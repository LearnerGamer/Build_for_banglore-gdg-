const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const twilio = require('twilio');

admin.initializeApp();

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

exports.analyzeIncident = functions.https.onCall(async (data, context) => {
  const { message, imageBase64, latitude, longitude } = data;
  const genAI = new GoogleGenerativeAI(functions.config().gemini.key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an emergency response AI for Bangalore city.
Analyze this incident. Respond ONLY in valid JSON, no markdown, no code blocks.
User message: "${message}"
Location: ${latitude}, ${longitude}
${imageBase64 ? 'Image attached — analyze it.' : 'No image.'}
Return exactly:
{
  "incident_type": "flood|fire|accident|medical|crowd|building_collapse|other",
  "severity": "critical|high|medium|low",
  "severity_score": <1-100>,
  "estimated_people_affected": <number>,
  "hazards_detected": ["<string>"],
  "recommended_unit_type": "fire|medical|police|rescue|ndrf",
  "units_needed": <number>,
  "ai_summary": "<one sentence for admin>",
  "civilian_reply": "<reassuring reply to user>"
}`;

  const parts = [{ text: prompt }];
  if (imageBase64) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  }

  const result = await model.generateContent(parts);
  const raw = result.response.text();
  const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

  await admin.firestore().collection('sos_signals').add({
    user_id: context.auth?.uid || 'anonymous',
    latitude, longitude, message,
    has_image: !!imageBase64,
    source: 'chatbot',
    priority: parsed.severity,
    status: 'new',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ...parsed,
  });

  return { civilian_reply: parsed.civilian_reply, severity: parsed.severity };
});

exports.sendSmsAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const { message, centerLat, centerLng, radiusKm = 3 } = data;
  const usersSnap = await admin.firestore().collection('users').get();
  const targets = usersSnap.docs.map(d => d.data())
    .filter(u => u.phone && u.last_lat && u.last_lng &&
      haversineKm(centerLat, centerLng, u.last_lat, u.last_lng) <= radiusKm);

  const client = twilio(functions.config().twilio.sid, functions.config().twilio.token);
  const results = await Promise.allSettled(
    targets.map(u => client.messages.create({
      body: message,
      from: functions.config().twilio.from,
      to: `+91${u.phone}`
    }))
  );
  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  await admin.firestore().collection('alerts').add({
    message, centerLat, centerLng, radiusKm,
    delivery_method: 'sms', sent_count: sent, failed_count: failed,
    sent_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { sent, failed };
});

exports.dispatchUnits = functions.firestore
  .document('sos_signals/{signalId}')
  .onCreate(async (snap) => {
    const signal = snap.data();
    if (signal.severity !== 'critical') return null;
    const unitsSnap = await admin.firestore()
      .collection('field_forces')
      .where('status', '==', 'available').get();
    if (unitsSnap.empty) return null;
    let nearest = null, minDist = Infinity;
    unitsSnap.docs.forEach(doc => {
      const u = doc.data();
      const dist = haversineKm(signal.latitude, signal.longitude, u.current_lat, u.current_lng);
      if (dist < minDist) { minDist = dist; nearest = { id: doc.id, ...u }; }
    });
    if (!nearest) return null;
    await snap.ref.update({
      status: 'dispatched',
      assigned_unit_id: nearest.id,
      assigned_unit_name: nearest.name,
      auto_dispatched: true,
    });
    await admin.firestore().collection('field_forces').doc(nearest.id)
      .update({ status: 'deployed' });
    return null;
  });

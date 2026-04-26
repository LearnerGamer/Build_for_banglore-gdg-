/**
 * Emergency SMS Service
 * This utility simulates sending emergency evacuation alerts via Twilio.
 * 
 * NOTE: In a production environment, this logic MUST reside on a secure backend server
 * to protect your TWILIO_AUTH_TOKEN and avoid CORS issues.
 */

export const sendEmergencySMS = async (userData, location, shelters) => {
  const accountSid = 'REPLACED_BY_SECRET_SCANNING';
  const authToken = 'REPLACED_BY_SECRET_SCANNING';
  const fromPhone = 'REPLACED_BY_SECRET_SCANNING';
  const toPhone = userData.phoneNumber;

  if (!toPhone) {
    console.error("SMS Error: No destination phone number provided.");
    return;
  }

  const nearestShelter = shelters && shelters.length > 0 ? shelters[0].name : "Checking nearest...";
  const msgBody = `🚨 SOS ALERT: ${userData.name}\n📍 Loc: ${location[0].toFixed(4)}, ${location[1].toFixed(4)}\n⚠️ Calamity: High Level\n⛺ Nearest Shelter: ${nearestShelter}\nEVACUATE NOW!`;

  console.log(`[MOCK SMS] Sending to ${toPhone}: \n${msgBody}`);

  // This is a direct call to Twilio API. It will likely fail CORS in a browser, 
  // but it demonstrates the exact integration requested.
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'To': toPhone,
        'From': fromPhone,
        'Body': msgBody
      })
    });

    if (response.ok) {
      console.log("✅ SMS sent successfully via Twilio API");
      return true;
    } else {
      const error = await response.json();
      if (error.message.includes("unverified")) {
        console.error("❌ Twilio Trial Error: The phone number is unverified. Please verify it at: https://www.twilio.com/console/phone-numbers/verified");
      } else {
        console.error("❌ Twilio API Error:", error.message);
      }
      return false;
    }
  } catch (error) {
    console.error("❌ SMS Network Error (likely CORS or connectivity):", error.message);
    return false;
  }
};

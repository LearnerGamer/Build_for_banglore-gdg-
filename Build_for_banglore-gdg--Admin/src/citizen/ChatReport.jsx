import { useState, useRef, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const getLocation = () => new Promise((resolve) => {
  navigator.geolocation.getCurrentPosition(
    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => resolve({ lat: 12.9716, lng: 77.5946 })
  );
});

export default function ChatReport() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: 'Hi. Describe what you see or attach a photo. I will alert emergency services immediately.'
  }]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const fns = getFunctions();
  const analyzeIncident = httpsCallable(fns, 'analyzeIncident');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSend = async () => {
    if (!input.trim() && !image) return;
    const userMessage = input.trim();
    setMessages(prev => [
      ...prev,
      { role: 'user', text: userMessage, imagePreview: imagePreview || null },
      { role: 'bot', text: 'Analyzing your report...', loading: true }
    ]);
    setInput('');
    setImage(null);
    setImagePreview(null);
    setLoading(true);
    try {
      const location = await getLocation();
      const imageBase64 = image ? await toBase64(image) : null;
      const result = await analyzeIncident({
        message: userMessage,
        imageBase64,
        latitude: location.lat,
        longitude: location.lng,
      });
      setMessages(prev => [
        ...prev.filter(m => !m.loading),
        { role: 'bot', text: result.data.civilian_reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev.filter(m => !m.loading),
        { role: 'bot', text: 'Could not reach emergency services. Please call 112 immediately.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-report-screen">
      <div className="chat-header">
        <span className="chat-title">Report Incident</span>
        <span className="chat-status-dot" />
        <span className="chat-status-text">Live — CODECURE AI</span>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.imagePreview && (
              <img src={msg.imagePreview} alt="attached" className="chat-image-preview" />
            )}
            <span className={msg.loading ? 'chat-analyzing' : ''}>{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {imagePreview && (
        <div className="chat-image-thumbnail">
          <img src={imagePreview} alt="preview" />
          <button onClick={() => { setImage(null); setImagePreview(null); }}>×</button>
        </div>
      )}
      <div className="chat-input-bar">
        <button className="chat-attach-btn" onClick={() => fileRef.current?.click()}>+</button>
        <input ref={fileRef} type="file" accept="image/*"
          capture="environment" style={{ display: 'none' }}
          onChange={handleImageChange} />
        <input type="text" className="chat-text-input"
          placeholder="Describe the emergency..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleSend()} />
        <button className="chat-send-btn" onClick={handleSend} disabled={loading}>➤</button>
      </div>
    </div>
  );
}

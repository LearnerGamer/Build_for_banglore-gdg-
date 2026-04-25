import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch {
      setError('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="glass-card admin-login-card">
        <h2>CODECURE Command Access</h2>
        <p>Authorized personnel only</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Admin email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="glass-input" required />
          <input type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="glass-input" required />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="glass-button primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Command Center'}
          </button>
        </form>
      </div>
    </div>
  );
}

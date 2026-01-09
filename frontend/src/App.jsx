import React, { useState, useEffect } from 'react';
import Jadwal from './components/Jadwal';
import Tugas from './components/Tugas';
import Auth from './components/Auth';

function App() {
  const [view, setView] = useState('jadwal');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);
  }, []);

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="app-container">
      <nav className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '32px' }}>🎓</span>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#38bdf8' }}>KuliahMate</h1>
        </div>
        
        {/* Menggunakan class user-nav yang sudah diberi gap di CSS */}
        <div className="user-nav">
          <div style={{ textAlign: 'right', lineHeight: '1.4' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Siswa</div>
            <div style={{ fontWeight: '700', fontSize: '18px', color: '#f1f5f9' }}>{user}</div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); setUser(null); }} 
            className="btn-danger-outline"
            style={{ padding: '10px 20px' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="tab-group">
        <button className={`btn-tab ${view === 'jadwal' ? 'active' : ''}`} onClick={() => setView('jadwal')}>
          📅 Jadwal
        </button>
        <button className={`btn-tab ${view === 'tugas' ? 'active' : ''}`} onClick={() => setView('tugas')}>
          📝 Tugas
        </button>
      </div>

      <div style={{ paddingBottom: '60px' }}>
        {view === 'jadwal' ? <Jadwal /> : <Tugas />}
      </div>
    </div>
  );
}

export default App;
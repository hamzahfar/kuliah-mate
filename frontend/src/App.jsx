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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>KuliahMate</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Siswa</div>
            <div style={{ fontWeight: '600' }}>{user}</div>
          </div>
          <button onClick={() => { localStorage.clear(); setUser(null); }} className="btn-danger-outline">Logout</button>
        </div>
      </nav>

      <div className="tab-group">
        <button className={`btn-tab ${view === 'jadwal' ? 'active' : ''}`} onClick={() => setView('jadwal')}>📅 Jadwal</button>
        <button className={`btn-tab ${view === 'tugas' ? 'active' : ''}`} onClick={() => setView('tugas')}>📝 Tugas</button>
      </div>

      <div style={{ paddingBottom: '50px' }}>
        {view === 'jadwal' ? <Jadwal /> : <Tugas />}
      </div>
    </div>
  );
}

export default App;
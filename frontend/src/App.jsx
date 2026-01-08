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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={(name) => setUser(name)} />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🎓 Kuliah Mate</h1>
        <div style={{ textAlign: 'right' }}>
          <span>Halo, <strong>{user}</strong>!</span><br />
          <button 
            onClick={handleLogout} 
            style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setView('jadwal')} 
          style={{ marginRight: '10px', padding: '10px 20px', background: view === 'jadwal' ? '#1890ff' : '#f0f0f0', color: view === 'jadwal' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📅 Jadwal
        </button>
        <button 
          onClick={() => setView('tugas')} 
          style={{ padding: '10px 20px', background: view === 'tugas' ? '#1890ff' : '#f0f0f0', color: view === 'tugas' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📝 Tugas
        </button>
      </div>

      <hr />

      <div style={{ marginTop: '20px' }}>
        {view === 'jadwal' ? <Jadwal /> : <Tugas />}
      </div>
    </div>
  );
}

export default App;
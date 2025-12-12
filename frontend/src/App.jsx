import React, { useState } from 'react';
import Jadwal from './components/Jadwal';
import Tugas from './components/Tugas';

function App() {
  const [view, setView] = useState('jadwal');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 Kuliah Mate</h1>
      <p>Sistem Manajemen Kuliah Terintegrasi</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('jadwal')} style={{ marginRight: '10px', padding: '10px' }}>
          📅 Lihat Jadwal
        </button>
        <button onClick={() => setView('tugas')} style={{ padding: '10px' }}>
          📝 Lihat Tugas
        </button>
      </div>

      <hr />

      {view === 'jadwal' ? <Jadwal /> : <Tugas />}
    </div>
  );
}

export default App;
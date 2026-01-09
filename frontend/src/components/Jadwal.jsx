import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({ uri: 'http://localhost:4001/graphql', cache: new InMemoryCache() });

const GET_COURSES = gql`query GetCourses($userId: String!) { getCourses(userId: $userId) { id name day time } }`;
const ADD_COURSE = gql`mutation AddCourse($name: String!, $day: String!, $time: String!, $userId: String!) { addCourse(name: $name, day: $day, time: $time, userId: $userId) { id name } }`;
const UPDATE_COURSE = gql`mutation UpdateCourse($id: ID!, $name: String!, $day: String!, $time: String!) { updateCourse(id: $id, name: $name, day: $day, time: $time) { id name } }`;
const DELETE_COURSE = gql`mutation DeleteCourse($id: ID!) { deleteCourse(id: $id) }`;

const JadwalContent = () => {
  const userId = localStorage.getItem('userId');
  const [editingId, setEditingId] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_COURSES, { variables: { userId } });
  const [addCourse] = useMutation(ADD_COURSE);
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const n = formData.get('name'), d = formData.get('day'), t = formData.get('time');
    if (editingId) { await updateCourse({ variables: { id: editingId, name: n, day: d, time: t } }); setEditingId(null); }
    else { await addCourse({ variables: { name: n, day: d, time: t, userId } }); }
    e.target.reset(); refetch();
  };

  if (loading) return <div style={{color: '#38bdf8', textAlign: 'center', padding: '50px'}}>Menghubungkan ke akademik...</div>;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, color: '#38bdf8' }}>📅 {editingId ? 'Edit Jadwal Kuliah' : 'Manajemen Jadwal'}</h3>
      <form id="form-jadwal" onSubmit={handleSubmit} className="form-grid">
        <input name="name" placeholder="Mata Kuliah" required />
        <input name="day" placeholder="Hari" required />
        <input name="time" type="time" required />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">{editingId ? 'Simpan' : 'Tambah'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); document.getElementById('form-jadwal').reset(); }} style={{background: '#334155', color: 'white'}}>Batal</button>}
        </div>
      </form>

      <div style={{ background: '#0f172a', borderRadius: '12px', padding: '10px' }}>
        {data?.getCourses.map((c) => (
          <div key={c.id} className="list-item">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{c.day} • {c.time} WIB</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => {
                setEditingId(c.id);
                const f = document.getElementById('form-jadwal');
                f.elements['name'].value = c.name; f.elements['day'].value = c.day; f.elements['time'].value = c.time;
              }} style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8' }}>Edit</button>
              <button onClick={async () => { if(confirm('Hapus jadwal?')) { await deleteCourse({variables:{id:c.id}}); refetch(); } }} className="btn-danger-outline">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Jadwal() {
  return <ApolloProvider client={client}><JadwalContent /></ApolloProvider>;
}
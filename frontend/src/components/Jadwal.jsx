import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

const GET_COURSES = gql`
  query GetCourses($userId: String!) {
    getCourses(userId: $userId) { id name day time }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $day: String!, $time: String!, $userId: String!) {
    addCourse(name: $name, day: $day, time: $time, userId: $userId) { id name }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $name: String!, $day: String!, $time: String!) {
    updateCourse(id: $id, name: $name, day: $day, time: $time) { id name }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

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
    const name = formData.get('name');
    const day = formData.get('day');
    const time = formData.get('time');

    try {
      if (editingId) {
        await updateCourse({ variables: { id: editingId, name, day, time } });
        setEditingId(null);
      } else {
        await addCourse({ variables: { name, day, time, userId } });
      }
      e.target.reset();
      refetch();
    } catch (err) {
      alert("Gagal memproses: " + err.message);
    }
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    // Mengisi form secara manual menggunakan name attribute
    const form = document.getElementById('form-jadwal');
    form.elements['name'].value = course.name;
    form.elements['day'].value = course.day;
    form.elements['time'].value = course.time;
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Memuat...</div>;

  return (
    <div className="card">
      <h3>📅 {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
      <form id="form-jadwal" onSubmit={handleSubmit} className="form-grid">
        <input name="name" placeholder="Mata Kuliah" required />
        <input name="day" placeholder="Hari" required />
        <input name="time" type="time" required />
        <div style={{ display: 'flex', gap: '5px' }}>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Tambah'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); document.getElementById('form-jadwal').reset(); }}>
              Batal
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '20px' }}>
        {data?.getCourses.map((c) => (
          <div key={c.id} className="list-item">
            <div>
              <div style={{ fontWeight: '700' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{c.day} • {c.time}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(c)} className="btn-tab">Edit</button>
              <button onClick={async () => { if(confirm('Hapus?')) { await deleteCourse({variables:{id:c.id}}); refetch(); } }} className="btn-danger-outline">Hapus</button>
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
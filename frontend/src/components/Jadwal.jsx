import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

// 1. Setup Client
const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

// 2. Definisi Query & Mutation
const GET_COURSES = gql`
  query {
    getCourses {
      id
      name
      day
      time
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $day: String!, $time: String!) {
    addCourse(name: $name, day: $day, time: $time) {
      id
      name
    }
  }
`;

// TAMBAHAN: Definisi Delete Mutation
const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

// 3. Komponen Tampilan
const JadwalContent = () => {
  const { loading, error, data, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await addCourse({
      variables: {
        name: formData.get('name'),
        day: formData.get('day'),
        time: formData.get('time')
      }
    });
    e.target.reset();
    refetch();
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus jadwal ini?')) {
      await deleteCourse({ variables: { id } });
      refetch();
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Memuat Jadwal...</div>;
  if (error) return <div className="card" style={{color: 'red'}}>Service Bermasalah.</div>;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '24px' }}>📅 Jadwal Kuliah Anda</h3>
      
      <form onSubmit={handleSubmit} className="form-grid">
        <input name="name" placeholder="Mata Kuliah" required />
        <input name="day" placeholder="Hari" required />
        <input name="time" type="time" required />
        <button type="submit" className="btn-primary">Tambah</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {data.getCourses.length === 0 && <p style={{textAlign: 'center', color: '#94a3b8'}}>Belum ada jadwal ditambahkan.</p>}
        {data.getCourses.map((c) => (
          <div key={c.id} className="list-item">
            <div>
              <div style={{ fontWeight: '700' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{c.day} • {c.time}</div>
            </div>
            <button onClick={() => handleDelete(c.id)} className="btn-danger-outline">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Jadwal() {
  return (
    <ApolloProvider client={client}>
      <JadwalContent />
    </ApolloProvider>
  );
}
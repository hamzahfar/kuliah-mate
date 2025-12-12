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
  const [deleteCourse] = useMutation(DELETE_COURSE); // Hook delete

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

  // Fungsi Handle Delete
  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
      await deleteCourse({ variables: { id } });
      refetch();
    }
  };

  if (loading) return <p>Loading Jadwal...</p>;
  if (error) return <p>Error: Pastikan Schedule Service berjalan!</p>;

  return (
    <div>
      <h2>Jadwal Mata Kuliah</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f0f0f0', padding: '10px' }}>
        <input name="name" placeholder="Nama Matkul" required />
        <input name="day" placeholder="Hari" required />
        <input name="time" type="time" required />
        <button type="submit">Tambah Jadwal</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.getCourses.map((c) => (
          <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '10px' }}>
            <span><strong>{c.name}</strong> - {c.day} pukul {c.time}</span>
            <button 
              onClick={() => handleDelete(c.id)}
              style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
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
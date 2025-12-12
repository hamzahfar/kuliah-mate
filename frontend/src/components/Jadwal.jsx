import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

// 1. Setup Client Khusus untuk Schedule Service
const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql', // URL Backend Schedule
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

// 3. Komponen Tampilan
const JadwalContent = () => {
  const { loading, error, data, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);

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
    refetch(); // Refresh data setelah input
  };

  if (loading) return <p>Loading Jadwal...</p>;
  if (error) return <p>Error: Pastikan Schedule Service (Port 4001) berjalan!</p>;

  return (
    <div>
      <h2>Jadwal Mata Kuliah</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f0f0f0', padding: '10px' }}>
        <input name="name" placeholder="Nama Matkul" required />
        <input name="day" placeholder="Hari" required />
        <input name="time" type="time" required />
        <button type="submit">Tambah Jadwal</button>
      </form>

      <ul>
        {data.getCourses.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> - {c.day} pukul {c.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 4. Bungkus dengan Provider
export default function Jadwal() {
  return (
    <ApolloProvider client={client}>
      <JadwalContent />
    </ApolloProvider>
  );
}
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

// 1. Setup Client Khusus untuk Task Service
const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql', // URL Backend Task
  cache: new InMemoryCache(),
});

const GET_TASKS = gql`
  query {
    getTasks {
      id
      title
      deadline
      courseName
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!, $deadline: String!, $courseName: String!) {
    addTask(title: $title, deadline: $deadline, courseName: $courseName) {
      id
      title
    }
  }
`;

const TugasContent = () => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await addTask({
      variables: {
        title: formData.get('title'),
        deadline: formData.get('deadline'),
        courseName: formData.get('courseName')
      }
    });
    e.target.reset();
    refetch();
  };

  if (loading) return <p>Loading Tugas...</p>;
  if (error) return <p>Error: Pastikan Task Service (Port 4002) berjalan!</p>;

  return (
    <div>
      <h2>Daftar Tugas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#e6f7ff', padding: '10px' }}>
        <input name="title" placeholder="Judul Tugas" required />
        <input name="courseName" placeholder="Matkul Terkait" required />
        <input name="deadline" type="date" required />
        <button type="submit">Tambah Tugas</button>
      </form>

      <ul>
        {data.getTasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> ({t.courseName}) - Deadline: {t.deadline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Tugas() {
  return (
    <ApolloProvider client={client}>
      <TugasContent />
    </ApolloProvider>
  );
}
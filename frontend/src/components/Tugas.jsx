import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
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

// TAMBAHAN: Definisi Delete Mutation
const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const TugasContent = () => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK); // Hook delete

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

  // Fungsi Handle Delete
  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tugas ini?')) {
      await deleteTask({ variables: { id } });
      refetch();
    }
  };

  if (loading) return <p>Loading Tugas...</p>;
  if (error) return <p>Error: Pastikan Task Service berjalan!</p>;

  return (
    <div>
      <h2>Daftar Tugas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#e6f7ff', padding: '10px' }}>
        <input name="title" placeholder="Judul Tugas" required />
        <input name="courseName" placeholder="Matkul Terkait" required />
        <input name="deadline" type="date" required />
        <button type="submit">Tambah Tugas</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.getTasks.map((t) => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '10px' }}>
            <span><strong>{t.title}</strong> ({t.courseName}) - Deadline: {t.deadline}</span>
            <button 
              onClick={() => handleDelete(t.id)}
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

export default function Tugas() {
  return (
    <ApolloProvider client={client}>
      <TugasContent />
    </ApolloProvider>
  );
}
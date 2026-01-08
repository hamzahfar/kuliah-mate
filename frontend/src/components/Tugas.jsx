import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  cache: new InMemoryCache(),
});

const GET_TASKS = gql`
  query GetTasks($userId: String!) {
    getTasks(userId: $userId) { id title deadline courseName }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!, $deadline: String!, $courseName: String!, $userId: String!) {
    addTask(title: $title, deadline: $deadline, courseName: $courseName, userId: $userId) { id title }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!, $deadline: String!, $courseName: String!) {
    updateTask(id: $id, title: $title, deadline: $deadline, courseName: $courseName) { id title }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const TugasContent = () => {
  const userId = localStorage.getItem('userId');
  const [editingId, setEditingId] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_TASKS, { variables: { userId } });
  
  const [addTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const courseName = formData.get('courseName');
    const deadline = formData.get('deadline');

    try {
      if (editingId) {
        await updateTask({ variables: { id: editingId, title, courseName, deadline } });
        setEditingId(null);
      } else {
        await addTask({ variables: { title, courseName, deadline, userId } });
      }
      e.target.reset();
      refetch();
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    const form = document.getElementById('form-tugas');
    form.elements['title'].value = task.title;
    form.elements['courseName'].value = task.courseName;
    form.elements['deadline'].value = task.deadline;
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Memuat...</div>;

  return (
    <div className="card">
      <h3>📝 {editingId ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h3>
      <form id="form-tugas" onSubmit={handleSubmit} className="form-grid">
        <input name="title" placeholder="Judul Tugas" required />
        <input name="courseName" placeholder="Mata Kuliah" required />
        <input name="deadline" type="date" required />
        <div style={{ display: 'flex', gap: '5px' }}>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Tambah'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); document.getElementById('form-tugas').reset(); }}>
              Batal
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '20px' }}>
        {data?.getTasks.map((t) => (
          <div key={t.id} className="list-item">
            <div>
              <div style={{ fontWeight: '700' }}>{t.title}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{t.courseName} • Deadline: {t.deadline}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(t)} className="btn-tab">Edit</button>
              <button onClick={async () => { if(confirm('Hapus?')) { await deleteTask({variables:{id:t.id}}); refetch(); } }} className="btn-danger-outline">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Tugas() {
  return <ApolloProvider client={client}><TugasContent /></ApolloProvider>;
}
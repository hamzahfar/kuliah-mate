import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({ uri: 'http://localhost:4002/graphql', cache: new InMemoryCache() });

const GET_TASKS = gql`query GetTasks($userId: String!) { getTasks(userId: $userId) { id title deadline courseName } }`;
const ADD_TASK = gql`mutation AddTask($title: String!, $deadline: String!, $courseName: String!, $userId: String!) { addTask(title: $title, deadline: $deadline, courseName: $courseName, userId: $userId) { id title } }`;
const UPDATE_TASK = gql`mutation UpdateTask($id: ID!, $title: String!, $deadline: String!, $courseName: String!) { updateTask(id: $id, title: $title, deadline: $deadline, courseName: $courseName) { id title } }`;
const DELETE_TASK = gql`mutation DeleteTask($id: ID!) { deleteTask(id: $id) }`;

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
    const t = formData.get('title'), c = formData.get('courseName'), d = formData.get('deadline');
    if (editingId) { await updateTask({ variables: { id: editingId, title: t, courseName: c, deadline: d } }); setEditingId(null); }
    else { await addTask({ variables: { title: t, courseName: c, deadline: d, userId } }); }
    e.target.reset(); refetch();
  };

  if (loading) return <div style={{color: '#38bdf8', textAlign: 'center', padding: '50px'}}>Memuat daftar tugas...</div>;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, color: '#38bdf8' }}>📝 {editingId ? 'Edit Detail Tugas' : 'Daftar Tugas'}</h3>
      <form id="form-tugas" onSubmit={handleSubmit} className="form-grid">
        <input name="title" placeholder="Judul Tugas" required />
        <input name="courseName" placeholder="Mata Kuliah" required />
        <input name="deadline" type="date" required />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">{editingId ? 'Simpan' : 'Tambah'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); document.getElementById('form-tugas').reset(); }} style={{background: '#334155', color: 'white'}}>Batal</button>}
        </div>
      </form>

      <div style={{ background: '#0f172a', borderRadius: '12px', padding: '10px' }}>
        {data?.getTasks.map((t) => (
          <div key={t.id} className="list-item">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{t.title}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{t.courseName} • <span style={{color: '#f87171'}}>Hingga {t.deadline}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => {
                setEditingId(t.id);
                const f = document.getElementById('form-tugas');
                f.elements['title'].value = t.title; f.elements['courseName'].value = t.courseName; f.elements['deadline'].value = t.deadline;
              }} style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8' }}>Edit</button>
              <button onClick={async () => { if(confirm('Hapus tugas?')) { await deleteTask({variables:{id:t.id}}); refetch(); } }} className="btn-danger-outline">Hapus</button>
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
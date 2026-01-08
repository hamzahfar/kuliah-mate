import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

// 1. Setup Client untuk Task Service
const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  cache: new InMemoryCache(),
});

// 2. Definisi Query & Mutation
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

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

// 3. Komponen Tampilan
const TugasContent = () => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await addTask({
      variables: {
        title: formData.get('title'),
        courseName: formData.get('courseName'),
        deadline: formData.get('deadline')
      }
    });
    e.target.reset();
    refetch();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tugas ini?')) {
      await deleteTask({ variables: { id } });
      refetch();
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Memuat Daftar Tugas...</div>;
  if (error) return <div className="card" style={{color: 'red'}}>Task Service bermasalah. Pastikan service berjalan!</div>;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '24px' }}>📝 Daftar Tugas Anda</h3>
      
      {/* Form Input dengan gaya grid yang sama dengan Jadwal */}
      <form onSubmit={handleSubmit} className="form-grid">
        <input name="title" placeholder="Judul Tugas" required />
        <input name="courseName" placeholder="Mata Kuliah Terkait" required />
        <input name="deadline" type="date" required />
        <button type="submit" className="btn-primary">Tambah</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {data.getTasks.length === 0 && (
          <p style={{textAlign: 'center', color: '#94a3b8'}}>Belum ada tugas ditambahkan.</p>
        )}
        
        {data.getTasks.map((t) => (
          <div key={t.id} className="list-item">
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{t.title}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                <span> {t.courseName}</span> • <span style={{ color: '#e74c3c' }}> Deadline: {t.deadline}</span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(t.id)} 
              className="btn-danger-outline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
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
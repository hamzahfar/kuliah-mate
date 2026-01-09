import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql } from '@apollo/client';

const authClient = new ApolloClient({
  uri: 'http://localhost:4003/graphql',
  cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) { token user { id username } }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) { token user { id username } }
  }
`;

const AuthContent = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authAction, { loading }] = useMutation(isSignup ? SIGNUP_MUTATION : LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAction({ variables: { username, password } });
      const res = isSignup ? data.signup : data.login;
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.user.username);
      localStorage.setItem('userId', res.user.id);
      onLogin(res.user.username);
    } catch (err) { alert(err.message); }
  };

  const themeColor = isSignup ? '#10b981' : '#38bdf8';

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
    }}>
      <div className="card" style={{ 
        width: '100%', maxWidth: '420px', textAlign: 'center', 
        borderTop: `4px solid ${themeColor}` 
      }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>{isSignup ? '📝' : '🔐'}</div>
        <h2 style={{ margin: '0 0 10px 0' }}>{isSignup ? 'Buat Akun Siswa' : 'Masuk KuliahMate'}</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>
          {isSignup ? '' : ''}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: themeColor, fontWeight: 'bold' }}>USERNAME</label>
            <input style={{ width: '90%', marginTop: '5px' }} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: themeColor, fontWeight: 'bold' }}>PASSWORD</label>
            <input type="password" style={{ width: '90%', marginTop: '5px' }} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{ background: themeColor, color: '#0f172a', marginTop: '10px' }}>
            {loading ? 'Memproses...' : (isSignup ? 'Daftar Akun Baru' : 'Masuk Ke Dashboard')}
          </button>
        </form>

        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            {isSignup ? 'Sudah terdaftar?' : 'Belum punya akun?'}
          </span>
          <button onClick={() => setIsSignup(!isSignup)} style={{ background: 'none', color: themeColor, textDecoration: 'underline', padding: '0 0 0 10px' }}>
            {isSignup ? 'Login di sini' : 'Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Auth({ onLogin }) {
  return <ApolloProvider client={authClient}><AuthContent onLogin={onLogin} /></ApolloProvider>;
}
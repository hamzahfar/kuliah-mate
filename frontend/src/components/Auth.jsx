import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql } from '@apollo/client';

const authClient = new ApolloClient({
  uri: 'http://localhost:4003/graphql',
  cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { id username }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user { id username }
    }
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
      localStorage.setItem('userId', res.user.id); // BARIS PENTING
      onLogin(res.user.username);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>{isSignup ? 'Daftar' : 'Login'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Memproses...' : (isSignup ? 'Daftar' : 'Masuk')}
          </button>
        </form>
        <button onClick={() => setIsSignup(!isSignup)} style={{ marginTop: '15px', background: 'none', color: '#3498db', textDecoration: 'underline' }}>
          {isSignup ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
        </button>
      </div>
    </div>
  );
};

export default function Auth({ onLogin }) {
  return (
    <ApolloProvider client={authClient}>
      <AuthContent onLogin={onLogin} />
    </ApolloProvider>
  );
}
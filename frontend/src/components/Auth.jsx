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
      user { username }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user { username }
    }
  }
`;

const AuthContent = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [authAction, { loading, error }] = useMutation(isSignup ? SIGNUP_MUTATION : LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAction({ variables: { username, password } });
      const { token, user } = isSignup ? data.signup : data.login;
      localStorage.setItem('token', token);
      localStorage.setItem('user', user.username);
      onLogin(user.username);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>{isSignup ? 'Buat Akun' : 'Login Kuliah Mate'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            placeholder="Username" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button 
          disabled={loading}
          type="submit" 
          style={{ width: '100%', background: '#1890ff', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Memproses...' : (isSignup ? 'Daftar Sekarang' : 'Masuk')}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isSignup ? 'Sudah punya akun?' : 'Belum punya akun?'} 
        <span 
          onClick={() => setIsSignup(!isSignup)} 
          style={{ color: '#1890ff', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isSignup ? 'Login di sini' : 'Daftar di sini'}
        </span>
      </p>
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
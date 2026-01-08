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

  const [authAction, { loading }] = useMutation(isSignup ? SIGNUP_MUTATION : LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAction({ variables: { username, password } });
      const res = isSignup ? data.signup : data.login;
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.user.username);
      onLogin(res.user.username);
    } catch (err) {
      alert(err.message);
    }
  };

  // Tema warna dinamis berdasarkan status
  const themeColor = isSignup ? '#2ecc71' : '#3498db';
  const shadowColor = isSignup ? 'rgba(46, 204, 113, 0.2)' : 'rgba(52, 152, 219, 0.2)';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: isSignup ? '#f0fff4' : '#f8fafc', 
      transition: 'all 0.4s ease'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '400px',
        borderTop: `6px solid ${themeColor}`, 
        boxShadow: `0 20px 25px -5px ${shadowColor}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            fontSize: '50px', 
            background: isSignup ? '#e8f5e9' : '#e3f2fd',
            width: '80px',
            height: '80px',
            lineHeight: '80px',
            borderRadius: '50%',
            margin: '0 auto 15px'
          }}>
            {isSignup ? '🎓' : '🎓'}
          </div>
          <h2 style={{ margin: '0', color: '#2c3e50' }}>
            {isSignup ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
            {isSignup ? 'Daftar untuk mulai mengatur jadwal kuliahmu' : 'Silakan masuk untuk melanjutkan'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginLeft: '5px' }}>USERNAME</label>
                <input 
                    placeholder="Masukkan Username" 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                    style={{ 
                    borderColor: isSignup ? '#c3e6cb' : '#bee3f8',
                    '::placeholder': { color: '#cbd5e1' } 
                    }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginLeft: '5px' }}>PASSWORD</label>
                <input 
                    type="password" 
                    placeholder="•••••••••" 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{ 
                    borderColor: isSignup ? '#c3e6cb' : '#bee3f8',
                    '::placeholder': { color: '#cbd5e1' } 
                    }}
                />
            </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              background: themeColor, 
              color: 'white', 
              padding: '14px',
              fontSize: '16px',
              marginTop: '10px',
              boxShadow: `0 4px 12px ${shadowColor}`
            }}
          >
            {loading ? 'Memproses...' : (isSignup ? 'Daftar Sekarang' : 'Masuk ke Aplikasi')}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #f1f5f9', 
          textAlign: 'center',
          fontSize: '14px' 
        }}>
          <span style={{ color: '#64748b' }}>
            {isSignup ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
          </span>
          <button 
            onClick={() => setIsSignup(!isSignup)} 
            style={{ 
              background: 'none', 
              color: themeColor, 
              padding: '0', 
              marginLeft: '8px', 
              textDecoration: 'underline',
              fontWeight: '700'
            }}
          >
            {isSignup ? 'Masuk di sini' : 'Daftar sekarang'}
          </button>
        </div>
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
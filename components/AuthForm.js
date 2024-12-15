// /components/AuthForm.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const data = { email, password, username };

    try {
      const res = await axios.post(url, data);
      if (res.status === 200) {
        router.push('/videos');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-6">{type === 'login' ? 'Login' : 'Register'}</h2>
      {type === 'register' && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-4 w-full px-4 py-2 border rounded"
          required
        />
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4 w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 w-full px-4 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;

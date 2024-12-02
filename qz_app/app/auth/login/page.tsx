"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

interface SignInResponse {
    error?: string | null;
}

const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const res: SignInResponse | undefined = await signIn('credentials', {
        redirect: false,
        username,
        password,
    });

    if (res?.error) {
        // Handle error
        console.error('Login failed');
    } else {
        // Redirect to the home page or dashboard
        window.location.href = '/';
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <label className="block mb-4">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 p-2 w-full border rounded" />
        </label>
        <label className="block mb-4">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 w-full border rounded" />
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
      <button onClick={() => signIn('google')} className="mt-4 bg-red-500 text-white p-2 rounded">Login with Google</button>
    </div>
  );
};

export default LoginPage;

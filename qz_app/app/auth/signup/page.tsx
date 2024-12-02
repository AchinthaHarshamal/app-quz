"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const handleSignup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Call your API to create a new user
    const res: Response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        // Redirect to login page or automatically log in the user
        signIn('credentials', { username, password });
    } else {
        // Handle error
        console.error('Signup failed');
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <label className="block mb-4">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 p-2 w-full border rounded" />
        </label>
        <label className="block mb-4">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 w-full border rounded" />
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Signup</button>
      </form>
      <button onClick={() => signIn('google')} className="mt-4 bg-red-500 text-white p-2 rounded">Signup with Google</button>
    </div>
  );
};

export default SignupPage;

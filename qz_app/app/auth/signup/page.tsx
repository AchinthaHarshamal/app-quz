"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        alert("Login failed!");
      } else {
        alert("Login successful!");
      }
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        alert("SignIn successful!");
      } else {
        alert("SignUp failed!");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Signup"}</h1>
      <form onSubmit={handleAuth} className="flex flex-col space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>
      <button onClick={() => signIn("google")} className="mt-4 p-2 bg-red-500 text-white rounded">
        {isLogin ? "Login" : "Signup"} with Google
      </button>
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 p-2 text-blue-500">
        Switch to {isLogin ? "Signup" : "Login"}
      </button>
    </div>
  );
}

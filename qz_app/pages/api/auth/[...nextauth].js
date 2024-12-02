import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import DBConnection from '../../../lib/dbConfig';
import User from '../../../models/UserModel';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Validate credentials
        const user = await User.findOne({ username: credentials.username });
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      }
    })
  ],
  // ...existing code...
  callbacks: {
    async signIn(user, account, profile) {
      await saveUserToDB(user);
      return true;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        await saveUserToDB(user); // Save user details for Google login
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    }
  },
  // ...existing code...
});

// Save user to the database
async function saveUserToDB(user) {
  await DBConnection.connect();
  const existingUser = await User.findOne({ email: user.email });
  if (!existingUser) {
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password || null, // Password might not be available for Google login
      createdAt: new Date()
    });
    await newUser.save();
  }
}

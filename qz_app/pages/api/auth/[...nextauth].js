import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import DBConnection from "../../../lib/dbConfig";
import User from "../../../models/UserModel";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await DBConnection.connect();
        const user = await User.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.type === "oauth") {
        await saveUserToDB(user);
      } else if (account.type === "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.provider = token.provider;
      return session;
    },
  },
});

async function saveUserToDB(user) {
  await DBConnection.connect();
  const existingUser = await User.findOne({ email: user.email });
  if (!existingUser) {
    const newUser = new User({
      email: user.email,
      password: user.password || "",
      createdAt: new Date(),
    });
    await newUser.save();
  }
}

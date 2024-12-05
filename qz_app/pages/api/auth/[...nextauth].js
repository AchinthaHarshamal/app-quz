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
        console.log("I am here");

        const user = await User.findOne({ username: credentials.username });
        console.log("I am in the auth");

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          console.log("Authorize result: ", user);
          return Promise.resolve(user);
        } else {
          console.log("Authorize result: null");
          return Promise.resolve(null);
        }
      },
    }),
  ],

  callbacks: {
    async signIn(user, account, profile) {
      await saveUserToDB(user);
      console.log("i am in", user, account, profile);
      return true;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        await saveUserToDB(user);
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
});

async function saveUserToDB(user) {
  await DBConnection.connect();
  const existingUser = await User.findOne({ email: user.email });
  if (!existingUser) {
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password || null,
      createdAt: new Date(),
    });
    await newUser.save();
  }
}

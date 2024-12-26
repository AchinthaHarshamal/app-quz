import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import DBConnection from "../../../lib/dbConfig";
import UserModel from "../../../models/UserModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, userName, role = "user" } = req.body;

  if (!email || !password || !userName) {
    return res.status(400).json({ message: "Email, password, and username are required" });
  }

  await DBConnection.connect();

  const existingUser = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    email: email,
    password: hashedPassword,
    createdAt: new Date(),
    userName: userName,
    role: role,
  });

  try {
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
}

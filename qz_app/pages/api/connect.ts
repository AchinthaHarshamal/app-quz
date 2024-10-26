import { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "../../lib/dbConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await DBConnection.connect();
  if (!connection) {
    return res.status(500).json({ error: "Failed to connect to the database" });
  }
  res.status(200).json('Connection successful');
}

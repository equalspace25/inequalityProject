// pages/api/problems.js

import { connectToDatabase } from '../../lib/mongodb'; // Assuming you have a MongoDB connection function
import Problem from '../../models/Problem'; // Assuming you have a Mongoose model for Problem

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const problems = await Problem.find(); // Fetch all problems from MongoDB
      res.status(200).json({ data: problems });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch problems' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description } = req.body;
      const newProblem = new Problem({ title, description });
      await newProblem.save();
      res.status(201).json({ data: newProblem });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit problem' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

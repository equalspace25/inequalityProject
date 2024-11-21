'use client'; // Mark this file as a client component

import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

export default function Home() {
  const [problems, setProblems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing problems on component mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch('/api/problems');
        if (!res.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await res.json();
        setProblems(data.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching problems');
      }
    };

    fetchProblems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit problem');
      }

      const newProblem = await res.json();
      setProblems((prevProblems) => [...prevProblems, newProblem.data]);

      // Clear form inputs
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
      alert('Error submitting problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Report Gender Inequality Issues
        </Typography>

        {/* Form to submit a new problem */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>

        <Typography variant="h5" gutterBottom>
          Reported Issues:
        </Typography>

        {/* Display list of reported problems */}
        <List>
          {problems.length > 0 ? (
            problems.map((problem) => (
              <ListItem key={problem._id}>
                <ListItemText primary={problem.title} secondary={problem.description} />
              </ListItem>
            ))
          ) : (
            <Typography>No reported problems yet</Typography>
          )}
        </List>
      </Container>
    </div>
  );
}

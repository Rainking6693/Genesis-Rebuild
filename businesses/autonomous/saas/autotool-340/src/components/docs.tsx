// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import Markdown from 'react-markdown';

interface DocItem {
  title: string;
  content: string;
}

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation from an API or local files
        setLoading(true);
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint or file path

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: DocItem[] = await response.json();
        setDocs(data);
        setFilteredDocs(data);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError("Failed to load documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  useEffect(() => {
    const results = docs.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocs(results);
  }, [searchTerm, docs]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="body1">Loading documentation...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Documentation
      </Typography>
      <TextField
        label="Search Documentation"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <List>
        {filteredDocs.map((doc, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primary={doc.title}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {doc.title}
                  </Typography>
                  {`— `}
                  <Markdown children={doc.content.substring(0, 100) + '...'} />
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import Markdown from 'react-markdown';

interface DocItem {
  title: string;
  content: string;
}

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation from an API or local files
        setLoading(true);
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint or file path

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: DocItem[] = await response.json();
        setDocs(data);
        setFilteredDocs(data);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError("Failed to load documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  useEffect(() => {
    const results = docs.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocs(results);
  }, [searchTerm, docs]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="body1">Loading documentation...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Documentation
      </Typography>
      <TextField
        label="Search Documentation"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <List>
        {filteredDocs.map((doc, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primary={doc.title}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {doc.title}
                  </Typography>
                  {`— `}
                  <Markdown children={doc.content.substring(0, 100) + '...'} />
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Docs;
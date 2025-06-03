const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Simple validation for demonstration
  if (username === 'user' && password === 'password') {
    // In a real application, you'd generate a JWT token here
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token-123' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
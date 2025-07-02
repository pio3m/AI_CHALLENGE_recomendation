const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
app.use(express.json());
app.use(cors());

// Prosty endpoint do analizy emocji
app.post('/api/emotions', async (req, res) => {
  const { entry } = req.body;
  const prompt = `Na podstawie poniższego tekstu zwróć dominujące emocje użytkownika jako tablicę słów kluczowych w formacie JSON (np. [\"nadzieja\", \"smutek\"]):\n\nTekst: \"${entry}\"\nEmocje:`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "Jesteś asystentem do analizy emocji." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const emotions = JSON.parse(response.data.choices[0].message.content.trim());
    res.json(emotions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd AI' });
  }
});

// Prosty endpoint do rekomendacji filmów
app.post('/api/recommend', (req, res) => {
  const n = req.body.n_recommendations || 5;
  const excluded = req.body.excluded_titles || [];
  const sample = [
    { title: 'Incepcja' },
    { title: 'Matrix' },
    { title: 'Forrest Gump' },
    { title: 'Pulp Fiction' },
    { title: 'Interstellar' },
    { title: 'The Social Network' },
    { title: 'Whiplash' },
    { title: 'Parasite' },
    { title: 'Joker' },
    { title: 'La La Land' },
    { title: 'The Godfather' },
    { title: 'The Dark Knight' },
    { title: 'Fight Club' },
    { title: 'The Shawshank Redemption' },
    { title: 'The Grand Budapest Hotel' }
  ];
  // Filtruj wykluczone tytuły
  const filtered = sample.filter(m => !excluded.includes(m.title));
  res.json(filtered.slice(0, n));
});

// Helper: wczytaj listę z pliku
function getViewedMovies() {
  try {
    return JSON.parse(fs.readFileSync(VIEWED_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Helper: zapisz listę do pliku
function saveViewedMovies(list) {
  fs.writeFileSync(VIEWED_FILE, JSON.stringify(list, null, 2));
}

// Endpoint: pobierz listę wyświetlonych filmów
app.get('/api/viewed', (req, res) => {
  res.json(getViewedMovies());
});

// Endpoint: dodaj film do listy
app.post('/api/viewed', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Brak tytułu' });
  const list = getViewedMovies();
  if (!list.includes(title)) {
    list.push(title);
    saveViewedMovies(list);
  }
  res.json({ ok: true, list });
});

app.post('/api/openai', async (req, res) => {
  try {
    console.log("OpenAI request body:", req.body);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("OpenAI response data:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = 6000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`)); 
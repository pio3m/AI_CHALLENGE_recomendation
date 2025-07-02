const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ====== ENDPOINT: Analiza emocji ======
app.post('/api/emotions', async (req, res) => {
  const { entry } = req.body;
  const prompt = `Na podstawie poniższego tekstu zwróć dominujące emocje użytkownika jako tablicę słów kluczowych w formacie JSON (np. ["nadzieja", "smutek"]):\n\nTekst: "${entry}"\nEmocje:`;
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
    console.error("Błąd w /api/emotions:", e.response?.data || e);
    res.status(500).json({ error: 'Błąd AI' });
  }
});

// ====== ENDPOINT: Rekomendacje filmów ======
app.post('/api/recommend', (req, res) => {
  const n = req.body.n_recommendations || 5;
  const excluded = req.body.excluded_titles || [];
  const sample = [
    { title: 'Incepcja' }, { title: 'Matrix' }, { title: 'Forrest Gump' },
    { title: 'Pulp Fiction' }, { title: 'Interstellar' }, { title: 'The Social Network' },
    { title: 'Whiplash' }, { title: 'Parasite' }, { title: 'Joker' },
    { title: 'La La Land' }, { title: 'The Godfather' }, { title: 'The Dark Knight' },
    { title: 'Fight Club' }, { title: 'The Shawshank Redemption' }, { title: 'The Grand Budapest Hotel' }
  ];
  const filtered = sample.filter(m => !excluded.includes(m.title));
  res.json(filtered.slice(0, n));
});

// ====== ENDPOINT: Lista obejrzanych filmów ======
const VIEWED_FILE = path.join(__dirname, 'viewed.json');

function getViewedMovies() {
  try {
    return JSON.parse(fs.readFileSync(VIEWED_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveViewedMovies(list) {
  fs.writeFileSync(VIEWED_FILE, JSON.stringify(list, null, 2));
}

app.get('/api/viewed', (req, res) => {
  res.json(getViewedMovies());
});

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

// ====== ENDPOINT: Forward do OpenAI (ogólny) ======
app.post('/api/openai', async (req, res) => {
  try {
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
    res.json(response.data);
  } catch (err) {
    console.error("Błąd w /api/openai:", err.response?.data || err);
    res.status(500).json({ error: err.toString() });
  }
});

// ====== SERWOWANIE FRONTENDU ======
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback – dla każdej innej ścieżki zwróć index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ====== START SERWERA ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

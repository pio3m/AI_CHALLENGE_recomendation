export async function fetchEmotions(sentence) {
  console.log("🛫 emotions →", sentence);
  const r = await fetch("/api/emotions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry: sentence }),
  });
  console.log("🛬 emotions status", r.status);
  const json = await r.json();
  console.log("🛬 emotions body", json);
  return Object.keys(json);
}

export async function fetchRecommendations(emotions, n = 15, excluded_titles = []) {
  console.log("🛫 recommend →", emotions);
  const r = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence: emotions.join(", "), n_recommendations: n, excluded_titles }),
  });
  console.log("🛬 recommend status", r.status);
  const json = await r.json();
  console.log("🛬 recommend body", json);
  return json;
}

export async function callOpenAI(messages) {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages
    })
  });
  return response.json();
}

export async function fetchJustification(movie, moodReason) {
  console.log("fetchJustification called with:", movie, moodReason);
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "You are a helpful movie recommendation assistant." },
          { role: "user", content: `In 2-3 sentences, justify in English why the movie \"${movie.title}\" (${movie.release_date?.slice(0,4)}) is a good fit for a user. Movie description: ${movie.overview}. User's mood/context: ${moodReason}` }
        ],
        max_tokens: 120,
        temperature: 0.7
      })
    });
    const data = await response.json();
    console.log("GPT justification response:", data);
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error("Justification fetch error:", err);
    return "";
  }
}

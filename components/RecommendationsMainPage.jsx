import React, { useEffect, useState } from "react";
import ProgressBar from "./Onboarding/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, BadgeInfo, Heart, Eye, Bookmark, Clock, ThumbsDown, List, User, BookOpen, SlidersHorizontal, Smile, ClapperboardIcon } from 'lucide-react';
import { fetchJustification } from '../src/api';
import Step2Age from './Onboarding/Step2Age';
import Step3Mood from './Onboarding/Step3Mood';
import Step4MoodReason from './Onboarding/Step4MoodReason';
import Step5Preferences from './Onboarding/Step5Preferences';

const TMDB_API_KEY = "5828ccf19b0fc0071b605bb190e7f817";
const TMDB_MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;
const TMDB_SERIES_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;

// Mapowanie nastrojów na emoji (zgodne z Step3Mood)
const moodEmojis = {
  'Happy': '😊',
  'In love': '😍',
  'Angry': '😡',
  'Stressed': '😰',
  'Tired': '😴',
  'Nostalgic': '🥲',
  'Sad': '😢',
};

function getYear(date) {
  if (!date) return "?";
  return date.split("-")[0];
}

function MovieCard({ movie, onReject, animating, setAnimating, setCurrentIndex, moodReason, onBookmark }) {
  const [justification, setJustification] = useState("");
  // Relaxation lvl losowany 4-10 dla każdego filmu (stały dla danego komponentu)
  const [relaxLvl] = useState(() => Math.floor(Math.random() * 7) + 4); // 4-10

  useEffect(() => {
    let isMounted = true;
    setJustification("");
    if (movie && moodReason) {
      fetchJustification(movie, moodReason).then(justif => {
        if (isMounted) setJustification(justif);
      });
    }
    return () => { isMounted = false; };
  }, [movie.id, moodReason]);

  const bookmarked = isBookmarked(movie);

  return (
    <motion.div
      key={movie.id}
      initial={{ x: 0, opacity: 1, rotate: 0 }}
      animate={animating ? { x: 600, opacity: 0, rotate: 24 } : { x: 0, opacity: 1, rotate: 0 }}
      exit={{ x: -500, opacity: 0, rotate: -12 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="bg-white rounded-2xl border border-gray-200 w-full flex flex-row items-stretch shadow-sm overflow-hidden"
    >
      {/* Lewa kolumna: tylko okładka + badge */}
      <div className="relative flex flex-col h-full max-w-[340px] min-w-[220px]">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : "https://via.placeholder.com/280x420?text=No+Image"}
          alt={movie.title || movie.name}
          className="h-full w-full object-cover rounded-l-2xl"
        />
        {/* Badge chill */}
        <span className="absolute top-4 left-4 bg-white text-gray-700 text-xs px-3 py-1 rounded-full font-semibold border border-gray-200 shadow">{relaxLvl}/10 Relaxation</span>
      </div>
      {/* Prawa kolumna: cała reszta */}
      <div className="relative flex flex-col h-full p-6 max-w-3xl w-full self-start">
        {/* Przyciski ikona w prawym górnym rogu */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button title="Save" className={`bg-white rounded-lg shadow p-1 hover:bg-gray-100 transition flex items-center justify-center ${bookmarked ? 'ring-2 ring-pink-400' : ''}`} onClick={() => onBookmark(movie, justification)}>
            <Bookmark size={16} className={bookmarked ? 'text-pink-500 fill-pink-500' : 'text-gray-500'} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button title="Watch later" className="bg-white rounded-lg shadow p-1 hover:bg-gray-100 transition flex items-center justify-center"><Clock size={16} className="text-gray-500" /></button>
        </div>
        {/* Tytuł */}
        <div className="text-xl font-bold text-blue-900 leading-tight mb-1 mt-1 pr-20">{movie.title || movie.name}</div>
        {/* Ocena i rok */}
        <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
          <span className="flex items-center gap-1"><span className="text-yellow-500">★</span>{movie.vote_average?.toFixed(1) || "-"}/10</span>
          <span>•</span>
          <span>{getYear(movie.release_date || movie.first_air_date)}</span>
        </div>
        {/* Typy */}
        <div className="flex flex-wrap gap-1 mb-2">
          {(movie.genre_names || []).map((g) => (
            <span key={g} className="px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
              {g}
            </span>
          ))}
        </div>
        {/* Opis */}
        <div className="text-gray-700 mb-2 text-xs leading-normal max-w-2xl">
          {movie.overview || "Brak opisu."}
        </div>
        {/* Sensowne uzasadnienie */}
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-2 py-2 mb-3">
          <div>
            <div className="font-semibold text-green-900 mb-1 text-sm flex items-center gap-2"><span>✅</span>Smart choice justification</div>
            <div className="text-gray-600 text-xs">{justification || "Loading justification..."}</div>
          </div>
        </div>
        {/* Przyciski na dole */}
        <div className="flex mt-auto border border-gray-200 rounded-xl bg-white p-0.5 gap-0.5">
          <button className={`flex-1 px-0 py-2 flex items-center justify-center gap-1 font-semibold text-sm transition outline-none border-0 bg-white text-gray-800 rounded-xl`} style={{ borderRadius: '0.75rem' }}
            onClick={() => {
              addExcludedTitle(movie.title || movie.name);
              setAnimating(true);
              setTimeout(() => {
                setAnimating(false);
                setCurrentIndex((i) => i + 1);
              }, 400);
            }}>
            <Eye size={16} /> Already seen
          </button>
          <button className={`flex-1 px-0 py-2 flex items-center justify-center gap-1 font-semibold text-sm transition outline-none border-0 bg-white text-gray-800 rounded-xl`} style={{ borderRadius: '0.75rem' }}
            onClick={() => {
              addExcludedTitle(movie.title || movie.name);
              onReject();
            }}>
            <ThumbsDown size={16} /> Not for me
          </button>
          <button className={`flex-1 px-4 py-2 flex items-center justify-center gap-1 font-semibold text-sm transition outline-none border-0 bg-purple-100 text-purple-700 font-bold rounded-xl`} style={{ borderRadius: '0.75rem' }}
            onClick={() => {
              setAnimating(true);
              setTimeout(() => {
                setAnimating(false);
                setCurrentIndex((i) => i + 1);
              }, 500);
            }}>
            <Heart fill="currentColor" size={16} className="text-purple-700" /> More like this
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const GENRES = {};

// Funkcje do obsługi wykluczonych filmów w localStorage
function getExcludedTitles() {
  return JSON.parse(localStorage.getItem('rf_excluded_titles') || '[]');
}
function addExcludedTitle(title) {
  const list = getExcludedTitles();
  if (!list.includes(title)) {
    list.push(title);
    localStorage.setItem('rf_excluded_titles', JSON.stringify(list));
  }
}

function getBookmarks() {
  return JSON.parse(localStorage.getItem('rf_bookmarks') || '[]');
}
function setBookmarks(list) {
  localStorage.setItem('rf_bookmarks', JSON.stringify(list));
}
function isBookmarked(movie) {
  const bookmarks = getBookmarks();
  return bookmarks.some(m => m.id === movie.id);
}
function toggleBookmark(movie, justification) {
  const bookmarks = getBookmarks();
  if (isBookmarked(movie)) {
    setBookmarks(bookmarks.filter(m => m.id !== movie.id));
  } else {
    setBookmarks([
      ...bookmarks,
      {
        ...movie,
        seen: false,
        liked: null,
        justification: justification || 'Personalized reason will appear here',
      },
    ]);
  }
}
function updateBookmark(movieId, updates) {
  const bookmarks = getBookmarks();
  setBookmarks(bookmarks.map(m => m.id === movieId ? { ...m, ...updates } : m));
}

// Funkcja do pobierania keywords z TMDB dla danego filmu
async function fetchKeywordsForMovie(movieId) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.keywords || [];
}

// Funkcje do obsługi wyświetlonych filmów w localStorage
function getViewedTitles() {
  return JSON.parse(localStorage.getItem('rf_viewed_titles') || '[]');
}
function addViewedTitle(title) {
  const list = getViewedTitles();
  if (!list.includes(title)) {
    list.push(title);
    localStorage.setItem('rf_viewed_titles', JSON.stringify(list));
  }
}

export default function RecommendationsMainPage() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showParams, setShowParams] = useState(true);
  const [showVibe, setShowVibe] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [displayMode, setDisplayMode] = useState('visual');
  // moodReason z localStorage lub propsów (jeśli masz lepsze źródło, podmień)
  const moodReason = localStorage.getItem('rf_mood_reason') || '';
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarksState] = useState(getBookmarks());
  const [showProfile, setShowProfile] = useState(false);
  // Dane z kwestionariusza (poza imieniem)
  const [profileData, setProfileData] = useState(() => {
    return {
      age: localStorage.getItem('rf_age') || '',
      mood: localStorage.getItem('rf_mood') || '',
      moodReason: localStorage.getItem('rf_mood_reason') || '',
      preferences: JSON.parse(localStorage.getItem('rf_preferences') || '[]'),
      customPreference: localStorage.getItem('rf_custom_preference') || '',
    };
  });

  // Dodaję obsługę trybów widoku (zakładki)
  const [mainView, setMainView] = useState('recommendations'); // 'recommendations', 'bookmarks', 'profile', 'analytics', ...
  const [mvpMessage, setMvpMessage] = useState('');

  // Stan na keywords tylko dla aktualnego filmu
  const [currentKeywords, setCurrentKeywords] = useState([]);
  const [currentKeywordsLoading, setCurrentKeywordsLoading] = useState(false);

  // Stany do filtrów i sortowania
  const [yearFrom, setYearFrom] = useState(1990);
  const [yearTo, setYearTo] = useState(new Date().getFullYear());
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('year'); // 'year', 'date', 'rating'
  const [moodFilter, setMoodFilter] = useState(profileData.mood || '');

  // Stany tymczasowe do edycji w panelu
  const [pendingYearFrom, setPendingYearFrom] = useState(yearFrom);
  const [pendingYearTo, setPendingYearTo] = useState(yearTo);
  const [pendingMinRating, setPendingMinRating] = useState(minRating);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [savingFilters, setSavingFilters] = useState(false);

  // Walidacja zakresów
  const isYearRangeValid = pendingYearFrom <= pendingYearTo && pendingYearFrom >= 1900 && pendingYearTo <= new Date().getFullYear();
  const isRatingValid = pendingMinRating >= 0 && pendingMinRating <= 10;
  const canSave = isYearRangeValid && isRatingValid;

  // Zatwierdzenie filtrów i sortowania z animacją
  async function handleSaveFilters() {
    if (!canSave) return;
    setSavingFilters(true);
    await new Promise(res => setTimeout(res, 400));
    setYearFrom(pendingYearFrom);
    setYearTo(pendingYearTo);
    setMinRating(pendingMinRating);
    setSortBy(pendingSortBy);
    setCurrentIndex(0);
    setSavingFilters(false);
  }

  // Funkcje do przełączania widoków
  function handleShowRecommendations() {
    setMainView('recommendations');
    setMvpMessage('');
  }
  function handleShowBookmarks() {
    setMainView('bookmarks');
    setMvpMessage('');
  }
  function handleShowProfile() {
    setMainView('profile');
    setMvpMessage('');
  }
  function handleShowAnalytics() {
    setMainView('analytics');
    setMvpMessage('This is an MVP. Analytics and advanced views will be added in the future!');
  }

  // Funkcja do zmiany nastroju i odświeżenia rekomendacji
  function handleMoodChange(newMood) {
    setMoodFilter(newMood);
    localStorage.setItem('rf_mood', newMood);
    // Resetuj listę wyświetlonych filmów przy zmianie moodu
    localStorage.removeItem('rf_viewed_titles');
    // Możesz tu wywołać onboarding lub fetchRecommendations, jeśli chcesz natychmiast odświeżyć rekomendacje
    window.location.href = '/onboarding.html?skipNameAge=1';
  }

  // Filtrowanie i sortowanie filmów
  function getFilteredSortedMovies(list = movies) {
    let filtered = list.filter(m => {
      const year = parseInt((m.release_date || m.first_air_date || '').slice(0, 4));
      const rating = m.vote_average || 0;
      return (
        (!isNaN(year) && year >= yearFrom && year <= yearTo) &&
        rating >= minRating
      );
    });
    if (sortBy === 'year') {
      filtered = filtered.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    } else if (sortBy === 'date') {
      filtered = filtered.sort((a, b) => (b.first_air_date || '').localeCompare(a.first_air_date || ''));
    } else if (sortBy === 'rating') {
      filtered = filtered.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }
    return filtered;
  }

  // Fetch genres and movies/series or use recommendations from localStorage
  useEffect(() => {
    const storedTitles = localStorage.getItem('rf_recommendation_titles');
    // Pobierz listę wykluczonych tytułów na podstawie bookmarków (seen/dislike)
    const bookmarks = getBookmarks();
    const excludedByBookmarks = bookmarks.filter(m => m.seen === true || m.liked === false).map(m => m.title || m.name);
    // Pobierz listę wyświetlonych filmów
    const viewedTitles = getViewedTitles();
    if (storedTitles) {
      try {
        const titles = JSON.parse(storedTitles);
        if (Array.isArray(titles) && titles.length > 0) {
          setLoading(true);
          Promise.all(
            titles.map(async (title) => {
              try {
                const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(title)}`);
                const data = await res.json();
                return data.results && data.results.length > 0 ? data.results[0] : null;
              } catch (e) {
                return null;
              }
            })
          ).then(results => {
            // Filtrujemy null/nieznalezione filmy
            const filtered = results.filter(Boolean);
            // Filtrujemy wykluczone filmy
            const excluded = [...getExcludedTitles(), ...excludedByBookmarks, ...viewedTitles];
            const uniqueFiltered = filtered.filter(m => !excluded.includes(m.title || m.name));
            setMovies(uniqueFiltered);
            setSeries([]);
            setLoading(false);
            // Usuwamy tytuły z localStorage, by przy kolejnym onboardingu pobrać nowe
            localStorage.removeItem('rf_recommendation_titles');
          });
          return;
        }
      } catch (e) {
        // fallback to TMDB fetch
      }
    }
    async function fetchData() {
      setLoading(true);
      try {
        const [movieRes, seriesRes, genreRes] = await Promise.all([
          fetch(TMDB_MOVIE_URL),
          fetch(TMDB_SERIES_URL),
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
        ]);
        const movieData = await movieRes.json();
        const seriesData = await seriesRes.json();
        const genreData = await genreRes.json();
        const genreMap = {};
        genreData.genres.forEach(g => { genreMap[g.id] = g.name; });
        // Map genres to names
        const moviesWithGenres = (movieData.results || []).slice(0, 15).map(m => ({
          ...m,
          genre_names: (m.genre_ids || []).map(id => genreMap[id]).filter(Boolean),
        }));
        const seriesWithGenres = (seriesData.results || []).slice(0, 15).map(m => ({
          ...m,
          genre_names: (m.genre_ids || []).map(id => genreMap[id]).filter(Boolean),
        }));
        // Filtruj filmy po bookmarkach (seen/dislike) i wyświetlonych
        const excluded = [...excludedByBookmarks, ...viewedTitles];
        setMovies(moviesWithGenres.filter(m => !excluded.includes(m.title || m.name)));
        setSeries(seriesWithGenres.filter(m => !excluded.includes(m.title || m.name)));
      } catch (e) {
        setMovies([]);
        setSeries([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Progress bar logic
  useEffect(() => {
    setProgress(Math.min(100, (currentIndex + 1) * 100 / 50));
  }, [currentIndex]);

  // Tab logic: rozdzielaj filmy i seriale według currentTab
  let filteredItems = [];
  if (currentTab === 'all') {
    filteredItems = [...getFilteredSortedMovies(movies), ...getFilteredSortedMovies(series)];
  } else if (currentTab === 'movies') {
    filteredItems = getFilteredSortedMovies(movies);
  } else if (currentTab === 'series') {
    filteredItems = getFilteredSortedMovies(series);
  }
  const current = filteredItems[currentIndex];
  console.log('DEBUG movies:', movies.length, 'series:', series.length);
  console.log('DEBUG filteredItems.length:', filteredItems.length, 'currentIndex:', currentIndex, 'current:', current);

  // Animacja odrzucenia
  const handleReject = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setCurrentIndex((i) => i + 1);
    }, 400);
  };

  const handleBookmark = (movie, justification) => {
    toggleBookmark(movie, justification);
    setBookmarksState(getBookmarks());
  };

  useEffect(() => {
    setBookmarksState(getBookmarks());
  }, [showBookmarks]);

  // Po przeklikaniu wszystkich filmów pokaż profil
  useEffect(() => {
    if (!loading && currentIndex >= filteredItems.length && !showProfile) {
      setShowProfile(true);
    }
  }, [loading, currentIndex, filteredItems.length, showProfile]);

  // Pełna lista emocji z kwestionariusza (z emoji)
  const moodOptions = [
    { label: 'Happy', emoji: '😊' },
    { label: 'In love', emoji: '😍' },
    { label: 'Angry', emoji: '😡' },
    { label: 'Stressed', emoji: '😰' },
    { label: 'Tired', emoji: '😴' },
    { label: 'Nostalgic', emoji: '🥲' },
    { label: 'Sad', emoji: '😢' },
  ];

  // Lewy panel z filtrami
  function LeftPanel() {
    return (
      <aside className="flex flex-col bg-white py-6 px-4 min-h-screen border-r border-gray-100 text-xs w-full">
        {/* Logo na górze */}
        <div className="mb-6 flex items-center justify-center">
          <a href="/index.html" className="flex items-center gap-2 rounded-xl px-4 py-2 bg-[#635BFF] text-black font-bold text-lg shadow hover:shadow-md transition">
            <span className="text-2xl">🎬</span>
            <span>Movie Recommender</span>
          </a>
        </div>
        <div className="font-bold text-lg mb-4">🎛️ Filters</div>
            <div className="mb-6">
              <div className="font-semibold mb-2 text-gray-700">Production year</div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1900"
              max={pendingYearTo}
              value={pendingYearFrom}
              onChange={e => {
                const val = Number(e.target.value);
                setPendingYearFrom(val);
                if (val > pendingYearTo) setPendingYearTo(val);
              }}
              className="w-16 border rounded px-1 py-0.5"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className="mx-1">–</span>
            <input
              type="number"
              min={pendingYearFrom}
              max={new Date().getFullYear()}
              value={pendingYearTo}
              onChange={e => {
                const val = Number(e.target.value);
                setPendingYearTo(val);
                if (val < pendingYearFrom) setPendingYearFrom(val);
              }}
              className="w-16 border rounded px-1 py-0.5"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className="ml-2 text-gray-400 text-xs">({pendingYearFrom}–{pendingYearTo})</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1 italic">As an MVP, the database includes movies up to 2017. Support for newer titles is easy to add, but not included in this MVP.</div>
            </div>
            <div className="mb-6">
          <div className="font-semibold mb-2 text-gray-700">Minimum rating</div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={pendingMinRating}
              onChange={e => setPendingMinRating(Number(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 text-gray-700 text-xs">{pendingMinRating}</span>
              </div>
            </div>
            <div className="mb-6">
          <div className="font-semibold mb-2 text-gray-700">Sort by</div>
          <select value={pendingSortBy} onChange={e => setPendingSortBy(e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="year">Production year</option>
            <option value="date">Release date</option>
            <option value="rating">Rating</option>
          </select>
            </div>
            <div className="mb-6">
          <div className="font-semibold mb-2 text-gray-700">Change mood</div>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map(mood => (
              <button key={mood.label} className={`px-2 py-1 rounded-full border flex items-center gap-2 ${moodFilter === mood.label ? 'bg-pink-100 border-pink-400 text-pink-700 font-bold' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => handleMoodChange(mood.label)}>
                <span>{mood.label}</span>
              </button>
            ))}
              </div>
            </div>
        <button
          className={`mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-base ${!canSave || savingFilters ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSaveFilters}
          disabled={!canSave || savingFilters}
        >
          {savingFilters ? 'Saving...' : 'Save'}
        </button>
      </aside>
    );
  }

  // Zawsze synchronizuj currentIndex z długością przefiltrowanej listy
  useEffect(() => {
    if (filteredItems.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredItems.length || currentIndex < 0) {
      setCurrentIndex(0);
    }
  }, [yearFrom, yearTo, minRating, sortBy, moodFilter, movies, series, filteredItems.length, currentIndex]);

  // Pobieraj keywords tylko dla aktualnego filmu
  useEffect(() => {
    let isActive = true;
    if (current && current.id) {
      setCurrentKeywordsLoading(true);
      console.log('Pobieram keywords dla:', current.title || current.name, current.id);
        fetchKeywordsForMovie(current.id).then(keywords => {
          if (isActive) {
          setCurrentKeywords(keywords);
          setCurrentKeywordsLoading(false);
          console.log('Ustawiam keywords dla:', current.title || current.name, current.id, keywords);
          }
        });
      } else {
      setCurrentKeywords([]);
      setCurrentKeywordsLoading(false);
    }
    return () => { isActive = false; };
  }, [current?.id]);

  // Synchronizuj moodFilter z profileData.mood, by panel po lewej zawsze pokazywał aktualny nastrój
  useEffect(() => {
    setMoodFilter(profileData.mood || '');
  }, [profileData.mood]);

  // Po każdej zmianie current (wyświetlany film) zapisz tytuł do viewed
  useEffect(() => {
    if (current && (current.title || current.name)) {
      addViewedTitle(current.title || current.name);
    }
  }, [current?.id]);

  // BookmarksList jako funkcja wewnętrzna
  function BookmarksList() {
    const [removingId, setRemovingId] = useState(null);
    if (bookmarks.length === 0) {
      return <div className="text-xl text-gray-400 mt-12">No bookmarked movies yet.</div>;
    }
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <AnimatePresence>
          {bookmarks.map((movie) => (
            <motion.div
              key={movie.id}
              initial={{ x: 0, opacity: 1, rotate: 0 }}
              animate={removingId === movie.id ? { x: 600, opacity: 0, rotate: 24 } : { x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: 600, opacity: 0, rotate: 24 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-row items-stretch mb-6 overflow-hidden"
            >
              <div className="relative flex flex-col h-full max-w-[180px] min-w-[120px]">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : "https://via.placeholder.com/120x180?text=No+Image"}
                  alt={movie.title || movie.name}
                  className="h-full w-full object-cover rounded-l-2xl"
                />
              </div>
              <div className="flex flex-col p-4 flex-1">
                <div className="text-lg font-bold text-blue-900 mb-1">{movie.title || movie.name}</div>
                <div className="text-gray-600 text-xs mb-2">{movie.release_date?.slice(0,4) || "?"}</div>
                <div className="text-gray-700 mb-2 text-xs leading-normal max-w-2xl">{movie.overview || "No description."}</div>
                {/* Powód rekomendacji */}
                {movie.justification && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-2 py-2 mb-3">
                    <div className="font-semibold text-green-900 mb-1 text-sm flex items-center gap-2"><span>✅</span>Smart choice justification</div>
                    <div className="text-gray-600 text-xs">{movie.justification}</div>
                  </div>
                )}
                <div className="flex mt-auto border border-gray-200 rounded-xl bg-white p-0.5 gap-0.5">
                  <button
                    className={`flex-1 px-0 py-2 flex items-center justify-center gap-2 font-semibold text-sm transition outline-none border-0 bg-white rounded-xl
                      ${movie.seen ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-800'}`}
                    style={{ borderRadius: '0.75rem' }}
                    onClick={() => {
                      setRemovingId(movie.id);
                      setTimeout(() => {
                        setBookmarks(getBookmarks().filter(m => m.id !== movie.id));
                        setBookmarksState(getBookmarks().filter(m => m.id !== movie.id));
                        setRemovingId(null);
                      }, 500); // dłużej, by animacja była widoczna
                    }}
                    disabled={removingId === movie.id}
                  >
                    <Eye size={16} className={movie.seen ? 'text-purple-700' : 'text-gray-800'} />
                    Already Seen
                  </button>
                  <button
                    className={`flex-1 px-0 py-2 flex items-center justify-center gap-2 font-semibold text-sm transition outline-none border-0 bg-white rounded-xl
                      ${movie.liked === true ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-800'}`}
                    style={{ borderRadius: '0.75rem' }}
                    onClick={() => { updateBookmark(movie.id, { liked: true }); setBookmarksState(getBookmarks()); }}
                  >
                    <Heart size={16} className={movie.liked === true ? 'text-green-700' : 'text-gray-800'} />
                    Like
                  </button>
                  <button
                    className={`flex-1 px-0 py-2 flex items-center justify-center gap-2 font-semibold text-sm transition outline-none border-0 bg-white rounded-xl
                      ${movie.liked === false ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-800'}`}
                    style={{ borderRadius: '0.75rem' }}
                    onClick={() => { updateBookmark(movie.id, { liked: false }); setBookmarksState(getBookmarks()); }}
                  >
                    <ThumbsDown size={16} className={movie.liked === false ? 'text-red-700' : 'text-gray-800'} />
                    Dislike
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Nowy panel profilu: "Today's mood" z przyciskiem Change i dużą ikonką nastroju
  function MoodPanel() {
    const moodLabel = profileData.mood || '—';
    const moodEmoji = moodEmojis[moodLabel] || '🙂';
    return (
      <div className="w-full flex flex-row items-center justify-center mt-16 gap-6">
        <div className="flex flex-col items-end justify-center mr-4">
          <span className="text-gray-500 text-sm font-medium mb-0.5">Today's mood</span>
          <button
            className="text-purple-700 font-bold text-sm hover:underline focus:outline-none p-0 m-0 bg-transparent border-none"
            style={{ lineHeight: 1, cursor: 'pointer' }}
            onClick={() => window.location.href = '/onboarding.html?skipNameAge=1'}
          >
            Change
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 border-gray-200 rounded-2xl px-8 py-6 flex flex-col items-center justify-center bg-white" style={{ minWidth: 110 }}>
            <span className="text-2xl mb-1">{moodEmoji}</span>
            <span className="text-base font-semibold text-gray-700">{moodLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  // Odświeżaj profileData po powrocie z onboarding (focus/visibility)
  useEffect(() => {
    function updateProfileData() {
      setProfileData({
        age: localStorage.getItem('rf_age') || '',
        mood: localStorage.getItem('rf_mood') || '',
        moodReason: localStorage.getItem('rf_mood_reason') || '',
        preferences: JSON.parse(localStorage.getItem('rf_preferences') || '[]'),
        customPreference: localStorage.getItem('rf_custom_preference') || '',
      });
    }
    window.addEventListener('focus', updateProfileData);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') updateProfileData();
    });
    return () => {
      window.removeEventListener('focus', updateProfileData);
      document.removeEventListener('visibilitychange', updateProfileData);
    };
  }, []);

  // Resetuj showProfile, gdy pojawią się filmy
  useEffect(() => {
    if (filteredItems.length > 0 && showProfile) {
      setShowProfile(false);
    }
  }, [filteredItems.length, showProfile]);

  // Renderowanie głównego widoku
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {mvpMessage && (
        <div className="w-full flex justify-center mb-4">
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-xl font-semibold text-lg shadow">{mvpMessage}</div>
            </div>
      )}
      {mainView === 'recommendations' || mainView === 'bookmarks' ? (
        <>
          {/* Display mode tylko w recommendations */}
          <div className="flex justify-center mb-4">
            {/* ... tutaj Twój kod display mode ... */}
            </div>
          <div className="grid min-h-screen bg-gray-50 font-inter" style={{ gridTemplateColumns: '240px 1fr 240px' }}>
            <LeftPanel />
      <main className="flex flex-col min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-0 min-h-screen">
          {/* Górny pasek z przyciskami i progressbarem */}
          <div className="flex w-full items-center justify-between px-4 pt-6 pb-3">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-row items-center gap-1 min-w-0">
                <span className="text-xl mr-2 shrink-0">🤖</span>
                <span className="font-semibold text-[#232A36] text-sm mr-1">Training level</span>
                <BookOpen size={16} className="text-yellow-400 mr-1" />
                      <span className="font-bold text-[#232A36] text-sm">{Math.round(progress / 2)} / 50</span>
              </div>
              <div className="w-full flex">
                <div className="w-full max-w-[120px] h-1 bg-[#F1F2F4] rounded-full mt-1 overflow-hidden ml-8">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
                    {/* Recommendations button z licznikiem */}
                    <div className="flex items-center gap-3">
                      <span
                        className="text-gray-500 text-base font-semibold cursor-pointer"
                        onClick={() => { setMainView('recommendations'); setShowProfile(false); setShowBookmarks(false); }}
                      >
                        Recommendations
                      </span>
                      <button
                        type="button"
                        aria-label="Recommendations"
                        onClick={() => { setMainView('recommendations'); setShowProfile(false); setShowBookmarks(false); }}
                        className={`relative flex items-center justify-center bg-gray-100 rounded-2xl p-3 shadow-none border-none focus:outline-none transition`}
                      >
                      <ClapperboardIcon />
                        {filteredItems.length - currentIndex > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow flex items-center justify-center min-w-[22px] min-h-[22px]">
                            {filteredItems.length - currentIndex}
                          </span>
                        )}
                    </button>
                    </div>
                    {/* Watchlist button z licznikiem */}
                    <div className="flex items-center gap-3">
                      <span
                        className="text-gray-500 text-base font-semibold cursor-pointer"
                        onClick={() => { setMainView('bookmarks'); setShowProfile(false); setShowBookmarks(true); }}
                      >
                        Watchlist
                      </span>
                      <button
                        type="button"
                        aria-label="Watchlist"
                        onClick={() => { setMainView('bookmarks'); setShowProfile(false); setShowBookmarks(true); }}
                        className={`relative flex items-center justify-center bg-gray-100 rounded-2xl p-3 shadow-none border-none focus:outline-none transition`}
                      >
                        <Bookmark size={24} className="text-gray-700" />
                        {bookmarks.length > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow flex items-center justify-center min-w-[22px] min-h-[22px]">
                            {bookmarks.length}
                          </span>
                        )}
              </button>
                    </div>
                    {/* Nowy przycisk mood/profile bez ramki, tylko 'Change' klikalny */}
                    <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2" style={{ minWidth: 220 }}>
                      <div className="flex flex-col items-end justify-center mr-2 select-none">
                        <span className="text-gray-500 text-sm font-semibold mb-0.5">Today's mood</span>
                        <button
                          className="text-purple-700 font-bold text-base underline hover:opacity-80 focus:outline-none p-0 m-0 bg-transparent border-none"
                          style={{ lineHeight: 1, cursor: 'pointer' }}
                          tabIndex={0}
                          onClick={() => window.location.href = '/onboarding.html?skipNameAge=1'}
                        >
                          Change
              </button>
                      </div>
                      <div className="flex flex-col items-center justify-center select-none">
                        <div className="px-6 py-3 flex flex-col items-center justify-center bg-white" style={{ minWidth: 80 }}>
                          <span className="text-2xl mb-1">{moodEmojis[profileData.mood] || '🙂'}</span>
                          <span className="text-base font-semibold text-gray-700">{profileData.mood || '—'}</span>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
                {/* Tab i tryby widoku tylko dla recommendations */}
                {mainView === 'recommendations' && (
          <div className="flex w-full items-center gap-4 px-8 mb-6">
            <div className="flex gap-4">
              <button onClick={() => setCurrentTab("all")} className={`${currentTab === "all" ? "font-bold text-[#181C32]" : "font-semibold text-gray-400"} transition`}>All</button>
              <button onClick={() => setCurrentTab("movies")} className={`${currentTab === "movies" ? "font-bold text-[#181C32]" : "font-semibold text-gray-400"} transition`}>Movies</button>
              <button onClick={() => setCurrentTab("series")} className={`${currentTab === "series" ? "font-bold text-[#181C32]" : "font-semibold text-gray-400"} transition`}>Series</button>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-gray-600 text-base whitespace-nowrap">Display mode</span>
              <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-0.5">
                <button
                  onClick={() => setDisplayMode('analytical')}
                  className={`flex items-center gap-1 px-3 py-1 font-semibold transition text-sm ${displayMode === 'analytical' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-xl`}
                  style={{ borderRadius: '0.75rem' }}
                >
                  <BarChart2 size={14} className="mr-1" /> Analytical
                </button>
                <button
                  onClick={() => setDisplayMode('descriptive')}
                  className={`flex items-center gap-1 px-3 py-1 font-semibold transition text-sm ${displayMode === 'descriptive' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-xl`}
                  style={{ borderRadius: '0.75rem' }}
                >
                  <BadgeInfo size={14} className="mr-1" /> Descriptive
                </button>
                <button
                  onClick={() => setDisplayMode('intuitive')}
                  className={`flex items-center gap-1 px-3 py-1 font-semibold transition text-sm ${displayMode === 'intuitive' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-xl`}
                  style={{ borderRadius: '0.75rem' }}
                >
                  <Heart size={14} className="mr-1" /> Intuitive
                </button>
                <button
                  onClick={() => setDisplayMode('visual')}
                  className={`flex items-center gap-1 px-3 py-1 font-semibold transition text-sm ${displayMode === 'visual' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-700 bg-white hover:bg-gray-50'} rounded-xl`}
                  style={{ borderRadius: '0.75rem' }}
                >
                  <List size={14} className="mr-1" /> Visual
                </button>
              </div>
            </div>
          </div>
                )}
                {/* Centralna treść: rekomendacje lub lista */}
                {mainView === 'bookmarks' ? (
                  <BookmarksList />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-start">
                    {/* Główny panel: najpierw sprawdzaj filteredItems.length === 0, potem showProfile */}
                    {(() => {
                      console.log('filteredItems.length:', filteredItems.length, 'showProfile:', showProfile);
                      if (filteredItems.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center w-full mt-16">
                            <div className="text-2xl text-gray-400 font-bold mb-4">No movies found for the selected filters.</div>
                            <div className="flex gap-4">
                              <button
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow hover:shadow-lg transition"
                                onClick={() => { setYearFrom(1990); setYearTo(new Date().getFullYear()); setMinRating(0); setSortBy('year'); }}
                              >
                                Reset filters
                              </button>
                              <button
                                className="px-6 py-2 rounded-xl border border-purple-500 text-purple-700 font-bold bg-white shadow hover:bg-purple-50 transition"
                                onClick={() => window.location.href = '/onboarding.html?skipNameAge=1'}
                              >
                                Change your mood
                              </button>
                          </div>
                          </div>
                        );
                      } else if (showProfile) {
                        return (
                <div className="text-2xl text-gray-400 font-bold">No more movies or series to display.</div>
                        );
                      } else if (!current) {
                        return (
                          <div className="text-2xl text-gray-400 font-bold">No more movies or series to display.</div>
                        );
                      } else {
                        return (
                <div className="w-full max-w-6xl mx-auto">
                  <MovieCard
                              movie={filteredItems[currentIndex]}
                    onReject={handleReject}
                    animating={animating}
                    setAnimating={setAnimating}
                    setCurrentIndex={setCurrentIndex}
                              moodReason={moodReason}
                              onBookmark={handleBookmark}
                  />
                </div>
                        );
                      }
                    })()}
          </div>
                )}
        </div>
      </main>
      {/* Prawy panel - zawsze widoczny */}
      <AnimatePresence initial={false}>
          <motion.aside
                key="keywords"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col bg-white py-12 px-10 min-h-screen border-l border-gray-100 text-sm"
          >
                {current && (
                  <>
                    <div className="font-bold text-xl mb-4">🎬 Movie Keywords</div>
                    <div className="font-semibold text-blue-900 mb-1 text-sm">{current.title || current.name}</div>
                    {currentKeywordsLoading ? (
                      <div className="text-xs text-gray-400">Loading keywords…</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentKeywords.map(kw => (
                          <span key={kw.id} className="px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold cursor-pointer select-none">
                            {kw.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.aside>
            </AnimatePresence>
              </div>
        </>
      ) : null}
      {mainView === 'profile' && (
        <div className="grid min-h-screen bg-gray-50 font-inter" style={{ gridTemplateColumns: '240px 1fr 240px' }}>
          <aside />
          <main className="flex flex-col min-h-screen bg-white">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-0 min-h-screen">
              <MoodPanel />
            </div>
          </main>
          <aside />
            </div>
      )}
      {mainView === 'analytics' && null}
    </div>
  );
} 
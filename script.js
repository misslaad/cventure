const API_URL = 'https://v2.jokeapi.dev/joke/Any?safe-mode';

const jokeButton = document.querySelector('#joke-button');
const buttonLabel = document.querySelector('#button-label');
const jokeText = document.querySelector('#joke-text');
const categoryLabel = document.querySelector('#category');
const errorMessage = document.querySelector('#error-message');
const jokeCard = document.querySelector('.joke-card');
const copyButton = document.querySelector('#copy-button');
const favoriteButton = document.querySelector('#favorite-button');

let currentJoke = null;

function formatJoke(joke) {
  if (joke.type === 'twopart') return `${joke.setup}\n\n${joke.delivery}`;
  return joke.joke;
}

function setLoading(isLoading) {
  jokeButton.disabled = isLoading;
  jokeCard.setAttribute('aria-busy', String(isLoading));
  buttonLabel.textContent = isLoading ? 'Finding a giggle…' : 'Tell me another';
  if (isLoading) {
    jokeText.textContent = 'The joke box is searching…';
    categoryLabel.textContent = 'LOADING';
    copyButton.disabled = true;
    favoriteButton.disabled = true;
    errorMessage.hidden = true;
  }
}

async function getJoke() {
  setLoading(true);
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch(API_URL, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        cache: 'no-store'
      });
    } finally {
      window.clearTimeout(timeout);
    }

    if (!response.ok) throw new Error(`Joke service returned ${response.status}.`);
    const data = await response.json();
    if (data.error) throw new Error('The joke service could not find a joke right now.');

    const text = formatJoke(data).trim();
    if (!text) throw new Error('The joke service returned an empty joke.');

    currentJoke = { text, category: data.category || 'JOKE' };
    jokeText.textContent = text;
    jokeText.classList.remove('updated');
    void jokeText.offsetWidth;
    jokeText.classList.add('updated');
    categoryLabel.textContent = currentJoke.category.toUpperCase();
    copyButton.disabled = false;
    favoriteButton.disabled = false;
    favoriteButton.setAttribute('aria-pressed', 'false');
    favoriteButton.textContent = '♡';
    favoriteButton.title = 'Save to favorites';
    errorMessage.hidden = true;
  } catch (error) {
    currentJoke = null;
    jokeText.textContent = 'Oh no—the joke box is taking a little break.';
    categoryLabel.textContent = 'NO JOKE YET';
    copyButton.disabled = true;
    favoriteButton.disabled = true;
    errorMessage.textContent = error.name === 'AbortError'
      ? 'The request took too long. Check your connection and try again.'
      : 'Could not load a joke. Please check your internet connection and try again.';
    errorMessage.hidden = false;
  } finally {
    setLoading(false);
  }
}

jokeButton.addEventListener('click', getJoke);

copyButton.addEventListener('click', async () => {
  if (!currentJoke) return;
  try {
    await navigator.clipboard.writeText(currentJoke.text);
    copyButton.textContent = '✓';
    copyButton.setAttribute('aria-label', 'Joke copied');
    window.setTimeout(() => {
      copyButton.textContent = '⧉';
      copyButton.setAttribute('aria-label', 'Copy joke');
    }, 1400);
  } catch {
    errorMessage.textContent = 'Copy is unavailable in this browser. You can select and copy the joke text.';
    errorMessage.hidden = false;
  }
});

favoriteButton.addEventListener('click', () => {
  if (!currentJoke) return;
  const saved = favoriteButton.getAttribute('aria-pressed') !== 'true';
  favoriteButton.setAttribute('aria-pressed', String(saved));
  favoriteButton.textContent = saved ? '♥' : '♡';
  favoriteButton.title = saved ? 'Saved to favorites' : 'Save to favorites';
});

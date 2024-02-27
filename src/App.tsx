import { createSignal, type Component, onMount, Show } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import MovieRatingsGraph from './MovieRatingsGraph';
import tempData from './tempData';

export interface Review {
  date: string;
  title: string;
  rating: string;
  rewatch: boolean;
  thumbnail: string;
  link: string;
}

interface MovieData {
  reviews: Review[];
  availableYears: number[];
}

export const [username, setUsername] = createSignal<string>("");
export const [year, setYear] = createSignal<number | undefined>(undefined);
export const [reviews, setReviews] = createSignal<Review[]>([]);
export const [availableYears, setAvailableYears] = createSignal<number[]>([]);
export const [isLoading, setIsLoading] = createSignal(true);

const App: Component = () => {
  const fetchData = async () => {
    setIsLoading(true); // Start loading
    const response = await fetch(`https://script.google.com/macros/s/AKfycbwiHxvPC5gLGLg1zBAjcxEbzKrBsANT129Nd4FM8Bh7xsuUPg9vtUhTokAz9qMbHoK7/exec?username=${username()}&year=${year()}`);
    const jsonData: MovieData = await response.json();
    // const jsonData = tempData as any;
    setReviews(jsonData.reviews);
    setAvailableYears(jsonData.availableYears);
    setIsLoading(false); // End loading
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <MovieRatingsGraph />
        <form onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission behavior
          fetchData(); // Call your fetchData function
        }}>
          <div style={{ display: "flex", gap: ".5em" }}>
            <input
              type="text"
              value={username()}
              onInput={(e) => {
                setUsername(e.currentTarget.value);
                setAvailableYears([]);
              }}
              autocomplete="username"
              placeholder="Letterboxd username..."
            />
            <Show when={availableYears().length > 0} fallback={
              <input
                type="number"
                value={year()}
                onInput={(e) => setYear(parseInt(e.currentTarget.value))}
                placeholder="Diary year..."
              />
            }>
              <select value={year()} onChange={(e) => setYear(parseInt(e.currentTarget.value))}>
                {availableYears().map((year) => (
                  <option value={year}>{year}</option>
                ))}
              </select>
            </Show>
            <button type="submit">Load Data</button>
          </div>
        </form>
      </header>
    </div>
  );
};

export default App;

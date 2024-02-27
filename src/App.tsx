import { createSignal, type Component, onMount } from 'solid-js';

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

export const [username, setUsername] = createSignal("zimonitrome");
export const [year, setYear] = createSignal(2023);
export const [reviews, setReviews] = createSignal<Review[]>([]);
export const [availableYears, setAvailableYears] = createSignal<number[]>([]);
export const [isLoading, setIsLoading] = createSignal(true);

const App: Component = () => {
  const fetchData = async () => {
      setIsLoading(true); // Start loading
      //const response = await fetch(`https://script.google.com/macros/s/AKfycbwiHxvPC5gLGLg1zBAjcxEbzKrBsANT129Nd4FM8Bh7xsuUPg9vtUhTokAz9qMbHoK7/exec?username=${username}&year=${year}`);
      // const jsonData: MovieData = await response.json();
      const jsonData = tempData as any;
      setReviews(jsonData.reviews);
      setAvailableYears(jsonData.availableYears);
      setIsLoading(false); // End loading
  };

  onMount(fetchData);

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <MovieRatingsGraph reviews={reviews()} />
        <div style={{ display: "flex", gap: ".5em" }}>
          <input type="text" value={username()} onInput={(e) => setUsername(e.currentTarget.value)} />
          <input type="number" value={year()} onInput={(e) => setYear(parseInt(e.currentTarget.value))} />
          <button onClick={fetchData}>Load Data</button>
        </div>
      </header>
    </div>
  );
};

export default App;

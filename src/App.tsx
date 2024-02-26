import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import MovieRatingsGraph from './MovieRatingsGraph';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        {/* <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a> */}
        <MovieRatingsGraph width={800} height={1000} />
      </header>
    </div>
  );
};

export default App;

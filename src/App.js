import React from "react";
import Weather from "./Weather";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="weather-container">
        <Weather />
        <footer>
          This project was coded by{" "}
          <a
            href="https://khelsea-alarefi-web-dev-portfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Khelsea Al-Arefi
          </a>{" "}
          and is{" "}
          <a
            href="https://github.com/Khelbot/react-weather-homework"
            target="_blank"
            rel="noopener noreferrer"
          >
            open-sourced on GitHub
          </a>{" "}
          and{" "}
          <a
            href="https://jolly-salamander-27ea5f.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hosted on Netlify
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;

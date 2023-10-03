import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // const apiKey = "2c12e4ab";
  const tmdbKey = "911b6a817f9b16d823f757d5d61d9684";
  const [movie, setMovie] = useState([]);
  const [query, setQuery] = useState("");
  const [selectID, setSelectID] = useState(null);

  function handleSelectMovie(id) {
    setSelectID((selectID) => (selectID === id ? null : id));
  }
  function closeSelected() {
    setSelectID(null);
  }
  useEffect(
    function () {
      async function getApi() {
        // const res = await fetch(
        //   `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
        // );
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${tmdbKey}`
        );
        const data = await res.json();
        const results = data.results;
        console.log(results);
        setMovie(results);
        // const dataSearch = data.Search;
        // setMovie(dataSearch);
      }
      getApi();
    },
    [query]
  );
  // useEffect(function () {
  //   async function getMovieApi() {
  //     const res = await fetch(
  //       `https://api.themoviedb.org/3/movie/157336?api_key=${tmdbKey}&append_to_response=videos`
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //   }
  //   getMovieApi();
  // }, []);
  return (
    <div>
      <header className="header">
        <MovieHeader
          movie={movie}
          query={query}
          setQuery={setQuery}
        ></MovieHeader>
      </header>
      <MovieContainer
        selectID={selectID}
        movie={movie}
        onSelectMovie={handleSelectMovie}
        closeSelected={closeSelected}
      ></MovieContainer>
    </div>
  );
}

function MovieHeader({ setQuery, query, movie }) {
  return (
    <nav className="navbar">
      <h1 className="logo-color">Ai Movies</h1>
      <div className="search">
        <input
          value={query}
          className="search"
          type="search"
          placeholder="search movie..."
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      <div>
        <p style={{ fontSize: "1.2rem" }}>
          <span className="logo-color" style={{ fontSize: "1.5rem" }}>
            Results:
          </span>{" "}
          {movie.length}
        </p>
      </div>
    </nav>
  );
}

function MovieContainer({ movie, selectID, onSelectMovie, closeSelected }) {
  return (
    <section className="movie-query-container">
      <ul className="movie-container">
        {movie?.map((mov) => (
          <QueryMovieBox
            onSelectMovie={onSelectMovie}
            mov={mov}
            key={mov?.id}
          ></QueryMovieBox>
        ))}
      </ul>
      <div className="movie-container">
        {selectID ? (
          <SelectedMovieBox
            closeSelected={closeSelected}
            selectID={selectID}
          ></SelectedMovieBox>
        ) : (
          <SavedMovieBox></SavedMovieBox>
        )}
      </div>
    </section>
  );
}

function QueryMovieBox({ mov, onSelectMovie }) {
  const imagePath = "https://image.tmdb.org/t/p/w500";
  return (
    <li onClick={() => onSelectMovie(mov.id)} className="query-grid">
      <img src={`${imagePath}${mov.poster_path}`} alt={mov.title}></img>
      <h2>{mov.title}</h2>
      <div className="query-year">
        <span>📅</span>
        <span>{mov.release_date}</span>
      </div>
    </li>
  );
}

function SelectedMovieBox({ selectID, closeSelected }) {
  return (
    <div>
      <span style={{ cursor: "pointer" }} onClick={closeSelected}>
        ❌
      </span>
      <h1>{selectID}</h1>
    </div>
  );
}

function SavedMovieBox() {
  return (
    <div>
      <h2>This is a placeholder to save your movies!</h2>
    </div>
  );
}
export default App;

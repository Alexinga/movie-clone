import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const tmdbKey = "911b6a817f9b16d823f757d5d61d9684";
  const [movie, setMovie] = useState([]);
  const [query, setQuery] = useState("");
  const [selectID, setSelectID] = useState(null);
  const [addMovie, setAddMovie] = useState(() => {
    const storedValue = localStorage.getItem("addMovies");
    return JSON.parse(storedValue) || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSelectMovie(id) {
    setSelectID((selectID) => (selectID === id ? null : id));
    getSelectApi(id);
  }
  function closeSelected() {
    setSelectID(null);
  }
  function addMovieList(selectMovie) {
    setAddMovie((movies) => [...movies, selectMovie]);
    closeSelected();
  }
  function removeMovieList(id) {
    setAddMovie((movies) => movies.filter((movie) => movie.id !== id));
  }
  async function getSelectApi(id) {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&append_to_response=videos`
      );
      if (!res.ok) throw new Error("Movie could not be fetched");
      const data = await res.json();
      setSelectID(data);
      // console.log(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
  async function getApi() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${tmdbKey}`
      );
      if (!res.ok) throw new Error("Movie not found");
      const data = await res.json();
      const results = data.results;
      setMovie(results);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    }
  }
  function handleSearchCall() {
    getApi();
  }

  // This was before I had to add a search button the getApi function was inside of the useEffect hook
  // useEffect(function () {
  //   getApi();
  // }, []);

  useEffect(
    function () {
      localStorage.setItem("addMovies", JSON.stringify(addMovie));
    },
    [addMovie]
  );
  return (
    <div>
      <header className="header">
        <MovieHeader
          movie={movie}
          query={query}
          setQuery={setQuery}
          onSearchCall={handleSearchCall}
        ></MovieHeader>
      </header>
      <MovieContainer
        selectID={selectID}
        movie={movie}
        onSelectMovie={handleSelectMovie}
        closeSelected={closeSelected}
        addMovieList={addMovieList}
        addMovie={addMovie}
        removeMovieList={removeMovieList}
        isLoading={isLoading}
        errorMessage={error}
      ></MovieContainer>
    </div>
  );
}

function MovieHeader({ setQuery, query, movie, onSearchCall }) {
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
        <button onClick={onSearchCall} className="btn">
          search
        </button>
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

function MovieContainer({
  movie,
  selectID,
  onSelectMovie,
  closeSelected,
  addMovieList,
  addMovie,
  removeMovieList,
  isLoading,
  errorMessage,
}) {
  return (
    <section className="movie-query-container">
      <ul className="movie-container scroll">
        {/* {isLoading && <Loading></Loading>}
        {!isLoading &&
          !errorMessage &&
          movie?.map((mov) => (
            <QueryMovieBox
              onSelectMovie={onSelectMovie}
              mov={mov}
              key={mov?.id}
              isLoading={isLoading}
              errorMessage={errorMessage}
            ></QueryMovieBox>
          ))}
        {errorMessage && <ErrMessage></ErrMessage>} */}
        {movie?.map((mov) => (
          <QueryMovieBox
            onSelectMovie={onSelectMovie}
            mov={mov}
            key={mov?.id}
            isLoading={isLoading}
            errorMessage={errorMessage}
          ></QueryMovieBox>
        ))}
      </ul>
      <div className="movie-container scroll">
        {isLoading && <Loading></Loading>}
        {!isLoading && !errorMessage && selectID ? (
          <SelectedMovieBox
            closeSelected={closeSelected}
            selectID={selectID}
            addMovieList={addMovieList}
            addMovie={addMovie}
          ></SelectedMovieBox>
        ) : (
          <SavedMovieBox
            removeMovieList={removeMovieList}
            addMovie={addMovie}
          ></SavedMovieBox>
        )}
        {errorMessage && <ErrMessage></ErrMessage>}
      </div>
    </section>
  );
}

function QueryMovieBox({ mov, onSelectMovie, isLoading, errorMessage }) {
  const imagePath = "https://image.tmdb.org/t/p/w500";
  return (
    <li onClick={() => onSelectMovie(mov.id)} className="query-grid">
      {mov.poster_path ? (
        <img src={`${imagePath}${mov.poster_path}`} alt={mov.title}></img>
      ) : null}
      <h2 className="title">{mov.title}</h2>
      <div className="query-year">
        <span>📅</span>
        <span>{mov.release_date}</span>
      </div>
    </li>
  );
}

function SelectedMovieBox({ selectID, closeSelected, addMovieList, addMovie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const imagePath = "https://image.tmdb.org/t/p/w500";
  const videoPath = "https://www.youtube.com/embed/";
  const trailerPath = selectID?.videos.results;
  const trailer = trailerPath.find(
    (vid) => vid.name === "Official Trailer"
  )?.key;
  const checkTrailer = trailerPath.find(
    (vid) => vid.name === "Official Trailer"
  );
  // console.log(trailer);
  const duplicateMovie = addMovie
    ?.map((movie) => movie.id)
    .includes(selectID.id);
  function openTrailer() {
    setShowTrailer(true);
  }
  function closeTrailer() {
    setShowTrailer(false);
  }
  return (
    <div>
      <span
        style={{
          cursor: "pointer",
          marginBottom: "1rem",
          display: "inline-block",
        }}
        onClick={closeSelected}
      >
        ❌
      </span>
      <div className="select-details">
        <div>
          <img
            src={`${imagePath}${selectID.poster_path}`}
            alt={selectID.title}
          ></img>
          <h2 className="title">{selectID.title}</h2>
          <p>Rating: {selectID.vote_average}⭐</p>
          <p>Runtime: {selectID.runtime} mins⏲️</p>
          <p>Genres: {selectID.genres?.map((genre) => genre.name).join(" ")}</p>
        </div>
        <div>
          <h4 style={{ marginBottom: "1rem" }}>
            Tagline: <span style={{ color: "red" }}>{selectID.tagline}</span>
          </h4>
          <p>{selectID.overview}</p>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            {!duplicateMovie ? (
              <button
                className="btn-add"
                onClick={() => addMovieList(selectID)}
              >
                Add Movie List
              </button>
            ) : (
              <button className="btn-add">Already Added</button>
            )}
            <button onClick={openTrailer} className="btn-add">
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
      {showTrailer ? (
        <div className="trailer-modal">
          <span
            style={{
              cursor: "pointer",
              marginBottom: "17rem",
              display: "inline-block",
            }}
            onClick={closeTrailer}
          >
            ❌
          </span>
          <div>
            {checkTrailer ? (
              <iframe
                title={selectID.title}
                src={`${videoPath}${trailer}`}
                className="vid-size"
              ></iframe>
            ) : (
              <iframe
                title={selectID.title}
                src={`${videoPath}${selectID.videos?.results[0]?.key}`}
                className="vid-size"
              ></iframe>
            )}
          </div>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

function SavedMovieBox({ addMovie, removeMovieList }) {
  return (
    <div>
      <div style={{ borderBottom: "solid 1px red" }}>
        <h2
          className="title"
          style={{ textAlign: "center", marginBottom: "1rem" }}
        >
          Catalog of your favorite movies 🎟️
        </h2>
      </div>
      <ul>
        {addMovie?.map((addMovie) => (
          <SavedMovieItem
            addMovie={addMovie}
            removeMovieList={removeMovieList}
            key={addMovie?.id}
          ></SavedMovieItem>
        ))}
      </ul>
    </div>
  );
}

function SavedMovieItem({ addMovie, removeMovieList }) {
  const imagePath = "https://image.tmdb.org/t/p/w500";
  return (
    <li
      style={{
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
        borderBottom: "1px solid red",
      }}
    >
      <img
        style={{ width: "20%" }}
        src={`${imagePath}${addMovie.poster_path}`}
        alt={addMovie.title}
      ></img>
      <h2 className="title">{addMovie.title}</h2>
      <span
        onClick={() => removeMovieList(addMovie.id)}
        style={{ cursor: "pointer" }}
      >
        ❌
      </span>
    </li>
  );
}
function ErrMessage({ error }) {
  return <h2 className="title">{error}</h2>;
}
function Loading() {
  return (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  );
}
export default App;

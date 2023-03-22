import React, { useEffect, useState } from "react";
import axios from "axios";
import Youtube from "react-youtube";
import "./App.css";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4636b9ce6115ecab574d4d7cab46b372";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";
  // variable de estado

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  //funcion para hacer peticiones tipo get a la api

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    setMovie(results[0]);
    if(results.length){
      await fetchMovie(results[0].id)
    }
  }
  //funcion para la peticion de un solo objeto y mostrar en reproducto de video
  const fetchMovie = async(id) => {
const {data} = await axios.get(`${API_URL}/movie/${id}`,{
  params : {
    api_key : API_KEY,
    append_to_response:"videos"
  }
})
if (data.videos && data.videos.results) {
  const trailer = data.videos.results.find(
    (vid) => vid.name === "Official Trailer"
  )
  setTrailer(trailer ? trailer : data.videos.results[0])
}
setMovie(data)
} 

  //funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <div>
      <h2 className="tex-center mt-5 mb-5">Trailer Movies</h2>
      <form className="container mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="search "
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button className="btn btn primary">Search</button>
      </form>
      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-3">
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                height={600}
                width="100%"
              />
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

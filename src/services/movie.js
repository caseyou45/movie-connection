import axios from "axios";

const getArrayofPopularActors = async (currentPage) => {
  const temp = await axios.get(
    `https://api.themoviedb.org/3/person/popular?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US&page=${currentPage}`
  );

  return temp.data.results;
};

const getMoviesCredits = async (arrayOfMovieIDs) => {
  const promises = [];

  for (let index = 0; index < arrayOfMovieIDs.length; index++) {
    promises.push(
      await axios.get(
        ` https://api.themoviedb.org/3/movie/${arrayOfMovieIDs[index]}/credits?api_key=aefae7a94f1e64124f45d882269ee568`
      )
    );
  }

  const temp = Promise.all(promises);
  return temp;
};

const getMovieInfo = async (arrayOfMovieIDs) => {
  const promises = [];

  for (let index = 0; index < arrayOfMovieIDs.length; index++) {
    promises.push(
      await axios.get(
        ` https://api.themoviedb.org/3/movie/${arrayOfMovieIDs[index]}?api_key=aefae7a94f1e64124f45d882269ee568`
      )
    );
  }
  const temp = Promise.all(promises);
  return temp;
};

const getActorInfo = async (actorID) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/person/${actorID}?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US`
  );
  return response.data;
};

const getMoviesActorIsIn = async (actorID) => {
  let movies = [];
  await axios
    .get(
      `https://api.themoviedb.org/3/person/${actorID}/movie_credits?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US `
    )
    .then((response) => {
      response.data.cast.forEach((el) => {
        if (!el.genre_ids.includes(99)) {
          if (!el.genre_ids.includes(10770)) {
            if (
              typeof el.character !== "undefined" &&
              el.character.length &&
              !el.character.includes("self") &&
              !el.character.includes("Narrator")
            ) {
              movies.push(el.id);
            }
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return movies;
};

const movieServices = {
  getArrayofPopularActors,
  getMoviesCredits,
  getMovieInfo,
  getActorInfo,
  getMoviesActorIsIn,
};
export default movieServices;

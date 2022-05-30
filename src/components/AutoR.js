import React, { useState } from "react";
import movieServices from "../services/movie";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Image,
  Table,
} from "react-bootstrap";

const Auto = ({
  actorsByPopularity,
  primary,
  secondary,
  reset,
  setShowSearch,
  setSwitchActorsAllowed,
}) => {
  const [finalArray, setFinalArray] = useState([]);
  const [finalRepeats, setFinalRepeats] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [go, setGo] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [showWaitAnimation, setShowWaitAnimation] = useState(false);
  let foundMatch = false;
  const timeoutsArray = [];
  const allCompondedMovies = [];

  const searchedIDS = [];
  let numberOfMoviesSearched = 0;

  const handleClose = () => setShowModal(false);

  const handleShow = (el) => {
    setShowModal(true);
    setModalInfo(el);
  };

  const cancelAllTimeouts = () => {
    for (let index = 0; index < timeoutsArray.length; index++) {
      clearTimeout(timeoutsArray[index]);
    }
  };

  const resetAll = () => {
    cancelAllTimeouts();
    reset();
  };

  const start = () => {
    if (primary !== "" && secondary !== "") {
      setShowSearch(false);
      setShowSearch(false);
      setSwitchActorsAllowed(false);
      byActorIDGetMoviesAndCredits(primary.id);
      setShowReset(true);
      setShowWaitAnimation(true);
    }
  };

  const goAgain = (poolOfActorIDs) => {
    const actorsWhoArePopularAndInPool = [];

    const filteredOutSerchedIDs = poolOfActorIDs.filter(function (x) {
      return searchedIDS.indexOf(x) < 0;
    });

    //Pick an actor at ranadom from pool
    let chosenID =
      filteredOutSerchedIDs[
        Math.floor(Math.random() * filteredOutSerchedIDs.length)
      ];

    //We can make an array of actors who are in both the actorsByPopularity array and
    //our pool.

    for (let index = 0; index < actorsByPopularity.length; index++) {
      if (filteredOutSerchedIDs.includes(actorsByPopularity[index].id)) {
        actorsWhoArePopularAndInPool.push(actorsByPopularity[index].id);
      }
    }

    //Our chosedID can be reassinged to a random choice from that array
    //if able.
    if (actorsWhoArePopularAndInPool.length > 0) {
      chosenID = actorsWhoArePopularAndInPool[Math.floor(Math.random() * 4)];
    }

    //Check if a match was found
    if (!foundMatch) {
      byActorIDGetMoviesAndCredits(chosenID);
    } else {
      formatInfo();
    }
  };

  const formatInfo = () => {
    const promises = [];
    const finalArrayTemp = [];

    searchedIDS.forEach((el) => {
      let actorInfo = movieServices.getActorInfo(el);
      promises.push(actorInfo);
    });

    Promise.all(promises).then((responses) => {
      for (let index = 0; index < searchedIDS.length + 1; index++) {
        allCompondedMovies.forEach((actorsArrays) => {
          actorsArrays.forEach((movie) => {
            movie.credits.forEach((el) => {
              if (
                el.id === searchedIDS[index + 1] &&
                movie.actor === searchedIDS[index]
              ) {
                let movieFinal = {
                  lead: responses[index],
                  movie: movie.film,
                  credits: movie.credits,
                  co: responses[index + 1],
                };

                finalArrayTemp.push(movieFinal);
              }
            });
          });
        });
      }

      let noRepeats = finalArrayTemp.filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.lead.id === thing.lead.id && t.lead.name === thing.lead.name
          )
      );

      let repeats = finalArrayTemp.filter(
        (thing, index, self) =>
          index !==
          self.findIndex(
            (t) =>
              t.lead.id === thing.lead.id && t.lead.name === thing.lead.name
          )
      );

      setShowWaitAnimation(false);
      setFinalArray(noRepeats);
      setFinalRepeats(repeats);
      window.scrollBy({
        top: 500,
        behavior: "smooth",
      });
    });
  };

  const byActorIDGetMoviesAndCredits = async (actorID) => {
    const poolOfActorIDs = [];

    // setSearchedIDS((prev) => [...prev, actorID]);
    searchedIDS.push(actorID);

    const compoundedMovieArray = [];

    // Get Array of An Actor's Movie's IDs

    const arrayOfMovieIDs = await movieServices.getMoviesActorIsIn(actorID);

    // For those movies, get all credits

    const arrayofAllCredits = await movieServices.getMoviesCredits(
      arrayOfMovieIDs
    );

    // For those movies, get all the information

    const arrayOfAllMovieInfo = await movieServices.getMovieInfo(
      arrayOfMovieIDs
    );

    //For the actor, create an array that has an object with the movie's credits and information

    for (let index = 0; index < arrayOfMovieIDs.length; index++) {
      compoundedMovieArray.push({
        actor: actorID,
        film: arrayOfAllMovieInfo[index].data,
        credits: arrayofAllCredits[index].data.cast,
      });
    }

    allCompondedMovies.push(compoundedMovieArray);

    compoundedMovieArray.forEach((movie) => {
      movie.credits.forEach((actor) => {
        //For each movie, check if actor is the one we are looking for.
        if (actor.id === secondary.id) {
          foundMatch = true;
          searchedIDS.push(secondary.id);
        } else {
          //If it is not the one we are looking for and their ID is not alread
          //in our arrayOfActorIDs, add them to the arraay
          if (poolOfActorIDs.includes(actor.id) === false) {
            poolOfActorIDs.push(actor.id);
          }
        }
      });
    });

    //Wait a bit and then call function to go again.
    timeoutsArray.push(
      setTimeout(() => {
        goAgain(poolOfActorIDs);
      }, 250)
    );
  };

  const HandleRepeats = (index, lead, arr) => {
    let re = arr.filter((el) => el.lead.id === lead);
    if (re.length !== 0) {
      return (
        <Button
          variant="outline-primary"
          className="m-2 mt-4"
          onClick={() => loadRepeats(lead, re, index)}
        >
          View {re.length} more
        </Button>
      );
    } else {
      return null;
    }
  };

  const loadRepeats = (id, arr, ind) => {
    let temp = finalArray;
    let temp2 = finalRepeats;
    temp.splice(ind, 0, ...arr);

    arr.forEach((el) => {
      let x = temp2.findIndex((x) => x.lead.id === el.lead.id);
      temp2.splice(x, 1);
    });
    setFinalRepeats(temp2);
    setFinalArray(temp);
  };

  return (
    <Container fluid>
      <div>
        {showReset && (
          <Row className="justify-content-center mt-3">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => resetAll()}
            >
              Reset
            </Button>
          </Row>
        )}
        {!showReset && (
          <Row className="justify-content-center mt-3">
            <Button variant="outline-primary" size="lg" onClick={() => start()}>
              Connect
            </Button>
          </Row>
        )}
      </div>
      {showWaitAnimation && (
        <Row className="justify-content-center pt-4 text-center text-secondary">
          <Col md="auto">
            <Spinner animation="border" variant="primary" />
            <p className="mt-4">
              Number of Movies Searched: {allCompondedMovies.length}
            </p>
          </Col>
        </Row>
      )}
      {finalArray.map((el, index) => (
        <Row className="justify-content-center my-2">
          <Card
            style={{ width: "20rem" }}
            className="text-center mt-2 mb-1 p-4"
          >
            <Card.Text className="text-center p-1">
              <i>{el.movie.original_title}</i>
            </Card.Text>
            <Row className="justify-content-center">
              <Col>
                {el.movie.poster_path && (
                  <Card.Img
                    className="rounded"
                    src={
                      "https://image.tmdb.org/t/p/w154/" + el.movie.poster_path
                    }
                  />
                )}
              </Col>
              <Col style={{ fontSize: "1.2rem" }}>
                <Card.Text className="mb-2">{el.lead.name}</Card.Text>

                <Card.Text className="my-3">- with -</Card.Text>

                <Card.Text className="mt-2">{el.co.name}</Card.Text>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Button
                className="m-2 mt-4"
                variant="outline-primary"
                onClick={() => handleShow(el)}
              >
                Show Details
              </Button>
              {HandleRepeats(index, el.lead.id, finalRepeats)}
            </Row>
          </Card>
        </Row>
      ))}
      {showModal && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} md={12} className="mt-2">
                  <h5 className="text-center">
                    <i>{modalInfo.movie.original_title}</i>
                  </h5>
                </Col>
              </Row>
              <Row className="my-2">
                <Col xs={6} md={6}>
                  <Image
                    src={
                      "https://image.tmdb.org/t/p/w154/" +
                      modalInfo.movie.poster_path
                    }
                  ></Image>
                </Col>

                <Col xs={6} md={6} style={{ fontSize: ".85rem" }}>
                  <p>
                    Length
                    <br></br>
                    {Math.floor(modalInfo.movie.runtime / 60)}h :{" "}
                    {modalInfo.movie.runtime % 60}m
                  </p>
                  <p>
                    Release Date:
                    <br></br>
                    {modalInfo.movie.release_date}
                  </p>
                  <p>
                    Budget: <br></br>$
                    {modalInfo.movie.budget
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                  </p>
                  <p>
                    Revenue: <br></br>$
                    {modalInfo.movie.revenue
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                  </p>
                </Col>
              </Row>
              <Row className="border-top mt-2">
                <Col className="mt-2" xs={12} md={12}>
                  <p style={{ fontSize: ".9rem" }} className="mt-2">
                    {modalInfo.movie.overview}
                  </p>
                </Col>
              </Row>
              <Row>
                <Table striped>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Cast</th>
                      <th>Character</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalInfo.credits.map((el) => (
                      <tr>
                        <td>
                          {el.profile_path && (
                            <Image
                              style={{ width: "3rem" }}
                              src={
                                "https://image.tmdb.org/t/p/w154/" +
                                el.profile_path
                              }
                            ></Image>
                          )}
                        </td>
                        <td>{el.name}</td>
                        <td>{el.character}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Auto;

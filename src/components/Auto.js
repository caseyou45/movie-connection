import React from "react";
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

class Auto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayOfActorIDs: [],
      finalArray: [],
      finalRepeats: [],
      foundMatch: [],
      megaArray: [],
      numberOfMoviesSearched: 0,
      responseArray: [],
      searchedIDS: [],
      showModal: false,
      modalInfo: {},

      showReset: false,
      showWaitAnimation: false,
      showInfoIndex: "",
      timeoutsArray: [],
    };

    this.baseState = this.state;

    this.reset = this.reset.bind(this);
    this.start = this.start.bind(this);
    this.loadRepeats = this.loadRepeats.bind(this);
  }

  handleClose = () => this.setState({ showModal: false });
  handleShow = (el) => {
    this.setState({ showModal: true, modalInfo: el });
    console.log(this.state.modalInfo);
  };

  cancelAllTimeouts = () => {
    for (let index = 0; index < this.state.timeoutsArray.length; index++) {
      clearTimeout(this.state.timeoutsArray[index]);
    }
  };

  reset = () => {
    this.cancelAllTimeouts();
    this.setState(this.baseState);
    this.props.reset();
  };

  getMoviesCredits = async (movieID) => {
    const response = await axios.get(
      ` https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=aefae7a94f1e64124f45d882269ee568`
    );
    return response.data.cast;
  };

  getMovieInfo = async (movieID) => {
    const response = await axios.get(
      ` https://api.themoviedb.org/3/movie/${movieID}?api_key=aefae7a94f1e64124f45d882269ee568`
    );
    return response.data;
  };
  getMoviesActorIsIn = async (actorID) => {
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
                this.setState({
                  responseArray: [...this.state.responseArray, el.id],
                });
              }
            }
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getActorInfo = async (actorID) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorID}?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US`
    );
    return response.data;
  };

  start = () => {
    if (this.props.primary !== "" && this.props.secondary !== "") {
      this.props.showSearch(false);
      this.props.switchActorsAllowed(false);
      this.byActorIDGetMoviesAndCredits(this.props.primary.id);
      this.setState({ showReset: true, showWaitAnimation: true });
    }
  };

  removePeople() {
    this.state.searchedIDS.forEach((el) => {
      let filteredArray = this.state.arrayOfActorIDs.filter(
        (item) => item !== el
      );
      this.setState({ arrayOfActorIDs: filteredArray });
    });
  }

  goAgain = (actorID) => {
    let popsInArray = [];

    this.removePeople(actorID);

    let chosenID =
      this.state.arrayOfActorIDs[
        Math.floor(Math.random() * this.state.arrayOfActorIDs.length)
      ];

    for (let index = 0; index < this.props.arrayOfPops.length; index++) {
      if (
        this.state.arrayOfActorIDs.includes(this.props.arrayOfPops[index].id)
      ) {
        popsInArray.push(this.props.arrayOfPops[index].id);
      }
    }
    chosenID = popsInArray[Math.floor(Math.random() * 4)];

    this.setState({ arrayOfActorIDs: [] });

    if (this.state.foundMatch.length === 0) {
      this.byActorIDGetMoviesAndCredits(chosenID);
    } else {
      this.formatInfo();
    }
  };

  formatInfo = () => {
    const promises = [];
    this.state.searchedIDS.forEach((el) => {
      let actorInfo = this.getActorInfo(el);
      promises.push(actorInfo);
    });

    Promise.all(promises).then((responses) => {
      for (let index = 0; index < this.state.searchedIDS.length + 1; index++) {
        this.state.megaArray.forEach((actorsArrays) => {
          actorsArrays.forEach((movie) => {
            movie.credits.forEach((el) => {
              if (
                el.id === this.state.searchedIDS[index + 1] &&
                movie.actor === this.state.searchedIDS[index]
              ) {
                let movieFinal = {
                  lead: responses[index],
                  movie: movie.film,
                  credits: movie.credits,
                  co: responses[index + 1],
                };

                this.setState({
                  finalArray: [...this.state.finalArray, movieFinal],
                });
              }
            });
          });
        });
      }

      let noRepeats = this.state.finalArray.filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.lead.id === thing.lead.id && t.lead.name === thing.lead.name
          )
      );

      let repeats = this.state.finalArray.filter(
        (thing, index, self) =>
          index !==
          self.findIndex(
            (t) =>
              t.lead.id === thing.lead.id && t.lead.name === thing.lead.name
          )
      );

      this.setState({
        showWaitAnimation: false,
        finalArray: noRepeats,
        finalRepeats: repeats,
      });

      window.scrollBy({
        top: 500,
        behavior: "smooth",
      });
    });
  };
  byActorIDGetMoviesAndCredits = async (actorID) => {
    console.log(`Searching ${actorID}`);

    this.setState({ searchedIDS: [...this.state.searchedIDS, actorID] });
    let arrayofAllCredits = [];
    let arrayOfAllMovieInfo = [];

    let compoundedMovieArray = [];

    Promise.all([this.getMoviesActorIsIn(actorID)]).then((results) => {
      // Get Array of An Actor's Movies

      this.state.responseArray.forEach((el) => {
        arrayofAllCredits.push(this.getMoviesCredits(el));

        arrayOfAllMovieInfo.push(this.getMovieInfo(el));
      });

      // Get Array Those Movie's Credits

      Promise.all(arrayofAllCredits).then((creditResponse) => {
        // Get Array Those Movie's Details

        Promise.all(arrayOfAllMovieInfo).then((infoResponse) => {
          for (let index = 0; index < infoResponse.length; index++) {
            let compoundedMovie = {
              actor: actorID,
              film: infoResponse[index],
              credits: creditResponse[index],
            };

            compoundedMovieArray.push(compoundedMovie);
          }

          this.setState({
            megaArray: [...this.state.megaArray, compoundedMovieArray],
            numberOfMoviesSearched:
              this.state.numberOfMoviesSearched + compoundedMovieArray.length,
          });

          compoundedMovieArray.forEach((movieArray) => {
            movieArray.credits.forEach((el) => {
              if (el.id === this.props.secondary.id) {
                this.setState({
                  foundMatch: [
                    ...this.state.foundMatch,
                    this.props.secondary.id,
                  ],
                  searchedIDS: [
                    ...this.state.searchedIDS,
                    this.props.secondary.id,
                  ],
                });
              } else {
                if (this.state.arrayOfActorIDs.includes(el.id) === false) {
                  this.setState({
                    arrayOfActorIDs: [...this.state.arrayOfActorIDs, el.id],
                  });
                }
              }
            });
          });
          this.setState({ responseArray: [] });

          this.setState({
            timeoutsArray: [
              ...this.state.timeoutsArray,
              setTimeout(() => {
                this.goAgain(actorID);
              }, 250),
            ],
          });
        });
      });
    });
  };

  HandleRepeats = (index, lead, arr) => {
    let re = arr.filter((el) => el.lead.id === lead);
    if (re.length !== 0) {
      return (
        <Button
          variant="outline-primary"
          className="m-2 mt-4"
          onClick={() => this.loadRepeats(lead, re, index)}
        >
          View {re.length} more
        </Button>
      );
    } else {
      return null;
    }
  };

  loadRepeats = (id, arr, ind) => {
    let temp = this.state.finalArray;
    let temp2 = this.state.finalRepeats;
    temp.splice(ind, 0, ...arr);

    arr.forEach((el) => {
      let x = temp2.findIndex((x) => x.lead.id === el.lead.id);
      temp2.splice(x, 1);
    });
    this.setState({ finalRepeats: temp2, finalArray: temp });
  };

  render() {
    return (
      <Container fluid>
        <div>
          {this.state.showReset && (
            <Row className="justify-content-center mt-3">
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => this.reset()}
              >
                Reset
              </Button>
            </Row>
          )}
          {!this.state.showReset && (
            <Row className="justify-content-center mt-3">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => this.start()}
              >
                Connect
              </Button>
            </Row>
          )}
        </div>
        {this.state.showWaitAnimation && (
          <Row className="justify-content-center pt-4 text-center text-secondary">
            <Col md="auto">
              <Spinner animation="border" variant="primary" />
              <p className="mt-4">
                Number of Movies Searched: {this.state.numberOfMoviesSearched}
              </p>
            </Col>
          </Row>
        )}
        {this.state.finalArray.map((el, index) => (
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
                        "https://image.tmdb.org/t/p/w154/" +
                        el.movie.poster_path
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
                  onClick={() => this.handleShow(el)}
                >
                  Show Details
                </Button>
                {this.HandleRepeats(index, el.lead.id, this.state.finalRepeats)}
              </Row>
            </Card>
          </Row>
        ))}
        {this.state.showModal && (
          <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Body>
              <Container>
                <Row>
                  <Col xs={12} md={12} className="mt-2">
                    <h5 className="text-center">
                      <i>{this.state.modalInfo.movie.original_title}</i>
                    </h5>
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col xs={6} md={6}>
                    <Image
                      src={
                        "https://image.tmdb.org/t/p/w154/" +
                        this.state.modalInfo.movie.poster_path
                      }
                    ></Image>
                  </Col>

                  <Col xs={6} md={6} style={{ fontSize: ".85rem" }}>
                    <p>
                      Length
                      <br></br>
                      {Math.floor(this.state.modalInfo.movie.runtime / 60)}h :{" "}
                      {this.state.modalInfo.movie.runtime % 60}m
                    </p>
                    <p>
                      Release Date:
                      <br></br>
                      {this.state.modalInfo.movie.release_date}
                    </p>
                    <p>
                      Budget: <br></br>$
                      {this.state.modalInfo.movie.budget
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                    </p>
                    <p>
                      Revenue: <br></br>$
                      {this.state.modalInfo.movie.revenue
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                    </p>
                  </Col>
                </Row>
                <Row className="border-top mt-2">
                  <Col className="mt-2" xs={12} md={12}>
                    <p style={{ fontSize: ".9rem" }} className="mt-2">
                      {this.state.modalInfo.movie.overview}
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
                      {this.state.modalInfo.credits.map((el) => (
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
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    );
  }
}

export default Auto;

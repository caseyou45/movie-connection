import React from "react";
import { Container, Row, Image, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Auto2 from "./Auto";

import Search from "./Search";
let backgroundImage = "Images/BackgroundArt.png";

class AutoStart extends React.Component {
  constructor() {
    super();
    this.state = {
      arrayOfPops: [],
      primary: "",
      secondary: "",
      showAuto: false,
      showSearch: false,
      showPickMethod: false,
      switchActorsAllowed: true,
    };

    this.baseState = {
      primary: "",
      secondary: "",
      showAuto: false,
      showSearch: false,
      showPickMethod: false,
      switchActorsAllowed: true,
    };

    this.getRandom = this.getRandom.bind(this);
    this.searchSetup = this.searchSetup.bind(this);
    this.getPrimary = this.getPrimary.bind(this);
    this.getSecondary = this.getSecondary.bind(this);
  }

  componentDidMount() {
    axios
      .get(
        `https://api.themoviedb.org/3/person/popular?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US&page=1`
      )
      .then((response) => {
        this.getCelebs(50, response.data.page);
      })

      .catch((error) => {
        console.log(error);
      });
  }

  getCelebs(pages, pageNum) {
    axios
      .get(
        `https://api.themoviedb.org/3/person/popular?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US&page=${pageNum}`
      )
      .then((response) => {
        this.setState({
          arrayOfPops: [...this.state.arrayOfPops, ...response.data.results],
        });

        if (pageNum < pages) {
          let x = pageNum + 1;
          this.getCelebs(pages, x);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getRandom() {
    if (this.state.primary !== "" && this.state.secondary !== "") {
      this.reset();

      this.setState({
        primary: this.makeRandomChoice(),
        secondary: this.makeRandomChoice(),
      });
      this.setState({ showAuto: true });
    } else {
      this.setState({ showAuto: true, showPickMethod: true });

      this.setState({
        primary: this.makeRandomChoice(),
        secondary: this.makeRandomChoice(),
      });
    }
  }

  makeRandomChoice() {
    let randomActor =
      this.state.arrayOfPops[
        Math.floor(Math.random() * this.state.arrayOfPops.length)
      ];

    this.setState((prevState) => ({
      arrayOfPops: this.state.arrayOfPops.filter((i) => i !== randomActor),
    }));

    return randomActor;
  }

  searchSetup() {
    if (
      this.state.primary !== "" ||
      (this.state.secondary !== "" && this.state.showSearch === false)
    ) {
      this.reset();

      this.setState({ showSearch: true });
    } else {
      this.setState({ showSearch: true });
    }

    this.setState({ showPickMethod: true });
  }

  reset = () => {
    this.setState(this.baseState);
  };

  getPrimary(first) {
    this.setState({ primary: first });
    if (this.state.secondary !== "") {
      this.setState({ showAuto: true });
    }
  }

  getSecondary(second) {
    this.setState({ secondary: second });
    if (this.state.primary !== "") {
      this.setState({ showAuto: true });
    }
  }

  switchActor(position) {
    if (!this.state.showSearch) {
      if (position === "primary") {
        this.setState({
          primary: this.makeRandomChoice(),
        });
      }
      if (position === "secondary") {
        this.setState({
          secondary: this.makeRandomChoice(),
        });
      }
      if (position === "both") {
        this.setState({
          primary: this.makeRandomChoice(),
          secondary: this.makeRandomChoice(),
        });
      }
    }

    if (this.state.showSearch) {
      if (position === "primary") {
        this.setState({ primary: "" });
      }
      if (position === "secondary") {
        this.setState({ secondary: "" });
      }
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center mt-4">
          <Image src={backgroundImage} style={{ width: "15rem" }} />
        </Row>

        <Row className="justify-content-center m-4">
          {!this.state.showPickMethod && this.state.arrayOfPops.length > 20 && (
            <Card
              style={{ width: "20rem" }}
              className="justify-content-center p-3 shadow-sm border-0"
            >
              <Button
                onClick={() => {
                  this.getRandom();
                }}
                className="m-3"
                variant="primary"
              >
                Pick Random Actors For Me
              </Button>

              <Button
                className="m-3"
                variant="primary"
                onClick={() => this.searchSetup()}
              >
                I'll Pick Them Myself
              </Button>
            </Card>
          )}
          {this.state.showPickMethod && (
            <Card
              style={{ width: "20rem" }}
              className="justify-content-center p-3 shadow-sm border-0"
            >
              <Button
                className="m-3"
                variant="primary"
                onClick={() => this.setState({ showPickMethod: false })}
              >
                Back To Pick Options
              </Button>
            </Card>
          )}
        </Row>
        <Row className="justify-content-center mt-2">
          {this.state.primary !== "" && this.state.secondary !== "" && (
            <Button
              className="mb-1"
              variant="link"
              size="sm"
              onClick={() => this.switchActor("both")}
              disabled={!this.state.switchActorsAllowed}
            >
              Switch Both
            </Button>
          )}
        </Row>
        <Row className="justify-content-center mt-3">
          <div>
            <Col md="auto">
              {this.state.primary !== "" && (
                <Card style={{ width: "8rem", border: "0" }}>
                  {this.state.primary.profile_path && (
                    <Card.Img
                      rounded
                      src={
                        "https://image.tmdb.org/t/p/w154/" +
                        this.state.primary.profile_path
                      }
                    />
                  )}
                  <Card.Text className="text-center mt-2 mb-0">
                    {this.state.primary.name}
                  </Card.Text>
                  <Button
                    className="mb-1"
                    variant="link"
                    size="sm"
                    onClick={() => this.switchActor("primary")}
                    disabled={!this.state.switchActorsAllowed}
                  >
                    Switch
                  </Button>
                </Card>
              )}
            </Col>
          </div>
          <div>
            <Col md="auto">
              {this.state.secondary !== "" && (
                <Card style={{ width: "8rem", border: "0" }}>
                  {this.state.secondary.profile_path && (
                    <Card.Img
                      rounded
                      src={
                        "https://image.tmdb.org/t/p/w154/" +
                        this.state.secondary.profile_path
                      }
                    />
                  )}
                  <Card.Text className="text-center mt-2 mb-0">
                    {this.state.secondary.name}
                  </Card.Text>
                  <Button
                    className="mb-1"
                    variant="link"
                    size="sm"
                    onClick={() => this.switchActor("secondary")}
                    disabled={!this.state.switchActorsAllowed}
                  >
                    Switch
                  </Button>
                </Card>
              )}
            </Col>
          </div>
        </Row>

        {this.state.showAuto && (
          <Auto2
            arrayOfPops={this.state.arrayOfPops}
            primary={this.state.primary}
            secondary={this.state.secondary}
            reset={this.reset}
            // showSearch={this.state.showSearch}
            showSearch={(showSearch) => this.setState({ showSearch })}
            switchActorsAllowed={(switchActorsAllowed) =>
              this.setState({ switchActorsAllowed })
            }
          />
        )}
        {this.state.showSearch && (
          <Search
            getPrimary={this.getPrimary}
            getSecondary={this.getSecondary}
            primary={this.state.primary}
            secondary={this.state.secondary}
          />
        )}
      </Container>
    );
  }
}

export default AutoStart;

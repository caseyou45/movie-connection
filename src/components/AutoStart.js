import React, { useState } from "react";
import { Container, Row, Image, Col, Card, Button } from "react-bootstrap";
import Auto2 from "./AutoR";
import movieServices from "../services/movie";

import Search from "./Search";
let backgroundImage = "Images/BackgroundArt.png";

const AutoStart = () => {
  const [actorsByPopularity, setActorsByPopularity] = useState([]);
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [showAuto, setShowAuto] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPickMethod, setShowPickMethod] = useState(false);
  const [switchActorsAllowed, setSwitchActorsAllowed] = useState(true);

  useState(async () => {
    let currentPage = 1;
    const temp = [];

    while (currentPage < 50) {
      currentPage += 1;
      const res = await movieServices.getArrayofPopularActors(currentPage);
      temp.push(...res);
    }

    setActorsByPopularity(temp);
  }, []);

  const getRandom = () => {
    if (primary !== "" && secondary !== "") {
      reset();
      setShowAuto(true);
    } else {
      setShowAuto(true);
      setShowPickMethod(true);
    }

    setPrimary(makeRandomChoice());
    setSecondary(makeRandomChoice());
  };

  const makeRandomChoice = () => {
    const randomActor =
      actorsByPopularity[Math.floor(Math.random() * actorsByPopularity.length)];

    setActorsByPopularity(actorsByPopularity.filter((i) => i !== randomActor));

    return randomActor;
  };

  const searchSetup = () => {
    if (primary !== "" || (secondary !== "" && showSearch === false)) {
      reset();
    }
    setShowSearch(true);
    setShowPickMethod(true);
  };

  const reset = () => {
    setPrimary("");
    setSecondary("");
    setShowAuto(false);
    setShowSearch(true);
    setShowPickMethod(false);
    setSwitchActorsAllowed(true);
  };

  const getPrimary = (first) => {
    setPrimary(first);
    if (secondary !== "") {
      setShowAuto(true);
    }
  };

  const getSecondary = (second) => {
    setSecondary(second);
    if (primary !== "") {
      setShowAuto(true);
    }
  };

  const switchActor = (position) => {
    if (!showSearch) {
      if (position === "primary") {
        setPrimary(makeRandomChoice());
      }
      if (position === "secondary") {
        setSecondary(makeRandomChoice());
      }
      if (position === "both") {
        setPrimary(makeRandomChoice());
        setSecondary(makeRandomChoice());
      }
    }

    if (showSearch) {
      if (position === "primary") {
        setPrimary("");
      }
      if (position === "secondary") {
        setSecondary("");
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Image src={backgroundImage} style={{ width: "15rem" }} />
      </Row>

      <Row className="justify-content-center m-4">
        {!showPickMethod && actorsByPopularity.length > 20 && (
          <Card
            style={{ width: "20rem" }}
            className="justify-content-center p-3 shadow-sm border-0"
          >
            <Button
              onClick={() => {
                getRandom();
              }}
              className="m-3"
              variant="primary"
            >
              Pick Random Actors For Me
            </Button>

            <Button
              className="m-3"
              variant="primary"
              onClick={() => searchSetup()}
            >
              I'll Pick Them Myself
            </Button>
          </Card>
        )}
        {showPickMethod && (
          <Card
            style={{ width: "20rem" }}
            className="justify-content-center p-3 shadow-sm border-0"
          >
            <Button
              className="m-3"
              variant="primary"
              onClick={() => setShowPickMethod(false)}
            >
              Back To Pick Options
            </Button>
          </Card>
        )}
      </Row>
      <Row className="justify-content-center mt-2">
        {primary !== "" && secondary !== "" && (
          <Button
            className="mb-1"
            variant="link"
            size="sm"
            onClick={() => switchActor("both")}
            disabled={!switchActorsAllowed}
          >
            Switch Both
          </Button>
        )}
      </Row>
      <Row className="justify-content-center mt-3">
        <div>
          <Col md="auto">
            {primary !== "" && (
              <Card style={{ width: "8rem", border: "0" }}>
                {primary.profile_path && (
                  <Card.Img
                    rounded
                    src={
                      "https://image.tmdb.org/t/p/w154/" + primary.profile_path
                    }
                  />
                )}
                <Card.Text className="text-center mt-2 mb-0">
                  {primary.name}
                </Card.Text>
                <Button
                  className="mb-1"
                  variant="link"
                  size="sm"
                  onClick={() => switchActor("primary")}
                  disabled={!switchActorsAllowed}
                >
                  Switch
                </Button>
              </Card>
            )}
          </Col>
        </div>
        <div>
          <Col md="auto">
            {secondary !== "" && (
              <Card style={{ width: "8rem", border: "0" }}>
                {secondary.profile_path && (
                  <Card.Img
                    rounded
                    src={
                      "https://image.tmdb.org/t/p/w154/" +
                      secondary.profile_path
                    }
                  />
                )}
                <Card.Text className="text-center mt-2 mb-0">
                  {secondary.name}
                </Card.Text>
                <Button
                  className="mb-1"
                  variant="link"
                  size="sm"
                  onClick={() => switchActor("secondary")}
                  disabled={!switchActorsAllowed}
                >
                  Switch
                </Button>
              </Card>
            )}
          </Col>
        </div>
      </Row>

      {showAuto && (
        <Auto2
          actorsByPopularity={actorsByPopularity}
          primary={primary}
          secondary={secondary}
          reset={reset}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          switchActorsAllowed={switchActorsAllowed}
          setSwitchActorsAllowed={setSwitchActorsAllowed}
        />
      )}
      {showSearch && (
        <Search
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          primary={primary}
          secondary={secondary}
        />
      )}
    </Container>
  );
};

export default AutoStart;

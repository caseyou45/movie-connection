import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

const Home = (props) => {
  let frontImage = "Images/FrontArt.png";

  return (
    <Container fluid>
      <Row className="justify-content-center pt-4">
        <Col md="auto pt-4">
          <h2 className="text-center">Find the Movie Connection</h2>
        </Col>
      </Row>
      <p className="text-center pt-3">
        Whether you pick two actors yourself or have them randomly chosen for
        you, automatically see the movies and actors that connect them.
      </p>
      <Row className="justify-content-center">
        <Button
          className="mt-4"
          size="lg"
          href="/autostart"
          variant="outline-dark"
        >
          Get Started
        </Button>
      </Row>

      <Row className="justify-content-center">
        <Image src={frontImage} style={{ maxWidth: "65%" }} />
      </Row>
    </Container>
  );
};

export default Home;

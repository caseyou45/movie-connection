import React from "react";
import { Image, Row, Col, Container } from "react-bootstrap";

const Footer = () => {
  let logo =
    "Images/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";

  const footerStyle = {
    marginTop: "20%",
  };

  return (
    <Container style={footerStyle}>
      <Row className="justify-content-center mb-3">
        <a href="https://www.themoviedb.org/">
          <Image src={logo} style={{ width: "4rem" }} />
        </a>
      </Row>

      <Row className="justify-content-center mb-0 mx-4">
        <Col md="auto">
          <p>
            This product uses the TMDb API but is not endorsed or certified by
            TMDb.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;

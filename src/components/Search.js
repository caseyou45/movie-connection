import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";

const Search = (props) => {
  const [returns, setReturns] = useState([]);

  const searchForActor = (event) => {
    let term = encodeURI(event.target.value);
    axios
      .get(
        `https://api.themoviedb.org/3/search/person?api_key=aefae7a94f1e64124f45d882269ee568&language=en-US&query=${term}&include_adult=false`
      )
      .then((response) => {
        setReturns(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              onChange={(event) => {
                searchForActor(event);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {returns.map((el, index) => (
          <div>
            <Col>
              <Card
                className="mb-4"
                key={index}
                style={{ width: "8rem", border: "0" }}
              >
                {el.profile_path && (
                  <Card.Img
                    rounded
                    src={"https://image.tmdb.org/t/p/w154/" + el.profile_path}
                  />
                )}
                <Card.Text className="text-center m-2">{el.name}</Card.Text>

                <Button
                  className="m-1"
                  variant="outline-dark"
                  size="sm"
                  onClick={() => {
                    props.getPrimary(el);
                  }}
                >
                  Pick First
                </Button>
                <Button
                  className="m-1"
                  variant="outline-dark"
                  size="sm"
                  onClick={() => {
                    props.getSecondary(el);
                  }}
                >
                  Pick Second
                </Button>
              </Card>
            </Col>
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default Search;

import React, { useState } from "react";

import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Image,
  Table,
} from "react-bootstrap";

const ModalComponent = ({ showModal, handleClose, modalInfo }) => {
  return (
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
                            "https://image.tmdb.org/t/p/w154/" + el.profile_path
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
  );
};

export default ModalComponent;

import React from "react";
import { Nav } from "react-bootstrap";

const Navbar = () => {
  return (
    <Nav className="p-2 pl-4 bg-light text-dark">
      <Nav.Item>
        <Nav.Link className="text-dark" href="/">
          Home
        </Nav.Link>
      </Nav.Item>
      <Nav.Item></Nav.Item>
    </Nav>
  );
};

export default Navbar;

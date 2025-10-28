import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaFlask, FaAtom, FaVial, FaBrain } from "react-icons/fa";

const WelcomeView: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand href="/" className="fw-bold">
            EduLab
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/tabla"><FaAtom className="me-1" /> Tabla Periódica</Nav.Link>
              <Nav.Link href="/mezclas"><FaFlask className="me-1" /> Mezclas</Nav.Link>
              <Nav.Link href="/titulacion"><FaVial className="me-1" /> Titulación</Nav.Link>
              <Nav.Link href="/fisica"><FaBrain className="me-1" /> Física</Nav.Link>
              <Nav.Link href="/biologia"><FaBrain className="me-1" /> Biología</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido centrado ocupando toda la pantalla */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center w-100 px-4">
        <h1 className="mb-4 display-4 fw-bold">Bienvenido a EduLab</h1>
        <p className="lead mb-5">
          Explora simulaciones de química, física y biología de manera interactiva.
        </p>

        {/* Botones */}
        <div className="d-flex flex-wrap justify-content-center gap-4">
          <a href="/tabla" className="btn btn-primary btn-lg shadow-sm d-flex align-items-center">
            <FaAtom className="me-2" /> Tabla Periódica
          </a>
          <a href="/mezclas" className="btn btn-success btn-lg shadow-sm d-flex align-items-center">
            <FaFlask className="me-2" /> Mezclas
          </a>
          <a href="/titulacion" className="btn btn-warning btn-lg shadow-sm d-flex align-items-center text-dark">
            <FaVial className="me-2" /> Titulación
          </a>
          <a href="/fisica" className="btn btn-info btn-lg shadow-sm d-flex align-items-center text-dark">
            <FaBrain className="me-2" /> Física
          </a>
          <a href="/biologia" className="btn btn-secondary btn-lg shadow-sm d-flex align-items-center">
            <FaBrain className="me-2" /> Biología
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
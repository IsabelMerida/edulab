import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaFlask, FaAtom, FaVial, FaBrain } from "react-icons/fa"; // Iconos

const WelcomeView: React.FC = () => {
  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">EduLab Quantum</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/tabla"><FaAtom className="me-1"/> Tabla Periódica</Nav.Link>
              <Nav.Link href="/mezclas"><FaFlask className="me-1"/> Mezclas</Nav.Link>
              <Nav.Link href="/titulacion"><FaVial className="me-1"/> Titulación</Nav.Link>
              {/* Futuras secciones */}
              <Nav.Link href="/fisica"><FaBrain className="me-1"/> Física</Nav.Link>
              <Nav.Link href="/biologia"><FaBrain className="me-1"/> Biología</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido de bienvenida */}
      <Container className="text-center mt-5">
        <h1 className="mb-3">Bienvenido a EduLab Quantum</h1>
        <p className="lead">
          Explora simulaciones de química, física y biología de manera interactiva.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <a href="/tabla" className="btn btn-primary">
            <FaAtom className="me-2"/> Tabla Periódica
          </a>
          <a href="/mezclas" className="btn btn-success">
            <FaFlask className="me-2"/> Mezclas
          </a>
          <a href="/titulacion" className="btn btn-warning text-dark">
            <FaVial className="me-2"/> Titulación
          </a>
          <a href="/fisica" className="btn btn-info text-dark">
            <FaBrain className="me-2"/> Física
          </a>
          <a href="/biologia" className="btn btn-secondary">
            <FaBrain className="me-2"/> Biología
          </a>
        </div>
      </Container>
    </div>
  );
};

export default WelcomeView;

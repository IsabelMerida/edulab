import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  FaFlask,
  FaAtom,
  FaVial,
  FaRocket,
  FaLeaf,
  FaHeart,
} from "react-icons/fa";
import { GiAtom } from "react-icons/gi";

const WelcomeView: React.FC = () => {
  return (
    <div
      className="bg-light d-flex flex-column"
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden", 
        boxSizing: "border-box",
      }}
    >
      {/* Navbar  */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="shadow"
      >
        <Container>
          <Navbar.Brand href="/" className="fw-bold d-flex align-items-center">
            <GiAtom
              size={55}
              strokeWidth={2}
              color="#00FFFF"
              style={{ marginRight: "10px" }}
            />
            EduLab
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="/tabla"
                className="d-flex align-items-center gap-2"
              >
                <FaAtom /> Tabla Periódica
              </Nav.Link>
              <Nav.Link
                href="/mezclas"
                className="d-flex align-items-center gap-2"
              >
                <FaFlask /> Mezclas
              </Nav.Link>
              <Nav.Link
                href="/titulacion"
                className="d-flex align-items-center gap-2"
              >
                <FaVial /> Titulación
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal */}

      <main
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100"
        style={{ paddingTop: "80px", paddingBottom: "72px" }}
      >
        <div className="container-fluid text-center px-4">
          <h1 className="mb-4 display-4 fw-bold">Bienvenido a EduLab</h1>
          <p className="lead mb-5">
            Explora simulaciones de química, física y biología de manera
            interactiva.
          </p>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-4 px-4 mb-5 w-100">
          <a
            href="/tabla"
            className="btn btn-primary btn-lg shadow-sm d-flex align-items-center gap-2"
          >
            <FaAtom /> Química
          </a>
          <a
            href="/fisica"
            className="btn btn-success btn-lg shadow-sm d-flex align-items-center gap-2"
          >
            <FaRocket /> Física
          </a>
          <a
            href="/biologia"
            className="btn btn-warning btn-lg shadow-sm d-flex align-items-center gap-2 text-dark"
          >
            <FaHeart /> Biología
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 fixed-bottom w-100 shadow-sm">
        <Container>
          <small>
            © {new Date().getFullYear()} The 404s. Todos los derechos
            reservados.
          </small>
        </Container>
      </footer>
    </div>
  );
};

export default WelcomeView;

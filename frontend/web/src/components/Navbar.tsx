import { Navbar, Nav, Container } from "react-bootstrap";
import { GiAtom, GiBrain } from "react-icons/gi";
import { FaFlask } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import React, { useState } from "react";

export default function AppNavbar() {
  const [show3D, setShow3D] = useState(false);

  return (
    <>
      <Navbar
        expand="lg"
        bg="primary"
        variant="dark"
        className="shadow-sm py-1"
        style={{ height: "70px", overflow: "hidden" }}
      >
        <Container style={{ maxWidth: "1100px" }}>
          {/* Botón de retroceso */}
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline-light me-3 d-flex align-items-center justify-content-center"
            style={{ borderRadius: "50%", width: "36px", height: "36px" }}
          >
            <BsArrowLeft size={18} />
          </button>

          {/* Icono Atomo */}
          <Navbar.Brand
            href="#"
            className="d-flex align-items-center fw-bold fs-5 text-white"
          >
            <GiAtom
              size={55}
              strokeWidth={2}
              color="#00FFFF"
              style={{ marginRight: "10px" }}
            />
            EduLab
          </Navbar.Brand>

          {/* Toggle en móvil */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          {/* Enlaces */}
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="#aprender"
                className="d-flex align-items-center text-white fw-semibold"
              >
                <GiBrain size={20} className="me-2 text-purple-500" />
                Aprender
              </Nav.Link>

              <Nav.Link
                href="#juego"
                className="d-flex align-items-center text-white fw-semibold"
              >
                <FaFlask size={20} className="me-2 text-blue-400" />
                Juego
              </Nav.Link>

              <Nav.Link
                href="#molecula"
                className="d-flex align-items-center text-white fw-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  setShow3D(!show3D);
                }}
              >
                <GiAtom size={20} className="me-2 text-teal-400" />
                Molécula
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {show3D && (
        <div
          style={{
            width: "100%",
            height: "500px",
            marginTop: "20px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <iframe
            title="Modelo 3D - Átomo"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/6a283d5b19c34e2b8fcfc6907b231aea/embed"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>
      )}
    </>
  );
}

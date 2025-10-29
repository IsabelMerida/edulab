import React from "react";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
const imageSrc = new URL("../../assets/image.png", import.meta.url).href;

function DownloadPDFButton() {
  const handleDownload = async () => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("No se pudo obtener el contexto 2D del canvas.");
        alert("⚠️ Error al crear el contexto de dibujo para generar el PDF.");
        return;
      }
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");
      const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("tabla-periodica.pdf");
    };

    img.onerror = (err) => {
      console.error("Error al cargar la imagen:", err);
      alert("⚠️ No se pudo cargar la imagen. Verifica la ruta o el archivo.");
    };
  };

  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <small className="text-muted mb-2" style={{ opacity: 0.7 }}>
        Tabla periódica en PDF
      </small>
      <Button variant="info" className="fw-bold" onClick={handleDownload}>
        Descargar PDF
      </Button>
    </div>
  );
}

export default DownloadPDFButton;
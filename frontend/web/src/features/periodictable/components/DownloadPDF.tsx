import React from "react";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import imageSrc from "../../../assets/image.png";

const DownloadPDFButton: React.FC = () => {
  const handleDownload = async () => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");

      const orientation = img.width > img.height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("tabla-periodica.pdf");
    };

    img.onerror = () => {
      alert("No se pudo cargar la imagen. Revisa la ruta en public/assets/");
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
};

export default DownloadPDFButton;

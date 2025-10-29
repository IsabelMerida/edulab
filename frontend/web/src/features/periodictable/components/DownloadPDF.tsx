import React from "react";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";

function DownloadPDFButton() {
  const handleDownload = async () => {
    try {
      const imageSrc = "/assets/image.png";

      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error("No se pudo cargar la imagen");

      const blob = await response.blob();
      const img = await createImageBitmap(blob);

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");
      const orientation = img.width > img.height ? "landscape" : "portrait";

      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [img.width, img.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, img.width, img.height);
      pdf.save("tabla-periodica.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("No se pudo generar el PDF. Verifica la ruta o el archivo.");
    }
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
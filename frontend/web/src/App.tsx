import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomeView from "./features/welcome/WelcomeView";
import PeriodicTableView from "./features/periodictable/PeriodicTableView";
import MezclasView from "./features/mixes/MezclasView";

function App() {
  return (
    <Router>
      <Routes>
        {/* Vista de bienvenida */}
        <Route path="/" element={<WelcomeView />} />

        {/* Secciones principales */}
        <Route path="/tabla" element={<PeriodicTableView />} />
        <Route path="/mezclas" element={<MezclasView />} />

      </Routes>
    </Router>
  );
}

export default App;

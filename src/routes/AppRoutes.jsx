import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<h1>Cadastro</h1>} />
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path="/diario" element={<h1>Meu Diário</h1>} />

        <Route
          path="/musicas/cadastrar"
          element={<h1>Cadastrar Música</h1>}
        />

        <Route
          path="/musicas/:id"
          element={<h1>Visualizar Música</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
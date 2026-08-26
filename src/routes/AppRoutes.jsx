import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import CadastrarMusica from "../pages/CadastrarMusica";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastrarMusica" element={<CadastrarMusica/>}/>

        <Route
          path="/musicas/:id"
          element={<h1>Visualizar Música</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
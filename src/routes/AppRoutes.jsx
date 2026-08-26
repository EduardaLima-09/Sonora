import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import CadastrarMusica from "../pages/CadastrarMusica";
import Notas from "../componentes/Notas";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastrarMusica" element={<CadastrarMusica/>}/>
        <Route path="/notas" element={<Notas/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
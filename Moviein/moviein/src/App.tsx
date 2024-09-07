import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Principal from "./pages/layout/Principal";
import PageValidate from "./pages/validate/PageValidate";
import LandingPage from "./pages/landingPage/Index";
import DadosPrincipais from "./pages/layout/perfil/DadosPrincipais";
import SidebarPerfil from "./components/SidebarPerfil/SidebarPerfil";
import MeusVideos from "./pages/layout/perfil/MeusVideos";
import Pagamento from "./pages/pagamento/Pagamento";
import RedefinirSenha from "pages/auth/RedefinirSenha";
import EnviarCodigo from "pages/auth/EnviarCodigo";
import VisualFilme from "pages/layout/VisualFilme";
import { Toaster } from "components/ui/toaster";
import { useToast } from "components/ui/use-toast";
import { useEffect } from "react";
import ApiService from "api/ApiService";
import Doisfatores from "pages/doisfatores/Doisfatores";
import Assinatura from "pages/Assinatura/Assinatura";
import UserLogConsultation from "pages/telalog/TelaLogs";

import Confirma from "pages/pagamento/confirma";
import UserConsultation from "pages/ConsultUser/ConsultarUsuario";
import Error404 from "pages/erro404/erro";
import AssistirVideo from "pages/layout/AssistirVideo/AssistirVideo";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    ApiService.toast = toast;
  }, [toast])


  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/enviarCodigo" element={<EnviarCodigo />} />
        <Route path="/redefinirSenha" element={<RedefinirSenha />} />
        <Route path="/doisFatores" element={<Doisfatores />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/confirma" element={<Confirma />} />
        <Route path="/consulta" element={<UserConsultation />} />
        <Route path="*" element={<Error404 />} />

        <Route path="/a/" element={<PageValidate />}>
          <Route index element={<Principal />} />
          <Route path="/a/assinatura" element={<Assinatura />} />
          <Route path="/a/visualFilme/:filmeId" element={<VisualFilme />} />
          <Route path="/a/filme/view/:filmeCripto" element={<AssistirVideo />} />
          <Route path="/a/perfil/" element={<SidebarPerfil />}>
            <Route path="dadosPrincipais" element={<DadosPrincipais />} />
            <Route path="meusVideos" element={<MeusVideos />} />
            <Route path="consulta/usuarios" element={<UserConsultation />} />
            <Route path="consulta/logs" element={<UserLogConsultation />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

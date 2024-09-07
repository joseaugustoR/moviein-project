import React, { useContext } from "react";
import film from '../../assets/filme.png';
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "context/UserContext";

type MenuItemPerfilType = {
    path: string
    titulo: string
}

const SidebarPerfil: React.FC = () => {
    const nav = useNavigate();
    const { funcao } = useContext(UserContext);
    const MenuItemPerfil: React.FC<MenuItemPerfilType> = (i) => {
        const active = window.location.pathname === i.path;
        const activeBg = active ? "bg-primary/20 text-primary" : "text-text";
        return (
            <div className={`p-4 cursor-pointer pr-8 ${activeBg}`} onClick={() => nav(i.path)}>
                <p className="text-right">{i.titulo}</p>
            </div>
        )
    }
    return (
        <>
            <img src={film} alt="filmes" className="w-screen h-[60px] object-cover" />
            <div className="flex">
                <div className="w-[30%] bg-slate-200/60 dark:bg-[#00000070] sticky top-[0] left-0 h-[100vh]">
                    <MenuItemPerfil
                        path="/a/perfil/dadosPrincipais"
                        titulo="Dados principais" />
                    {
                        (funcao === "criador" || funcao === "admin") && (
                            <MenuItemPerfil
                                path="/a/perfil/meusVideos"
                                titulo="Meus vídeos" />
                        )
                    }
                    {
                        funcao === "admin" && (
                            <MenuItemPerfil
                                path="/a/perfil/consulta/usuarios"
                                titulo="Consultar Usuarios" />
                        )
                    }
                    {
                        funcao === "admin" && (
                            <MenuItemPerfil
                                path="/a/perfil/consulta/logs"
                                titulo="Logs" />
                        )
                    }
                </div>
                <div className="w-[70%] relative h[calc(100vh-60px)]">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default SidebarPerfil;
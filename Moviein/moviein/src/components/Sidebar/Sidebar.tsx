import UserContext from "context/UserContext";
import React, { useContext, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import moviein from '../../assets/moviein.png';
import movieinDark from '../../assets/moviein-dark.png';
import { useTheme } from 'components/ui/theme-provider';
import ModalDesconectar from "components/Modals/ModalThumbnail/ModalDesconectar/ModalDesconectar";
import { Button } from "components/ui/button";
import { MdLogout } from "react-icons/md";
const Sidebar: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { nome, thumb } = useContext(UserContext)
    const { theme } = useTheme();
    const nav = useNavigate();
    return (
        <>
            {
                open ? (
                    <>
                        <div className="h-screen shadow-xl fixed p-4 left-0 w-[40vh] bg-white dark:bg-card z-[100] flex flex-col justify-between">
                            <div className="flex gap-5 items-center cursor-pointer" onClick={() => {
                                setOpen(false);
                                nav("/a/perfil/dadosPrincipais");
                            }}>
                                <img alt="avatar" src={thumb} className="w-[42px] h-[42px] rounded-full bg-dark flex items-center ml-15 mt-5" />
                                <p className="ml-0 mt-5 p-0 text-text ">
                                    {nome}
                                </p>
                            </div>
                            <div className="mt-3 cursor-pointer flex"
                                onClick={() => {
                                    nav("/a/");
                                    setOpen(false)
                                }}
                            >
                                Filmes
                            </div>

                            <div className="flex flex-col mt-auto">
                                {/* <ModalDesconectar >
                                    <div className="flex gap-4 items-center" onClick={() => setOpen(false)}>
                                        <MdLogout className="text-[26px]" />
                                        Deslogar da conta
                                    </div>
                                </ModalDesconectar> */}
                                {/* {
                                    (theme === "dark" || theme === "system") &&
                                    <img alt='Moviein' src={movieinDark} className="w-[200px] object-contain mb-10" />
                                }
                                {
                                    theme === "light" &&
                                    <img alt='Moviein' src={moviein} className="w-[100px] object-contain mb-10" />
                                } */}
                            </div>

                        </div>

                        <div className="h-screen cursor-pointer w-[32px] fixed left-[40vh] flex items-center z-50"
                            onMouseLeave={() => setOpen(false)}
                            onClick={() => setOpen(false)}>
                            <IoIosArrowBack className="text-white text-[22px]" />
                        </div>
                        <div className="fixed bg-[#00000050] w-screen h-screen z-40"></div>
                    </>
                ) : (
                    <div className="h-screen fixed cursor-pointer w-[32px] flex items-center z-[100]" onClick={() => setOpen(true)}>
                        <IoIosArrowForward className="text-text text-[22px]" />
                    </div>
                )
            }
        </>
    )
}

export default Sidebar;
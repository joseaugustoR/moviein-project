import React, { useContext, useEffect, useState } from "react";
import ModalThumbnail from "../../../components/Modals/ModalThumbnail/ModalThumbnail";
import { Skeleton } from "components/ui/skeleton";
import ModalDesconectar from "components/Modals/ModalThumbnail/ModalDesconectar/ModalDesconectar";
import UserContext from "context/UserContext";
import { useNavigate } from "react-router-dom";
import { Theme, useTheme } from "components/ui/theme-provider";
import InputSwitchAutenticacao2Fatores from "components/InputSwitchAutenticacao2Fatores";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import ApiService from "api/ApiService";

type AssinaturaType = {
    Assinatura: string;
    preco: number,
    periodo: string
} | null

const Api = new ApiService();
const DadosPrincipais: React.FC = () => {
    const { thumb, email, nome, auth2, setValueUser, reload } = useContext(UserContext)
    const { setTheme, theme } = useTheme();
    const [load, setLoad] = useState<boolean>(true);
    const [assinatura, setAssinatura] = useState<AssinaturaType>(null);
    const nav = useNavigate();
    useEffect(() => {

        if (email === undefined) {
            setLoad(true)
        } else {
            setLoad(false)
        }
    }, [email])

    function redefinirSenha() {
        nav("/enviarCodigo");
    }

    useEffect(() => {
        async function loadAssist() {
            Api.Get<AssinaturaType>({
                path: `api/usuario/temAssinatura`,
                errorTitle: "Falha ao validar assinatura do usuário",
                thenCallback: (r) => {
                    setAssinatura(r);
                }
            })
        }
        loadAssist();
    }, [])


    return (
        <div>
            <div className="w-full grid grid-cols-2 px-8 gap-8">
                <div>
                    <div className="mt-10 flex justify-center relative">
                        {
                            load ? (
                                <Skeleton className="w-[189px] h-[180px] rounded-full" />
                            ) : (
                                <>
                                    {
                                        (thumb === undefined || thumb === null) ? (
                                            <img alt="avatar" src="https://picsum.photos/200/300" className="w-[180px] h-[180px] rounded-full" />
                                        ) : (
                                            <img alt="avatar" src={thumb} className="w-[180px] h-[180px] rounded-full" />
                                        )
                                    }
                                    <div className="absolute bottom-[-20px] z-10">
                                        <ModalThumbnail thumb={thumb}
                                            setValue={setValueUser}
                                            email={thumb}
                                            reloadPerfil={reload} />
                                    </div>
                                </>
                            )
                        }

                    </div>

                    <div>
                        {
                            load ? (
                                <>
                                    <div className="flex flex-col space-y-4 mt-4">
                                        <Skeleton className="w-[full] h-[64px] " />
                                        <Skeleton className="w-[full] h-[64px]" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mt-2">
                                        <Label htmlFor="nome" className="opacity-50">Nome</Label>
                                        <Input value={nome} id="nome" disabled />
                                    </div>
                                    <div className="mt-6">
                                        <Label htmlFor="email" className="opacity-50">Email</Label>
                                        <Input value={email} id="email" disabled />
                                    </div>


                                    <InputSwitchAutenticacao2Fatores auth2={auth2} />
                                </>
                            )
                        }

                        <div className="my-5">
                            <Button className="w-full" onClick={() => redefinirSenha()}>
                                Redefinir senha
                            </Button>
                        </div>
                        <div className="mb-4">
                            <Select onValueChange={(d: Theme) => setTheme(d)} value={theme}>
                                <SelectTrigger>
                                    <SelectValue defaultValue={theme} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="light">Claro</SelectItem>
                                        <SelectItem value="dark">Escuro</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <ModalDesconectar>
                                <Button
                                    color="outline-white"
                                    className="w-full">
                                    Deslogar
                                </Button>
                            </ModalDesconectar>
                        </div>
                    </div>

                </div>
                <div>
                    <div className="mt-10 relative h-[60vh] flex items-center p-10 w-full border-[1px] dark:border-white/35 border-primary/35 rounded-[20px] overflow-hidden">
                        {
                            load ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                assinatura === null ? (
                                    <>
                                        <div className="absolute top-[-60px] right-[-60px] opacity-45 w-[200px] h-[200px] bg-primary dark:bg-white rounded-full blur-[100px]"></div>
                                        <div className="absolute bottom-[-60px] left-[-60px] opacity-45 w-[200px] h-[200px] bg-primary dark:bg-white rounded-full blur-[100px]"></div>

                                        <div className="flex flex-col gap-4 text-center text-text">
                                            <h3 className="text-[20px]">Atualmente você não possui nenhuma assinatura</h3>
                                            <Button color="outline-white" onClick={() => nav("/a/Assinatura")}>
                                                Comprar uma assinatura
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute top-[-60px] right-[-60px] opacity-45 w-[200px] h-[200px] bg-primary dark:bg-white rounded-full blur-[100px]"></div>
                                        <div className="absolute bottom-[-60px] left-[-60px] opacity-45 w-[200px] h-[200px] bg-primary dark:bg-white rounded-full blur-[100px]"></div>

                                        <div className="flex flex-col gap-4 text-center w-full text-text">
                                            <h3 className="text-[22px]">Sua assinatura atual:</h3>
                                            <h2 className="text-[32px] font-bold">{assinatura.Assinatura}</h2>
                                        </div>
                                    </>
                                )
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}


export default DadosPrincipais;
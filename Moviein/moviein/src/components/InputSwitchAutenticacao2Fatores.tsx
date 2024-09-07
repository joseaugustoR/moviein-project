import Api from "api/api";
import { Switch } from "./ui/switch"
import { useState } from "react";
import { useToast } from "./ui/use-toast";

type InputSwitchAutenticacao2FatoresType = {
    auth2?: boolean
}
const InputSwitchAutenticacao2Fatores: React.FC<InputSwitchAutenticacao2FatoresType> = (p) => {
    const {toast} = useToast();
    const [check, setCheck] = useState<boolean>(p.auth2 ?? false);
    async function toggle2Auth() {
        var e = await Api.get("api/usuario/toggleAuth2");
        if(e.status === 200) {
            setCheck(!check);
            toast({
                title: `Autenticação de 2 fatores: ${check ? "Inativo" : "Ativo"}`,
                className: "bg-success text-black"
            })
        }
    }

    return (
        <>
            <div className="flex gap-8 justify-between cursor-pointer my-4" onClick={toggle2Auth}>
                <label htmlFor="auth2"
                    className="pointer-events-none"
                    onClick={toggle2Auth}
                >
                    Ativar autenticação de dois fatores?
                </label>
                <Switch id="auth2" checked={check} defaultChecked={p.auth2} />
            </div>
        </>
    )
}

export default InputSwitchAutenticacao2Fatores;
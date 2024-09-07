import React, { useState } from 'react';
import escudo from "assets/protect.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'components/ui/input-otp';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'components/ui/button';
import { useToast } from 'components/ui/use-toast';
import ApiService from 'api/ApiService';
import LoginDTO_Res from 'models/LoginDTO_Res';
const api = new ApiService();
const VerificacaoDoisFatores: React.FC = () => {
  const [load, setLoad] = useState<boolean>(false);
  const [digitos, setDigitos] = useState<string>("");
  const { state } = useLocation()
  const { code, email } = state as { code: string, email: string }
  const { toast } = useToast();
  const nav = useNavigate();
  async function Verificar2Fatores() {
    setLoad(true);
    if (code.toString() !== digitos.toString()) {
      toast({
        title: "Falha na verificação",
        description: "Código de verificação inválido.",
        className: "bg-red"
      })
      setLoad(false);
      return;
    }

    await api.Post<LoginDTO_Res>({
      path: "api/usuario/DoisFatoresValidado",
      data: {
        email: email
      },
      errorTitle: "Falha ao validar autenticação de dois fatores",
      thenCallback: (d) => {
        window.localStorage.setItem("token", d.token!);
        window.localStorage.setItem("funcao", d.funcao!);
        window.localStorage.setItem("exp", d.expiracao!.toString());
        nav("/a/");
      }
    })
    setLoad(false)
  }


  return (
    <div className="bg-purple-600 min-h-screen flex justify-center items-center">
      <div className="container">
        <div className='bg-background p-8 rounded-lg text-center'>
          <div className="icone w-24 h-24 flex justify-center items-center bg-purple-600 rounded-full mx-auto mb-3">
            <img src={escudo} alt="" className="w-16 h-16" />
          </div>
          <h4 className="text-lg font-semibold text-text">Código de Verificação de 2 fatores:</h4>
          <p className='mb-3'>Verifique em sua caixa de email</p>
          <div className="grupoInputs flex justify-center mb-6 text-gray-800">
            <InputOTP onChange={setDigitos} maxLength={5} containerClassName={"opacity-100 border-1"}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button size="lg" load={load} onClick={() => Verificar2Fatores()}>
            Verificar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificacaoDoisFatores;





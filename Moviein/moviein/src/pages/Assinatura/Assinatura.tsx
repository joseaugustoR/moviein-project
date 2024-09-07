import React, { useCallback, useState } from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { twMerge } from 'tailwind-merge';
import { Button } from 'components/ui/button';
import ApiService from 'api/ApiService';
import { useToast } from 'components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type tipoType = "MONTHLY" | "YEARLY" | "SEMIANNUALLY";
type assinaturaType = "cliente" | "criador";


type tableType = {
  preco: number,
  precoString: string,
  assinatura: assinaturaType,
  tipo: tipoType
}

const Api = new ApiService();
const Assinatura: React.FC = () => {
  const [tipo, setTipo] = useState<tipoType>("MONTHLY");
  const [assinatura, setAssinatura] = useState<assinaturaType>("cliente");
  const [load, setLoad] = useState<boolean>(false);
  const { toast } = useToast();
  const nav = useNavigate();
  async function AssinarPlano() {
    setLoad(true);
    await Api.Post<string>({
      path: "api/assinatura/Registrar",
      data: {
        periodo: tipo,
        assinatura: assinatura,
        preco: tabelas.find(d => d.assinatura === assinatura && d.tipo === tipo)?.preco
      },
      errorTitle: "Falha ao registrar assinatura.",
      thenCallback: (t) => {
        setLoad(false);
        toast({
          title: "Assinatura criada com sucesso!",
          className: "bg-success text-black"
        })
        window.open(t, "_blank");
        nav("/a/perfil/dadosPrincipais");
      }
    })
  }

  const tabelas: tableType[] = [
    {
      preco: 16.72,
      precoString: "R$ 16,72",
      assinatura: "cliente",
      tipo: "MONTHLY"
    },
    {
      preco: 32.90,
      precoString: "R$ 32,90",
      assinatura: "cliente",
      tipo: "SEMIANNUALLY"
    },
    {
      preco: 60.00,
      precoString: "R$ 60,00",
      assinatura: "cliente",
      tipo: "YEARLY"
    },


    /*{
      preco: 24.70,
      precoString: "R$ 24,70",
      assinatura: "critico",
      tipo: "MONTHLY"
    },
    {
      preco: 56.00,
      precoString: "R$ 56,00",
      assinatura: "critico",
      tipo: "SEMIANNUALLY"
    },
   {
      preco: 100,
      precoString: "R$ 100,00",
      assinatura: "critico",
      tipo: "YEARLY"
    },*/

    {
      preco: 50.00,
      precoString: "R$ 50,50",
      assinatura: "criador",
      tipo: "MONTHLY"
    },
    {
      preco: 80.00,
      precoString: "R$ 80,00",
      assinatura: "criador",
      tipo: "SEMIANNUALLY"
    },
    {
      preco: 120.00,
      precoString: "R$ 120,00",
      assinatura: "criador",
      tipo: "YEARLY"
    }
  ];

  return (
    <div className='bg-gradient-to-br flex justify-center items-center w-full min-h-screen from-primary to-red'>
      <div className='container'>
        <div className='bg-background p-6 rounded-lg mt-4 md:mt-0'>
          <section className='container mx-auto'>
            <div className='mb-6'>
              <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <h2 className='font-bold text-2xl mt-4 mb-4'>Planos de Assinatura</h2>
                <p className='mb-3'>Para poder assistir vídeos, é necessário obter um desses planos.</p>
              </div>
              <div className='grid md:grid-cols-2 grid-cols-1 gap-12 justify-between items-center w-full'>
                <Select onValueChange={(d: tipoType) => setTipo(d)} defaultValue={tipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MONTHLY">Mensal</SelectItem>
                      <SelectItem value="SEMIANNUALLY">Semestral</SelectItem>
                      <SelectItem value="YEARLY">Anual</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid md:grid-cols-2 gap-[20px] mb-3'>

              {/* ASSINATURAS */}
              <div onClick={() => setAssinatura("cliente")}
                className={twMerge("relative p-6 rounded-xl border-primary border-[1px] text-text overflow-hidden cursor-pointer", assinatura !== "cliente" && "opacity-50")}>
                <div className="w-[180px] h-[180px] absolute -right-12 -top-12 rounded-full blur-[50px] bg-primary"></div>
                <div className="w-[180px] h-[180px] absolute -left-12 -bottom-12 rounded-full blur-[50px] -10 bg-primary"></div>
                <div className='relative z-10'>
                  <div className='mb-4'>
                    <h4 className='text-[22px]'>Cliente</h4>
                    <small className='text-md font-bold'>Casual</small>
                  </div>
                  <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
                    </div>
                    <div className="flex gap-4 opacity-35">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
                    </div>
                    <div className="flex gap-4 opacity-35">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Sem anúncios</p>
                    </div>
                    <div className="flex gap-4 opacity-35">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
                    </div>
                  </div>
                  <p className='text-2xl font-bold mt-8 mb-6'>{tabelas.find(d => d.assinatura === "cliente" && d.tipo === tipo)?.precoString}</p>
                </div>
              </div>



              {/* CRÍTICO 
              <div onClick={() => setAssinatura("critico")}
                className={twMerge("relative p-6 rounded-xl border-red border-[1px] text-text overflow-hidden cursor-pointer", assinatura !== "critico" && "opacity-50")}>
                <div className="w-[180px] h-[180px] absolute -right-12 -top-12 rounded-full blur-[50px] bg-red"></div>
                <div className="w-[180px] h-[180px] absolute -left-12 -bottom-12 rounded-full blur-[50px] -10 bg-red"></div>
                <div className='relative z-10'>
                  <div className='mb-4'>
                    <h4 className='text-[22px]'>Crítico</h4>
                    <small className='text-md font-bold'>Diferente</small>
                  </div>
                  <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
                    </div>
                    <div className="flex gap-4 opacity-35">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Sem anúncios</p>
                    </div>
                    <div className="flex gap-4 opacity-35">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
                    </div>
                  </div>
                  <p className='text-2xl font-bold mt-8 mb-6'>{tabelas.find(d => d.assinatura === "critico" && d.tipo === tipo)?.precoString}</p>

                </div>
              </div>*/}



              {/* CRIADOR */}
              <div onClick={() => setAssinatura("criador")}
                className={twMerge("relative p-6 rounded-xl border-text border-[1px] text-text overflow-hidden cursor-pointer", assinatura !== "criador" && "opacity-50")}>
                <div className="w-[180px] h-[180px] absolute -right-12 -top-12 rounded-full blur-[50px] bg-text"></div>
                <div className="w-[180px] h-[180px] absolute -left-12 -bottom-12 rounded-full blur-[50px] -10 bg-text"></div>
                <div className='relative z-10'>
                  <div className='mb-4'>
                    <h4 className='text-[22px]'>Criador</h4>
                    <small className='text-md font-bold'>Especial</small>
                  </div>
                  <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Sem anúncios</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <FaRegCircleCheck className='text-[28px]' />
                      </div>
                      <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
                    </div>
                  </div>
                  <p className='text-2xl font-bold mt-8 mb-6'>{tabelas.find(d => d.assinatura === "criador" && d.tipo === tipo)?.precoString}</p>
                </div>
              </div>



            </div>
            <div className='flex justify-end'>
              <Button load={load} onClick={() => AssinarPlano()}>
                Assinar plano
              </Button>
            </div>
          </section>
        </div>
      </div >
    </div >
  )
}
export default Assinatura;

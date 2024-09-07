import React, { useEffect, useState } from 'react';
// import Button from 'components/Button';
import ApiService from 'api/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import Classificacao from 'components/Classificacao/Classificacao';
import { MdArrowBack, MdPlayArrow } from 'react-icons/md';
import { IoReloadSharp } from "react-icons/io5";
interface FilmeDetalheDTO_Res {
  caminhoImagem: string,
  descricao: string,
  titulo: string,
  classificacao: string
  id: string
}

const Api = new ApiService();
const VisualFilme: React.FC = () => {
  const [detail, setDetail] = useState<FilmeDetalheDTO_Res | null>(null);
  const nav = useNavigate();
  const { filmeId } = useParams<{ filmeId: string }>();
  const [load, setLoad] = useState<boolean>(false);
  useEffect(() => {
    async function LoadDetalhe() {
      Api.Get<FilmeDetalheDTO_Res>({
        path: `api/filme/DetalheFilme?FilmeId=${filmeId}`,
        errorTitle: "Falha ao coletar detalhe do filme",
        thenCallback: (r) => {
          setDetail(r)
        }
      })
    }
    LoadDetalhe();
  }, [])


  async function openPlayVideo() {
    setLoad(true);
    await Api.Get<{ validado: boolean, filmeCripto: string }>({
      path: `api/assinatura/permitido?filmeId=${filmeId}`,
      errorTitle: "Falha ao validar permissão",
      thenCallback: (r) => {
        if (r.validado === true) {
          nav(`/a/filme/view/${r.filmeCripto}`)
        } else {
          nav("/a/Assinatura")
        }
        setLoad(false);
      }
    })
  }

  return (
    <>
      <img loading='lazy' className="fixed h-screen w-full top-0 left-0 m-0 p-0 border-0 bg-cover blur-[3px]" style={{ backgroundImage: `url(${detail?.caminhoImagem})`, backdropFilter: 'blur(5px)' }} />
      <div className='fixed bg-gradient-to-r from-background to-transparent h-screen w-[600px] top-0 left-0'></div>
      <div className='relative z-10'>
        <div className="container relative">
          <div className='flex min-h-screen flex-col justify-start pt-10 md:w-1/2 w-full'>
            <div >
              <Classificacao classificacao={detail?.classificacao ?? "l"} />
            </div>
            <h1 className="text-text text-5xl font-semibold mt-8">{detail?.titulo}</h1>
            <h5 className="text-1xl text-text font-normal leading-9 mt-4 mb-20 max-w-6xl text-left">
              {detail?.descricao}
            </h5>

            <div className="flex w-full justify-between pt-8">
              <div className='flex gap-3'>
                <button onClick={() => openPlayVideo()}
                  className="w-[64px] h-[64px] bg-primary rounded-full focus:outline-none flex items-center justify-center">
                  {
                    load ? <IoReloadSharp className='animate-spin' /> : <MdPlayArrow />
                  }
                </button>
              </div>
            </div>

            <div className='flex gap-3 absolute bottom-[20px] right-8'>
              <button onClick={() => nav("/a/")} className='px-7 py-5 rounded-full items-center bg-white  flex gap-3'>
                <MdArrowBack className='text-black' />
                <label className='text-black'>voltar</label>
              </button>
              {/* <button className='px-7 py-5 rounded-full items-center bg-background flex gap-3'>
                <img src={tomate} alt="tomate" className='h-[20px] object-contain' />
                <label>30%</label>
              </button>
              <button className='px-7 py-5 rounded-full items-center bg-background flex gap-3'>
                <img src={pipoca} alt="pipoca" className='h-[20px] object-contain' />
                <label>60%</label>
              </button> */}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default VisualFilme;
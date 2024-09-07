import React, { useEffect, useState } from 'react';
import { Button } from 'components/ui/button';
import tomate from '../../assets/tomate.png';
import pipoca from '../../assets/pipoca.png';
import { Carousel, CarouselContent, CarouselItem } from 'components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import unisuamLight from '../../assets/Unisuam-light.png'
import unisuam from '../../assets/Unisuam.png'
import moviein from '../../assets/moviein.png';
import movieinDark from '../../assets/moviein-dark.png';
import { useTheme } from 'components/ui/theme-provider';
import { Link } from 'react-router-dom';
import pandafundo from '../../assets/filmes/pandafundo.jpg';
import ApiService from 'api/ApiService';
import FilmeDTO_Res from 'models/FilmeDTO_Res';
import { Skeleton } from 'components/ui/skeleton';


interface FilmeNovoDTO_Res {
    imagem: string
    nome: string
    filmeId: number
}

const api = new ApiService();
const Principal: React.FC = () => {
    const nav = useNavigate();
    const { theme } = useTheme();
    const [list, setList] = useState<FilmeDTO_Res[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [filme, setFilme] = useState<FilmeNovoDTO_Res | null>(null)
    useEffect(() => {
        async function LoadFilmes() {
            setLoad(true);

            await api.Get<FilmeNovoDTO_Res>({
                errorTitle: "Falha ao exibir filme novo.",
                path: "api/filme/NovoFilme",
                thenCallback: (r) => {
                    setFilme(r);
                }
            })

            await api.Get<FilmeDTO_Res[]>({
                path: "api/filme/ListarFilmes",
                errorTitle: "Falha ao listar os filmes",
                thenCallback: (r) => {
                    setList(r);
                    setLoad(false);
                }
            })
        }
        LoadFilmes();
    }, [])


    const LoadContext: React.FC<{ children: React.ReactNode, className: string }> = (p) => {
        return (
            <>
                {
                    load ?
                        <Skeleton className={p.className} />
                        :
                        p.children
                }
            </>
        );
    }

    return (
        <main className='min-h-screen relative'>
            <div className='relative h-[40vh]'>
                <div className='bg-background absolute w-full h-full z-[1]'>
                    <LoadContext className='w-full h-[40vh]'>
                        <img src={filme?.imagem} alt="filme" className='animate-in fade-in duration-1200 w-full opacity-70 h-full object-cover' />
                    </LoadContext>
                </div>
                <div className='container relative z-20'>
                    <div className='grid md:grid-cols-2 grid-cols-1 items-end h-[25vh] pb-5'>
                        <div>
                            <LoadContext className='h-[60px]'>
                                <h3 className='md:text-[50px] text-[32px] text-text font-bold'>{filme?.nome}</h3>
                            </LoadContext>
                        </div>
                        <div className='flex justify-end gap-4'>
                            {/* <LoadContext className='h-[46px] w-[80px] rounded-full'>
                                <button className='p-2 rounded-full items-center bg-background flex gap-3'>
                                    <img src={tomate} alt="tomate" className='h-[25px] object-contain' />
                                    <label className='sm:text-[14px]'>30%</label>
                                </button>
                            </LoadContext>
                            <LoadContext className='h-[46px] w-[80px] rounded-full'>
                                <button className='p-2 rounded-full items-center bg-background flex gap-3'>
                                    <img src={pipoca} alt="pipoca" className='h-[25px] object-contain' />
                                    <label className='sm:text-[14px]'>60%</label>
                                </button>
                            </LoadContext> */}
                            <LoadContext className='h-[40px] rounded-md'>
                                <Button onClick={() => nav(`/a/visualFilme/${filme?.filmeId}`)} variant="red">
                                    Assistir
                                </Button>
                            </LoadContext>
                        </div>
                    </div>
                </div>
                <div className='w-full absolute z-[10] h-[60px] bottom-0 left-0 bg-gradient-to-b from-transparent to-background'></div>
            </div>
            <section className='container mt-8 pb-[100px]'>

                {
                    load ? (
                        <>
                            <Skeleton className='w-[160px] h-[32px] mb-4' />
                            <Carousel>
                                <CarouselContent>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                    <CarouselItem className='basis-1/5'>
                                        <Skeleton className='w-full h-[260px]' />
                                    </CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </>
                    ) : list.map((e, i) => (
                        <>
                            <Carousel key={i}>
                                <h3 className='text-[25px] text-text font-bold mb-[15px] mt-[30px]'>{e.categoria}</h3>
                                <CarouselContent>
                                    {
                                        e.filmes.map((r, k) => (
                                            <CarouselItem key={k} className='md:basis-1/5 basis-1/2' onClick={() => nav(`/a/visualFilme/${r.id}`)}>
                                                <div className='relative pt-[140%] border-primary border-[2px] rounded-xl hover:shadow-[0_6px_16px_0_rgba(134,93,255,0.5)]'>
                                                    <Link to="#">
                                                        <img className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" src={r.thumb} alt="" />
                                                    </Link>
                                                </div>
                                            </CarouselItem>
                                        ))
                                    }
                                </CarouselContent>
                            </Carousel >
                        </>
                    ))
                }

            </section>
            <footer className="pt-4 dark:bg-black bg-card h-[80px] absolute bottom-0 w-full">
                <div className='container'>
                    
                <div>
                    {
                        (theme === "dark" || theme === "system") && <img alt='Moviein' src={movieinDark} className="w-[100px] object-contain -dark:hidden" />
                    }
                    {
                        theme === "light" && <img alt='Moviein' src={moviein} className="w-[100px] object-contain -dark:hidden" />
                    }
                </div>
                <div className='flex justify-between'>
                    <small>Moviein © 2024 - Todos os direitos reservados</small>
                    {
                        (theme === "dark" || theme === "system") && <img alt='Moviein' src={unisuamLight} className="w-[100px] object-contain -dark:hidden" />
                    }
                    {
                        theme === "light" && <img alt='Moviein' src={unisuam} className="w-[100px] object-contain -dark:hidden" />
                    }
                </div>
                </div>
            </footer>
        </main>
    );
}

export default Principal;
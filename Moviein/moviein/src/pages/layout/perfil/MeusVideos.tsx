import ApiService from 'api/ApiService';
import ModalRegistrarFilme from 'components/Modals/ModalRegistrarFilme/ModalRegistrarFilme';
import { Button } from 'components/ui/button';
import React, { useEffect, useState } from 'react';
import { MdMovie } from 'react-icons/md';
import { Skeleton } from 'components/ui/skeleton';
import FilmeItem from 'models/FilmeItemModel';
import MeusVideoItem from 'components/Items/MeusVideoItem/MeusVideoItem';

const Api = new ApiService();
const MeusVideos: React.FC = () => {
    const [videos, setVideos] = useState<FilmeItem[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    async function LoadVideos() {
        setLoad(true)
        await Api.Get<FilmeItem[]>({
            path: "api/filme/Meusvideos",
            errorTitle: "Falha ao listar os vídeos",
            thenCallback: (r) => {
                setVideos(r);
                setLoad(false);
            }
        })
    }

    useEffect(() => {
        LoadVideos()
    }, [])


    return (
        <div className='px-8 mt-8'>
            <div className='w-full mb-4 flex justify-between'>
                <h3 className='text-3xl'>Meus vídeos</h3>
                <ModalRegistrarFilme onUpdated={LoadVideos}>
                    <Button variant="outline" className='gap-3'>
                        Registrar novo vídeo
                        <MdMovie />
                    </Button>
                </ModalRegistrarFilme>
            </div>

            <div className='grid grid-cols-3 gap-4'>
                {
                    load ?
                        (
                            <>
                                <Skeleton className='w-full h-[280px]' />
                                <Skeleton className='w-full h-[280px]' />
                                <Skeleton className='w-full h-[280px]' />
                            </>
                        ) : (
                            <>
                                {
                                    videos.map((e, i) => (
                                        <MeusVideoItem
                                            key={i}
                                            {...e}
                                            updateChange={() => LoadVideos()}
                                        />
                                    ))
                                }
                            </>
                        )
                }

            </div>

        </div>
    );
}

export default MeusVideos; 
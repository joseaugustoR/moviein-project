import React from 'react';
import { MdCircle } from 'react-icons/md';

type ColaboradorType = {
    nome: string
    feitos: string[]
    imagem: string
}

const Colaborador: React.FC<ColaboradorType> = (p) => {
    return (
        <div className='p-8 flex flex-col gap-y-8 items-center'>
            <img alt={p.nome} src={p.imagem} className='rounded-full h-[280px] w-[280px] object-cover' />
            <div className='p-4 bg-primary rounded-xl text-center w-full text-white'>
                {p.nome}
            </div>
            <div className='w-full flex flex-col gap-2'>
                {
                    p.feitos.map((e, i) => (
                        <div key={i} className='flex gap-3 w-full'>
                            <MdCircle />
                            {e}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Colaborador;
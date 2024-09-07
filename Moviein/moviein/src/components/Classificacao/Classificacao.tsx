import React from 'react';


type ClassificacaType = {
    classificacao: string
}

const Classificacao: React.FC<ClassificacaType> = (p) => {

    switch (p.classificacao) {
        case "l":
            return (
                <div className='w-[64px] h-[64px] bg-success text-dark rounded-md flex justify-center items-center'>
                    L
                </div>
            )
        case "10":
            return (
                <div className='w-[64px] h-[64px] bg-info text-dark rounded-md flex justify-center items-center'>
                    10
                </div>
            )
        case "12":
            return (
                <div className='w-[64px] h-[64px] bg-warning text-dark rounded-md flex justify-center items-center'>
                    12
                </div>
            )
        case "14":
            return (
                <div className='w-[64px] h-[64px] bg-orange text-dark rounded-md flex justify-center items-center'>
                    14
                </div>
            )
        case "16":
            return (
                <div className='w-[64px] h-[64px] bg-red text-dark rounded-md flex justify-center items-center'>
                    16
                </div>
            )
        case "18":
            return (
                <div className='w-[64px] h-[64px] bg-black text-dark rounded-md flex justify-center items-center'>
                    18
                </div>
            )

        default:
            return <></>;
    }

}

export default Classificacao;
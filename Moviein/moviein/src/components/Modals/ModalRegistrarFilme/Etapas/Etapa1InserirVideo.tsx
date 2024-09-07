import getVideoDuration from 'helpers/getVideoDuration';
import React, { useRef } from 'react';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';

type Etapa1_InserirVideoType = {
  onchange: (f: File | null) => any
  onDuration: (d: number | null) => any
  file: File | null
}

const Etapas1_InserirVideo: React.FC<Etapa1_InserirVideoType> = (p) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input type='file' accept='video/mp4' className='hidden' onChange={async (d) => {
        var f: File | null = d.target.files != null ? d.target.files[0] : null;
        if (f !== null) {
          p.onchange(f);
          const e = await getVideoDuration(f!);
          p.onDuration(e)
        }
      }} ref={ref} />
      <div className='flex justify-center'>
        <div
          onClick={() => ref.current?.click()}
          className='flex flex-col cursor-pointer justify-center items-center w-[400px] rounded-lg h-[400px] border-[1px] border-sky-100'>
          <BiSolidMoviePlay className={twMerge("text-[80px]", p.file !== null ? "text-primary" : "dark:text-white/50 text-black/20")} />
          <p>{p.file !== null ? p.file?.name : "Arraste o seu vídeo / filmes aqui"}</p>
          <small>Atualmente é permitido vídeos com resolução de 360p.</small>
        </div>
      </div>
    </>
  );
}

export default Etapas1_InserirVideo;
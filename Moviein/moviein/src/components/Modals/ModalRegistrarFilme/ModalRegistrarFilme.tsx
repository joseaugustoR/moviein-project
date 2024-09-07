import { Button } from 'components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import React, { useRef, useState } from 'react';
import Etapa1_InserirVideo from './Etapas/Etapa1InserirVideo';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ApiService from 'api/ApiService';
import RegistroFilmeSchema, { RegistroFilmeSchemaType } from './RegistroFilmeSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { MdClose, MdImage } from 'react-icons/md';
import convertToBase64 from 'helpers/convertToBase64';
import RegistrarFilmeDTO_res from 'models/RegistrarFilmeDTO_res';
import { useToast } from 'components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Progress } from 'components/ui/progress';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util'


type ModalRegistrarFilmeType = {
    children: React.ReactNode;
    onUpdated: () => any
}

const Api = new ApiService();
const ModalRegistrarFilme: React.FC<ModalRegistrarFilmeType> = (p) => {
    const [file, setFile] = useState<File | null>(null);
    const [etapa, setEtapa] = useState<number>(0);
    const { toast } = useToast();
    const [fileDetail_select, setFileDetail_select] = useState<File | null>(null);
    const ImgDetailRef = useRef<HTMLInputElement>(null);
    const [imgDetail_select, setImgDetail_select] = useState<string | null>(null);
    const [load, setLoad] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [loadContext, setLoadcontext] = useState<{ text: string, progress: number }>(
        {
            progress: 0,
            text: ""
        }
    );
    const ThumbRef = useRef<HTMLInputElement>(null);
    const [thumb_select, setThumb_select] = useState<string | null>(null);
    const buttonCloseRef = useRef<HTMLButtonElement>(null);
    const form = useForm<RegistroFilmeSchemaType>({
        resolver: yupResolver(RegistroFilmeSchema),
        defaultValues: {
            classificacao: "L"
        }
    });

    async function registrar(data: RegistroFilmeSchemaType) {
        //Cadastrar filme pelo banco
        var req = {
            nome: data.nome,
            descricao: data.descricao,
            classificacao: data.classificacao,
            thumbnail: thumb_select,
            categoria: data.categoria,
            duracao: duration
        }

        if (fileDetail_select === null) {
            toast({
                title: "Falha ao registrar filme",
                description: "Insira uma imagem detalhada do filme.",
                className: "bg-red text-white"
            })
            return;
        }

        if (thumb_select === null) {
            toast({
                title: "Falha ao registrar filme",
                description: "Insira uma imagem de thumbnail do filme.",
                className: "bg-red text-white"
            })
            return;
        }

        if (file === null) {
            toast({
                title: "Falha ao registrar filme",
                description: "Faça um upload de algum vídeo na etapa 1.",
                className: "bg-red text-white"
            })
            return;
        }

        setLoad(true);
        setLoadcontext({
            progress: 20,
            text: "Gerando dados do filme (1/4)"
        });

        //Estágio 1: Criando filme no lado do banco.
        await Api.Post<RegistrarFilmeDTO_res>({
            data: req,
            errorTitle: "Falha ao registrar informações filme",
            path: "api/filme/RegistroConteudo",
            thenCallback: async (e1) => {
                setLoadcontext({
                    progress: 40,
                    text: "Salvando dados do filme, salvando imagens(2/4)..."
                });

                var formData = new FormData();

                formData.append("file", fileDetail_select!);

                //Estágio 2: Salvando a imagem detalhe no S3
                await Api.Post({
                    data: formData,
                    formData: true,
                    path: `api/filme/RegistroImagem?filmeId=${e1.filmeId}`,
                    errorTitle: "Falha ao salvar imagem detalhada.",
                    thenCallback: async () => {
                        setLoadcontext({
                            progress: 60,
                            text: "Salvando filme segmentado (3/4)..."
                        });
                        //Estágio 3: Despembrando o vídeo e salvando ela um de cada vez.
                        if (file !== null) {
                            const f = new FFmpeg();

                            await f.load();

                            await f.createDir("videos", {});

                            var pathFile = await fetchFile(file);
                           
                            await f.writeFile(`./videos/${file.name}`, pathFile);
                            await f.exec([
                                '-i',
                                `./videos/${file.name}`,
                                '-c',
                                'copy',
                                '-map',
                                '0',
                                '-segment_time',
                                '60', // Dividir em segmentos de 1 minuto
                                '-f',
                                'segment',
                                'videos/segment-%03d.mp4' // Diretório de saída
                            ]);
                            const segmentFiles = await f.listDir('./videos/');
                            const newSegmentsPromise = segmentFiles.filter((name) => name.name.startsWith('segment-')).map(async (fileName) => {
                                const fileData = await f.readFile("videos/" + fileName.name);
                                const blob = new Blob([fileData], { type: 'video/mp4' });
                                return {
                                    name: fileName,
                                    blob,
                                };
                            });
                            var newSegments = await Promise.all(newSegmentsPromise);
                            setLoadcontext({
                                progress: 80,
                                text: "Enviando video segmentado (4/4)..."
                            });
                            console.log({ newSegments })

                            for (const segment of newSegments) {
                                var fd = new FormData();
                                fd.append("file", segment.blob, segment.name.name);
                                console.log({ "blobs": segment.blob })

                                await Api.Post({
                                    data: fd,
                                    formData: true,
                                    errorTitle: "Falha ao baixar filme segmentado.",
                                    path: `api/filme/RegistroFilme?filmeId=${e1.filmeId}`
                                })
                            }
                            toast({
                                title: "Vídeo salvo com sucesso!",
                                className: "bg-success text-black"
                            })
                            setLoad(false)
                            p.onUpdated();
                            buttonCloseRef.current?.click();
                        }
                    }
                })

            },
            catchCallback() {
                setLoad(false);
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {p.children}
            </DialogTrigger>
            <DialogContent className='min-w-[80%] min-h-[50%]'>

                <DialogHeader>
                    <DialogTitle>Upload do vídeo (etapa {etapa + 1})</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(registrar)}>
                        {
                            etapa === 0 && <Etapa1_InserirVideo file={file} onDuration={setDuration} onchange={setFile} />
                        }
                        {
                            etapa === 1 && (
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do filme</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="descricao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={6} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoria"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categoria</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma categoria" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Terror">Terror</SelectItem>
                                                        <SelectItem value="Aventura">Aventura</SelectItem>
                                                        <SelectItem value="Curtas">Curtas</SelectItem>
                                                        <SelectItem value="Acao">Ação</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-6 justify-center gap-12 pt-6'>
                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "L")}>
                                            <div className='p-8 bg-success w-full rounded-md text-center'>
                                                L
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "L" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "10")}>
                                            <div className='p-8 bg-info text-dark w-full rounded-md text-center'>
                                                10
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "10" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "12")}>
                                            <div className='p-8 bg-warning text-dark w-full rounded-md text-center'>
                                                12
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "12" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "14")}>
                                            <div className='p-8 bg-orange text-dark w-full rounded-md text-center'>
                                                14
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "14" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "16")}>
                                            <div className='p-8 bg-red w-full rounded-md text-center'>
                                                16
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "16" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                        <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "18")}>
                                            <div className='p-8 bg-black w-full rounded-md text-center text-white'>
                                                18
                                            </div>

                                            <div className='border-[1px] border-black dark:border-white rounded-full w-[24px] h-[24px] p-1'>
                                                {form.watch("classificacao") === "18" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            )
                        }


                        {
                            etapa === 2 && (
                                <>
                                    <input type="file" accept="image/*" className="hidden" ref={ImgDetailRef}
                                        onChange={async (f) => {
                                            const file = f.target.files?.[0];
                                            setFileDetail_select(file ?? null);
                                            if (file !== undefined) {
                                                var base = await convertToBase64(file);
                                                if (base !== null)
                                                    setImgDetail_select(base.toString());
                                            }
                                        }} />
                                    <input type="file" accept="image/*" className="hidden" ref={ThumbRef}
                                        onChange={async (f) => {
                                            const file = f.target.files?.[0];
                                            if (file !== undefined) {
                                                var base = await convertToBase64(file);
                                                if (base !== null)
                                                    setThumb_select(base.toString());
                                            }
                                        }}
                                    />
                                    <div className='grid grid-cols-3 gap-4'>
                                        <div
                                            onClick={() => ImgDetailRef.current?.click()}
                                            className='flex cursor-pointer flex-col justify-center items-center col-span-2 h-[400px] w-full border-[1px] rounded-lg'>
                                            {
                                                imgDetail_select !== null && (
                                                    <img src={imgDetail_select} className='h-full w-full object-cover rounded-lg' />
                                                )
                                            }
                                            {
                                                imgDetail_select === null && (
                                                    <>
                                                        <MdImage className='text-4xl' />
                                                        <p>Foto detalhada do filme</p>
                                                    </>
                                                )
                                            }
                                        </div>
                                        <div
                                            onClick={() => ThumbRef.current?.click()}
                                            className='relative flex cursor-pointer flex-col justify-center items-center h-[400px] w-full border-[1px] rounded-lg'>

                                            {
                                                thumb_select !== null && (
                                                    <>
                                                        <img src={thumb_select} className='h-full w-full object-cover rounded-lg' />
                                                        <div className='absolute bottom-3'>
                                                            <Button onClick={() => {
                                                                setThumb_select(null);
                                                                if (ThumbRef.current !== null)
                                                                    ThumbRef.current.value = '';
                                                            }}>
                                                                <MdClose />
                                                            </Button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            {
                                                thumb_select === null && (
                                                    <>
                                                        <MdImage className='text-4xl' />
                                                        <p>Foto de thumb</p>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        }

                        {
                            load === true && (
                                <div className='mt-3'>
                                    <Progress value={loadContext.progress} />
                                    <p className='text-center'>{loadContext.text}</p>
                                </div>
                            )
                        }

                        <DialogFooter className='pt-10'>
                            <div className='flex justify-between w-full'>
                                <div className='flex gap-3 items-center'>
                                    <DialogClose asChild>
                                        <Button variant="outline" ref={buttonCloseRef} color="outline-white">
                                            Fechar
                                        </Button>
                                    </DialogClose>
                                    <div className='text-red'>
                                        {
                                            form.formState.errors.categoria?.message ||
                                            form.formState.errors.classificacao?.message ||
                                            form.formState.errors.descricao?.message ||
                                            form.formState.errors.nome?.message
                                        }
                                    </div>
                                </div>

                                <div className='space-x-2'>
                                    {
                                        etapa > 0 && (
                                            <Button variant="outline" type='button' onClick={() => {
                                                if (etapa > 0) {
                                                    setEtapa(e => e - 1)
                                                }
                                            }}>
                                                Voltar
                                            </Button>
                                        )
                                    }

                                    {
                                        etapa < 2 && (
                                            <Button type='button' onClick={() => {
                                                if (etapa <= 2) {
                                                    setEtapa(e => e + 1)
                                                }
                                            }} >
                                                Próximo
                                            </Button>
                                        )
                                    }
                                    <Button disabled={etapa < 2} load={load} color="red" type='submit' >
                                        Registrar filme
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalRegistrarFilme;

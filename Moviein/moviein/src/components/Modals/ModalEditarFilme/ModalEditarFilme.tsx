import { yupResolver } from '@hookform/resolvers/yup';
import ApiService from 'api/ApiService';
import { Button } from 'components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import resizeFile from '../../../helpers/resizeFile';
import convertToBase64 from 'helpers/convertToBase64';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { useToast } from 'components/ui/use-toast';

interface DetalheFilmeDTO_Res {
    caminhoImagem: string,
    classificacao: string,
    descricao: string,
    id: number,
    titulo: string
    thumb: string
    imagemDetalhada: string
    imageDetail: string
    categoria: string
}

type ModalEditarFilmeType = {
    filmeId: number
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean,
    UpdateChange: () => any
}
const EditarFilmeSheema = yup.object({
    id: yup.number(),
    nome: yup.string().required("É necessário inserir um nome."),
    descricao: yup.string().max(800, "a descrição ultrapassou de 255 caracteres."),
    classificacao: yup.string(),
    thumb: yup.string(),
    caminhoImagem: yup.string(),
    categoria: yup.string()
})

type EditarFilmeScheemaType = yup.InferType<typeof EditarFilmeSheema>;


var Api = new ApiService();
const ModalEditarFilme: React.FC<ModalEditarFilmeType> = (p) => {
    const ImgDetailRef = useRef<HTMLInputElement>(null);
    const [imgDetail_select_file, setImgDetail_select_file] = useState<File | null>(null);
    const [imgDetail_select, setImgDetail_select] = useState<string | null>(null);
    const ThumbRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();
    const form = useForm<EditarFilmeScheemaType>({
        resolver: yupResolver(EditarFilmeSheema),
        defaultValues: {
            nome: ""
        }
    })
    const [load, setLoad] = useState<boolean>(false);

    async function editar(data: EditarFilmeScheemaType) {
        setLoad(true);

        if (imgDetail_select_file !== null) {
            var formData = new FormData();
            formData.append("file", imgDetail_select_file);
            await Api.Post<null>({
                path: `api/filme/EditarImagem?filmeId=${data.id}`,
                errorTitle: "Falha ao editar imagem do vídeo.",
                data: formData,
                formData: true
            })
        }

        await Api.Post<null>({
            path: "api/filme/EditarVideo",
            data: {
                filmeId: data.id,
                nome: data.nome,
                descricao: data.descricao,
                classificacao: data.classificacao,
                categoria: data.categoria,
                thumb: data.thumb
            },
            errorTitle: "Falha ao editar vídeo",
            thenCallback: (data) => {
                toast({
                    title: "Vídeo editado com sucesso!",
                    className: "bg-success text-black"
                })
                p.setOpen(false);
                p.UpdateChange();
            },
        })
    }

    useEffect(() => {
        async function LoadDetailFilme() {
            Api.Get<DetalheFilmeDTO_Res>({
                path: `api/filme/DetalheFilme?FilmeId=${p.filmeId}`,
                errorTitle: "Falha ao coletar detalhe do filme",
                thenCallback: (r) => {
                    form.setValue("nome", r.titulo)
                    form.setValue("descricao", r.descricao)
                    form.setValue("classificacao", r.classificacao)
                    form.setValue("thumb", r.thumb)
                    form.setValue("caminhoImagem", r.caminhoImagem)
                    form.setValue("categoria", r.categoria)
                    form.setValue("id", r.id)
                    setImgDetail_select(r.caminhoImagem)
                }
            })
        }
        if (p.open) {
            LoadDetailFilme();
        }
    }, [p.open])

    return (
        <Dialog open={p.open} onOpenChange={p.setOpen}>
            <DialogContent className='min-w-[80%] min-h-[50%]'>
                <DialogHeader>
                    <DialogTitle>Upload do vídeo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(editar)} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='space-y-3'>
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do vídeo</FormLabel>
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
                                            <FormLabel>Descrição do vídeo</FormLabel>
                                            <FormControl>
                                                <Textarea rows={6} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                máximo 800 caracteres ({field.value?.length} / 800)
                                            </FormDescription>
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

                                <div className='grid grid-cols-3 justify-center gap-12 pt-6'>
                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "L")}>
                                        <div className='p-8 bg-success w-full rounded-md text-center'>
                                            L
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "L" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "10")}>
                                        <div className='p-8 bg-info text-dark w-full rounded-md text-center'>
                                            10
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "10" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "12")}>
                                        <div className='p-8 bg-warning text-dark w-full rounded-md text-center'>
                                            12
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "12" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "14")}>
                                        <div className='p-8 bg-orange text-dark w-full rounded-md text-center'>
                                            14
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "14" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "16")}>
                                        <div className='p-8 bg-red w-full rounded-md text-center'>
                                            16
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "16" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                    <div className='flex items-center flex-col space-y-4 cursor-pointer' onClick={() => form.setValue("classificacao", "18")}>
                                        <div className='p-8 bg-black w-full rounded-md text-center text-white'>
                                            18
                                        </div>

                                        <div className='border-[1px] border-white rounded-full w-[24px] h-[24px] p-1'>
                                            {form.watch("classificacao") === "18" && <div className='bg-primary rounded-full w-full h-full'></div>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='space-y-3'>
                                <input type="file" className="hidden" ref={ThumbRef}
                                    onChange={async (f) => {
                                        const file = f.target.files?.[0];
                                        if (file !== undefined) {
                                            var simple = await resizeFile(file, 640);
                                            form.setValue("thumb", simple as string);
                                        }
                                    }}
                                />
                                <input type="file" className="hidden" ref={ImgDetailRef}
                                    onChange={async (f) => {
                                        const file = f.target.files?.[0];
                                        if (file !== undefined) {
                                            var simple = await convertToBase64(file);
                                            console.log({ simple })
                                            setImgDetail_select(simple as string);
                                            setImgDetail_select_file(file);
                                        }
                                    }}
                                />
                                <div className='h-[200px] cursor-pointer w-[200px] relative rounded-lg overflow-hidden bg-black/25'
                                    onClick={() => {
                                        if (form.watch("thumb") === undefined) ThumbRef.current?.click()
                                    }}>
                                    {
                                        form.watch("thumb") !== undefined ? (
                                            <>
                                                <div className='flex gap-3 items-center absolute z-10 bottom-4 left-4'>
                                                    <Button onClick={() => form.setValue("thumb", undefined)}>
                                                        x
                                                    </Button>
                                                    <p>
                                                        Thumb
                                                    </p>
                                                </div>
                                                <img
                                                    className='h-full w-full object-cover'
                                                    src={form.watch("thumb")}
                                                />
                                            </>
                                        ) : (
                                            <div className='flex gap-3 items-center absolute z-10 bottom-4 left-4'>
                                                <p>
                                                    Thumb
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>
                                <hr className='opacity-25'></hr>
                                <div className='h-[340px] cursor-pointer w-[340px] relative rounded-lg overflow-hidden bg-black/25'
                                    onClick={() => {
                                        if (imgDetail_select === null) ImgDetailRef.current?.click()
                                    }}>
                                    {
                                        imgDetail_select !== null ? (
                                            <>
                                                <div className='flex gap-3 items-center absolute z-10 bottom-4 left-4'>
                                                    <Button type='button'
                                                        onClick={() => {
                                                            form.setValue("caminhoImagem", undefined);
                                                            setImgDetail_select_file(null);
                                                            setImgDetail_select(null);
                                                        }}>
                                                        x
                                                    </Button>
                                                    <p>
                                                        Imagem
                                                    </p>
                                                </div>
                                                {
                                                    imgDetail_select === null ? (
                                                        <img
                                                            className='h-full object-cover w-full'
                                                            src={form.watch("caminhoImagem")}
                                                        />
                                                    ) : (
                                                        <img
                                                            className='h-full object-cover w-full'
                                                            src={imgDetail_select}
                                                        />
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <div className='flex gap-3 items-center absolute z-10 bottom-4 left-4'>
                                                <p>
                                                    Imagem
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">
                                    fechar
                                </Button>
                            </DialogClose>
                            <Button type='submit' load={load}>
                                Editar vídeo
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default ModalEditarFilme;
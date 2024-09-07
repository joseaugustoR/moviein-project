import { DialogFooter, DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, } from '../../../components/ui/dialog';
import React, { useRef, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { MdImage } from 'react-icons/md';
import Api from '../../../api/api';
import Resizer from "react-image-file-resizer";
import { Button } from 'components/ui/button';
import { useToast } from 'components/ui/use-toast';


type ModalThumbnailType = {
    thumb?: string
    setValue: UseFormSetValue<any>
    email?: string
    reloadPerfil: () => any
}

const ModalThumbnail: React.FC<ModalThumbnailType> = (p) => {
    const [open, setOpen] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const ImageRef = useRef<HTMLInputElement>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [imageView, setImageView] = useState<string | null>(null);
    const {toast} = useToast();
    const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    async function changeFile(f: React.ChangeEvent<HTMLInputElement>) {
        const file = f.target.files?.[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            const base64 = await convertToBase64(file);
            // p.setValue("thumb", base64);
            setImageBlob(file);
            setImageView(base64!.toString());
        }
    }

    const resizeFile = (file: Blob) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                200,
                200,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });

    async function SaveImage() {
        if (p.thumb !== undefined) {
            setLoad(true);
            var image = await resizeFile(imageBlob!);
            const data = {
                thumb: image
            };
            try {
                var res = await Api.post("api/usuario/updateThumb", data);
                if (res.status === 200 || res.status === 204) {
                    setOpen(false);
                    setLoad(false);
                    p.reloadPerfil();
                    toast({
                        title: "imagem salva com sucesso!",
                        className: "bg-success text-black"
                    });
                }

            } catch (error) {
                setLoad(false);
            }
        }
    }

    return (
        <Dialog open={open} modal onOpenChange={(e) => {
            setOpen(e)
            setImageView(null)
        }}>
            <DialogTrigger asChild >
                <button onClick={() => setOpen(true)} className="w-[42px] flex justify-center items-center h-[42px] rounded-full bg-primary">
                    <MdImage />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alterar imagem</DialogTitle>
                    <input type="file" accept=".png,.jpg,.jpeg" onChange={(f) => changeFile(f)} className="hidden" ref={ImageRef} />
                    {
                        p.thumb !== undefined ? (
                            <div className='flex justify-center relative'>
                                <img alt="Alterar imagem"
                                    className="w-[400px] h-[400px] object-cover"
                                    src={imageView ? imageView : p.thumb} />
                                <button onClick={() => ImageRef.current?.click()} className='bg-background p-2 px-4 rounded-full absolute bottom-3'>
                                    substituir imagem
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    onClick={() => ImageRef.current?.click()}
                                    className="w-full cursor-pointer h-[300px] flex items-center justify-center">
                                    <MdImage className="text-[78px]" />
                                </div>
                            </>
                        )
                    }
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline" >
                        Fechar
                    </Button>
                    {
                        (p.thumb === undefined || p.thumb === null) ? (
                            <Button onClick={() => SaveImage()} load={load} >
                                Salvar thumb
                            </Button>
                        ) : (
                            <Button onClick={() => SaveImage()} load={load} >
                                Editar thumb
                            </Button>
                        )
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ModalThumbnail;
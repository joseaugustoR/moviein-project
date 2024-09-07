import { DialogTitle } from '@radix-ui/react-dialog';
import ApiService from 'api/ApiService';
import { Button } from 'components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from 'components/ui/dialog';
import { useToast } from 'components/ui/use-toast';
import React, { useState } from 'react';
import { MdCircle } from 'react-icons/md';

type ModalConfirmarRemocaoUsuarioType = {
    open: boolean
    usuarioId?: number
    setClose: () => any
    onChange: () => any
}

const api = new ApiService();
const ModalConfirmarRemocaoUsuario: React.FC<ModalConfirmarRemocaoUsuarioType> = (p) => {
    const { toast } = useToast();
    const [load, setLoad] = useState<boolean>(false);
    async function Remove() {
        setLoad(true);
        await api.Post<null>({
            path: "api/usuario/RemoverUsuario",
            data: {
                usuarioId: p.usuarioId
            },
            errorTitle: "Falha ao remover usuário",
            thenCallback: (r) => {
                p.setClose();
                toast({
                    title: "Removido com sucesso!",
                    className: "bg-success text-dark"
                })
                p.onChange();
            }
        })
        setLoad(false);
    }

    return (
        <Dialog modal open={p.open} onOpenChange={p.setClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remover usuário</DialogTitle>
                </DialogHeader>
                Deseja mesmo deletar o usuário?
                <div className='w-full flex items-center gap-3'>
                    <MdCircle />
                    O usuário não será possível logar dentro do sistema.
                </div>
                <DialogFooter className='gap-3'>
                    <DialogClose>
                        <Button variant="outline">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button variant="red" onClick={() => Remove()} load={load}>
                        Sim, remover usuário
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
}

export default ModalConfirmarRemocaoUsuario;
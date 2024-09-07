import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import React from 'react';


type ModalDesconectarType = {
    children: React.ReactNode
    onClick?: () => any
}

const ModalDesconectar: React.FC<ModalDesconectarType> = (p) => {

    function desconectar() {
        localStorage.clear();
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild onClick={p.onClick} className='cursor-pointer'>
                    {p.children}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Desconectar?</DialogTitle>
                        <div>
                            Deseja mesmo deslogar da conta?
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <>
                            <DialogClose>
                                <Button color="outline-white">
                                    Fechar
                                </Button>
                            </DialogClose>
                            <Button color="red" onClick={() => desconectar()}>
                                Sair da plataforma
                            </Button>
                        </>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModalDesconectar;
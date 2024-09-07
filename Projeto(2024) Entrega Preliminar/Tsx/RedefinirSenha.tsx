import { yupResolver } from '@hookform/resolvers/yup';
import Api from 'api/api';
import Button from 'components/Button';
import Input from 'components/Input/Input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'components/ui/input-otp';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
type redefine = { code: string , email: string};

const RedefinirSenhaSchreema = yup.object({
    senha: yup.string().required(),
    code: yup.string().required("Preenche o código de redefinição").min(5).max(5),
    confirmarSenha: yup.string().oneOf([yup.ref("senha")], "As senhas não coincidem.").required()
})

type RedefinirSenhaType = yup.InferType<typeof RedefinirSenhaSchreema>;

const RedefinirSenha: React.FC = () => {
    const { state } = useLocation();
    const [load, setLoad] = useState<boolean>(false);
    const { code, email } = state as redefine;
    const nav = useNavigate();
    const { register, formState: { errors }, handleSubmit, setValue, setError } = useForm({
        resolver: yupResolver(RedefinirSenhaSchreema)
    })

    
    async function submit(data: RedefinirSenhaType) {
        if (data.code !== code) {
            setError("code", { message: "Código inválido." });
        } else {
            setLoad(true);
            var req = {
                senha: data.senha,
                email: email
            }
            try {
                const res = await Api.post("api/usuario/resetPassword", req);
                if (res.status === 200) {
                    toast.success("Senha redefinida com sucesso!");
                    nav("/login");
                }
            } catch (error) {
                console.log(error);
            }
            setLoad(false);
        }
    }

    function changeOTP(data: string) {
        setValue("code", data);
    }

    return (
        <div className='bg-gradient-to-br flex justify-center items-center w-full h-screen from-primary to-redDark'>
            <div className='w-[80vh] h-[70vh] p-8 bg-dark rounded-xl'>
                <h2 className='text-xl'>Redefinir Senha</h2>
                <form className='mt-10' onSubmit={handleSubmit(submit)}>
                    <p>Insira um código de redefinição de senha</p>
                    <small className='opacity-50'>O código foio enviado em sua caixa de email</small>
                    <InputOTP onChange={changeOTP} maxLength={5} containerClassName={"opacity-100 border-white"}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                        </InputOTPGroup>
                    </InputOTP>
                    {errors && <small className='text-redDark'>{errors.code?.message}</small>}
                    <hr className='my-8' />
                    <Input<RedefinirSenhaType> register={register}
                        Titulo='Senha'
                        field='senha'
                        fieldErrors={errors}
                    />
                    <Input<RedefinirSenhaType> register={register}
                        Titulo='Confirmar senha'
                        field='confirmarSenha'
                        fieldErrors={errors}
                    />
                    <div className='mt-4 flex justify-end gap-4'>
                        <Button titulo='Voltar'
                            color="outline-white"
                            onClick={() => nav(-1)}
                            type='button'
                        />
                        <Button titulo='Redefinir senha'
                            type='submit'
                            loading={load}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RedefinirSenha;
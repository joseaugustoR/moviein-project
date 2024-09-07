import { yupResolver } from '@hookform/resolvers/yup';
import ApiService from 'api/ApiService';
// import Api from 'api/api';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'components/ui/input-otp';
import { useToast } from 'components/ui/use-toast';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
type redefine = { code: string, email: string };

const Api = new ApiService();
const RedefinirSenhaSchreema = yup.object({
    senha: yup.string().required("Preenche a senha"),
    code: yup.string().required("Preenche o código de redefinição")
        .min(5, "código necessita de 5 números")
        .max(5, "código necessita de 5 números"),
    confirmarSenha: yup.string()
        .oneOf([yup.ref("senha")], "As senhas não coincidem.")
        .required("Preenche a confirmação de senha")
})

type RedefinirSenhaType = yup.InferType<typeof RedefinirSenhaSchreema>;

const RedefinirSenha: React.FC = () => {
    const { state } = useLocation();
    const { code, email } = state as redefine;
    const [load, setLoad] = useState<boolean>(false);
    const { toast } = useToast();
    const nav = useNavigate();
    const form = useForm({
        resolver: yupResolver(RedefinirSenhaSchreema)
    })


    async function submit(data: RedefinirSenhaType) {
        if (data.code !== code) {
            form.setError("code", { message: "Código inválido." });
        } else {
            setLoad(true);
            var req = {
                senha: data.senha,
                email: email
            }

            await Api.Post<null>({
                data: req,
                path: "api/usuario/resetPassword",
                errorTitle: "Falha ao redefinir senha",
                thenCallback(s) {
                    toast({
                        title: "Senha redefinida com sucesso!",
                        duration: 2000,
                        className: "bg-success text-background"
                    });
                    nav("/login");
                }
            })
        }
    }

    function changeOTP(data: string) {
        form.setValue("code", data);
    }

    return (
        <div className='bg-gradient-to-br flex justify-center items-center w-full h-screen from-primary to-red'>
            <div className='w-[80vh] h-[70vh] p-8 bg-card rounded-xl'>
                <h2 className='text-xl'>Redefinir Senha</h2>
                <Form {...form}>
                    <form className='mt-10' onSubmit={form.handleSubmit(submit)}>
                        <p>Insira um código de redefinição de senha</p>
                        <small className='opacity-50'>O código foi enviado em sua caixa de email</small>
                        <InputOTP onChange={changeOTP} maxLength={5} containerClassName={"opacity-100 border-white"}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                            </InputOTPGroup>
                        </InputOTP>
                        {form.formState.errors && <small className='text-red'>{form.formState.errors.code?.message}</small>}
                        <hr className='my-8' />
                        <FormField
                            control={form.control}
                            name='senha'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmarSenha'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar senha</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <Input<RedefinirSenhaType> register={register}
                        Titulo='Senha'
                        field='senha'
                        fieldErrors={errors}
                        />
                        <Input<RedefinirSenhaType> register={register}
                        Titulo='Confirmar senha'
                        field='confirmarSenha'
                        fieldErrors={errors}
                    /> */}
                        <div className='mt-4 flex justify-end gap-4'>
                            <Button color="outline-white" onClick={() => nav(-1)} type='button'>
                                Voltar
                            </Button>
                            <Button type='submit' load={load}>
                                Redefinir senha
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default RedefinirSenha;
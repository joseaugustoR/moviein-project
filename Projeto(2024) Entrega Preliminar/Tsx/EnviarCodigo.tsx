import { yupResolver } from '@hookform/resolvers/yup';
import Api from 'api/api';
import { AxiosError } from 'axios';
import Button from 'components/Button';
import Input from 'components/Input/Input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const EnviarSenhaSchreema = yup.object({
  email: yup.string().required("Insira o seu email").email("Email inválido")
})

type EnviarSenhaType = yup.InferType<typeof EnviarSenhaSchreema>;

const EnviarCodigo: React.FC = () => {
  const nav = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(EnviarSenhaSchreema)
  })
  const [loadred, setLoadred] = useState<boolean>(false);

  async function submit(data: EnviarSenhaType) {
    setLoadred(true);
    try {
      const res = await Api.post<{ code: string }>("api/usuario/resetPasswordCode", data);
      if (res.status === 200) {
        toast.info("Enviamos um código de redefinição de senha em sua caixa de email.");
        nav("/RedefinirSenha", { state: { code: res.data.code, email: data.email } });
      }
    } catch (err) {
      var error = err as AxiosError<{erro: string}>;
      toast.error(error.response?.data.erro as string);
    }
    setLoadred(false);
  }

  return (
    <div className='bg-gradient-to-br flex justify-center items-center w-full h-screen from-primary to-redDark'>
      <div className='w-[80vh] p-8 bg-background rounded-xl'>
        <h2 className='text-xl'>Redefinir Senha</h2>
        <form className='mt-10' onSubmit={handleSubmit(submit)}>
          <Input<EnviarSenhaType> register={register}
            Titulo='Email'
            field='email'
            fieldErrors={errors}
          />
          <div className='mt-4 flex justify-end gap-4'>
            <Button titulo='Cancelar'
              type='button'
              color='outline-white'
              onClick={() => nav(-1)}
            />
            <Button titulo='Enviar código de redefinição'
              type='submit'
              loading={loadred}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnviarCodigo;
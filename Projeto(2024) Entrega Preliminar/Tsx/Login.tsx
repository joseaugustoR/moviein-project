import React, { useState } from 'react';
import filmes from '../../assets/filme.png';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginSchreema, { LoginSchreemaType } from './LoginSchreema';
import { MdEmail, MdOutlinePassword } from 'react-icons/md';
import Input from '../../components/Input/Input';
import Button from '../../components/Button';
import { AxiosError } from 'axios';
import Api from '../../api/api';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const nav = useNavigate();
  const [load, setLoad] = useState<boolean>(false);
  const { register, formState: { errors }, handleSubmit } = useForm<LoginSchreemaType>({
    resolver: yupResolver(LoginSchreema)
  })

  type LoginDTO_Res = {
    token: string,
    funcao: string
    exp: number
    expiracao: Date
  }

  async function LoginEntrar(data: LoginSchreemaType) {
    setLoad(true);
    try {
      var e = await Api.post<LoginDTO_Res>("/api/usuario/login", data);
      if (e.status === 200 || e.status === 204) {
        window.localStorage.setItem("token", e.data.token);
        window.localStorage.setItem("funcao", e.data.funcao);
        window.localStorage.setItem("exp", e.data.expiracao.toString());
        setLoad(false);
        nav("/a/")
      }
    } catch (error) {
      setLoad(false);
      var errorData = error as AxiosError<{ mensagem: string }>;
      toast.error(errorData.response?.data.mensagem);
    }
  }

  return (
    <div className='relative w-full h-screen'>
      <img src={filmes} alt='Filmes' className='absolute w-full h-screen object-cover -z-10' />
      <div className='container mx-auto'>
        <div className='grid md:grid-cols-2 grid-cols-1 h-screen'>
          <div className='md:col-start-2'>
            <div className='py-12 h-full'>
              <div className='bg-background rounded-md p-8 flex flex-col h-full relative'>
                <div className='mb-4'>
                  <img src={logo} alt='Moviein' className='w-[120px]' />
                </div>
                <div className='mb-20'>
                  <h2 className='text-4xl mb-2 text-text'>Fazer login</h2>
                  <div className='flex gap-1'>
                    <p className='text-text'>Novo usuário?</p>
                    <p onClick={() => nav("/registro")} className='text-primary ml-1 cursor-pointer underline  decoration-slice'>Crie uma conta</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit(LoginEntrar)}>
                  <Input<LoginSchreemaType>
                    Icon={<MdEmail />}
                    Titulo='Email'
                    Type='email'
                    field="email"
                    fieldErrors={errors}
                    register={register} />
                  <Input<LoginSchreemaType>
                    Icon={<MdOutlinePassword />}
                    Titulo='Senha'
                    Type='password'
                    field="senha"
                    fieldErrors={errors}
                    register={register}
                  />
                  <div className='flex gap-4 mt-4 justify-end'>
                    {/* <input type='submit' value="Entrar" className='w-full cursor-pointer py-3 px-6 text-white bg-primary rounded-lg ' /> */}
                    <Button
                      type="submit"
                      titulo='Entrar'
                      className='w-full'
                      loading={load}
                    />
                  </div>
                </form>
                <div className='mt-6 flex gap-1'>
                  <p className='text-text'>Esqueceu sua senha?</p>
                  <p className='text-primary cursor-pointer underline decoration-slice' onClick={() => nav("/enviarCodigo")}>Redefine aqui</p>
                </div>

                <div className='mt-6'>
                  <p className='text-white cursor-pointer underline decoration-slice absolute bottom-4 right-4'>Termos de uso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
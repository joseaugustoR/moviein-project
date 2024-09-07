import React, { useState } from 'react';
import filmes from '../../assets/filme.png';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginSchreema, { LoginSchreemaType } from './LoginSchreema';
// import Input from '../../components/Input/Input';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import ApiService from 'api/ApiService';
import LoginDTO_Res from 'models/LoginDTO_Res';

var Api = new ApiService();
const Login: React.FC = () => {
  const nav = useNavigate();
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<LoginSchreemaType>({
    resolver: yupResolver(LoginSchreema)
  })

  async function LoginEntrar(data: LoginSchreemaType) {
    setLoad(true);
    await Api.Post<LoginDTO_Res>({
      errorTitle: "Falha no login!",
      data: data,
      path: "/api/usuario/login",
      thenCallback: (d) => {
        if(d.token) window.localStorage.setItem("token", d.token);
        if(d.funcao) window.localStorage.setItem("funcao", d.funcao);
        if(d.expiracao) window.localStorage.setItem("exp", d.expiracao.toString());
        
        if(d.autenticacao2fatores) {
          nav("/doisfatores", { state: { code: d.code, email: form.getValues("email") } })
        } else {
          nav("/a/")
        }
        setLoad(false);
      },
      catchCallback: () =>{
        setLoad(false);
      }
    })
  }

  return (
    <div className='relative w-full h-screen'>
      <img src={filmes} alt='Filmes' className='absolute w-full h-screen object-cover' />
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
                <Form {...form}>
                  <form className='gap-4 flex flex-col'
                    onSubmit={form.handleSubmit(LoginEntrar)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel >Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="senha"
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

                    <div className='flex gap-4 mt-4 justify-end'>
                      <Button type="submit" className='w-full' load={load}>
                        Entrar
                      </Button>
                    </div>
                  </form>
                </Form>
                <div className='mt-6 flex gap-1'>
                  <p className='text-text'>Esqueceu sua senha?</p>
                  <p className='text-primary cursor-pointer underline decoration-slice' onClick={() => nav("/enviarCodigo")}>Redefine aqui</p>
                </div>
                <div className='mt-6'>
                  {/* <p className='text-white cursor-pointer underline decoration-slice absolute bottom-4 right-4'>Termos de uso</p> */}
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
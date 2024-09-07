import React, { useEffect, useState } from 'react';
import filmes from '../../assets/filme.png';
import logo from '../../assets/logo.png';
// import Input from '../../components/Input/Input';
import { yupResolver } from "@hookform/resolvers/yup"

import { useForm } from 'react-hook-form';
import RegistroUsuarioScheema, { RegistroUsuario } from './RegisterScheema';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/api';
import { AxiosError } from 'axios';
import EnderecoCEPModel from '../../models/EnderecoCEPModel';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { MdSearch } from 'react-icons/md';
import { useToast } from 'components/ui/use-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(false);
  const [loadCEP, setLoadCEP] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<RegistroUsuario>({
    resolver: yupResolver(RegistroUsuarioScheema),
    defaultValues: {
      etapa: 0,
      // nomeMaterno: "teste",
      // telefone: "123",
      // dataNascimento: "2024-06-20",
      // cpf: "22222222222",
      // genero: "M",
      // nomeCompleto: "teste",
      // bairro: "teste",
      // cep: "77777777",
      // cidade: "teste",
      // complemento: "teste",
      // confirmarSenha: "123",
      // email: "eduardo14rj@gmail.com",
      // estado: "teste",
      // numero: "1",
      // pais: "teste",
      // senha: "123",
    }
  });

  const [etapa, setEtapa] = useState<number>(0);
  const EtapaState =
    etapa === 0 ? "w-0" : (
      etapa === 1 ? "w-[50%]" : (
        etapa === 2 ? "w-full" : "w-0"
      ));

  useEffect(() => {
    form.setValue("etapa", etapa);
  }, [etapa, form])

  async function CEPEndereco() {
    try {
      setLoadCEP(true);
      var cep = form.getValues("cep");
      var enderecos = await Api.get<EnderecoCEPModel>(`https://viacep.com.br/ws/${cep}/json/`);
      if (enderecos.status === 200 || enderecos.status === 204) {
        setLoadCEP(false);
        form.setValue("bairro", enderecos.data.bairro);
        form.setValue("estado", enderecos.data.uf);
        form.setValue("complemento", enderecos.data.complemento);
        form.setValue("cidade", enderecos.data.localidade);
      }
      if (
        enderecos.data?.bairro === undefined &&
        enderecos.data?.complemento === undefined &&
        enderecos.data?.localidade === undefined &&
        enderecos.data?.logradouro === undefined
      ) {

        // "Endereço do CEP não encontrado.", {
        //   position: "bottom-center",
        //   autoClose: 2000
        // }
        toast({
          title: "Endereço do CEP não encontrado.",
          duration: 2000,
          className: "bg-red"
        })
      }
    } catch (err) {
      setLoadCEP(false);
      toast({
        title: "CEP inválido",
        className: "bg-danger "
      })
    }
  }

  function LimparCampos() {

    switch (etapa) {
      case 0:
        form.reset({
          nomeCompleto: "",
          nomeMaterno: "",
          dataNascimento: "",
          telefone: "",
          cpf: "",
          genero: ""
        })
        break;
      case 1:
        form.reset({
          cep: "",
          pais: "",
          estado: "",
          cidade: "",
          bairro: "",
          numero: "",
          complemento: ""
        })
        break;
      case 2:
        form.reset({
          email: "",
          senha: "",
          confirmarSenha: ""
        })
        break;
    }
  }

  const VoltarEtapa = () => {
    switch (etapa) {
      case 0: navigate("/login")
        break;
      case 1: setEtapa(0)
        break;
      case 2: setEtapa(1)
        break;
    }
  }

  async function RegistrarUsuario(data: RegistroUsuario) {
    switch (etapa) {
      case 0: setEtapa(1)
        break;
      case 1: setEtapa(2)
        break;
      case 2:
        try {

          setLoad(true)
          const { etapa, ...iss } = data;
          var res = await Api.post("/api/usuario/registro", iss)
          setLoad(false);
          if (res.status === 200 || res.status === 201) {
            toast({
              title: "Usuário criado com sucesso!",
              className: "bg-success text-black"
            })
            navigate("/login");
          }
        } catch (error) {
          const d = error as AxiosError<{ message: string }>;
          toast({
            title: d.response?.data.message,
            duration: 10000,
            className: "bg-red text-text"
          })
          setLoad(false)
        }
        break;
    }
    if (etapa === 0)
      setEtapa(1);
  }

  return (
    <div className='relative w-full h-screen'>
      <img src={filmes} alt='Filmes' className='absolute w-full h-screen object-cover' />
      <div className='container mx-auto pt-8 relative z-10'>
        <div className='bg-card p-8 rounded-lg'>
          <div className='flex justify-center mb-3'>
            <img src={logo} alt='Logo' className='w-[80px]' />
          </div>
          {/* Etapas */}
          <div className='relative flex justify-between mx-4'>
            <div className='flex flex-col items-center relative'>
              <div className='w-8 h-8 rounded-full bg-primary z-10'></div>
              <p className='text-white  absolute top-12 z-10 text-center'>Dados pessoais</p>
            </div>
            <div className='flex flex-col items-center'>
              <div className={`w-8 h-8 rounded-full z-10 ${etapa >= 1 ? "bg-primary" : "bg-primary/50"}`}></div>
              <p className='text-white absolute top-12 z-10'>Endereço</p>
            </div>

            <div className='h-3 w-full bg-dark overflow-hidden top-[50%] translate-y-[-50%] absolute rounded-full'>
              <div className={`h-full ${EtapaState} bg-primary`}>
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <div className={`w-8 h-8 rounded-full z-10 ${etapa >= 2 ? "bg-primary" : "bg-primary/50"}`}></div>
              <p className='text-white z-10 absolute bottom-2 w-[max-content] text-center top-12'>Dados de <br /> acesso</p>
            </div>
          </div>
          {/*  */}

          {/* Formulário: Etapa 1 */}

          <div className='mt-20'>
            <Form {...form}>
              <form className='gap-4 flex flex-col'
                onSubmit={form.handleSubmit(RegistrarUsuario)}>
                {
                  etapa === 0 && (
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name="nomeCompleto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nomeMaterno"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome materno</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de nascimento</FormLabel>
                            <FormControl>
                              <Input {...field} type='date' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone (DDD)</FormLabel>
                            <FormControl>
                              <Input {...field} type='tel' maxLength={11} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={11} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gênero</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value='M'>Masculino</SelectItem>
                                  <SelectItem value='F'>Feminino</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )
                }
                {
                  etapa === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <div className='flex space-x-4'>
                              <FormControl>
                                <Input {...field} type='number' />
                              </FormControl>
                              <Button type='button' load={loadCEP} onClick={() => CEPEndereco()}>
                                <MdSearch className='text-white' />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <hr className='border-white/30' />
                      <div className='grid grid-cols-2 gap-5'>
                        <FormField
                          control={form.control}
                          name="pais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="estado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bairro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bairro</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="complemento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )
                }

                {
                  etapa === 2 && (
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type='email' />
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
                      <FormField
                        control={form.control}
                        name="confirmarSenha"
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
                    </div>
                  )
                }

                <div className='mt-4 flex justify-between'>
                  <Button onClick={() => LimparCampos()} variant="red" type='button' >
                    Limpar
                  </Button>
                  <div className='flex gap-4'>
                    <Button type='button' variant="outline" onClick={() => VoltarEtapa()}>
                      {etapa === 0 ? "Voltar ao login" : "Voltar"}
                    </Button>
                    <Button load={load} type="submit">
                      Próximo
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>

        </div>
      </div >
    </div >
  );
}

export default Register;
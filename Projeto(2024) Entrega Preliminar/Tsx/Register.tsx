import React, { useEffect, useState } from 'react';
import filmes from '../../assets/filme.png';
import logo from '../../assets/logo.png';
import Input from '../../components/Input/Input';
import { yupResolver } from "@hookform/resolvers/yup"

import { useForm } from 'react-hook-form';
import { MdCalendarMonth, MdEmail, MdKey, MdSearch } from 'react-icons/md';
import Select from '../../components/Input/Select';
import RegistroUsuarioScheema, { RegistroUsuario } from './RegistroUsuarioScheema';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import EnderecoCEPModel from '../../models/EnderecoCEPModel';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(false);
  const [loadCEP, setLoadCEP] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, setValue, getValues, resetField, watch } = useForm<RegistroUsuario>({
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
    setValue("etapa", etapa);
  }, [etapa, setValue])

  async function CEPEndereco() {
    try {
      setLoadCEP(true);
      var cep = getValues("cep");
      var enderecos = await Api.get<EnderecoCEPModel>(`https://viacep.com.br/ws/${cep}/json/`);
      if (enderecos.status === 200 || enderecos.status === 204) {
        setLoadCEP(false);
        setValue("bairro", enderecos.data.bairro);
        setValue("estado", enderecos.data.uf);
        setValue("complemento", enderecos.data.complemento);
        setValue("cidade", enderecos.data.localidade);
      }
      if (
        enderecos.data?.bairro === undefined &&
        enderecos.data?.complemento === undefined &&
        enderecos.data?.localidade === undefined &&
        enderecos.data?.logradouro === undefined
      ) {
        toast.warning("Endereço do CEP não encontrado.", {
          position: "bottom-center",
          autoClose: 2000
        })
      }
    } catch (err) {
      setLoadCEP(false);
      toast.error("CEP inválido", {
        position: "bottom-center"
      })
    }
  }

  function LimparCampos() {
    switch (etapa) {
      case 0:
        resetField("nomeCompleto");
        resetField("nomeMaterno");
        resetField("dataNascimento");
        resetField("telefone");
        resetField("cpf");
        resetField("genero");
        break;
      case 1:
        resetField("cep");
        resetField("pais");
        resetField("estado");
        resetField("cidade");
        resetField("bairro");
        resetField("numero");
        resetField("complemento");
        break;
      case 2:
        resetField("email");
        resetField("senha");
        resetField("confirmarSenha");
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
            toast.success("Usuário criado com sucesso!", {
              position: "bottom-center"
            })
            navigate("/login");
          }
        } catch (error) {
          const d = error as AxiosError<{ message: string }>;
          toast.error(d.response?.data.message, {
            position: "bottom-center",
            autoClose: 10000
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
      <img src={filmes} alt='Filmes' className='absolute w-full h-screen object-cover -z-10' />
      <div className='container mx-auto pt-8'>
        <div className='bg-dark p-8 rounded-lg'>
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
            <form onSubmit={handleSubmit(RegistrarUsuario)}>
              {
                etapa === 0 && (
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <Input<RegistroUsuario>
                      fieldErrors={errors}
                      register={register}
                      field='nomeCompleto'
                      Titulo='Nome completo' />
                    <Input<RegistroUsuario>
                      fieldErrors={errors}
                      register={register}
                      field='nomeMaterno'
                      Titulo='Nome materno' />
                    <Input<RegistroUsuario>
                      fieldErrors={errors}
                      register={register}
                      Icon={<MdCalendarMonth />}
                      Type='date'
                      field='dataNascimento'
                      Titulo='Data de nascimento' />
                    <Input<RegistroUsuario>
                      fieldErrors={errors}
                      register={register}
                      field='telefone'
                      Titulo='Telefone com DDD' />
                    <Input<RegistroUsuario>
                      fieldErrors={errors}
                      register={register}
                      field='cpf'
                      Titulo='CPF' />
                    <Select<RegistroUsuario>
                      register={register}
                      fieldErrors={errors}
                      field='genero'
                      options={[
                        { nome: "Masculino", valor: "M" },
                        { nome: "Feminino", valor: "F" }
                      ]}
                      placeholder='Selecione um gênero'
                      Titulo='Gênero' />
                  </div>
                )
              }
              {
                etapa === 1 && (
                  <>
                    <div className='flex justify-between items-start gap-3'>
                      <div className='w-full'>
                        <Input<RegistroUsuario>
                          Titulo='CEP'
                          field="cep"
                          fieldErrors={errors}
                          register={register}
                        />
                      </div>
                      <div className='relative'>
                      <p className='text-white mb-2 opacity-0'>.</p>
                        <Button
                          disabled={watch("cep")?.length !== 8}
                          icon={<MdSearch className='text-white' />}
                          loading={loadCEP}
                          onClick={() => CEPEndereco()} />
                      </div>
                    </div>
                    <hr className='border-white/30' />
                    <div className='mt-3 grid grid-cols-2 gap-4'>
                      <Input<RegistroUsuario>
                        Titulo="País"
                        field="pais"
                        fieldErrors={errors}
                        register={register} />
                      <Input<RegistroUsuario>
                        Titulo="Estado"
                        field="estado"
                        fieldErrors={errors}
                        register={register} />
                      <Input<RegistroUsuario>
                        Titulo="Cidade"
                        field="cidade"
                        fieldErrors={errors}
                        register={register} />
                      <Input<RegistroUsuario>
                        Titulo="Bairro"
                        field="bairro"
                        fieldErrors={errors}
                        register={register} />
                      <Input<RegistroUsuario>
                        Titulo="Número"
                        field="numero"
                        Type="number"
                        fieldErrors={errors}
                        register={register} />
                      <Input<RegistroUsuario>
                        Titulo="Complemento"
                        field="complemento"
                        fieldErrors={errors}
                        register={register} />
                    </div>
                  </>
                )
              }

              {
                etapa === 2 && (
                  <div>
                    <Input<RegistroUsuario>
                      Titulo='Email'
                      Icon={<MdEmail />}
                      field='email'
                      fieldErrors={errors}
                      register={register}
                      Type='email' />
                    <Input<RegistroUsuario>
                      Titulo="Senha"
                      Icon={<MdKey />}
                      field="senha"
                      fieldErrors={errors}
                      register={register}
                      Type='password'
                    />
                    <Input<RegistroUsuario>
                      Titulo="Confirmar senha"
                      Icon={<MdKey />}
                      field="confirmarSenha"
                      fieldErrors={errors}
                      register={register}
                      Type='password'
                    />
                  </div>
                )
              }

              <div className='mt-4 flex justify-between'>
                <Button titulo='Limpar'
                  onClick={() => LimparCampos()}
                  color="outline-red" type='button' />
                <div className='flex gap-4'>
                  <Button
                    titulo={etapa === 0 ? "Voltar ao login" : "Voltar"}
                    type='button'
                    color="outline-white"
                    onClick={() => VoltarEtapa()}
                  />
                  <Button
                    titulo='Próximo'
                    loading={load}
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>

        </div>
      </div >
    </div >
  );
}

export default Register;
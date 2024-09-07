import * as yup from 'yup';

const RegistroUsuarioScheema = yup
    .object({
        etapa: yup.number(),
        //scheema etapa 1
        nomeCompleto: yup.string().required("O campo 'Nome Completo' é obrigatório."),
        dataNascimento: yup.string().required("O campo 'Data de nascimento' é obrigatório."),
        cpf: yup.string()
            .max(11, "O CPF precisa ter 11 dígitos.")
            .min(11, "O CPF precisa ter 11 dígitos."),
        nomeMaterno: yup.string(),
        telefone: yup.string().required("Preenche o telefone"),
        genero: yup.string().required("Selecione um gênero."),

        //scheema etapa 2

        cep: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 1)
                return scheema.required("Preenche o campo 'CEP'")
                    .min(8, "O cep precisa ter 8 dígitos")
                    .max(8, "O cep precisa ter 8 dígitos")
            return scheema
        }),
        pais: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 1)
                return scheema.required("Preenche o campo 'Pais'")
            return scheema
        }),
        estado: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 1)
                return scheema.required("Preenche o campo 'Estado'")
            return scheema
        }),
        cidade: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 1)
                return scheema.required("Preenche o campo 'cidade'")
            return scheema
        }),
        bairro: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 1)
                return scheema.required("Preenche o campo 'Bairro'")
            return scheema
        }),
        numero: yup.string(),
        complemento: yup.string(),

        //schreema etapa 3

        email: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 2)
                return scheema.required("Preenche o campo 'Email'").email("Formato de email inválido.")
            return scheema
        }),
        senha: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 2)
                return scheema.required("Insira sua senha")
            return scheema
        }),
        confirmarSenha: yup.string().when("etapa", (etp, scheema) => {
            if (etp[0] === 2)
                return scheema.required("Preenche o campo 'Email'").oneOf([yup.ref("senha")], "As senhas não coincidem.")
            return scheema
        }),
    })

export type RegistroUsuario = yup.InferType<typeof RegistroUsuarioScheema>;

export default RegistroUsuarioScheema;

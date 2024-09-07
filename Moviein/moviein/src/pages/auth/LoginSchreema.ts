import * as yup from 'yup';

const LoginSchreema = yup
.object({
    email: yup.string().required("Insere o email").email("Insira um email válido."),
    senha: yup.string().required("Insere a senha")
});

export type LoginSchreemaType = yup.InferType<typeof LoginSchreema>;

export default LoginSchreema;
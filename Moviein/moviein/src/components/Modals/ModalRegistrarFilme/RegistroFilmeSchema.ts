import * as yup from 'yup'


const RegistroFilmeSchema = yup.object({
    nome: yup.string().required("Preenche o nome do filme"),
    descricao: yup.string(),
    classificacao: yup.string(),
    categoria: yup.string().required("Selecione uma categoria.")
})

export type RegistroFilmeSchemaType = yup.InferType<typeof RegistroFilmeSchema>;

export default RegistroFilmeSchema;
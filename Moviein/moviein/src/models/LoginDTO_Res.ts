type LoginDTO_Res = {
    token?: string,
    funcao?: string
    exp?: number
    expiracao?: Date
    autenticacao2fatores: boolean
    code?: string
  }

  export default LoginDTO_Res;
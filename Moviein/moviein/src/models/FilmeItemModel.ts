interface FilmeItem {
    nome: string,
    id: number,
    thumb: string
    classificacaoAssinantes: number

    updateChange: () => any
}

export default FilmeItem;
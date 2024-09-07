import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Confirma: React.FC = () => {
    const navigate = useNavigate();
    const [numeroAleatorio, setNumeroAleatorio] = useState<number | null>(null);
    const handlePrint = () => {
        window.print();
    };
    const goBack = () => {
        navigate(-1);
    }

    const atualizarData = () => {
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleString();
        const dataContainer = document.getElementById('data-container');
        if (dataContainer) {
            dataContainer.textContent = "Data: " + dataFormatada;
        }
    };

    useEffect(() => {
        atualizarData();
    }, []);

    useEffect(() => {
        const numero = gerarNumeroAleatorio(100000, 1000000);
        setNumeroAleatorio(numero);
    }, []);

    const gerarNumeroAleatorio = (min: number, max: number): number => {
        const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
        const paragrafoNumeroAleatorio = document.getElementById('numero-aleatorio');
        if (paragrafoNumeroAleatorio) {
            paragrafoNumeroAleatorio.textContent = "ID da Transação: " + numeroAleatorio;
        }
        return numeroAleatorio;
    };



    return (
        <div className="bg-gradient-to-b from-purple-600 to-black min-h-screen flex flex-col justify-center items-center font-poppins text-white">
            <div className="confirmation-container max-w-md mx-auto p-8 rounded-lg shadow-lg bg-gray-900">
                <h1 className="text-green-500 text-3xl mb-4">Pagamento Confirmado</h1>
                <p className="mb-4">Seu pagamento foi realizado com sucesso!</p>
                <div className="details mb-4">
                    <p><strong className="font-bold">Tipo de assinatura:</strong> Mensal</p>
                    <p><strong className="font-bold">Valor:</strong> R$ 18,00</p>
                    <p><strong className="font-bold">Nome do assinante:</strong> {/* link com o banco de dados */}</p>
                    <p><strong className="font-bold">CPF:</strong> {/* link com o banco de dados */}</p>
                    <p className="data-container text-lg font-bold" id="data-container"></p>
                    <p id="numero-aleatorio" className="mb-4 font-bold">ID da Transação:</p>
                </div>
                <div className='flex justify-between'>
                <button onClick={handlePrint} className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800">Imprimir Recibo</button>
                <button type="button" onClick={goBack} className="voltar bg-gray-900 text-white px-6 py-2 rounded-lg border border-gray-600 hover:bg-gray-700">
                    Voltar
                    <span className="ml-1">&#8620;</span>
                </button>
                </div>
            </div>
        </div>
    );
};

export default Confirma;
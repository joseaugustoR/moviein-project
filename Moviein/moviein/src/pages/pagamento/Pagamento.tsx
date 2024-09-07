import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import moviein from '../../assets/logo.png';

const Pagamento: React.FC = () => {
      const nav=useNavigate()
      useEffect(() => {
        const cvvInput = document.getElementById('cvv') as HTMLInputElement;
        cvvInput.addEventListener('input', function (e: Event) {
          this.value = this.value.replace(/[^0-9]/g, '');
        });
        cvvInput.addEventListener('input', function (e: Event) {
          if (this.value.length > 3) {
            this.value = this.value.slice(0, 3);
          }
        });
    
        const cartaoInput = document.getElementById('cartao') as HTMLInputElement;
        cartaoInput.addEventListener('input', function (e: Event) {
          if (this.value.length > 19) {
            this.value = this.value.slice(0, 19);
          }
        });
        cartaoInput.addEventListener('input', function (e: Event) {
          this.value = this.value.replace(/[^0-9- --]/g, '');
        });
    
        const nomeInput = document.getElementById('nome') as HTMLInputElement;
        nomeInput.addEventListener('input', function (e: Event) {
          this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
      }, []);

      return (
        <html lang="en">
          <head>
            <link rel="stylesheet" href="" />
            <link rel="icon" href="../../../build/favicon.ico" />
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Tela de Pagamento</title>
          </head>
          <body className="bg-gradient-to-b from-purple-700 to-black h-screen absolute inset-0 font-poppins">
            <div className="container mx-auto w-2/4 my-20 p-10 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center justify-between">
              <img src={moviein} alt="Logo" className="Logo w-24" />
              <h2 className="text-white mb-4 text-2xl">Tela de Pagamento</h2>
              <form>
                <div className="form-group mb-5 max-w-md">
                  <label htmlFor="nome" className="block font-bold mb-1 text-white">
                    Nome do Titular:
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="nome completo"
                    required
                    className="input bg-gray-800 rounded-lg border px-4 py-2"
                  />
                </div>
                <div className="form-group mb-5 max-w-md">
                  <label htmlFor="cartao" className="block font-bold mb-1 text-white">
                    Número do Cartão:
                  </label>
                  <input
                    type="text"
                    id="cartao"
                    name="cartao"
                    placeholder="**** **** **** ****"
                    required
                    className="input bg-gray-800 rounded-lg border px-4 py-2"
                  />
                </div>
                <div className="form-group mb-5 max-w-md">
                  <label htmlFor="validade" className="block font-bold mb-1 text-white">
                    Data de Validade:
                  </label>
                  <input
                    type="date"
                    id="validade"
                    name="validade"
                    placeholder="MM/AA"
                    required
                    className="input bg-gray-800 rounded-lg border px-12 py-2"
                  />
                </div>
                <div className="form-group mb-5 max-w-md">
                  <label htmlFor="cvv" className="block font-bold mb-1 text-white">
                    CVV:
                  </label>
                  <input
                    type="number"
                    id="cvv"
                    name="cvv"
                    placeholder="***"
                    required
                    className="input bg-gray-800 rounded-lg border px-4 py-2"
                  />
                </div>
                <div className='flex justify-between'>
                <button type="button" id="pagar" className="btn-submit rounded-lg border px-4 py-2 bg-purple-600">
                  <a href='https://sandbox.asaas.com/c/0azwtxohcx6pi0cq'>Pagar</a>
                </button>
                <button type="button" className="btn-voltar rounded-lg border px-4 py-2 bg-black-600" onClick={()=>nav(-1)}>
                  Voltar
                </button>
                </div>
              </form>
            </div>
          </body>
        </html>
      );
    };
export default Pagamento;
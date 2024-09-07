import React from 'react';
// import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';
import movie from '../../assets/filme.png';
import log from '../../assets/movie.png'
import aparelhos from '../../assets/aparelhos.png';
import moviein from '../../assets/moviein.png';
import movieinDark from '../../assets/moviein-dark.png';
import { FaRegCircleCheck } from "react-icons/fa6";
import { Button } from 'components/ui/button';
import Colaborador from './Colaborador';
import eduardo from '../../assets/colaboradores/perfil-eduardo.jpg';
import brenda from '../../assets/colaboradores/perfil-brenda.jpg';
import gabriel from '../../assets/colaboradores/perfil-gabriel.jpg';
import jose from '../../assets/colaboradores/perfil-jose.jpg';
import lorrayne from '../../assets/colaboradores/perfil-lorrayne.jpg';
import karol from '../../assets/colaboradores/perfil-karol.jpg';
import Navbar from './Navbar/Navbar';
import { useTheme } from 'components/ui/theme-provider';
import unisuamLight from '../../assets/Unisuam-light.png'
import unisuam from '../../assets/Unisuam.png'


const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const nav = useNavigate();

  return (
    <main>
      <Navbar />

      <section className="container mx-auto">
        <div className="relative col-span-3">

          <div className='bg-primary/50 w-[340px] h-[340px] rounded-full blur-[100px] top-[130px] absolute'></div>
          <div className='bg-redPalid w-[160px] h-[160px] rounded-full blur-[60px] bottom-[130px] right-0 absolute -z-10'></div>

          <div className='grid md:grid-cols-3 mt-8 md:mt-0 md:h-screen items-center gap-[32px]'>

            <div className="relative flex flex-col items-center text-center md:text-start md:items-start">
              <img className="mb-4 w-[42px]" src={log} alt="Icon" />
              <h1 className="text text-6xl font-medium">Streaming feito para todos!</h1>
            </div>

            <img className="w-full md:h-[80vh] object-cover rounded-full border-[4px] border-redDark"
              src={movie}
              alt="Elipse"
            />

            <div className="grid gap-4 mt-8">
              <div className="bg-background border-b-4 border-b-primary p-4 rounded-[12px]" id="card">
                <img className="movie w-8 object-contain mb-3" src={log} alt="Movie" />
                <p>Criadores independentes têm a chance de brilhar. Com uma audiência ávida por conteúdo autêntico.</p>
              </div>

              <div className="bg-background border-b-4 border-b-primary p-4 rounded-[12px]" id="card">
                <img className="movie w-8 object-contain mb-3" src={log} alt="Movie" />
                <p>Espaço onde sonhos cinematográficos se tornam realidade, graças ao apoio financeiro da comunidade.</p>
              </div>

              <div className="bg-background border-b-4 border-b-primary p-4 rounded-[12px]" id="card">
                <img className="movie w-8 object-contain mb-3" src={log} alt="Movie" />
                <p>Espectadores se tornam parte ativa do processo criativo. Comentários construtivos, discussões apaixonadas e apoio mútuo são incentivados.</p>
              </div>

              <div className="bg-background border-b-4 border-b-primary p-4 rounded-[12px]" id="card">
                <img className="movie w-8 object-contain mb-3" src={log} alt="Movie" />
                <p>Serve como ponto de encontro para profissionais da indústria, diretores, produtores, roteiristas e outros talentos podem se conectar e crescer juntos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className='container overflow-hidden mx-auto min-h-screen grid md:grid-cols-3 gap-0 md:gap-12 relative items-center'>
        <div className='bg-primary w-[360px] h-[360px] left-20 rounded-full blur-[120px] absolute -z-10'></div>
        <div className='col-span-2'>
          <img alt='responsividade' src={aparelhos} className='w-full' />
        </div>
        <div className='text-center md:text-start'>
          <h2 className='text-4xl font-bold mb-6'>Feito para todos os Tamanhos</h2>
          <p className='text-2xl'>
            Aproveite cada momento assistindo filmes, séries ou curta metragens em qualquer resolução de tela, seja por TV 4k, Tablets ou até mesmo celulares!
          </p>
        </div>
      </section>

      <section className='pr-60 pl-60 container mx-auto mb-[120px]'>
        <div className='col-span-3 text-center'>
          <h2 className='font-bold text-3xl mb-4'>Assinatura</h2>
          <p></p>
        </div>
        <div className='grid md:grid-cols-2 gap-[20px]'>
          {/* ASSINATURAS */}
          <div className='relative p-6 py-10 rounded-xl border-primary border-[1px] text-text overflow-hidden'>
            <div className="w-[180px] h-[180px] absolute right-0 top-0 rounded-full blur-[50px] -z-10 bg-primary"></div>
            <div className="w-[180px] h-[180px] absolute -left-5 bottom-[-60px] rounded-full blur-[50px] -z-10 bg-primary"></div>
            <div className='mb-8'>
              <h4 className='text-[28px]'>Cliente</h4>
              <small className='text-md'>Casual</small>
            </div>
            <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
              </div>
              <div className="flex gap-4 opacity-35">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Com anúncios</p>
              </div>
              <div className="flex gap-4 opacity-35">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
              </div>
            </div>
            {/*<p className='text-3xl font-bold mt-16 mb-12'>R$ 18,00/mês</p>*/}
            <Button onClick={() => nav("/registro")} size="lg"
              className='w-full mt-16 mb-12'>
              Comece agora
            </Button>
          </div>
{/*  
          <div className='relative p-6 py-10 rounded-xl border-red border-[1px] text-text overflow-hidden'>
            <div className="w-[180px] h-[180px] absolute right-0 top-0 rounded-full blur-[50px] -z-10 bg-red"></div>
            <div className="w-[180px] h-[180px] absolute -left-5 bottom-[-60px] rounded-full blur-[50px] -z-10 bg-red"></div>
            <div className='mb-8'>
              <h4 className='text-[28px]'>Critico</h4>
              <small className='text-md'>Diferente</small>
            </div>
            <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Sem anúncios</p>
              </div>
              <div className="flex gap-4 opacity-35">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
              </div>
            </div>
            <p className='text-3xl font-bold mt-16 mb-12'>R$ 113,40/semestral</p>
            <Button onClick={() => nav("/registro")}  size="lg"
              className='w-full'
              variant="red">
              Comece agora
            </Button>
          </div>
*/}
          <div className='relative p-6 py-10 rounded-xl border-redPalid border-[1px] text-text overflow-hidden'>
            <div className="w-[180px] h-[180px] absolute right-0 top-0 rounded-full blur-[50px] -z-10 bg-redPalid"></div>
            <div className="w-[180px] h-[180px] absolute -left-5 bottom-[-60px] rounded-full blur-[50px] -z-10 bg-redPalid"></div>
            <div className='mb-8'>
              <h4 className='text-[28px]'>Criador</h4>
              <small className='text-md'>Único</small>
            </div>
            <div className='border-l-2 border-l-white/45 p-4 flex flex-col gap-8'>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Livre para assistir qualquer vídeo gratuitamente (não alugados).</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Avaliar vídeos como cliente</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Sem anúncios</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <FaRegCircleCheck className='text-[28px]' />
                </div>
                <p className='text-[14px] text-text'>Enviar novo vídeo ou filme</p>
              </div>
            </div>
            {/*<p className='text-3xl font-bold mt-16 mb-12'>R$ 226,80/anual</p>*/}
            <Button onClick={() => nav("/registro")}  size="lg"
              className='w-full mt-16 mb-12'
              variant="redPalid">
              Comece agora
            </Button>
          </div>
        </div>
      </section>

      <div className='container mb-7'>
        <div className='w-full flex items-center gap-5'>
          <hr className='w-full' />
          <Button onClick={() => nav("/registro")}  variant="outline" size="lg" className='p-8 rounded-full'>
            Comece agora mesmo
          </Button>
          <hr className='w-full' />
        </div>
      </div>

      <section>
        <div className='grid md:grid-cols-3 gap-[32px]'>
          
          <Colaborador
            nome='Eduardo Lima de Oliveira'
            feitos={["Infra do projeto", "Autenticação", "Redefinição de senha", "Cadastro", "Login", "Perfil do usuário", "Pagamento e confirmação", "streamming"]}
            imagem={eduardo}
            
          />

          <Colaborador
            nome='Karollyne de Oliveira Cordeiro'
            feitos={["Infra do projeto", "Ladingpage", "Documentos"]}
            imagem={karol}
          />

          <Colaborador
            nome='José Augusto R. dos Santos'
            feitos={["Infra do projeto", "Criadores", "Filmes", "Ladingpage", "Conversões"]}
            imagem={jose}
          />

          <Colaborador
            nome='Brenda Rodrigues de Oliveira'
            feitos={["Infra do projeto", "Inicio", "2FA", "Erro 404", "Consulta de usuário", "Logs"]}
            imagem={brenda}
          />

          <Colaborador
            nome='Gabriel Tavares Pessanha'
            feitos={["Infra do projeto", "Modificações e atualizações"]}
            imagem={gabriel}
          />

          <Colaborador
            nome='Lorrayne Calazans Braga'
            feitos={["Infra do projeto", "Assinaturas", "Mensagem de erro"]}
            imagem={lorrayne}
          />

        </div>
      </section>

      <footer className="dark:bg-black bg-card p-8">
        <div>
          {
            (theme === "dark" || theme === "system") && <img alt='Moviein' src={movieinDark} className="w-[100px] object-contain -dark:hidden" />
          }
          {
            theme === "light" && <img alt='Moviein' src={moviein} className="w-[100px] object-contain -dark:hidden" />
          }
        </div>
        <div className='flex justify-between'>
          <small>Moviein © 2024 - Todos os direitos reservados</small>
          {
            (theme === "dark" || theme === "system") && <img alt='Moviein' src={unisuamLight} className="w-[100px] object-contain -dark:hidden" />
          }
          {
            theme === "light" && <img alt='Moviein' src={unisuam} className="w-[100px] object-contain -dark:hidden" />
          }
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
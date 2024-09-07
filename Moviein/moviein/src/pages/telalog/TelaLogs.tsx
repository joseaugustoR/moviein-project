import ApiService from 'api/ApiService';
import { Input } from 'components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'components/ui/table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
interface LogEntry {
  nome: string;
  email: string;
  dataHora: Date;
  descricao: string;
}

const api = new ApiService();
const UserLogConsultation: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState<string>("");
  const [results, setResults] = useState<LogEntry[]>([]);
  const [found, setFound] = useState(false);
  const [load, setLoad] = useState<boolean>(true);

  async function Logs(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setLoad(true);
    await api.Get<LogEntry[]>({
      errorTitle: "Falha ao consultar logs no sistema.",
      path: `api/log/Consultar?nome=${nome}&email=${email}&data=${data}`,
      thenCallback: (r) => {
        setLoad(false);
        setFound(true);
        setResults(r);
      }
    })
  }

  useEffect(() => {
    Logs();
  }, [])

  return (
    <div className="bg-background min-h-screen pt-10">
      <div className='container'>
        <div className="dark:bg-black/30 bg-slate-400/20 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-text mb-4">Consulta Log do Sistema</h1>
          <form className="mb-4" onSubmit={Logs}>
            <div className="flex flex-col md:flex-row gap-2 items-end">
              <div className='w-full'>
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className='w-full'>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className='w-[50px]'>
                <MdOutlineCleaningServices />
              </Button>
            </div>
            <div className='md:w-auto w-full'>
              <label className="block text-text" htmlFor="date">Data</label>
              <Input type='date'
                onChange={(r) => setData(r.target.value)}
              />
            </div>
            <Button type='submit' load={load} className='w-full mt-3'>
              Buscar
            </Button>
          </form>
          <hr></hr>
          <Table>
            <TableRow>
              <TableHead className='text-text'>Email</TableHead>
              <TableHead className='text-text'>Mensagem</TableHead>
              <TableHead className='text-text'>Data</TableHead>
            </TableRow>
            <TableBody>
              {
                results.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className='text-[12px]'>{d.email}</TableCell>
                    <TableCell className='text-[12px]'>{d.descricao}</TableCell>
                    <TableCell className='text-[12px]'>{moment(d.dataHora).format("DD/MM/yyyy HH:mm")}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserLogConsultation;
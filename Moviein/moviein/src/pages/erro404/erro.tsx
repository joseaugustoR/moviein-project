import React from 'react';

const Error404: React.FC = () => {
  return (
    <div className="square bg-background text-white h-screen flex flex-col justify-center items-center">
      <p className="title text-6xl text-text mb-3">Erro 404</p>
      <p className="text text-lg font-bold">Página não encontrada, reinicie</p>
    </div>
  );
};

export default Error404;

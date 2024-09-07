import dotenv from 'dotenv'; // Importe o dotenv
dotenv.config(); // Carregue as variáveis de ambiente do arquivo .env

import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import UserAuthorizationModel from "./models/UserAuthorizationModel";
import { badRequestMiddleware, okMiddleware } from "./middlewares/RequestExceptions";
import UserController from "./controllers/UserController";
import FilmeController from "./controllers/FilmeController";
import AssinaturaController from "./controllers/AssinaturaController";
import LogController from './controllers/LogController';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserAuthorizationModel
  }
}

const connectionString = "postgres://dvlvctun:u1gQQ6T2PxiVXJAl1hA1GcjkWA-81PZv@kesavan.db.elephantsql.com/dvlvctun"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prismaClient = new PrismaClient({ adapter })

const app = fastify({
  bodyLimit: 10485760
});
app.register(cors, { origin: true });
app.register(fastifyMultipart, {
  limits: {
    fileSize: 52428800 //40mb
  }
});

app.addHook('onRequest', okMiddleware);
app.addHook('onRequest', badRequestMiddleware);

//controllers
app.register(UserController, { prefix: "/api/usuario/" })
app.register(FilmeController, { prefix: "/api/filme/" })
app.register(AssinaturaController, { prefix: "/api/assinatura/" })
app.register(LogController, { prefix: "/api/log/" })
//


app.listen({
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  host: "0.0.0.0"
}).then(() => {
  console.log("Servidor rodando em porta:", `http://localhost:${process.env.PORT ? Number(process.env.PORT) : 3001}`);
});

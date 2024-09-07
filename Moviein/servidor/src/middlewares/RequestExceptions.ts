import { FastifyReply, FastifyRequest } from "fastify";

declare module 'fastify' {
    interface FastifyReply {
        ok(data: any, message?: string): void;
        badRequest(message: string): void;
    }
}

const okMiddleware = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    reply.ok = (data: any, message?: string) => {
        reply.code(200).send({
            status: 'success',
            data: data,
            message: message
        });
    };
    done();
};

// Middleware para o padrão "BadRequest"
const badRequestMiddleware = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    reply.badRequest = (message: string) => {
        reply.code(400).send({
            status: 'error',
            message: message,
            data: undefined
        });
    };
    done();
};

export { badRequestMiddleware, okMiddleware };
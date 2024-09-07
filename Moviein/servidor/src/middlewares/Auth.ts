import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import tokenService from "../services/tokenService";

function Auth(req: FastifyRequest, re: FastifyReply, done: HookHandlerDoneFunction, ) {
    const authBearer = req.headers.authorization;
    if (!authBearer) {
        re.code(401).send({ erro: "Não autorizado." })
        return;
    }
    
    const token = authBearer.split(" ")[1];
    const tokenDesc = tokenService.descript(token);
    
    req.user = {
        funcao: tokenDesc?.funcao,
        email: tokenDesc?.email
    }
    done();
}

export default Auth;
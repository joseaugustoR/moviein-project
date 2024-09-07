import {createContext} from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import * as yup from "yup";

export const UseContextSchreema = yup.object({
    nome: yup.string(),
    email: yup.string(),
    funcao: yup.string(),
    thumb: yup.string(),
    auth2: yup.boolean()
})

export type UseContextType = yup.InferType<typeof UseContextSchreema>;

interface UseContextTypeData extends UseContextType {
    setValueUser: UseFormSetValue<UseContextType>
    watchUser: UseFormWatch<UseContextType> | null
    errorUser?: FieldErrors<UseContextType>
    registerUser?: UseFormRegister<UseContextType>
    reload: () => any
}

const UserContext = createContext<UseContextTypeData>({
    email: undefined,
    nome: undefined,
    thumb: undefined,
    auth2: undefined,
    funcao: undefined,
    setValueUser: () => {},
    watchUser: null,
    errorUser: undefined,
    registerUser: undefined,
    reload: () => {}
})

export default UserContext;
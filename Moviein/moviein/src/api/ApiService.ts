import { ToastType, ToasterToast } from "components/ui/use-toast";
import Api from "./api";
import { AxiosError } from "axios";

type ResponseAxiosType<T> = {
    data: T
    message?: string
    status: string | number
}

type ResponseGetType<T> = {
    path: string
    errorTitle: string
    thenCallback?: (data: T) => any
    catchCallback?: () => any
}

type ResponsePostType<T> = {
    path: string
    formData?: boolean
    errorTitle: string
    data: any
    thenCallback?: (data: T) => any
    catchCallback?: () => any
}


class ApiService {
    public static toast: ({ ...props }: ToastType) => {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
    };


    public async Get<T>(data: ResponseGetType<T>) {
        try {
            var res = await Api.get<ResponseAxiosType<T>>(data.path)
            if (res.status === 200 || res.status === 201) {
                if (data.thenCallback) data.thenCallback(res.data.data);
                return res.data.data
            } else {
                ApiService.toast({
                    title: data.errorTitle,
                    description: res.data.message,
                    duration: 3000,
                    className: "bg-red"
                })
            }
        } catch (error) {
            var errorData = error as AxiosError<ResponseAxiosType<T>>
            ApiService.toast({
                title: data.errorTitle,
                description: errorData.response?.data.message,
                duration: 3000,
                className: "bg-red"
            })
        }
    }

    public async Post<T>(data: ResponsePostType<T>) {
        try {
            var res = await Api.post<ResponseAxiosType<T>>(data.path, data.data, {
                headers: {
                    "Content-Type": data.formData ? "multipart/form-data" : "application/json",
                    "Accept": "application/json",
                    "type": "formData"
                }
            })
            if (res.status === 200 || res.status === 201 || res.status === 204) {
                if (data.thenCallback) data.thenCallback(res.data.data);
                return res.data.data
            } else {
                ApiService.toast({
                    title: data.errorTitle,
                    description: res.data.message,
                    duration: 3000,
                    className: "bg-red"
                })
            }
        } catch (error) {
            var errorData = error as AxiosError<ResponseAxiosType<T>>
            ApiService.toast({
                title: data.errorTitle,
                description: errorData.response?.data.message,
                duration: 3000,
                className: "bg-red"
            })
            if (data.catchCallback != null) data.catchCallback();
        }
    }



}

export default ApiService;
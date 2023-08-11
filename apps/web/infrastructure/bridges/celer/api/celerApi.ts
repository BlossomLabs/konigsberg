import axios, { AxiosResponse } from "axios";
import { CelerApiTransferConfigResponse, anyToCelerApiTransferConfigResponse } from "./responses/CelerApiTransferConfigResponse";


export class CelerApi {
    testBase = "https://cbridge-v2-test.celer.network"
    prodBase = "https://cbridge-prod2.celer.app/v2"
    baseUrl = this.prodBase;


    public axiosInstance = axios.create({
        baseURL : this.baseUrl
    });

    constructor() {
        this.axiosInstance.interceptors.request.use((config)=> {
            // Add authorization
            config.headers!.withCredentials = false;
            return config;
        })
    }

    responseBody = <T>(response: AxiosResponse) => response.data;

    request = {
        get: <T>(url:string) => this.axiosInstance.get<T>(url).then(this.responseBody),
        post: <T>(url:string) => this.axiosInstance.post<T>(url).then(this.responseBody),
    };

    public Bridge = {
        getTransferConfigs: async () : Promise<CelerApiTransferConfigResponse|undefined> => {
            const response = await this.request.get<any[]>(
                "/getTransferConfigs"
            )
            return anyToCelerApiTransferConfigResponse(response)
        }
    }
}
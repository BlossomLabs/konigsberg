import axios, { AxiosResponse } from "axios";
import { HopApiQuoteResponse } from "./request_response/HopApiQuoteResponse";
import { HopApiQuoteRequest } from "./request_response/HopApiQuoteRequest";

export class HopApi {
    baseUrl = "https://api.hop.exchange/v1";


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
        getquote: async (params : HopApiQuoteRequest) : Promise<HopApiQuoteResponse|undefined> => {
            const urlWithParams = `/quote?amount=${params.quantity.toString()}&token=${params.sourceToken}&fromChain=${params.sourceChainName.toLowerCase()}&toChain=${params.destinationChainName.toLowerCase()}&slippage=${params.slippage}`
            const response = await this.request.get<any[]>(
                urlWithParams
            )
            return response as HopApiQuoteResponse
        }
    }
}
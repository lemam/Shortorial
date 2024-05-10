import {AxiosResponse} from "axios";

export function getAccessToken(): string{
    const token = localStorage.getItem("accessToken");
    if(token) return token;
    else return "";
}

export function setAccessToken(data: AxiosResponse){
    const accessToken = data.data.accessToken.accessToken || "";
    localStorage.setItem("accessToken",accessToken);
}
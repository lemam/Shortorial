import {isAxiosError} from "axios";
import {axios} from "../utils/axios";
import parseJwt from "../modules/auth/parseJwt";
import{
    getAccessToken,
    setAccessToken,
} from "../modules/auth/accessToken";


const REST_MEMBER_API = "/api/member";

//일반 로그인

export async function postLogin( id :string , password : string){
    try{
        const data = await axios.post(REST_MEMBER_API + "/login",{
            memberId: id,
            memberPass : password,
            withCredentials: true,
        });
        
        // console.log(data);
        
        
        setAccessToken(data);
        //로그인한 회원의 id 반환
        return parseJwt(getAccessToken()).sub;
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.status +"");
        }
    }
}

export async function getMemberInfo(){
    try{
        const token = "Bearer "+ localStorage.getItem("accessToken");
        const data = await axios.get(REST_MEMBER_API + `/info`,{
            headers : {
                Authorization : token,
            },
        });

        setAccessToken(data);

        return{
            idx: parseJwt(getAccessToken()).sub,
            info: data.data,
        };
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error("500");
        }
    }
}
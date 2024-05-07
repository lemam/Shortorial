import { axios } from "../utils/axios";

const REST_SHORTS_URL = "/s3/upload";
const REST_SHORTS_LIST_URL = "/api/shorts";


// S3 동영상 업로드
export async function uploadShorts(file: string, fileName: string) {
  try {
    const data = await axios.post(REST_SHORTS_URL, {
      file: file,
      fileName: fileName,
    });

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


export interface shorts {
  shortsNo : number;
  shortsUrl : string;
  shortsTitle : string;
  shortsDirector : string;
  shortsTime : number;
  shortsChallengers : number;
  shortsLink : string;
}

// 쇼츠 리스트 조회
export const getShortsList = async () => {
  try {
    const response = await axios.get(REST_SHORTS_LIST_URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
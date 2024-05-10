import { axios } from "../utils/axios";

const REST_SHORTS_URL = "/s3/upload";
const REST_SHORTS_LIST_URL = "/api/shorts";
const REST_MYPAGE_URL = "/api/mypage";

// S3 동영상 업로드
export async function postUploadShorts(file: File, fileName: string) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = await axios.post(
      REST_SHORTS_URL,
      {
        file: file,
        fileName: fileName,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export interface shorts {
  shortsNo: number;
  shortsUrl: string;
  shortsTitle: string;
  shortsDirector: string;
  shortsTime: number;
  shortsChallengers: number;
  shortsLink: string;
  shortsDate: string;
}

// 쇼츠 리스트 조회
export const getShortsList = async () => {
  try {
    const response = await axios.get(REST_SHORTS_LIST_URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 특정 쇼츠 조회
export const getShortsInfo = async (shortsNo: number) => {
  try {
    const response = await axios.get(`${REST_SHORTS_LIST_URL}/{shortsNo}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export interface UploadShorts {
  uploadNo: number;
  memberNo: number;
  uploadUrl: string;
  uploadTitle: string;
  uploadDate: string;
}

//사용자가 저장한 쇼츠 조회
export async function getUploadedShorts() {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = await axios.get(`${REST_MYPAGE_URL}/upload-shorts`, {
      headers: {
        Authorization: token,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

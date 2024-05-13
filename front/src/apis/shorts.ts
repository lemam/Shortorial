import { axios } from "../utils/axios";

const REST_SHORTS_URL = "api/s3/upload";
const REST_SHORTS_LIST_URL = "/api/shorts";
const REST_MYPAGE_URL = "/api/mypage";

// S3 동영상 업로드
export async function postUploadShorts(blob: blob, fileName: string) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const formData = new FormData(); // FormData 객체 생성
    // formData.append("file", file); // 파일 추가
    formData.append("file", blob, `${fileName}.mp4`);
    formData.append("fileName", fileName); // 파일 이름 추가

    const data = await axios.post(REST_SHORTS_URL, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data", // 파일 업로드 시 Content-Type 설정
      },
    });

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

//사용자가 저장한 쇼츠 이름 수정
export async function putUpdateTitle(oldTitle: string, newTitle: string, uploadNo: number) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = {
      uploadNo: uploadNo,
      oldTitle: oldTitle,
      newTitle: newTitle,
    };

    const response = await axios.put(`${REST_MYPAGE_URL}/rename`, data, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//영상 시도하면 카운트
export async function getTryCount(shortsNo: number) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");
    const data = {
      shortsNo: shortsNo,
    };

    const response = await axios.put(`${REST_SHORTS_LIST_URL}/addTryCount`, data, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

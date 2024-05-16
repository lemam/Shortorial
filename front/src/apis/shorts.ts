import { axios } from "../utils/axios";

const REST_SHORTS_URL = "/api/s3";
const REST_SHORTS_LIST_URL = "/api/shorts";

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

export interface UploadShorts {
  uploadNo: number;
  memberNo: number;
  uploadUrl: string;
  uploadTitle: string;
  uploadDate: string;
}

export interface TryShorts {
  tryNo: number;
  shortsNo: number;
  memberNo: number;
  tryYn: number;
}

// S3 동영상 업로드
export async function postUploadShorts(blob: Blob, fileName: string) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const formData = new FormData(); // FormData 객체 생성
    // formData.append("file", file); // 파일 추가
    formData.append("file", blob, `${fileName}.mp4`);
    formData.append("fileName", fileName); // 파일 이름 추가

    const data = await axios.post(`${REST_SHORTS_URL}/upload`, formData, {
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
export const getShortsInfo = async (shortsNo: string) => {
  try {
    const response = await axios.get(`${REST_SHORTS_LIST_URL}/${shortsNo}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

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

// S3에 있는 파일을 Blob으로 받기
export async function getS3Blob(fileName: string) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = await axios.post(
      `${REST_SHORTS_URL}/bring/blob/${fileName}`,
      {},
      {
        headers: {
          Authorization: token,
        },
        responseType: "blob",
      }
    );

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getMyS3Blob(uploadNo: number) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = await axios.post(
      `${REST_SHORTS_URL}/bring/myblob/${uploadNo}`,
      {},
      {
        headers: {
          Authorization: token,
        },
        responseType: "blob",
      }
    );

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 동영상 파일 이름 업데이트
export async function updateTitle(updatingShorts: Map<string, string>, uploadNo: number) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const updatingShortsObj = Object.fromEntries(updatingShorts);

    const data = await axios.put(`${REST_SHORTS_URL}/rename/${uploadNo}`, updatingShortsObj, {
      headers: {
        Authorization: token,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Error Renaming data:", error);
  }
}

// 동영상 파일 이름 중복검사
export async function checkTitle(title: String) {
  try {
    const token = "Bearer " + localStorage.getItem("accessToken");

    const data = {
      title: title,
    };

    const response = await axios.post(`${REST_SHORTS_URL}/try-shorts`, data, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      // 요청이 성공적으로 처리됨, 이름으로 써도 됨.
      console.log("Name is available.");
      return true;
    } else if (response.status === 400) {
      // 클라이언트의 요청이 잘못됨, 이름으로 쓸 수 없음.
      console.log("Name already exists. Please choose another one.");
      return false;
    }
  } catch (error) {
    console.error("Error Renaming data:", error);
  }
}

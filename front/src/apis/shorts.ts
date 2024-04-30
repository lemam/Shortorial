import { axios } from "../utils/axios";

const REST_SHORTS_URL = "/s3/upload";

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

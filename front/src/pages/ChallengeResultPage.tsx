import { useState } from "react";
import { Link } from "react-router-dom";
import useChallengeStore from "../store/useChallengeStore";
import styled from "styled-components";
import axios from "axios";

const ChallengeResultPage = () => {
  const { downloadURL } = useChallengeStore();
  console.log(downloadURL);

  const [title, setTitle] = useState<string>("");

  const saveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const s3Upload = (url: string, title: string) => {
    axios.get(url, { responseType: "blob" }).then((response) => {
      const file = new File([response.data], `${title}.mp4`, { type: "video/mp4" }); // url 파일 변환
      const formData = new FormData();
      formData.append("file", file); // 파일 매개변수
      formData.append("fileName", title); // 파일 이름 매개변수

      axios
        .post("http://localhost:8080/s3/upload", formData, {
          // formData 보내기
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => console.log("s3 upload success", response.data))
        .catch((error) => console.error("s3 upload fail", error));
    });
  };

  return (
    <ResultContainer>
      <VideoContainer autoPlay playsInline loop src={downloadURL}></VideoContainer>
      <ControlBoxContainer>
        <ControlBox>
          <div>촬영이 완료되었습니다.</div>
          <input
            type="text"
            value={title}
            onChange={saveTitle}
            placeholder="제목을 입력하세요."
          ></input>
          <a href={downloadURL} download={title}>
            로컬저장
          </a>
          <button onClick={() => s3Upload(downloadURL, title)}>s3저장</button>
          <div>
            <Link to={"/challenge"}>다시 촬영하기 |</Link>
            <Link to={"/"}> 쇼츠 목록보기</Link>
          </div>
        </ControlBox>
      </ControlBoxContainer>
    </ResultContainer>
  );
};

const ResultContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const VideoContainer = styled.video`
  height: 100vh;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  padding: 30px;
  box-sizing: border-box;
  transform: scaleX(-1);
`;

const ControlBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ControlBox = styled.div`
  height: 300px;
  width: 300px;
  border: 1px solid black;
`;

export default ChallengeResultPage;

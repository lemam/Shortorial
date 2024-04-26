import { useState } from "react";
import { Link } from "react-router-dom";
import useChallengeStore from "../store/useChallengeStore";
import styled from "styled-components";

const ChallengeResultPage = () => {
  const { downloadURL } = useChallengeStore();
  console.log(downloadURL);

  const [title, setTitle] = useState<string>("");

  const saveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    console.log(event.target.value);
  };

  return (
    <ResultContainer>
      <VideoContainer autoPlay src={downloadURL}></VideoContainer>
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
            저장
          </a>
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

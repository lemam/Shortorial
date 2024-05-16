import { useState } from "react";
import styled from "styled-components";
import { Check, Create } from "@mui/icons-material";
import { shorts } from "../../apis/shorts";

const ChallengeResultPage = ({ shorts }: { shorts: shorts }) => {
  const [title, setTitle] = useState<string>(shorts.shortsTitle);
  const [modify, setModify] = useState<boolean>(false);

  const saveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    //제목 수정 api
  };

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);

  return (
    <ResultContainer>
      <VideoContainer>
        <Video
          crossOrigin="anonymous"
          src={shorts.shortsLink}
          controls
        ></Video>
      </VideoContainer>
      {!modify && (
        <TitleContainer>
          <Title>{title}</Title>
          <ModifyIcon onClick={titleCanbeModified}></ModifyIcon>
        </TitleContainer>
      )}
      {modify && (
        <TitleContainer>
          <InputBox
            type="text"
            value={title}
            onChange={saveTitle}
            placeholder="제목을 입력하세요."
          />
          <CheckIcon onClick={titleCanNotbeModified}></CheckIcon>
        </TitleContainer>
      )}
    </ResultContainer>
  );
};

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% / 4);
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Video = styled.video`
  object-fit: cover;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const Title = styled.div`
  font-size: 20px;
`;

const ModifyIcon = styled(Create)`
  position: absolute;
  cursor: pointer;
  right: 0;
`;

const InputBox = styled.input`
  width: 360px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
  font-size: 20px;
`;

const CheckIcon = styled(Check)`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

// const GridContainer = styled.div`
//   position: relative;
//   display: grid;
//   gap: 16px;
//   grid-template-columns: repeat(2, 1fr);

//   @media (orientation: landscape) {
//     grid-template-columns: repeat(4, minmax(162px, 1fr));
//   }
// `;
export default ChallengeResultPage;

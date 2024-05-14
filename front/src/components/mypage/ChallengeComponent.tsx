import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Check, Create, Download } from "@mui/icons-material";
import { UploadShorts } from "../../apis/shorts";

const ChallengeResultPage = ({ uploadShorts }: { uploadShorts: UploadShorts }) => {
  const [title, setTitle] = useState<string>(uploadShorts.uploadTitle);
  const [modify, setModify] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);

  const saveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    //제목 수정 api
  };

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);
  const startDownload = () => setDownload(true);
  const completeDownload = () => setDownload(false);

  const downloadVideo = () => {
    startDownload();

    axios
      .get(`http://localhost:8080/s3/download/file/${uploadShorts.uploadTitle}`, {
        responseType: "blob",
      })
      .then((res) => {
        const videoBlob = new Blob([res.data], { type: "video/mp4" }); // 비디오를 blob으로 변경
        const downloadUrl = URL.createObjectURL(videoBlob); // blob url 생성

        const downloadLink = document.createElement("a"); // 임시 a 태그 생성
        downloadLink.href = downloadUrl; // href 링크 지정
        downloadLink.setAttribute("download", `${title}.mp4`);
        document.body.appendChild(downloadLink);
        downloadLink.click(); // a 태그 클릭

        document.body.removeChild(downloadLink); // 임시 a 태그 제거
        URL.revokeObjectURL(downloadUrl);

        completeDownload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <ResultContainer>
      <VideoContainer>
        <Video
          crossOrigin="anonymous"
          src={uploadShorts.uploadUrl}
          controls
        ></Video>
        {!download && (
          <DownloadIcon
            onClick={downloadVideo}
            fontSize="large"
          ></DownloadIcon>
        )}
        {download && <DownloadingIcon src="../src/assets/mypage/downloading.gif"></DownloadingIcon>}
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
  width: 360px;
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Video = styled.video`
  width: 360px;
  height: 640px;
  object-fit: cover;
`;

const DownloadIcon = styled(Download)`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const DownloadingIcon = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  width: 50px;
  height: 50px;
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

export default ChallengeResultPage;

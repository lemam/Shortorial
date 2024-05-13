import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Check, Create, Download, IosShare } from "@mui/icons-material";

const ChallengeResultPage = () => {
  const [title, setTitle] = useState<string>("minji");
  const [modify, setModify] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);

  const saveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);
  const startDownload = () => setDownload(true);
  const completeDownload = () => setDownload(false);

  // 비디오 로컬 다운로드
  const downloadVideo = () => {
    startDownload();

    axios
      .get("http://localhost:8080/s3/download/file/제목제목", {
        responseType: "blob",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTcxNTI0Mzk5MCwiZXhwIjoxNzE1MjQ1NzkwfQ.S0BMRsugGqsEIu0mPNWCa68AF2rgUwubPFxQJjuUr-w",
        },
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

  // 비디오 유튜브 업로드
  const uploadVideo = () => {
    (() => setShare(true))();

    axios
      .get(`http://localhost:3001/authenticate?fileName=minji`) // node 서버로 요청 보냄
      .then((response) => {
        window.location.href = response.data.authUrl; // 응답 받은 authUrl로 이동
      })
      .catch((error) => console.error("Error:", error));

    (() => setShare(false))();
  };

  return (
    <ResultContainer>
      <VideoContainer>
        <Video
          crossOrigin="anonymous"
          src="https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/minji"
          controls
        ></Video>
        {!share && <IosShareIcon onClick={uploadVideo} fontSize="large"></IosShareIcon>}
        {share && <SharingIcon src="../src/assets/mypage/downloading.gif"></SharingIcon>}
        {!download && <DownloadIcon onClick={downloadVideo} fontSize="large"></DownloadIcon>}
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

const IosShareIcon = styled(IosShare)`
  position: absolute;
  right: 0;
  top: 1%;
  cursor: pointer;
`;

const SharingIcon = styled.img`
  position: absolute;
  right: 0;
  top: 1%;
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const DownloadIcon = styled(Download)`
  position: absolute;
  right: 0;
  top: 8%;
  cursor: pointer;
`;

const DownloadingIcon = styled.img`
  position: absolute;
  right: 0;
  top: 8%;
  cursor: pointer;
  width: 40px;
  height: 40px;
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

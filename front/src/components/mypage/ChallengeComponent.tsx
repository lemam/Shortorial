import { useState, useEffect } from "react";
import styled from "styled-components";
import { Check, Create, Download } from "@mui/icons-material";
import { UploadShorts, checkTitle, updateTitle } from "../../apis/shorts";
import { getMyS3Blob } from "../../apis/shorts";

interface ContainerProps {
  isPortrait: boolean;
}

const ChallengeResultPage = ({ uploadShorts }: { uploadShorts: UploadShorts }) => {
  // 제목에서 '/' 이후의 부분을 추출하는 함수
  const extractTitle = (fullTitle: string): string => {
    const titleParts = fullTitle.split("/");
    return titleParts.length > 0 ? titleParts[1] : fullTitle;
  };

  const [title, setTitle] = useState<string>(extractTitle(uploadShorts.uploadTitle));
  const [modify, setModify] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(window.innerHeight > window.innerWidth);

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);
  const startDownload = () => setDownload(true);
  const completeDownload = () => setDownload(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const saveTitle = async () => {
    const result = await checkTitle(title);
    if (result) {
      setTitle(title);
      titleCanNotbeModified();

      const updatingShorts = new Map<string, string>();
      updatingShorts.set("oldTitle", uploadShorts.uploadTitle);
      updatingShorts.set("newTitle", title);

      await updateTitle(updatingShorts, uploadShorts.uploadNo);
      // 업데이트된 타이틀을 반영한 쇼츠를 조회해서 재렌더링 해야함
    } else {
      alert("이미 존재하는 타이틀입니다.");
    }
  };

  const downloadVideo = async () => {
    startDownload();

    try {
      const videoBlob = await getMyS3Blob(uploadShorts.uploadNo);
      const downloadUrl = URL.createObjectURL(videoBlob); // blob url 생성

      const downloadLink = document.createElement("a"); // 임시 a 태그 생성
      downloadLink.href = downloadUrl; // href 링크 지정
      downloadLink.setAttribute("download", `${title}.mp4`);
      document.body.appendChild(downloadLink);
      downloadLink.click(); // a 태그 클릭

      document.body.removeChild(downloadLink); // 임시 a 태그 제거
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("다운로드에 실패했습니다.");
      console.log(err);
    } finally {
      completeDownload();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ResultContainer isPortrait={isPortrait}>
      <VideoContainer isPortrait={isPortrait}>
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
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요."
          />
          <CheckIcon onClick={saveTitle}></CheckIcon>
        </TitleContainer>
      )}
    </ResultContainer>
  );
};

const ResultContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  // width: ${({ isPortrait }) => (isPortrait ? "100%" : "calc(100% / 2)")};
`;

const VideoContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ isPortrait }) => (isPortrait ? "column" : "row")};
  position: relative;
`;

const Video = styled.video`
  // width: 100%;
  // height: auto;
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
  width: 100%;
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

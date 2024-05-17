import { useState, useEffect } from "react";
import styled from "styled-components";
import { Check, Create, Delete, Download, IosShare, YouTube } from "@mui/icons-material";
import {
  UploadShorts,
  updateTitle,
  getMyS3Blob,
  shareShorts,
  getFilePath,
  deleteShorts,
  checkTitle,
} from "../../apis/shorts";

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
  const [share, setShare] = useState<boolean>(false);
  const [link, setLink] = useState<string | null>(null);

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);
  const startDownload = () => setDownload(true);
  const completeDownload = () => setDownload(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const deleteUploadedShorts = async () => {
    const deletingShorts = new Map<string, string>();
    deletingShorts.set("uploadNo", String(uploadShorts.uploadNo));
    deletingShorts.set("title", uploadShorts.uploadTitle);

    await deleteShorts(deletingShorts);
    // 재렌더링 필요
  };

  const saveTitle = async () => {
    // 이름이 존재하면 true, 존재하지 않으면 false를 반환
    const result = await checkTitle(title);
    if (!result) {
      setTitle(title);
      titleCanNotbeModified();

      const updatingShorts = new Map<string, string>();
      updatingShorts.set("oldTitle", uploadShorts.uploadTitle);
      updatingShorts.set("newTitle", title);

      await updateTitle(updatingShorts, uploadShorts.uploadNo);
      // 업데이트된 타이틀을 반영한 쇼츠를 조회해서 재렌더링 해야함
    } else {
      alert("이미 존재하는 타이틀입니다.");
      setModify(false);
      setTitle(extractTitle(uploadShorts.uploadTitle));
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

  const shareShortsToYoutube = async () => {
    (() => setShare(true))();

    const filePath = await getFilePath(uploadShorts.uploadNo); // 임시 저장한 파일 경로
    await shareShorts(filePath, uploadShorts.uploadNo); // 유튜브 업로드 함수에 전달
  };

  // youtube url 있는지 체크
  useEffect(() => {
    if (uploadShorts.youtubeUrl) {
      setLink(uploadShorts.youtubeUrl);
      setShare(false);
    }
  }, [uploadShorts.youtubeUrl]);

  // 쿼리스트링에 auth=true가 있으면 유튜브 인증 완료
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const alertParam = urlParams.get("auth");

    if (alertParam === "true") {
      alert(
        "유튜브 권한 설정이 완료되었습니다.\n공유 버튼을 누르면 채널에 비공개 동영상으로 업로드 됩니다."
      );
      urlParams.delete("auth"); // alert 파라미터 제거
      const newUrl = window.location.pathname; // 원래 url + 남은 쿼리스트링
      window.history.replaceState({}, document.title, newUrl); // 원래 url로 업데이트
    }
  }, []);

  return (
    <ResultContainer isPortrait={isPortrait}>
      <VideoContainer isPortrait={isPortrait}>
        <Video
          crossOrigin="anonymous"
          src={uploadShorts.uploadUrl}
          controls
        ></Video>
        <MyVideoControlComponent>
          {!download && (
            <DownloadIcon
              onClick={downloadVideo}
              fontSize="large"
            ></DownloadIcon>
          )}
          {download && (
            <DownloadingIcon src="../src/assets/mypage/downloading.gif"></DownloadingIcon>
          )}
          {!share && !link && (
            <IosShareIcon
              onClick={shareShortsToYoutube}
              fontSize="large"
            ></IosShareIcon>
          )}
          {!share && link && (
            <YoutubeIcon
              fontSize="large"
              onClick={() => (window.location.href = link)}
            ></YoutubeIcon>
          )}
          {share && <SharingIcon src="../src/assets/mypage/downloading.gif"></SharingIcon>}
          <DeleteIcon
            fontSize="large"
            onClick={deleteUploadedShorts}
          ></DeleteIcon>
        </MyVideoControlComponent>
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

const MyVideoControlComponent = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
`;

const DownloadIcon = styled(Download)`
  cursor: pointer;
`;

const DownloadingIcon = styled.img`
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const IosShareIcon = styled(IosShare)`
  cursor: pointer;
`;

const SharingIcon = styled.img`
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const YoutubeIcon = styled(YouTube)`
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
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

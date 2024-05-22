import { useState, useEffect } from "react";
import styled from "styled-components";
import { Check, Create, Delete, Download, IosShare, YouTube, Menu } from "@mui/icons-material";
import {
  UploadShorts,
  updateTitle,
  getMyS3Blob,
  shareShorts,
  deleteShorts,
  checkTitle,
} from "../../apis/shorts";

interface UploadComponentProps {
  uploadShorts: UploadShorts;
  onDelete: (uploadNo: number) => void;
}

const UploadComponent = ({ uploadShorts, onDelete }: UploadComponentProps) => {
  // 제목에서 '/' 이후의 부분을 추출하는 함수
  const extractTitle = (fullTitle: string): string => {
    const titleParts = fullTitle.split("/");
    return titleParts.length > 1 ? titleParts[1] : fullTitle;
  };

  const [title, setTitle] = useState<string>(extractTitle(uploadShorts.uploadTitle));
  const [modify, setModify] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);
  const short = uploadShorts;
  const [show, setShow] = useState<boolean>(false);

  const titleCanbeModified = () => setModify(true);
  const titleCanNotbeModified = () => setModify(false);
  const startDownload = () => setDownload(true);
  const completeDownload = () => setDownload(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const deleteUploadedShorts = async () => {
    const deletingShorts = new Map<string, string>();
    deletingShorts.set("uploadNo", String(short.uploadNo));
    deletingShorts.set("title", short.uploadTitle);

    await deleteShorts(deletingShorts);
    onDelete(short.uploadNo); // 삭제 후 상위 컴포넌트에 uploadNo 전달
  };

  const saveTitle = async () => {
    const result = await checkTitle(title);
    if (!result) {
      setTitle(title);
      titleCanNotbeModified();

      const updatingShorts = new Map<string, string>();
      updatingShorts.set("oldTitle", short.uploadTitle);
      updatingShorts.set("newTitle", title);

      await updateTitle(updatingShorts, short.uploadNo);
    } else {
      alert("이미 존재하는 타이틀입니다.");
      setModify(false);
      setTitle(extractTitle(short.uploadTitle));
    }
  };

  const downloadVideo = async () => {
    startDownload();

    try {
      const videoBlob = await getMyS3Blob(short.uploadNo);
      const downloadUrl = URL.createObjectURL(videoBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute("download", `${title}.mp4`);
      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("다운로드에 실패했습니다.");
      console.log(err);
    } finally {
      completeDownload();
    }
  };

  const shareShortsToYoutube = async () => {
    setShare(true);

    try {
      const s3blob = await getMyS3Blob(short.uploadNo);

      const formData = new FormData();
      formData.append("blob", s3blob, "uploadedVideo.mp4");

      await shareShorts(formData, short.uploadNo, short.uploadTitle);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 인증 완료 체크
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const alertParam = urlParams.get("auth");

    if (alertParam === "true") {
      alert("유튜브 권한 설정이 완료되었습니다.\n공유 버튼을 누르면 채널에 업로드 됩니다.");
      urlParams.delete("auth");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uploadParam = urlParams.get("upload");

    if (uploadParam) {
      if (uploadParam === "fail") {
        alert("유튜브 업로드에 실패하였습니다.");
      }

      urlParams.delete("upload");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      setShare(false);
    }
  }, []);

  return (
    <ResultContainer>
      <VideoContainer>
        <Gradient className="gradient" />
        <Video crossOrigin="anonymous" src={short.uploadUrl} controls></Video>
        <MenuIcon fontSize="large" onClick={() => setShow(!show)}></MenuIcon>
        {show && (
          <MyVideoControlContainer>
            {!download && <DownloadIcon onClick={downloadVideo} fontSize="large"></DownloadIcon>}
            {download && (
              <DownloadingIcon src="../src/assets/mypage/downloading.gif"></DownloadingIcon>
            )}
            {!share && !short.youtubeUrl && (
              <IosShareIcon onClick={shareShortsToYoutube} fontSize="large"></IosShareIcon>
            )}
            {short.youtubeUrl && (
              <YoutubeIcon
                fontSize="large"
                onClick={() => window.open(short.youtubeUrl, "_blank")}
              ></YoutubeIcon>
            )}
            {share && <SharingIcon src="../src/assets/mypage/downloading.gif"></SharingIcon>}
            <DeleteIcon fontSize="large" onClick={deleteUploadedShorts}></DeleteIcon>
          </MyVideoControlContainer>
        )}
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

const ResultContainer = styled.div`
  flex-direction: column;

  position: relative;
  width: calc(100% / var(--grid-items-per-row) - var(--grid-item-margin));
  margin: calc(var(--grid-item-margin) / 2);
  color: #000;

  &.serise {
    --grid-items-per-row: 3;
    max-width: 220px;
  }

  @media screen and (min-width: 600px) {
    max-width: var(--grid-item-max-width);
  }
`;

const VideoContainer = styled.div`
  display: flex;
  position: relative;
`;

const Gradient = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  height: 100px;
  background: rgb(0, 0, 0);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.25));
  border-radius: 0 0 12px 12px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const MenuIcon = styled(Menu)`
  position: absolute;
  right: 0;
  cursor: pointer;
`;

const MyVideoControlContainer = styled.div`
  position: absolute;
  top: 23%;
  right: 0;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  height: 45%;
  justify-content: space-evenly;
  background-color: rgba(255, 255, 255, 0.7);

  border: 1px solid black;
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

export default UploadComponent;

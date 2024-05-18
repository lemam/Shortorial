import { useEffect, useState } from "react";
import { Shorts } from "../constants/types";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getTryCount, getShortsInfo } from "../apis/shorts";
import Header from "../components/header/Header";
import { CancelPresentation, EmojiPeople, MusicNote, TimerOutlined } from "@mui/icons-material";

const ShortsDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [shortsNo, setShortsNo] = useState<string>("");
  const [shortsInfo, setShortsInfo] = useState<Shorts>();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const getShorts = async (shortsNo: string) => {
    const shorts = await getShortsInfo(shortsNo);
    setShortsInfo(shorts);
  };

  const goToLearnMode = () => {
    getTryCount(shortsNo);
    navigate(`/learn/${shortsNo}`);
  };

  const goToChallengeMode = () => {
    getTryCount(shortsNo);
    navigate(`/challenge/${shortsNo}`);
  };

  const handleVideoClick = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    if (params.shortsNo) {
      setShortsNo(params.shortsNo);
      getShorts(params.shortsNo);
    }
  }, []);

  return (
    <Container>
      <Header></Header>
      <ShortsContainer>
        <VideoBox
          src={shortsInfo?.shortsLink}
          crossOrigin="anonymous"
          onClick={handleVideoClick}
        ></VideoBox>
        {showDetails && (
          <DetailContainer>
            <CancelIcon>
              <CancelPresentation onClick={handleVideoClick} />
            </CancelIcon>
            <Details>
              <Detail
                icon={<MusicNote />}
                text={shortsInfo?.shortsTitle}
                fontWeight="bold"
                fontSize="22px"
              ></Detail>
              <Detail text={shortsInfo?.shortsDirector} fontSize="18px"></Detail>
              <Detail
                icon={<TimerOutlined />}
                text={String(shortsInfo?.shortsTime) + "초"}
              ></Detail>
              <Detail
                icon={<EmojiPeople />}
                text={String(shortsInfo?.shortsChallengers) + "명의 챌린저"}
              ></Detail>
            </Details>
            <ButtonContainer>
              <RouteButton onClick={goToLearnMode}>연습모드</RouteButton>
              <RouteButton onClick={goToChallengeMode}>챌린지모드</RouteButton>
            </ButtonContainer>
          </DetailContainer>
        )}
      </ShortsContainer>
    </Container>
  );
};

export default ShortsDetailPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ShortsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 90%;
  width: 100%;
`;

const VideoBox = styled.video`
  height: 100%;
  cursor: pointer;
`;

const DetailContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  padding: 10px;
`;

const CancelIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Details = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

interface DetailType {
  text?: string;
  fontSize?: string;
  fontWeight?: string;
  icon?: JSX.Element;
}

const Detail = ({ icon, text, fontSize, fontWeight }: DetailType) => {
  return (
    <div style={{ fontSize: fontSize, fontWeight: fontWeight }}>
      {icon} {text}
    </div>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RouteButton = styled.button`
  border: 3px solid black;
  border-radius: 20px;
  background-color: #f3f3f3;
  color: black;
  padding: 8px;
  cursor: pointer;
  margin: 5px; 0px;
  font-size: 14px;

  &:hover {
    background-color: #FF7EA0;; 
  }
`;

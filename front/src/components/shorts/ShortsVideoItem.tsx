import { Link } from "react-router-dom";
import styled from "styled-components";
import { PlayArrow } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Shorts } from "../../constants/types";

interface ShortsVideoPrpos {
  shortsInfo: Shorts | undefined;
  isLoading: boolean;
}

const ShortsVideoItem = ({ shortsInfo, isLoading }: ShortsVideoPrpos) => {
  return (
    <>
      {isLoading ? (
        <SkeletonContainer>
          <Skeleton variant="rounded" className="video" />
        </SkeletonContainer>
      ) : (
        shortsInfo && (
          <VideoContainer to={`/shorts/${shortsInfo.shortsNo}`}>
            <VideoBox>
              <Video src={shortsInfo.shortsLink} crossOrigin="anonymous" />
              <Gradient className="gradient" />
              <PlayButton>
                <PlayArrow sx={{ color: "white" }} />
              </PlayButton>
            </VideoBox>
            <DetailsContainer>
              <div className="title">{shortsInfo.shortsTitle}</div>
              <div className="detail">챌린저 {shortsInfo.shortsChallengers}명</div>
            </DetailsContainer>
          </VideoContainer>
        )
      )}
    </>
  );
};

const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: rgb(0, 0, 0);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.25));
  opacity: 0;
  transition: opacity 0.2s;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 12px;
  left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  transition: background-color 0.2s;
`;

const VideoBox = styled.div`
  position: relative;

  &:hover button {
    background-color: #fb2576;
  }

  &:hover .gradient {
    opacity: 1;
  }
`;

const VideoContainer = styled(Link)`
  position: relative;
  width: calc(100% / var(--grid-items-per-row) - var(--grid-item-margin));
  margin: calc(var(--grid-item-margin) / 2);
  color: #000;

  @media screen and (min-width: 600px) {
    max-width: var(--grid-item-max-width);
  }
`;

const Video = styled.video`
  width: 100%;
  border-radius: 12px;
  object-fit: contain;
`;

const DetailsContainer = styled.div`
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .detail {
    font-size: 14px;
    color: #606060;
  }
`;

const SkeletonContainer = styled.div`
  position: relative;
  width: calc(100% / var(--grid-items-per-row) - var(--grid-item-margin));
  margin: calc(var(--grid-item-margin) / 2);
  aspect-ratio: 9 / 16;

  .video {
    height: 100%;
  }
`;

export default ShortsVideoItem;

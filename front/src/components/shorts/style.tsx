import styled from "styled-components";

export const Card = styled.div`
  position: relative;
  width: calc(100% / var(--grid-items-per-row) - var(--grid-item-margin));
  margin: calc(var(--grid-item-margin) / 2);
  cursor: pointer;
`;

export const CardVideoContainer = styled.div`
  position: relative;

  .hover-opacity {
    opacity: 0;
  }

  &:hover {
    .hover-opacity {
      opacity: 1;
    }
  }
`;

export const CardVideo = styled.video`
  width: 100%;
  border-radius: 12px;
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  height: 100px;
  background: rgb(0, 0, 0);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.25));
  border-radius: 0 0 12px 12px;
`;

export const SoundButton = styled.button`
  position: absolute;
  right: 12px;
  bottom: 16px;
  color: #fff;

  svg {
    font-size: 28px;
  }
`;

export const CardTitle = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 16px;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CardDesc = styled.div`
  font-size: 14px;
  color: #606060;
`;

export const CardVideoSkeleton = styled.div`
  border-radius: 12px;
  background-color: #e2e2e6;
  aspect-ratio: 9 / 16;
`;

export const CardTitleSkeleton = styled.div`
  height: 32px;
  margin: 6px 0;
  border-radius: 4px;
  background-color: #e2e2e6;
`;

export const CardSubTitleSkeleton = styled.div`
  width: 50%;
  height: 16px;
  margin: 6px 0;
  border-radius: 4px;
  background-color: #e2e2e6;
`;

export const CardVideoBox = styled.div`
  width: 100%;
  aspect-ratio: "9 / 16";
`;

export const Thumbnail = styled.img<{ opacity: string }>`
  position: absolute;
  z-index: 1;
  width: 100%;
  border-radius: 12px;
  opacity: ${props => props.opacity};
`;

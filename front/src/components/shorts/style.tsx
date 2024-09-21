import styled from "styled-components";

export const Card = styled.div`
  position: relative;
  width: calc(100% / var(--grid-items-per-row) - var(--grid-item-margin));
  margin: calc(var(--grid-item-margin) / 2);
  cursor: pointer;
`;

export const CardVideo = styled.video`
  width: 100%;
  border-radius: 12px;
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

export const CardSubTitle = styled.div`
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

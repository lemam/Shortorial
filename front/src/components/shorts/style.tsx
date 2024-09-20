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

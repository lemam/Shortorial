import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

interface VideoMotionButtonProps {
  id?: string;
  toolTip?: string;
  icon?: JSX.Element | undefined;
  text?: string;
  imgSrc?: string;
  link?: string;
  onClick?: () => void;
  progress?: number;
}

const VideoMotionButton = ({
  id,
  icon,
  text,
  imgSrc,
  toolTip,
  onClick,
  link = "",
  progress,
}: VideoMotionButtonProps) => {
  const handleLinkClick = (e: MouseEvent) => {
    if (!link) e.preventDefault();
  };

  return (
    <Link to={link} onClick={handleLinkClick}>
      <Container id={id} onClick={onClick}>
        <ProgressContainer>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={55}
            thickness={4}
            sx={{ color: "#FB2576" }}
          />
        </ProgressContainer>
        {icon}
        {imgSrc && <img src={imgSrc} alt="" />}
        <div className="text">{text}</div>
        <div className="tooltipText">{toolTip}</div>
      </Container>
    </Link>
  );
};

const Container = styled.button`
  position: relative;
  color: #fff;
  display: flex;
  width: 42px;
  height: 42px;
  justify-content: center;
  align-items: center;
  background-color: #35353580;
  border-radius: 50%;

  &:hover,
  &:active {
    border: 3px solid #fb2576;
  }

  .text {
    font-weight: bold;
    font-size: 14px;
  }

  .tooltipText {
    position: absolute;
    top: 50%;
    right: 68px;
    padding: 8px;
    background-color: #35353580;
    border-radius: 4px;
    visibility: hidden;
    width: max-content;
    font-size: 12px;
    transform: translateY(-50%);
  }

  &:hover .tooltipText,
  &:active .tooltipText {
    visibility: visible;
  }
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export default VideoMotionButton;

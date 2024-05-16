import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
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
  isVisible?: boolean;
}

const VideoMotionButton = ({
  id,
  icon,
  text,
  imgSrc,
  toolTip,
  onClick,
  link = "",
  progress = 0,
  isVisible = true,
}: VideoMotionButtonProps) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLinkClick = (e: MouseEvent) => {
    if (!link) e.preventDefault();
  };

  // 화면 크기 바뀔 때마다 실행
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setContainerWidth(width);
    }
  }, []);

  // window resize 이벤트 추가
  useEffect(() => {
    setTimeout(handleResize, 200);
    window.addEventListener("resize", () => setTimeout(handleResize, 200));

    return () => window.removeEventListener("resize", () => setTimeout(handleResize, 200));
  }, [handleResize]);

  return (
    <Link to={link} onClick={handleLinkClick}>
      <Container
        id={id}
        onClick={onClick}
        ref={containerRef}
        $progress={progress}
        $isVisible={isVisible}
      >
        <ProgressContainer>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={containerWidth}
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

const Container = styled.button<{ $progress: number; $isVisible: boolean }>`
  position: relative;
  color: #fff;
  display: flex;
  width: 42px;
  height: 42px;
  justify-content: center;
  align-items: center;
  background-color: #35353580;
  border-radius: 50%;
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden !important")};
  opacity: ${(props) => (props.$isVisible ? "1" : "0")};
  transition-property: opacity, visibility;
  transition-duration: 0.5s;

  &:hover,
  &:active {
    border: 3px solid #fb2576;
  }

  .text {
    font-weight: bold;
    font-size: 14px;
  }

  img {
    width: 24px;
    height: 24px;
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
  &:active .tooltipText,
  ${(props) => props.$progress > 0 && ".tooltipText"} {
    visibility: visible;
  }

  @media screen and (min-width: 768px) {
    width: 60px;
    height: 60px;
    /* margin-bottom: 50px; */

    .text {
      font-size: 18px;
    }

    svg {
      font-size: 32px;
    }

    img {
      width: 32px;
      height: 32px;
    }
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

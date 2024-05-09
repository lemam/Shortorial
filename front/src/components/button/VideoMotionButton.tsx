import { Link } from "react-router-dom";
import styled from "styled-components";

interface VideoMotionButtonProps {
  toolTip?: string;
  icon?: JSX.Element | undefined;
  text?: string;
  link?: string;
  onClick?: () => void;
}

const VideoMotionButton = ({ icon, text, toolTip, onClick, link = "" }: VideoMotionButtonProps) => {
  return (
    <Link to={link}>
      <Container onClick={onClick}>
        {icon}
        <div>{text}</div>
        <div>{toolTip}</div>
      </Container>
    </Link>
  );
};

const Container = styled.button`
  color: #fff;
  display: flex;
  width: 42px;
  height: 42px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: #35353580;
  border-radius: 50%;

  &:hover,
  &:active {
    border: 3px solid #fb2576;
  }
`;

export default VideoMotionButton;

import styled from "styled-components";

interface MotionButtonProps {
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const VideoMotionButton2 = ({ icon, onClick }: MotionButtonProps) => {
  return (
    <ControlButtonContainer
      // ref={button => (buttonRefs.current[0] = button)}
      onClick={onClick}
    >
      <ControlButton>{icon}</ControlButton>
      <CircleWrapper viewBox="0 0 60 60">
        <CircleProgress
          cx={30}
          cy={30}
          r={28}
          // progress={0 === getActiveButtonId() ? getProgress() : 0}
          progress={30}
        />
      </CircleWrapper>
    </ControlButtonContainer>
  );
};

export default VideoMotionButton2;

const ControlButtonContainer = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;

  &:hover button,
  &:active button {
    border: 3px solid #fb2576;
  }
`;

const ControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  box-sizing: border-box;

  &:hover,
  &:active {
    border: 3px solid #fb2576;
  }
`;

const CircleWrapper = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  width: 60px;
  height: 60px;
`;

const CircleProgress = styled.circle<{ r: number; progress: number }>`
  fill: none;
  stroke: #fb2576;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: ${({ r }) => r * Math.PI * 2};
  stroke-dashoffset: ${({ r, progress }) => r * Math.PI * 2 * (1 - progress / 100)};
  transition: stroke-dashoffset 0.5s ease;
`;

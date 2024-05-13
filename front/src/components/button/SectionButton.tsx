import { useMemo } from "react";
import styled from "styled-components";
import { Repeat } from "@mui/icons-material";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, SectionButtonProps {}

interface SectionButtonProps {
  time: number;
  isSmall?: boolean;
  active?: boolean;
  isLooping?: boolean;
}

const SectionButton = ({
  time,
  isSmall = false,
  active = false,
  isLooping = false,
  ...buttonAttribute
}: ButtonProps) => {
  // 출력될 시간 텍스트 반환
  const getText = useMemo(() => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formatedSeconds}`;
  }, [time]);

  return (
    <Container {...buttonAttribute} $isSmall={isSmall} $active={active}>
      <div className="text">{getText}</div>
      {isLooping && <Repeat className="icon" />}
    </Container>
  );
};

export default SectionButton;

const Container = styled.button<{ $isSmall: boolean; $active: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isSmall ? "column" : "row")};
  justify-content: ${(props) => (props.$isSmall ? "center" : "space-between")};
  align-items: center;
  padding: 0 12px;
  width: ${(props) => (props.$isSmall ? "48px" : "100%")};
  max-width: 140px;
  height: ${(props) => (props.$isSmall ? "48px" : "40px")};
  font-size: 16px;
  color: inherit;
  background-color: ${(props) => (props.$active ? "#FF95BD50" : "#353535")};
  border: 1px solid ${(props) => (props.$active ? "#FB2576" : "#808080")};
  border-radius: ${(props) => (props.$isSmall ? "50%" : "4px")};

  .icon {
    font-size: ${(props) => (props.$isSmall ? "16px" : "24px")};
  }
`;

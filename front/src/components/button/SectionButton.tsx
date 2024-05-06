import { useMemo } from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, SectionButtonProps {}

interface SectionButtonProps {
  time: number;
  isSmall?: boolean;
}

const SectionButton = ({ time, isSmall = false, ...buttonAttribute }: ButtonProps) => {
  // 출력될 시간 텍스트 반환
  const getText = useMemo(() => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formatedSeconds}`;
  }, [time]);

  return (
    <Container {...buttonAttribute} $isSmall={isSmall}>
      {getText}
    </Container>
  );
};

export default SectionButton;

const Container = styled.button<{ $isSmall: boolean }>`
  max-width: 140px;
  font-size: 16px;
  color: inherit;
  background-color: #353535;
  border: 1px solid #808080;

  width: ${(props) => {
    if (props.$isSmall) return "48px";
    return "100%";
  }};

  height: ${(props) => {
    if (props.$isSmall) return "48px";
    return "40px";
  }};

  border-radius: ${(props) => {
    if (props.$isSmall) return "50%";
    return "4px";
  }};
`;

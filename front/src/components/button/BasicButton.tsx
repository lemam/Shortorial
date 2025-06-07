import { MouseEvent } from "react";
import styled, { CSSProperties } from "styled-components";

interface ButtonType {
  text: string;
  color?: string;
  size?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
}

interface ButtonStyleType {
  [key: string]: string;
}

const BasicButton = ({ text, color = "basic", onClick, style }: ButtonType) => {
  const buttonColors: ButtonStyleType = {
    basic: "#FB2576",
  };

  const hoverButtonColors: ButtonStyleType = {
    basic: "#d4206e",
  };

  return (
    <Button color={buttonColors[color]} $hoverColor={hoverButtonColors[color]} onClick={onClick} style={style}>
      {text}
    </Button>
  );
};

export default BasicButton;

const Button = styled.button<{ color: string; $hoverColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; /* 글자 크기 */
  border: none; /* 테두리 제거 */
  border-radius: 10px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  outline: none; /* 포커스 아웃라인 제거 */
  transition: background-color 0.3s; /* 배경색 변경 애니메이션 */
  height: 50px;
  width: 100%;
  color: white;
  background-color: ${props => props.color};
  &:hover {
    background-color: ${props => props.$hoverColor};
  }

  @media screen and (max-width: 479px) {
    font-size: 80%;
    width: 12rem;
    height: 2rem;
    border-radius: 7px;
  }
`;

import { MouseEvent } from "react";
import styled from "styled-components";

interface ButtonType {
  text: string;
  color?: string;
  size?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

interface ButtonStyleType {
  [key: string]: string;
}

const BasicButton = ({ text, color = "basic", onClick }: ButtonType) => {
  // 크기에 따른 버튼 css 설정 객체
  // const buttonSizes: ButtonStyleType = {
  //   md: "px-5 py-2",
  //   lg: "px-8 py-3",
  // };

  const buttonColors: ButtonStyleType = {
    basic: "#FB2576",
    // gray: "#343a40",
  };

  const hoverButtonColors: ButtonStyleType = {
    basic: "#d4206e",
    // gray: "#1d2124",
  };

  return (
    <Button
      color={buttonColors[color]}
      hoverColor={hoverButtonColors[color]}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default BasicButton;

const Button = styled.button<{ color: string; hoverColor: string }>`
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
  background-color: ${(props) => props.color};
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }

  @media screen and (max-width: 479px) {
    font-size: 80%;
    width: 12rem;
    height: 2rem;
    border-radius: 7px;
  }
`;

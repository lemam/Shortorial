import { Check } from "@mui/icons-material";
import styled from "styled-components";

interface SectionType {
  text: string;
  isCurrent?: boolean;
  isDone?: boolean;
}

interface StyleType {
  [key: string]: {
    backgroundColor: string;
    border: string;
  };
}

const style: StyleType = {
  current: {
    backgroundColor: "#FF95BD50",
    border: " 1px solid #FB2576",
  },
};

const SectionButton = ({ text, isCurrent = false, isDone = false }: SectionType) => {
  const styleKey = isCurrent ? "current" : "default";

  return (
    <Button style={style[styleKey]}>
      <div>{text}</div>
      <CheckIcon $isDone={isDone}>
        <Check fontSize="small" />
      </CheckIcon>
    </Button>
  );
};

export default SectionButton;

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 140px;
  padding: 8px 16px;
  font-size: 16px;
  color: #fff;
  background-color: #353535;
  border: 1px solid #808080;
  border-radius: 4px;
`;

const CheckIcon = styled.div<{ $isDone: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #fb2576;
  border-radius: 50%;
  visibility: ${(props) => (props.$isDone ? "visible" : "hidden")};
`;

import { styled } from "styled-components";

interface SignUpType {
  cate: string;
  subContent?: string;
  getValue: (value: string) => void;
}
const InputComponent = ({ cate, subContent = "", getValue }: SignUpType) => {
  // 입력값이 변경될 때마다 호출될 함수
  const handleChange = (event: any) => {
    // 입력된 값으로 상태 업데이트
    getValue(event.target.value);
  };

  return (
    <InputForm text={subContent}>
      <Content>{cate}</Content>
      <input
        placeholder={cate}
        onChange={handleChange}
        style={{ width: "100%" }}
      ></input>
      <SubContent text={subContent}>{subContent}</SubContent>
    </InputForm>
  );
};

export default InputComponent;

const InputForm = styled.div<{ text: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${(props) => (props.text == "" ? "5%" : "")};
  width: 100%;
  gap: 6px;
`;

const Content = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #000000;

  flex: none;
  order: 0;
  flex-grow: 0;
`;

const SubContent = styled.div<{ text: string }>`
  display: ${(props) => (props.text == "" ? "none" : "flex")};
  width: 100%;
  height: 17px;
  right: 0px;

  font-family: "Inter";
  font-style: normal;
  font-size: 14px;
  line-height: 17px;

  color: #000000;

  flex: none;
  order: 2;
  flex-grow: 0;
`;
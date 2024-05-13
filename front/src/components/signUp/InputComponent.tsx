import { styled } from "styled-components";

interface SignUpType {
  cate: string; // 입력값 이름. placeholder 에도 들어감
  subContent?: string; // 부가설명. 없으면 안넣어도 됨
  type?: string;
  scColor?: string;
  getValue: (value: string) => void; //input으로 입력받은 값을 저장할 함수
}

interface ScColorType {
  [key: string]: string;
}

const InputComponent = ({
  cate,
  subContent = "",
  type,
  scColor = "black",
  getValue,
}: SignUpType) => {
  // 설명값 색상
  const scColors: ScColorType = {
    black: "#000000",
    red: "#ff0000",
    blue: "#0000ff",
    gray: "#c2c2c2",
  };
  // 입력값이 변경될 때마다 호출될 함수
  const handleChange = (event: any) => {
    // 입력된 값으로 상태 업데이트
    getValue(event.target.value);
  };

  return (
    <InputForm text={subContent}>
      {/* <Content>{cate}</Content> */}
      <BasicInput
        type={type}
        placeholder={cate}
        onChange={handleChange}
      ></BasicInput>
      <SubContent text={subContent} color={scColors[scColor]}>
        {subContent}
      </SubContent>
    </InputForm>
  );
};

export default InputComponent;

const InputForm = styled.div<{ text: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 6px;

  @media screen and (max-width: 479px) {
    gap: 3px;
  }
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
  @media screen and (max-width: 479px) {
    font-size: 13px;
  }
`;

const SubContent = styled.div<{ text: string; color: string }>`
  display: ${(props) => (props.text == "" ? "none" : "flex")};
  width: 100%;
  height: 17px;
  justify-content: flex-end;

  font-family: "Inter";
  font-style: normal;
  font-size: x-small;
  line-height: 17px;

  color: ${(props) => props.color};

  flex: none;
  order: 2;
  flex-grow: 0;
  @media screen and (max-width: 479px) {
    font-size: 10px;
  }
`;

// 일반 입력창
// const BasicInput = styled.input`
//   width: 100%;
//   height: 40px;
//   text-indent: 2%;
//   border-radius: 10px; /* 기본 테두리 스타일 설정 */
//   border: 1px solid #c5c5c5; /* 기본 테두리 스타일 설정 */
//   transition: border-color 0.3s; /* 테두리 색상 변경 애니메이션 */
//   &:focus {
//     outline: none;
//     border-color: #fb2576;
//     border-width: 2px;
//   }

//   &::placeholder {
//     // text-indent: 2%; /* 왼쪽에 10px의 공백을 추가합니다. */
//     font-size: 80%; /* Placeholder의 글꼴 크기를 조절합니다. */
//     color: #999; /* Placeholder의 색상을 조절합니다. */
//   }
//   @media screen and (max-width: 479px) {
//     height: 30px;
//     border-radius: 5px;
//     font-size: 10px;
//   }
// `;

// 밑줄 버전
const BasicInput = styled.input`
  width: 100%;
  height: 40px;
  text-indent: 2%;
  border: none;
  border-bottom: 1px solid #c5c5c5; /* 기본 테두리 스타일 설정 */
  transition: border-color 0.3s; /* 테두리 색상 변경 애니메이션 */
  &:focus {
    outline: none;
    border-color: #fb2576;
    border-width: 2px;
  }

  &::placeholder {
    // text-indent: 2%; /* 왼쪽에 10px의 공백을 추가합니다. */
    font-size: 80%; /* Placeholder의 글꼴 크기를 조절합니다. */
    color: #999; /* Placeholder의 색상을 조절합니다. */
  }
  @media screen and (max-width: 479px) {
    height: 30px;
    border-radius: 5px;
    font-size: 10px;
  }
`;

import InputComponent from "../components/signUp/InputComponent";
import BasicButton from "../components/button/BasicButton";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { check } from "../modules/Member";
import { signUp } from "../apis/member";

const SignUpPage = () => {
  const navigate = useNavigate();

  // input에서 입력받아야할 변수
  const [id, setId] = useState<string>("");
  const [checkId, setCheckId] = useState<string>("");

  const [pass, setPass] = useState<string>("");
  const [checkPass, setCheckPass] = useState<string>("");

  const [passConfirm, setPassConfirm] = useState<string>("");
  const [checkPassConfirm, setCheckPassConfirm] = useState<string>("");

  const [nickname, setNickname] = useState<string>("");
  const [checkNickname, setCheckNickname] = useState<string>("");

  const [isId, setIsId] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [isPassConfirm, setIsPassConfirm] = useState<boolean>(false);
  const [isNickname, setIsNickname] = useState<boolean>(false);

  // 회원가입 실행
  const signUpForm = async () => {
    if (!id || !pass || !passConfirm || !nickname) {
      if (!id) alert("아이디를 확인해주세요.");
      else if (!pass) alert("비밀번호를 확인해주세요.");
      else if (!passConfirm) alert("비밀번호 확인을 확인해주세요.");
      else if (!nickname) alert("닉네임을 확인해주세요");
      return;
    }

    const rslt = await signUp(id, pass, nickname);
    console.log(rslt);
    navigate("/learn");
  };

  // 아이디
  useEffect(() => {
    // 비동기 작업을 수행할 함수를 선언
    (async () => {
      try {
        setIsId(await check("id", id, setCheckId));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id]); // id 값이 변경될 때마다 useEffect 실행

  // 비밀번호
  useEffect(() => {
    // 비동기 작업을 수행할 함수를 선언
    (async () => {
      try {
        setIsPass(await check("pass", pass, setCheckPass));
        if (passConfirm) {
          setIsPassConfirm(
            await check("passConfirm", passConfirm, setCheckPassConfirm, pass)
          );
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [pass]); // pass 값이 변경될 때마다 useEffect 실행

  // 비밀번호 확인
  useEffect(() => {
    // 비동기 작업을 수행할 함수를 선언
    (async () => {
      try {
        setIsPassConfirm(
          await check("passConfirm", passConfirm, setCheckPassConfirm, pass)
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [passConfirm]); // passConfirm 값이 변경될 때마다 useEffect 실행

  // 닉네임
  useEffect(() => {
    // 비동기 작업을 수행할 함수를 선언
    (async () => {
      try {
        setIsNickname(await check("nickname", nickname, setCheckNickname));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [nickname]); // nickname 값이 변경될 때마다 useEffect 실행

  return (
    <TotalPage>
      <Title>Let's Dance</Title>
      <SignUp>
        <Input>
          <NameContainer> 회원가입 </NameContainer>
          <InputComponent
            cate="아이디"
            subContent={checkId}
            scColor={isId ? "blue" : "red"}
            getValue={setId}
          />
          <InputComponent
            cate="비밀번호"
            type="password"
            subContent={checkPass}
            scColor={isPass ? "blue" : "red"}
            getValue={setPass}
          />
          <InputComponent
            cate="비밀번호 확인"
            type="password"
            subContent={checkPassConfirm}
            scColor={isPassConfirm ? "blue" : "red"}
            getValue={setPassConfirm}
          />
          <InputComponent
            cate="닉네임"
            subContent={checkNickname}
            scColor={isNickname ? "blue" : "red"}
            getValue={setNickname}
          />
        </Input>
        <Btn>
          <BasicButton text="완료" onClick={signUpForm} />
        </Btn>
      </SignUp>
    </TotalPage>
  );
};

export default SignUpPage;

const TotalPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;

  @media screen and (max-width: 479px) {
    padding-bottom: 20%;
  }

  @media screen and (orientation: landscape) and (hover: none) and (pointer: coarse) {
    justify-content: flex-start;
    height: auto;
    padding: 5% 0%;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  height: 15%;

  @media screen and (max-width: 479px) {
    font-size: 24px; /* 화면 너비가 479px 이하 또는 뷰포트의 절반 이하일 때 적용됩니다. */
    height: 15%;
  }

  @media screen and (orientation: landscape) and (hover: none) and (pointer: coarse) {
    padding-bottom: 3%;
  }
`;

const SignUp = styled.div`
  background-color: white;
  display: flex;
  justiy-content: center;
  align-items: center;
  width: 25rem;
  height: 30rem;
  border-radius: 10px;
  flex-direction: column;

  @media screen and (max-width: 479px) {
    width: 15rem;
    height: 25rem;
  }
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  margin-bottom: 10%;
  color: black;
  text-weight: bold;
  border-bottom: 2px solid #fb2576;
`;

const Input = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 80%;
  height: 80%;
`;

const Btn = styled.div`
  height: 20%;
  width: 80%;
  display: flex;
  align-items: top;
  justify-content: center;

  @media screen and (max-width: 479px) {
    font-size: 80%;
    width: 100%;
  }
`;

import useLoginStore from "../store/useLoginStore";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMemberInfo, postLogin } from "../apis/login";
import WarningIcon from "@mui/icons-material/Warning";
import { styled } from "styled-components";
import InputComponent from "../components/signUp/InputComponent";
import ButtonAsset from "../components/button/ButtonAsset";
import VerticalDivider from "../components/login/VerticalDivider";
import BasicButton from "../components/button/BasicButton";

export default function LoginForm() {
  const { setLoginMember, setLoginMemberIdx, getIsLogin } = useLoginStore();

  //아이디, 비밀번호
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  //로그인 실패 확인
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      //로그인 회원 인덱스 저장

      await postLogin(id, password);

      //로그인한 회원 인덱스
      const data = await getMemberInfo();
      setLoginMemberIdx(data?.idx);
      setLoginMember(data?.info);

      //로그인하기 이전 페이지로 이동

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "400") {
          setHasError(true);
        } else if (error.name === "Unauthorized") {
          alert(error.message);
          navigate("/");
        }
      }
    }
  }

  useEffect(() => {
    //로그인한 유저는 메인페이지로 튕김
    if (getIsLogin()) navigate("/");
  }, [getIsLogin, navigate]);

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div className="">
  //       <Link to="/">
  //         <img src="" alt="로고자리" className="" />
  //       </Link>
  //     </div>
  //     {hasError && (
  //       <div className="">
  //         <WarningIcon color="error" className="" />
  //         <span className="">아이디 또는 비밀번호가 맞지 않습니다.</span>
  //       </div>
  //     )}
  //     <Login>
  //       <Input>
  //         <InputComponent cate="id"  getValue={setId} />
  //         <InputComponent cate="password" getValue={setPassword} />
  //       </Input>
  //       <ButtonAsset text="로그인" />
  //       <div className="">
  //         <Link to="/help/idInquiry">아이디 찾기</Link>
  //         <VerticalDivider />
  //         <Link to="/help/pwInquiry">비밀번호 찾기</Link>
  //         <VerticalDivider />
  //         <Link to="/signup">회원가입</Link>
  //       </div>
  //     </Login>
  //   </form>
  // );
  return (
    <TotalPage>
      <Title>Let's Dance</Title>
      <Login>
        <Input>
          <NameContainer> 로그인 </NameContainer>
          <InputComponent cate="아이디" getValue={setId} />
          <InputComponent
            cate="비밀번호"
            type="password"
            getValue={setPassword}
          />
        </Input>
        <Btn>
          <BasicButton text="완료" onClick={handleSubmit} />
        </Btn>
        <FindContent>
          <Find to="/help/idInquiry">아이디 찾기&nbsp;|&nbsp;</Find>
          <Find to="/help/pwInquiry">비밀번호 찾기&nbsp;|&nbsp;</Find>
          <Find to="/sign-up">회원가입</Find>
        </FindContent>
      </Login>
    </TotalPage>
  );
}

const TotalPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding-bottom: 10%;

  @media screen and (max-width: 479px) {
    padding-bottom: 45%;
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

const Login = styled.div`
  background-color: white;
  display: flex;
  justiy-content: center;
  align-items: center;
  width: 25rem;
  height: 23rem;
  border-radius: 10px;
  flex-direction: column;

  @media screen and (max-width: 479px) {
    width: 15rem;
    height: 15rem;
  }
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
  margin-bottom: 10%;
  color: black;
  text-weight: bold;
  border-bottom: 2px solid #fb2576;

  @media screen and (max-width: 479px) {
    padding-bottom: 10%;
  }
`;

const Input = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 80%;
  height: 70%;
`;

const Btn = styled.div`
  height: 16%;
  width: 80%;
  display: flex;
  align-items: top;
  justify-content: center;

  @media screen and (max-width: 479px) {
    font-size: 80%;
    width: 100%;
    border-radius: 6px;
  }
`;

const FindContent = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
  height: 10%;
`;

const Find = styled(Link)`
  font-size: x-small;
  color: #c3c3c3;

  @media screen and (max-width: 479px) {
    font-size: xx-small;
  }

  // 가로모드
  @media screen and (orientation: landscape) and (hover: none) and (pointer: coarse) {
    font-size: xx-small;
  }
  }
`;

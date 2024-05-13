import useLoginStore from "../store/useLoginStore";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMemberInfo, postLogin } from "../apis/login";
import WarningIcon from "@mui/icons-material/Warning";
import { styled } from "styled-components";
import InputComponent from "../components/login/InputComponent";
import ButtonAsset from "../components/button/ButtonAsset";
import VerticalDivider from "../components/login/VerticalDivider";


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

  return (
    <form onSubmit={handleSubmit}>
      <div className="">
        <Link to="/">
          <img src="" alt="로고자리" className="" />
        </Link>
      </div>
      {hasError && (
        <div className="">
          <WarningIcon color="error" className="" />
          <span className="">아이디 또는 비밀번호가 맞지 않습니다.</span>
        </div>
      )}
      <Login>
        <Input>
          <InputComponent cate="id"  getValue={setId} />
          <InputComponent cate="password" getValue={setPassword} />
        </Input>
        <ButtonAsset text="로그인" />
        <div className="">
          <Link to="/help/idInquiry">아이디 찾기</Link>
          <VerticalDivider />
          <Link to="/help/pwInquiry">비밀번호 찾기</Link>
          <VerticalDivider />
          <Link to="/signup">회원가입</Link>
        </div>
      </Login>
    </form>
  );
}


const Login = styled.div`
  display: block;
  width: 30%;
  border: 3px solid black;
`;

const Input = styled.div`
  display: block;
  width: 80%;
  margin: 10%;
`;

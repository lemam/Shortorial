import { CSSProperties, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useLoginStore from "../../store/useLoginStore";

interface HeaderProps {
  style?: CSSProperties;
}

const Header = ({ style }: HeaderProps) => {
  const isLogin = useLoginStore((state) => state.getIsLogin());
  const navigate = useNavigate();

  const logout = (e: MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Container style={style}>
      <Wrapper>
        <div>로고 들어갈 곳</div>
        <LinkWrapper>
          {!isLogin ? (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/sign-up">회원가입</Link>
            </>
          ) : (
            <>
              <Link to="/mypage">마이페이지</Link>
              <Link to="" onClick={logout}>
                로그아웃
              </Link>
            </>
          )}
        </LinkWrapper>
      </Wrapper>
    </Container>
  );
};

const LinkWrapper = styled.div`
  a {
    color: #000;
    font-weight: bold;
  }

  a:first-child {
    margin-right: 20px;
  }

  a:hover {
    color: #fb2576;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 100%;
  margin: 0 auto;
`;

const Container = styled.header`
  position: relative;
  width: 100%;
  height: 60px;
  background-color: #fff;
  z-index: 100;
`;

export default Header;

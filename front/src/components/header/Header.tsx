import { CSSProperties, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "/src/assets/logo.png";
import useLoginStore from "../../store/useLoginStore";

interface HeaderProps {
  style?: CSSProperties;
}

const Header = ({ style }: HeaderProps) => {
  const isLogin = useLoginStore((state) => state.getIsLogin());
  const logout = useLoginStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogoutClick = (e: MouseEvent) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <Container style={style}>
      <Wrapper>
        <LogoContainer to="/main">
          <LogoImg src={logo} alt="" />
        </LogoContainer>
        <LinkWrapper>
          {!isLogin ? (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/sign-up">회원가입</Link>
            </>
          ) : (
            <>
              <Link to="/mypage">마이페이지</Link>
              <Link to="" onClick={handleLogoutClick}>
                로그아웃
              </Link>
            </>
          )}
        </LinkWrapper>
      </Wrapper>
    </Container>
  );
};

const LogoContainer = styled(Link)`
  height: 40px;
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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

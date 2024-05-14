import { Link } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  return (
    <Container>
      <Wrapper>
        <div>로고 들어갈 곳</div>
        {/* TODO: 로그인 상태이면 마이페이지, 로그아웃으로 변경 */}
        <LinkWrapper>
          <Link to="/login">로그인</Link>
          <Link to="/sign-up">회원가입</Link>
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
`;

export default Header;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImg from "/src/assets/landing/hero.jpg";
import device from "/src/assets/landing/device.png";
import service from "/src/assets/landing/service.png";
import Header from "../components/header/Header";
import useLoginStore from "../store/useLoginStore";

const LandingPage = () => {
  const isLogin = useLoginStore((state) => state.getIsLogin());
  const navigate = useNavigate();

  // 로그인한 유저의 접근 막기
  useEffect(() => {
    if (isLogin) navigate("/main");
  }, [isLogin, navigate]);

  return (
    <Container>
      <Header style={{ position: "fixed" }} />
      <HeroContainer>
        <HeroImg src={heroImg} alt="" />
        <HeroTextContainer>
          <h1 className="title">{`SHORTORIAL에서\n쉽고 빠르게\n챌린지에 도전하세요`}</h1>
          <h2 className="subTitle">모션 인식 기반 댄스 챌린지 연습 서비스</h2>
        </HeroTextContainer>
      </HeroContainer>
      <Section>
        <h1 className="title">{`숏토리얼과 함께라면 여기가 나만의 연습실`}</h1>
        <p className="subTitle">
          {`웹캠 또는 스마트폰 카메라 하나로\n언제 어디서나 챌린지를 연습해보세요.`}
        </p>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "50%",
              transform: "translateX(-50%) rotate(270deg)",
              width: "80%",
            }}
          >
            <img
              src={service}
              alt=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "57%",
                height: "auto",
              }}
            />
            <img
              src={device}
              alt=""
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </Section>
      <Section>
        <div>
          <h1 className="title">{`이제 멀리서 걸어오실 필요 없어요`}</h1>
          <p className="subTitle">{`춤추다가 걸어와서 버튼 누르고...\n이런 경험 없으신가요?`}</p>
          <p className="subTitle">{`이런 귀찮은 과정은\n저희가 도와드릴게요.`}</p>
          <p className="subTitle">
            {`별다른 기기 부착 없이 카메라로 모션을 인식하여 멀리서도 버튼 조작이 가능해요.`}
          </p>
        </div>
        <div
          style={{
            position: "relative",
            // TODO: 가로 핸드폰 이미지를 만들어야 함. 돌리면 세로 여백이 너무 김. 근데 이거 아이폰인데 괜찮나
            // 이러면 아래 absolute를 할 필요 없지 않나...
            // display: flex;
            // align-items: center;
            // justify-content: center;
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "50%",
              transform: "translateX(-50%) rotate(270deg)",
              width: "80%",
            }}
          >
            <img
              src={service}
              alt=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "57%",
                height: "auto",
              }}
            />
            <img
              src={device}
              alt=""
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </Section>
    </Container>
  );
};

// const ImgContainer = styled.div`
//   /* position: relative;
//   width: 600px;
//   height: 936px; */

//   /* position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: auto; */

//   position: absolute;
//   top: 50%;
//   left: 50%;
//   width: 220px;
//   height: auto;
//   transform: translateX(-50%) rotate(270deg);
// `;

const Section = styled.section`
  position: relative;
  width: 300px;
  margin: 0 auto;
  padding-top: 70px;
  padding-bottom: 230px;
  box-sizing: border-box;
`;

const HeroTextContainer = styled.div`
  position: relative;

  & > * {
    text-align: center;
    color: #fff;
  }

  h2 {
    font-size: 18px;
  }
`;

const HeroImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  word-break: keep-all;
  white-space: pre-wrap;

  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .subTitle {
    font-size: 18px;
    line-height: 1.4;
  }
`;

export default LandingPage;

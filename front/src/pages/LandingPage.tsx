import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImg from "/src/assets/landing/hero.jpg";
// import device from "/src/assets/landing/device3.png";
import deviceLandscape from "/src/assets/landing/device_landscape.png";
// import service from "/src/assets/landing/service.png";
import serviceLandscape from "/src/assets/landing/service_landscape.png";
import Header from "../components/header/Header";
import useLoginStore from "../store/useLoginStore";
import BasicButton from "../components/button/BasicButton";
import useScrollFadeIn from "../hooks/useScrollFadeIn";

const LandingPage = () => {
  const isLogin = useLoginStore((state) => state.getIsLogin());
  const navigate = useNavigate();

  const scroll1 = useScrollFadeIn({ direction: "none", duration: 1 });
  const scroll7 = useScrollFadeIn({ direction: "none", duration: 1 });
  const scroll2 = useScrollFadeIn();
  const scroll3 = useScrollFadeIn();
  const scroll4 = useScrollFadeIn();
  const scroll5 = useScrollFadeIn();
  const scroll6 = useScrollFadeIn();

  // 로그인한 유저의 접근 막기
  useEffect(() => {
    if (isLogin) navigate("/main");
  }, [isLogin, navigate]);

  return (
    <Container>
      <Header style={{ position: "fixed" }} />
      <HeroContainer>
        <HeroImg src={heroImg} alt="" />
        <HeroTextContainer {...scroll1}>
          <h1 className="title">{`SHORTORIAL에서\n쉽고 빠르게\n챌린지에 도전하세요`}</h1>
          <h2 className="subTitle">모션 인식 기반 댄스 챌린지 연습 서비스</h2>
        </HeroTextContainer>
        <CTAButtonContainer {...scroll7}>
          <BasicButton
            text="지금 시작하기"
            style={CTAButtonStyled}
            onClick={() => navigate("/main")}
          />
        </CTAButtonContainer>
      </HeroContainer>
      <Section {...scroll2}>
        <h1 className="title">{`숏토리얼과 함께라면 여기가 나만의 연습실`}</h1>
        <p className="subTitle">
          {`웹캠 또는 스마트폰 카메라 하나로\n언제 어디서나 챌린지를 연습해보세요.`}
        </p>
        <ImageContainer>
          <ServiceImg src={serviceLandscape} alt="" />
          <DeviceImg src={deviceLandscape} alt="" />
        </ImageContainer>
      </Section>
      <Section {...scroll3}>
        <div>
          <h1 className="title">{`이제 멀리서 걸어오실 필요 없어요`}</h1>
          <p className="subTitle">{`춤추다가 걸어와서 버튼 누르고...\n이런 귀찮은 과정은 저희가 해결해드릴게요.`}</p>
        </div>
        <ImageContainer>
          <ServiceImg src={serviceLandscape} alt="" />
          <DeviceImg src={deviceLandscape} alt="" />
        </ImageContainer>
        <p className="text">
          {`별다른 기기 부착 없이 카메라로 모션을 인식하여 멀리서도 버튼 조작이 가능해요.`}
        </p>
      </Section>
      <Section {...scroll4}>
        <h1 className="title">인기 챌린지를 한눈에</h1>
        <p className="subTitle">지금 유행하는 다양한 댄스 챌린지에 도전해보세요.</p>
        <p className="text">당신이 좋아할만한 챌린지도 추천해드릴게요.</p>
      </Section>
      <Section {...scroll5}>
        <h1 className="title">촬영에서 업로드까지</h1>
        <p className="subTitle">{`연습한 그 자리에서 바로 촬영하고\nSNS에 공유해보세요.`}</p>
        <ImageContainer>
          <ServiceImg src={serviceLandscape} alt="" />
          <DeviceImg src={deviceLandscape} alt="" />
        </ImageContainer>
      </Section>
      <CenterSection {...scroll6}>
        <h1 className="title bg">{`춤 출 준비 되셨나요?`}</h1>
        <p className="subTitle">{`처음이라도 괜찮아요!`}</p>
        <p className="subTitle">{`숏토리얼은\n혼자서, 자신만의 속도로\n춤을 연습할 수 있어요.`}</p>
        <p className="subTitle">{`지금 바로 챌린지에 참여해보세요!`}</p>
        <BasicButton
          text="지금 시작하기"
          style={CTAButtonStyled}
          onClick={() => navigate("/main")}
        />
      </CenterSection>
    </Container>
  );
};

const CTAButtonContainer = styled.div`
  z-index: 10;
`;

const CTAButtonStyled = {
  width: "auto",
  height: "auto",
  marginTop: "20px",
  padding: "11px 16px",
  fontSize: "17px",
  zIndex: "10",
};

const DeviceImg = styled.img`
  width: 100%;
  height: 100%;
`;

const ServiceImg = styled.img`
  position: absolute;
  top: 53%;
  left: 50%;
  width: 90%;
  border-radius: 1rem;
  box-shadow: 12px 12px 15px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Section = styled.section`
  position: relative;
  width: 300px;
  margin: 0 auto;
  padding-top: 100px;
  padding-bottom: 50px;
  box-sizing: border-box;

  @media screen and (min-width: 600px) {
    width: 550px;
    padding-top: 120px;
    padding-bottom: 80px;
  }

  @media screen and (min-width: 1024px) {
    width: 750px;
    padding-top: 150px;
    padding-bottom: 100px;
  }
`;

const CenterSection = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroTextContainer = styled.div`
  position: relative;
  z-index: 10;

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
  z-index: 10;
`;

const HeroContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  word-break: keep-all;
  white-space: pre-wrap;
  background-color: #f9f9f9;

  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .bg {
    color: #fff;
    background-color: #000;
    padding: 6px 8px;
  }

  .subTitle {
    font-size: 20px;
    line-height: 1.4;
  }

  .text {
    margin: 50px 0 0;
    color: #333d4b;
    font-size: 18px;
    line-height: 1.4;
  }
`;

export default LandingPage;

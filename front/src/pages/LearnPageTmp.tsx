import styled from "styled-components";
import MotionCamera from "../components/motion/MotionCamera";
import MotionVideo from "../components/motion/MotionVideo";
// import MotionVideo2 from "../components/motion/MotionVideo copy";
// import { Acc } from "../modules/Acc";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useState } from "react";
import { setBtnInfo } from "../modules/Motion";
// import { text } from "stream/consumers";

export default function LearnPage() {
  const [, setVideoLandmark] = useState<NormalizedLandmark[] | null>(null);

  // const [camLandmark, setCamLandmark] = useState<NormalizedLandmark[] | null>(
  //   null
  // );

  // const [accValue, setAccValue] = useState(0);

  const getVideoLandmark = (landmarkData: NormalizedLandmark[]) => {
    setVideoLandmark(landmarkData);
  };

  // const getCamLandmark = (landmarkData: NormalizedLandmark[]) => {
  //   setCamLandmark(landmarkData);
  // };

  // const accValue =
  //   videoLandmark && camLandmark ? Acc(videoLandmark, camLandmark) : 0;

  // useEffect(() => {
  //   if (videoLandmark && camLandmark) {
  //     const accValue = Acc(videoLandmark, camLandmark);
  //     setAccValue(accValue);
  //     // console.log(accValue);
  //   }
  // }, [videoLandmark, camLandmark]);
  useEffect(() => {
    setBtnInfo();
  }, []);
  return (
    <Container>
      <VideoContainer>
        <MotionVideo width={500} height={700} getLandmark={getVideoLandmark} />
      </VideoContainer>
      {/* <VideoContainer>
        <MotionVideo2 width={500} height={700} getLandmark={getCamLandmark} />
      </VideoContainer> */}
      <MotionCameraContainer>
        <MotionCamera width={500} height={700} />
      </MotionCameraContainer>
      {/* <div id="Acc" style={{ background: "white", width: "100%" }}>
        Acc: {accValue}
      </div> */}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000;

  @media screen and (orientation: portrait) {
    flex-direction: column;
  }

  @media screen and (orientation: landscape) {
    flex-direction: row;
    justify-content: center;
  }
`;

const VideoContainer = styled.div`
  @media screen and (orientation: portrait) {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
  }

  @media screen and (orientation: landscape) {
    height: 100%;
  }
`;

const MotionCameraContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media screen and (orientation: portrait) {
    display: block;
  }

  @media screen and (orientation: landscape) {
    display: block;
    transform: scaleX(-1); // 수평으로 뒤집기
  }
`;

import { useCallback, useEffect, useRef } from "react";
import danceVideo from "/src/assets/sample.mp4";
import styled from "styled-components";
import IconButton from "../components/IconButton";
import { Videocam } from "@mui/icons-material";

const VideoEditPage = () => {
  
  console.log("VideoEditPage")
  
  return (
    <Container>
      <h1> Video Edit Page</h1>
      {/* <VideoContainer>
        <video src={danceVideo} ref={videoRef} controls></video>
      </VideoContainer>
      <CameraContainer>
        <Camera ref={cameraRef} autoPlay></Camera>
        <IconButton icon={<Videocam />} text="챌린지 모드" link="/challenge" />
      </CameraContainer> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  background-color: #000;
`;

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const CameraContainer = styled.div`
  position: relative;
  display: none;

  @media screen and (min-width: 1024) {
    display: flex;
  }

  @media screen and (orientation: landscape) {
    display: flex;
  }
`;

const Camera = styled.video`
  transform: scaleX(-1);
`;

export default VideoEditPage;

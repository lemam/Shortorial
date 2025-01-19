import { useCallback, useEffect, useRef, useState } from "react";
import MotionCameraTest from "./MotionCameraTest";
import useCameraStore from "./useCameraStore";
import { Shorts } from "../../constants/types";
import { useParams } from "react-router-dom";
import { getShortsInfo } from "../../apis/shorts";
import styled from "styled-components";

interface Size {
  width: number;
  height: number;
}

function LearnPageTest() {
  const [videoInfo, setVideoInfo] = useState<Shorts | null>(null);
  const { userPermission } = useCameraStore();
  const params = useParams();

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });

  // 쇼츠 영상 데이터 가져오기
  const loadVideo = useCallback(async () => {
    if (params.shortsNo) {
      const data: Shorts = await getShortsInfo(params.shortsNo);
      if (data) setVideoInfo(data);
    }
  }, [params.shortsNo]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // 비디오 요소 크기 계산
  // TODO: 화면이 바뀔 때마다 다시 게산하도록 수정해야 한다.
  useEffect(() => {
    if (videoSectionRef.current && videoInfo) {
      const width = videoSectionRef.current.offsetWidth / 2;
      const height = videoSectionRef.current.offsetHeight;
      const ratioWidth = (height * 9) / 16;

      if (width >= ratioWidth) setVideoSize({ width: ratioWidth, height });
      else setVideoSize({ width, height: (width * 16) / 9 });

      // console.log("Width:", width, "Height:", height);
    }
  }, [videoInfo]);

  return (
    <Layer>
      {!userPermission && (
        <div>카메라 접근이 차단되었습니다. 상단 아이콘을 클릭하여 접근을 허용 후 새로고침해주세요.</div>
      )}
      <Container style={{ padding: "0 16px" }}>
        <TimestampSection style={{ flexBasis: "160px" }}>
          <Button>0:00</Button>
          <Button>0:10</Button>
          <Button>0:20</Button>
          <Button>0:30</Button>
        </TimestampSection>
        <VideoSection ref={videoSectionRef} style={{ flex: "1", background: "lightblue" }}>
          {videoInfo && (
            <VideoContainer>
              <VideoBox
                style={{ position: "relative", width: `${videoSize.width}px`, height: `${videoSize.height}px` }}
              >
                <Video src={videoInfo?.shortsLink} crossOrigin="anonymous"></Video>
              </VideoBox>
            </VideoContainer>
          )}
          {/* TODO: 비디오가 켜질 때까지 기다리기... 화면에 표시해주기 */}
          <VideoContainer>
            <VideoBox style={{ position: "relative", width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
              <MotionCameraTest />
            </VideoBox>
          </VideoContainer>
        </VideoSection>
      </Container>
    </Layer>
  );
}

const Layer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Container = styled(Layer)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  /* @media screen and (min-width: 800px) {
    flex-direction: row;
  } */
`;

const TimestampSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 48px;
`;

const Button = styled.button`
  width: 160px;
  height: 40px;
  margin: 8px 0;
  border-radius: 4px;
  border: 1px solid red;
`;

const VideoSection = styled.section`
  display: flex;
  /* width: 100%; */
  justify-content: center;
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

const VideoBox = styled.div`
  height: 100%;
  aspect-ratio: 9/16;
`;

const Video = styled.video`
  width: 100%;
`;

export default LearnPageTest;

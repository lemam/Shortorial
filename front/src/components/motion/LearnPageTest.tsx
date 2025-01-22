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

  const timestampSectionRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });

  // 쇼츠 영상 데이터 가져오기
  const loadVideo = useCallback(async () => {
    if (params.shortsNo) {
      const data: Shorts = await getShortsInfo(params.shortsNo);
      if (data) setVideoInfo(data);
    }
  }, [params.shortsNo]);

  // 비디오 요소 크기 계산
  // TimestampSection 크기를 제외한 컨테이너 넓이에 적절한 비디오 너비/높이를 계산하여 videoSize에 저장한다.
  const calcVideoSize = useCallback(() => {
    const section = timestampSectionRef.current;

    if (section && videoInfo) {
      const totalWidth = window.innerWidth - section.offsetWidth; // 사용 가능한 VideoSection 너비
      const width = totalWidth / 2;
      const height = section.offsetHeight;
      const ratioWidth = (height * 9) / 16;

      // 사용 가능한 너비가 비율에 맞춰 계산한 너비보다 넓은 경우 화면에 꽉차게 출력한다.
      if (width >= ratioWidth) setVideoSize({ width: ratioWidth, height });
      else setVideoSize({ width, height: (width * 16) / 9 });
    }
  }, [videoInfo]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  useEffect(() => {
    calcVideoSize();
    window.addEventListener("resize", calcVideoSize);

    return () => window.addEventListener("resize", calcVideoSize);
  }, [calcVideoSize]);

  return (
    <Layer>
      {!userPermission && (
        <div>카메라 접근이 차단되었습니다. 상단 아이콘을 클릭하여 접근을 허용 후 새로고침해주세요.</div>
      )}
      <Container>
        <TimestampSection ref={timestampSectionRef}>
          <Button>0:00</Button>
          <Button>0:10</Button>
          <Button>0:20</Button>
          <Button>0:30</Button>
        </TimestampSection>
        <VideoSection>
          {videoInfo && (
            <VideoContainer>
              <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
                <Video src={videoInfo.shortsLink} crossOrigin="anonymous"></Video>
              </VideoBox>
            </VideoContainer>
          )}
          {/* TODO: 비디오가 켜질 때까지 기다리기... 화면에 표시해주기 */}
          <VideoContainer>
            <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
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
  flex-basis: 160px;
  flex-shrink: 0;
  padding: 0 24px;
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
  justify-content: center;
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

const VideoBox = styled.div`
  position: relative;
  height: 100%;
  aspect-ratio: 9/16;
`;

const Video = styled.video`
  width: 100%;
`;

export default LearnPageTest;

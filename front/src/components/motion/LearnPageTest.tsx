import { useCallback, useEffect, useRef, useState } from "react";
import MotionCameraTest from "./MotionCameraTest";
import useCameraStore from "./useCameraStore";
import { Shorts } from "../../constants/types";
import { useParams } from "react-router-dom";
import { getShortsInfo } from "../../apis/shorts";
import styled from "styled-components";
import { Videocam } from "@mui/icons-material";

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
      if (window.innerWidth > 1024) {
        const totalWidth = window.innerWidth - section.offsetWidth; // 사용 가능한 VideoSection 너비
        const width = totalWidth / 2;
        const height = section.offsetHeight;
        const ratioWidth = (height * 9) / 16;

        // 사용 가능한 너비가 비율에 맞춰 계산한 너비보다 넓은 경우 화면에 꽉차게 출력한다.
        if (width >= ratioWidth) setVideoSize({ width: ratioWidth, height });
        else setVideoSize({ width, height: (width * 16) / 9 });
      } else {
        const totalHeight = window.innerHeight - section.offsetHeight;
        const height = totalHeight;
        const width = section.offsetWidth / 2;
        const ratioHeight = (width * 16) / 9;

        if (height >= ratioHeight) setVideoSize({ width, height: ratioHeight });
        else setVideoSize({ width: (height * 9) / 16, height });
      }
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
        <CameraAlert>
          <CameraAlertBox>
            <div>
              카메라 접근이 차단되었습니다. 상단 아이콘 <Videocam />을 클릭하여 접근을 허용 후 새로고침해주세요.
            </div>
          </CameraAlertBox>
        </CameraAlert>
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

const CameraAlert = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 40%);
  z-index: 100;
`;

const CameraAlertBox = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 160px;
  padding: 16px;
  font-size: 32px;
  color: white;
  text-align: center;
  word-break: keep-all;
  background: #232323;
  border-radius: 8px;
  z-index: 100;
`;

const Layer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(48, 13, 45, 1) 80%, rgba(112, 0, 102, 1) 100%);
`;

const Container = styled(Layer)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media screen and (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const TimestampSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-basis: 160px;
  flex-shrink: 0;
  padding: 0 24px;

  @media screen and (max-width: 1024px) {
    flex-direction: row;
    flex-basis: 100px;
  }
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
  background-color: #000;
`;

const Video = styled.video`
  width: 100%;
`;

export default LearnPageTest;

import { useCallback, useEffect, useState } from "react";
import MotionCameraTest from "./MotionCameraTest";
import useCameraStore from "./useCameraStore";
import { Shorts } from "../../constants/types";
import { useParams } from "react-router-dom";
import { getShortsInfo } from "../../apis/shorts";
import styled from "styled-components";

function LearnPageTest() {
  const { userPermission } = useCameraStore();
  const [videoInfo, setVideoInfo] = useState<Shorts | null>();
  const params = useParams();

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

  return (
    <Layer>
      {!userPermission && (
        <div>카메라 접근이 차단되었습니다. 상단 아이콘을 클릭하여 접근을 허용 후 새로고침해주세요.</div>
      )}
      <Container>
        <TimestampSection>
          <Button>0:00</Button>
          <Button>0:10</Button>
          <Button>0:20</Button>
          <Button>0:30</Button>
        </TimestampSection>
        <VideoSection>
          {videoInfo && (
            <VideoContainer>
              <VideoBox>
                <Video src={videoInfo?.shortsLink} crossOrigin="anonymous"></Video>
              </VideoBox>
            </VideoContainer>
          )}
          {/* TODO: 비디오가 켜질 때까지 기다리기... 화면에 표시해주기 */}
          <MotionCameraTest />
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
  flex-direction: column;
  justify-content: center;

  @media screen and (min-width: 800px) {
    flex-direction: row;
  }
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

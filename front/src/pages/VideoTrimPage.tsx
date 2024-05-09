import { useEffect, useState } from "react";
import { shorts } from "../apis/shorts";
import { axios } from "../utils/axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../components/modal/ModalComponent";

const VideoTrimPage = () => {
  const navigate = useNavigate();
  const handleShowModal = (id: number) => setClickId(id);
  const handleCloseModal = () => setClickId(-1);

  const goToLearnMode = () => {
    navigate("/learn");
  };

  const goToChallengeMode = () => {
    navigate("/challenge");
  };

  const [shortsList, setShortsList] = useState<shorts[]>([]);
  const [clickId, setClickId] = useState<number>(-1);

  useEffect(() => {
    axios
      .get<shorts[]>("/api/shorts")
      .then((response) => {
        setShortsList(response.data);

        console.log(response.data);
        for (let i = 0; i < shortsList.length; i++) {
          console.log(shortsList[i].shortsUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Container>
      <Header>Let's DANCE</Header>
      <GridContainer>
        {shortsList.map((shorts) => (
          <VideoItem key={shorts.shortsNo}>
            <VideoBox onClick={() => handleShowModal(shorts.shortsNo)}>
              <video
                src={shorts.shortsLink}
                crossOrigin="anonymous"
              ></video>
            </VideoBox>
            <ModalComponent
              title={shorts.shortsTitle}
              body={
                <ModalVideoBox>
                  <video src={shorts.shortsLink} autoPlay loop crossOrigin='anonymous'></video>
                </ModalVideoBox>
              }
              showModal={clickId === shorts.shortsNo}
              handleCloseModal={handleCloseModal}
              goToLearnMode={goToLearnMode}
              goToChallengeMode={goToChallengeMode}
            />
            <VideoTitle>{shorts.shortsTitle}</VideoTitle>
          </VideoItem>
        ))}
      </GridContainer>
    </Container>
  );
};

export default VideoTrimPage;

// Component 로 나중에 빼자
const Header = styled.header`
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  box-sizing: border-box;
`;

const GridContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(162px, 1fr));
  gap: 16px 16px;
`

const VideoItem = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  width: 100%; // 비디오 박스의 최대 너비를 고려
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 286px;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ModalVideoBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 286px;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 50%;
    height: 50%;
    object-fit: cover;
  }
`;

// 쇼츠 제목
const VideoTitle = styled.div`
  font-weight: bold;
  white-space: nowrap; /* 줄 바꿈 방지 */
  overflow: hidden; /* 넘침 숨김 */
  text-overflow: ellipsis; /* 넘침시 생략 부호(...) 표시 */
`;

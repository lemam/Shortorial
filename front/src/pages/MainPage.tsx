import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import danceVideo from "../assets/sample.mp4";
import styled from "styled-components";
import ModalComponent from "../components/ModalComponent";

export default function MainPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const goToLearnMode = () => {
    navigate("/learn");
  };

  const goToChallengeMode = () => {
    navigate("/challenge");
  };

  return (
    <>
      <h1>Let's DANCE</h1>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(162px, 1fr))",
          gap: "16px 16px",
        }}
      >
        <Link to={"/learn"}>
          <VideoBox>
            <div style={{ paddingTop: "177.8%" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <div style={{ width: "100%", height: "100%" }}>
                  <video src={danceVideo}></video>
                </div>
              </div>
            </div>
          </VideoBox>
        </Link>
        <div>
          <VideoBox onClick={handleShowModal}>
            <video src={danceVideo}></video>
          </VideoBox>
          <ModalComponent
            title="아픈 건 딱 질색이니까"
            body={
              <VideoBox>
                <video src={danceVideo} autoPlay loop></video>
              </VideoBox>
            }
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            goToLearnMode={goToLearnMode}
            goToChallengeMode={goToChallengeMode}
          />
        </div>

        <VideoBox>
          <video src={danceVideo}></video>
        </VideoBox>
      </div>
    </>
  );
}

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

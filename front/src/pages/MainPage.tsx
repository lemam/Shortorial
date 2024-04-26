import { Link } from "react-router-dom";
import danceVideo from "../assets/sample.mp4";
import styled from "styled-components";

export default function MainPage() {
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

        <VideoBox>
          <video src={danceVideo}></video>
        </VideoBox>
        <VideoBox>
          <video src={danceVideo}></video>
        </VideoBox>
      </div>
      <Link to={"/learn"}>쇼츠를 눌러주세용</Link>
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

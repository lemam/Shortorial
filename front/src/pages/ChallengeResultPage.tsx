import { useState } from "react";
import { uploadShorts } from "../apis/shorts";
import useChallengeStore from "../store/useChallengeStore";
import styled from "styled-components";

const ChallengeResultPage = () => {
  const [uploadURL, setuploadURL] = useState<string>("");
  const { downloadURL } = useChallengeStore();
  console.log(downloadURL);
  console.log("uploadURL", uploadURL);

  async function uploadVideo() {
    const data = await uploadShorts(downloadURL, "test");
    setuploadURL(data);
  }

  return (
    <div>
      <VideoContainer
        controls
        autoPlay
        src={downloadURL}
      ></VideoContainer>
      <DownloadLink
        href={downloadURL}
        download="jjajeung.mp4"
        onClick={uploadVideo}
      >
        Download Video
      </DownloadLink>
    </div>
  );
};

const VideoContainer = styled.video`
  height: 100vh;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  padding: 30px;
  box-sizing: border-box;
`;

const DownloadLink = styled.a`
  display: block;
  margin-top: 10px;
`;

export default ChallengeResultPage;

import useChallengeStore from "../store/useChallengeStore";
import styled from "styled-components";

const ChallengeResultPage = () => {
  const { downloadURL } = useChallengeStore();
  console.log(downloadURL);

  return (
    <div>
      <VideoContainer controls autoPlay src={downloadURL}></VideoContainer>
      <DownloadLink href={downloadURL} download="jjajeung.mp4">
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

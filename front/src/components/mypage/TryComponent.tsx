import styled from "styled-components";
import { shorts } from "../../apis/shorts";

const ChallengeResultPage = ({ shorts }: { shorts: shorts }) => {
  return (
    <Video
      crossOrigin="anonymous"
      src={shorts.shortsLink}
      controls
    ></Video>
  );
};
const Video = styled.video`
  width: calc(100% / 4);

  @media screen and (orientation: portrait) {
    width: calc(100% / 2);
  }
`;

export default ChallengeResultPage;

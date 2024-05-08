import styled from "styled-components";
import { VideoSection } from "../../constants/types";
import SectionButton from "../button/SectionButton";
import useLearnVideoStore from "../../store/useLearnVideoStore";

interface SectionButtonListProps {
  sectionList: VideoSection[] | null;
  parentWidth: number;
  clickHandler: (section: VideoSection) => void;
}

const SectionButtonList = ({ sectionList, parentWidth, clickHandler }: SectionButtonListProps) => {
  const currentSection = useLearnVideoStore((state) => state.computed.currentSection);

  return (
    <Container>
      {sectionList?.map((section) => {
        return (
          <SectionButton
            key={section.id}
            time={section.start}
            isSmall={parentWidth < 100}
            active={section.id === currentSection().id}
            onClick={() => clickHandler(section)}
          ></SectionButton>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  button {
    margin: 8px 0;
  }

  @media screen and (max-width: 479px) {
    flex-direction: row;
    justify-content: start;
    align-items: flex-start;
    overflow: scroll;
    height: auto;
    padding: 16px 0;

    button {
      min-width: 120px;
      margin: 0 8px;
    }
  }
`;

export default SectionButtonList;

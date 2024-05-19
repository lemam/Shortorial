import { useEffect, useState } from "react";
import { UploadShorts } from "../../apis/shorts";
import { getUploadedShorts } from "../../apis/mypage";
import styled from "styled-components";
import UploadComponent from "./UploadComponent";

export default function UploadList() {
  const [shortsList, setShortsList] = useState<UploadShorts[]>([]);

  const getShorts = async () => {
    try {
      const data = await getUploadedShorts();
      setShortsList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteShort = (uploadNo: number) => {
    setShortsList((prevList) => prevList.filter((short) => short.uploadNo !== uploadNo));
  };

  useEffect(() => {
    getShorts();
  }, []);

  return (
    <Container>
      <SectionWrapper>
        <Section>
          <SectionConents>
            {shortsList.map((uploadShorts) => (
              <UploadComponent
                key={uploadShorts.uploadNo}
                uploadShorts={uploadShorts}
                onDelete={handleDeleteShort}
              />
            ))}
          </SectionConents>
        </Section>
      </SectionWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Section = styled.section`
  position: relative;
  margin: 16px;
  box-sizing: border-box;
`;

const SectionConents = styled.div`
  display: flex;
  flex-wrap: wrap;

  &.nowrap {
    justify-content: center;
  }
`;
const SectionWrapper = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
`;

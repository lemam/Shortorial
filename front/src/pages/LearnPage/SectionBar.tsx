import styled from "styled-components";

const SectionBar = () => {
  return (
    <Container>
      <Bar className="active" />
      <Bar className="active" />
      <Bar />
      <Bar />
      <Bar />
      <Bar />
      <Bar />
    </Container>
  );
};

const Bar = styled.div`
  width: 100%;
  height: 50px;
  background-color: #585858;
  margin-top: 4px;

  &.active {
    background-color: #fb2576;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  width: 10px;
`;

export default SectionBar;

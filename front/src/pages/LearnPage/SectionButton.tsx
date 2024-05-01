import styled from "styled-components";

interface SectionButtonType {
  size?: string;
}

const SectionButton = ({ size = "default" }: SectionButtonType) => {
  return (
    <Button data-size={size}>
      <div>0:00</div>
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  padding: 8px;
  color: #fff;
  min-width: 120px;
  background-color: #353535;
  border: 1px solid #808080;
  border-radius: 4px;

  &[data-size="small"] {
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    min-width: 52px;
    width: 52px;
    height: 52px;
  }
`;

export default SectionButton;

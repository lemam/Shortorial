import styled from "styled-components";

interface VideoButtonType {
  path: string;
  onClick?: () => void;
  text: string;
  isVisible: boolean;
}

const VideoButton = ({ path, onClick, text, isVisible }: VideoButtonType) => {
  return (
    <ButtonContainer isVisible={isVisible}>
      <Button src={path} onClick={onClick}></Button>
      <ButtonText>{text}</ButtonText>
    </ButtonContainer>
  );
};

export default VideoButton;

const ButtonContainer = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 15px;
`;

const Button = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
  cursor: pointer;
`;

const ButtonText = styled.div`
  font-size: 14px;
  color: white;
  cursor: pointer;
`;

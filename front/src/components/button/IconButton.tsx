import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IconButtonType {
  text: string;
  link?: string;
  icon: JSX.Element;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = ({ link = "", icon, onClick }: IconButtonType) => {
  return (
    <LinkContainer to={link}>
      <Button onClick={onClick}>
        <div className="icon">{icon}</div>
        {/* <span className="text">{text}</span> */}
      </Button>
    </LinkContainer>
  );
};

const LinkContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  padding: 8px;
  border-radius: 50%;
  background-color: #35353580;
`;

const Button = styled.button`
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon svg {
    width: 32px;
    height: 32px;
    color: #fff;
  }

  .text {
    font-size: 12px;
    padding: 4px 0;
  }
`;

export default IconButton;

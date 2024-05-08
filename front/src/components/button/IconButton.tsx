import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IconButtonType {
  tooltip: string;
  link?: string;
  icon: JSX.Element;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = ({ link = "", tooltip, icon, onClick }: IconButtonType) => {
  return (
    <LinkContainer to={link}>
      <Button onClick={onClick}>
        <div className="icon">{icon}</div>
        <div className="tooltipText">{tooltip}</div>
      </Button>
    </LinkContainer>
  );
};

const LinkContainer = styled(Link)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  padding: 8px;
  border-radius: 50%;
  background-color: #35353580;
`;

const Button = styled.button`
  position: relative;
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

  .tooltipText {
    visibility: hidden;
    position: absolute;
    top: 50%;
    right: 48px;
    padding: 4px;
    font-size: 12px;
    background-color: #35353580;
    border-radius: 4px;
    transform: translateY(-50%);
    z-index: 200;
  }

  &:hover > .tooltipText,
  &:active > .tooltipText {
    visibility: visible;
  }
`;

export default IconButton;

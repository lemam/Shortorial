import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IconButtonType {
  text: string;
  link?: string;
  style?: React.CSSProperties;
  icon: JSX.Element;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = ({
  link = "",
  text,
  style = {},
  icon,
  onClick,
}: IconButtonType) => {
  return (
    <LinkContainer to={link} style={style}>
      <Button onClick={onClick}>
        <div className="icon">{icon}</div>
        <span className="text">{text}</span>
      </Button>
    </LinkContainer>
  );
};

const LinkContainer = styled(Link)`
  display: inline-block;
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
  }

  .text {
    font-size: 14px;
  }
`;

export default IconButton;

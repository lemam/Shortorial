import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for twinkling animation
const twinkling = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

// Star styled component
const Star = styled.div`
  border-radius: 50%;
  background-color: white;
  position: absolute;
  overflow: hidden;

  &.style1 {
    width: 1px;
    height: 1px;
  }
  &.style2 {
    width: 2px;
    height: 2px;
  }
  &.style3 {
    width: 3px;
    height: 3px;
  }

  &.twinkle {
    animation: ${twinkling} 7s infinite ease-in-out;
  }
`;

// Utility function to get a random value
function getRandomValue(max: number) {
  return Math.floor(Math.random() * max);
}

// Function to generate stars
const generateStars = (numStars: number, windowWidth: number, windowHeight: number) => {
  const stars = [];
  const styles = ["style1", "style2", "style3"];

  for (let i = 0; i < numStars; i++) {
    const style = styles[getRandomValue(styles.length)];
    const x = getRandomValue(windowWidth);
    const y = getRandomValue(windowHeight);

    stars.push(<Star className={`${style} twinkle`} style={{ top: y, left: x }} key={i} />);
  }

  return stars;
};

// Stars component
type StarsProps = {
  numStars: number;
};

const Stars: React.FC<StarsProps> = ({ numStars }) => {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setStars(generateStars(numStars, windowWidth, windowHeight));
  }, [numStars]);

  return <>{stars}</>;
};

export default Stars;

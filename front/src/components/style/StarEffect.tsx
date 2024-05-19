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

// Star SVG component
const StarSVG = styled.svg`
  position: absolute;
  fill: white;
  overflow: hidden;

  &.style1 {
    width: 10px;
    height: 10px;
  }
  &.style2 {
    width: 15px;
    height: 15px;
  }
  &.style3 {
    width: 20px;
    height: 20px;
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

    stars.push(
      <StarSVG
        className={`${style} twinkle`}
        style={{ top: y, left: x }}
        viewBox="0 0 24 24"
        key={i}
      >
        <polygon points="12,2 15,8.6 22,9.3 17,14 18.6,21 12,17.7 5.4,21 7,14 2,9.3 9,8.6" />
      </StarSVG>
    );
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

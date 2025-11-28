// IntroAnimation.jsx
import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

// import background from "../img/challenge_background.png";
import background1 from "../img/login_back2.png";
import airplane from "../img/airplane/challenge_airplane.png";

const fly = keyframes`
  0% {
    transform: translate(-200%, 20%) rotate(0deg);
  }
  100% {
    transform: translate(330%, -10%) rotate(0deg);
  }
`;

const flyReverse = keyframes`
  0% {
    transform: translate(200%, -10%) rotate(0deg) scaleX(-1);
  }
  100% {
    transform: translate(-200%, 20%) rotate(0deg) scaleX(-1);
  }
`;

const IntroOverlay = styled.div`
  position: absolute;     /* 부모 기준으로 절대 위치 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
  overflow: hidden;
`;


const PlaneImg = styled.img`
  position: absolute;
  width: 200px; /* 필요 시 조정 */
  animation: ${({ $reverse }) => ($reverse ? flyReverse : fly)} 2.5s ease-in-out forwards;
`;

const IntroAnimation = ({ onFinish, reverse = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish && onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <IntroOverlay>
      <PlaneImg src={airplane} alt="plane" $reverse={reverse} />
    </IntroOverlay>
  );
};

export default IntroAnimation;

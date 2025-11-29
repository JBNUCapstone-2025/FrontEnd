import React from "react";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
import colors from "../styles/colors";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  max-width: 400px;
  animation: slideUp 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$alignCenter ? 'center' : 'stretch'};
  justify-content: center;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Icon = styled(FaCheckCircle)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto 20px;
  display: flex;
  font-size: 30px;
  color: ${colors.text};
  animation: checkmark 0.5s ease-in-out;

  @keyframes checkmark {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Message = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const SubMessage = styled.p`
  font-size: 16px;
  color: ${colors.airplanebody};
  margin-block: 40px;
  text-align: ${props => props.$centered ? 'center' : 'left'};
`;

export default function SuccessModal({ message, subMessage, show, centered = false, alignCenter = false }) {
  if (!show) return null;

  return (
    <Overlay>
      <ModalContainer $alignCenter={alignCenter}>
        <SubMessage $centered={centered}>{message}<br/>{subMessage}</SubMessage>
        <Icon/>
      </ModalContainer>
    </Overlay>
  );
}

import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { FaCheckCircle } from "react-icons/fa";

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
  z-index: 1000;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto 20px;
  display: flex;
  font-size: 30px;
  color: ${colors.main};
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
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

export default function SuccessModal({ message, subMessage, show }) {
  if (!show) return null;

  return (
    <Overlay>
      <ModalContainer>
        <SubMessage>{message}<br/>{subMessage}</SubMessage>
        <Icon/>
      </ModalContainer>
    </Overlay>
  );
}

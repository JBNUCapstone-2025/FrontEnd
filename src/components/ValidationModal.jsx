import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

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
  padding: 30px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
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

const SuccessIcon = styled(FaCheckCircle)`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: block;
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

const FailureIcon = styled(IoMdCloseCircle)`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: block;
  color: #ff4444;
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
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const SubMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  line-height: 1.5;
`;

export default function ValidationModal({ type, message, subMessage, show }) {
  if (!show) return null;

  return (
    <Overlay>
      <ModalContainer>
        {type === "success" ? <SuccessIcon /> : <FailureIcon />}
        <Message>{message}</Message>
        {subMessage && <SubMessage>{subMessage}</SubMessage>}
      </ModalContainer>
    </Overlay>
  );
}

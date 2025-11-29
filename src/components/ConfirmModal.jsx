import React from "react";
import styled from "styled-components";
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
  padding: 30px 25px;
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

const Message = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.airplanebody};
  margin: 0 0 25px 0;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &:active {
    transform: scale(0.95);
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: ${colors.airplanebody};

  &:hover {
    background: #e0e0e0;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${colors.text};
  color: white;

  &:hover {
    background: ${colors.deactivate};
  }
`;

export default function ConfirmModal({ message, show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Message>{message}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}

// src/components/Character.jsx
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import dog from "../img/character/dog.png";
import cat from "../img/character/cat.png";
import rabbit from "../img/character/rabbit.png";
import racoon from "../img/character/racoon.png";
import bear from "../img/character/bear.png";
import hamster from "../img/character/hamster.png";
import colors from "../styles/colors";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  width: 90%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  font-weight: 700;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 20px;
`;

const Body = styled.div`
  padding: 20px;
`;

const AvatarList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  justify-items: center;
`;

const AvatarButton = styled.button`
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:focus { outline: none; }
  &:focus:not(:focus-visible) { outline: none; }

  &:focus-visible img {
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.65);
    border-radius: 50%;
  }

  &:hover img {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ $active }) => ($active ? "#bbb" : "#eee")};
  filter: ${({ $active }) => ($active ? "grayscale(100%)" : "none")};
  opacity: ${({ $active }) => ($active ? 0.6 : 1)};
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease, opacity .15s ease, border-color .15s ease;
`;

const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  transition: opacity .15s ease, transform .05s ease;
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryButton = styled(Button)`
  background: #e9ecef;
  color: #333;
`;

const PrimaryButton = styled(Button)`
  background: ${colors.text};
  color: #fff;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-top: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color .15s ease;
  background: white;
  color: black;
  &:focus {
    outline: none;
    border-color: ${colors.text};
  }
  &::placeholder {
    color: #aaa;
  }
`;

export default function Character({ onClose, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [characterName, setCharacterName] = useState("");

  const avatars = [
    { id: "dog",    src: dog,    alt: "강아지 캐릭터" },
    { id: "cat",    src: cat,    alt: "고양이 캐릭터" },
    { id: "bear",  src: bear,  alt: "곰 캐릭터" },
    { id: "rabbit", src: rabbit, alt: "토끼 캐릭터" },
    { id: "racoon",   src: racoon,   alt: "너구리 캐릭터" },
    { id: "hamster",    src: hamster,    alt: "햄스터 캐릭터" },
  ];

  const handleSelect = (id) => {
    setSelected(prev => (prev === id ? null : id)); // 토글
  };

  const handleConfirm = async () => {
    if (!selected || !characterName.trim()) return;

    try {
      const token = localStorage.getItem("access_token");

      await axios.patch("/user/character", {
        character: selected,
        character_name: characterName.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 로컬 스토리지에 저장
      localStorage.setItem("character", selected);
      localStorage.setItem("character_name", characterName.trim());

      onSelect?.(selected);
      onClose?.();
    } catch (error) {
      console.error("캐릭터 변경 오류:", error);
      alert("캐릭터 변경에 실패했습니다.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>승무원 선택</Header>
        <Body>
          <AvatarList>
            {avatars.map(a => (
              <AvatarButton key={a.id} onClick={() => handleSelect(a.id)} aria-label={a.alt}>
                <Avatar src={a.src} alt={a.alt} $active={selected === a.id} />
              </AvatarButton>
            ))}
          </AvatarList>
          <NameInput
            type="text"
            placeholder="캐릭터 이름을 입력하세요"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
        </Body>
        <Footer>
          <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
          <PrimaryButton onClick={handleConfirm} disabled={!selected || !characterName.trim()}>
            선택
          </PrimaryButton>
        </Footer>
      </Dialog>
    </Backdrop>
  );
}

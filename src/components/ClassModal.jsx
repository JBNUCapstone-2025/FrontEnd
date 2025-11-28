// src/pages/Class.jsx
import React, { useMemo, useEffect } from "react";
import styled from "styled-components";

// ../icon/ 안의 이미지를 한 번에 import (Vite)
const iconModules = import.meta.glob("../icon/*.{png,jpg,svg}", { eager: true, import: "default" });

// 색상 키와 감정 라벨 매핑 (파일명과 정확히 맞춰야 해요: blud/gray/pink/purple/red/yellow)
// emotion 매핑 (서버 허용 값: 기쁨, 슬픔, 분노, 불안, 설렘, 무기력)

const MOODS = [
  { key: "yellow",  label: "기쁨" },
  { key: "pink",    label: "설렘" },
  { key: "gray",    label: "보통" },
  { key: "blue",    label: "슬픔" },
  { key: "purple",  label: "불안" },
  { key: "red",     label: "분노" },
];

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* 상단 */
`;

const Sheet = styled.div`
  width: min(480px, 92vw);
  max-height: 100vh;
  overflow: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  padding: 20px 10px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 10px 5px;
  background: #fff;
  cursor: pointer;

  &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  &:focus { outline: 2px solid #9bbcff; }
`;

const Thumb = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
`;

const Label = styled.span`
  font-size: 13px;
  color: black;
`;

export default function ClassModal({ onSelect, onClose }) {
  // 파일 키 → 실제 경로
  const imageMap = useMemo(() => {
    const m = {};
    for (const key in iconModules) {
      // key 예: "../icon/red.png"
      const name = key.split("/").pop()?.split(".")[0]; // red
      m[name] = iconModules[key];
    }
    return m;
  }, []);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Title>오늘 너의 기분은?</Title>
        <Grid>
          {MOODS.map(({ key, label }) => {
            const src = imageMap[key];
            if (!src) return null; // 파일 누락 시 스킵
            return (
              <Card
                key={key}
                onClick={() => onSelect?.({ key, label, src })}
                aria-label={`${label} 선택`}
              >
                <Thumb src={src} alt={key} />
                <Label>{label}</Label>
              </Card>
            );
          })}
        </Grid>
      </Sheet>
    </Backdrop>
  );
}

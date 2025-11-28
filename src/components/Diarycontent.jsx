// src/components/Diarycontent.jsx
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 캐릭터 이미지 import
import yellowChar from "../icon/yellow.png";
import redChar from "../icon/red.png";
import purpleChar from "../icon/purple.png";
import pinkChar from "../icon/pink.png";
import grayChar from "../icon/gray.png";
import blueChar from "../icon/blue.png";

// 일기 상세 모달 import
import DiaryDetailModal from "./DiaryDetailModal";

/* ─────────── 스타일 ─────────── */
const Wrap = styled.div`
  padding-inline: 12px;
  padding-bottom: 14px;
  border-top: 1px solid rgba(0,0,0,0.08);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  padding-bottom: 6px;
`;

const MonthLabel = styled.div`
  justify-self: start;
  font-weight: 700;
  color: #7f9db9;
  letter-spacing: .2px;
  font-size: 18px;
`;

const Nav = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;

  button{
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    line-height: 0;
    padding: 0;
    color: #7f9db9;
    border-radius: 8px;
  }
  button:active { transform: translateY(1px); }

  button svg{
    width: 18px; height: 18px; display: block;
  }
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 4px;
  color: #a9b7c7;
  font-size: 12px;
`;

const W = styled.div`
  text-align: center;
  padding: 6px 0 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  padding-top: 2px;
`;

const DayCell = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  align-items: start;
  height: 58px;
`;

const DayNum = styled.div`
  font-size: 13px;
  color: ${({ dim }) => (dim ? "transparent" : "#2F3B4A")};
  height: 18px;
`;

/* 회색 기본 알약 (미래 날짜용) */
const Pill = styled.div`
  width: 36px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(#f6f7fb, #eef2f7);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.7),
    0 1px 2px rgba(0,0,0,.08),
    0 6px 12px rgba(0,0,0,.08);
  display: grid;
  place-items: center;
  opacity: .6;
`;

/* 이미지로 칸을 꽉 채우는 컴포넌트(오늘/과거) */
const FillImg = styled.img`
  width: 36px;
  height: 46px;
  display: block;
  object-fit: cover;    /* 비율 유지하며 꽉 채우기 */
  border-radius: 12px;  /* Pill과 동일 라운드 */
  /* 배경 없이 이미지 단독으로 보이게: 별도 배경/그림자 없음 */
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

/* ─────────── 유틸 ─────────── */
function buildMonthMatrix(year, monthIndex /* 0~11 */) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const daysInMonth = last.getDate();

  const jsFirstDow = first.getDay();         // Sun=0 .. Sat=6
  const monStartOffset = (jsFirstDow + 6) % 7; // Mon=0 .. Sun=6

  const cells = [];
  for (let i = 0; i < monStartOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return { cells, daysInMonth };
}

/* emotion에 따른 이미지 매핑 (서버 값: 기쁨, 슬픔, 분노, 불안, 설렘, 무기력) */
function getEmotionImage(emotion) {
  const emotionMap = {
    "기쁨": yellowChar,
    "슬픔": blueChar,
    "분노": redChar,
    "불안": purpleChar,
    "설렘": pinkChar,
    "무기력": grayChar
  };

  return emotionMap[emotion] || grayChar;
}

/**
 * props:
 * - addImage: 오늘 칸에 표시할 이미지 (예: add.png)
 * - pastImage: 과거 칸에 표시할 이미지 (예: angry.png)
 */
export default function DiaryContent({
  year,
  month,           // 1~12
  addImage,
  onPrevMonth,
  onNextMonth,
  onClickDay,
}) {
  const navigate = useNavigate();

  const sysToday = new Date();
  const todayY = sysToday.getFullYear();
  const todayM = sysToday.getMonth();   // 0~11
  const todayD = sysToday.getDate();

  const initYear = year ?? todayY;
  const initMonthIdx = (month ? month - 1 : todayM);

  const [curYear, setCurYear] = useState(initYear);
  const [curMonth, setCurMonth] = useState(initMonthIdx);

  // 일기 데이터 저장 (날짜를 키로)
  const [diaryData, setDiaryData] = useState({});

  // 모달 상태
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (year) setCurYear(year);
    if (month) setCurMonth(month - 1);
  }, [year, month]);

  // API에서 일기 목록 가져오기
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.get("/diary/list?skip=0&limit=100", {
          headers: headers,
        });

        console.log("가져온 일기 목록:", response.data);

        // 날짜를 키로 하는 객체로 변환
        const diaryMap = {};
        response.data.forEach(diary => {
          if (diary.diary_date) {
            diaryMap[diary.diary_date] = diary;
          }
        });

        setDiaryData(diaryMap);
      } catch (error) {
        console.error("일기 목록 가져오기 오류:", error);
      }
    };

    fetchDiaries();
  }, [curYear, curMonth]); // 월이 바뀔 때마다 다시 가져오기

  const { cells } = useMemo(
    () => buildMonthMatrix(curYear, curMonth),
    [curYear, curMonth]
  );

  const label = `${curYear}년 ${curMonth + 1}월`;

  const goPrev = () => {
    let y = curYear, m = curMonth - 1;
    if (m < 0) { m = 11; y -= 1; }
    setCurYear(y); setCurMonth(m);
    onPrevMonth && onPrevMonth(y, m + 1);
  };

  const goNext = () => {
    let y = curYear, m = curMonth + 1;
    if (m > 11) { m = 0; y += 1; }
    setCurYear(y); setCurMonth(m);
    onNextMonth && onNextMonth(y, m + 1);
  };

  // 특정 날짜의 일기 데이터 가져오기
  const getDiaryForDate = (d) => {
    const dateStr = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return diaryData[dateStr];
  };

  // 미래 날짜인지 확인
  const isFutureDate = (d) => {
    const cellDate = new Date(curYear, curMonth, d);
    const today = new Date(todayY, todayM, todayD);
    // 시간 제거하고 날짜만 비교
    cellDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return cellDate > today;
  };

  const handleDayClick = (d) => {
    const dateObj = new Date(curYear, curMonth, d);
    onClickDay && onClickDay(dateObj);
    // 선택한 날짜를 state로 전달
    const dateString = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    navigate("/diary/write", { state: { selectedDate: dateString } });
  };

  // 일기 상세 정보 가져오기
  const handleDiaryClick = async (diaryId, emotion) => {
    // emotion이 null이면 편집 모드로 이동
    if (emotion === null || emotion === undefined) {
      try {
        const token = localStorage.getItem("access_token");
        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.get(`/diary/${diaryId}`, {
          headers: headers,
        });

        console.log("편집할 일기 정보:", response.data);

        // 편집 모드로 /diary/write로 이동
        navigate("/diary/write", {
          state: {
            editMode: true,
            diaryId: diaryId,
            diaryData: response.data
          }
        });
      } catch (error) {
        console.error("일기 정보 가져오기 오류:", error);
      }
      return;
    }

    // emotion이 있으면 상세보기 모달 표시
    try {
      const token = localStorage.getItem("access_token");
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`/diary/${diaryId}`, {
        headers: headers,
      });

      console.log("일기 상세 정보:", response.data);

      setSelectedDiary(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("일기 상세 정보 가져오기 오류:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDiary(null);
  };

  return (
    <Wrap>
      <Header>
        <MonthLabel>{label}</MonthLabel>
        <div />
        <Nav>
          <button onClick={goPrev} aria-label="prev"><FaAngleLeft/></button>
          <button onClick={goNext} aria-label="next"><FaAngleRight/></button>
        </Nav>
      </Header>

      <Weekdays>
        {["월","화","수","목","금","토","일"].map((w) => (
          <W key={w}>{w}</W>
        ))}
      </Weekdays>

      <Grid>
        {cells.map((d, i) => {
          const blank = d == null;
          const diary = blank ? null : getDiaryForDate(d);
          const isFuture = blank ? false : isFutureDate(d);

          return (
            <DayCell key={i}>
              {/* ✅ 항상 위에 날짜 영역: 빈 칸이면 투명(텍스트 없음) */}
              <DayNum dim={blank}>
                {blank ? "" : d}
              </DayNum>

              {/* ✅ 아래는 항상 Pill 또는 이미지 영역 */}
              {blank ? (
                // 앞뒤 패딩용 빈 날짜 칸
                <Pill />
              ) : diary ? (
                // 일기가 있는 날짜: 감정 이미지 또는 추가 아이콘
                <FillImg
                  src={diary.emotion === null ? addImage : getEmotionImage(diary.emotion)}
                  alt={diary.emotion === null ? "add-diary" : `diary-${diary.emotion}`}
                  $clickable={true}
                  onClick={() => handleDiaryClick(diary.diary_id, diary.emotion)}
                />
              ) : isFuture ? (
                // 미래 날짜: 작성 불가 회색 Pill
                <Pill />
              ) : addImage ? (
                // 오늘/과거 날짜: 작성 버튼 이미지
                <FillImg
                  src={addImage}
                  alt="add-diary"
                  $clickable
                  onClick={() => handleDayClick(d)}
                />
              ) : (
                // 아무것도 없으면 그냥 회색 Pill
                <Pill />
              )}
            </DayCell>
          );
        })}
      </Grid>

      {/* 일기 상세 모달 */}
      {showModal && selectedDiary && (
        <DiaryDetailModal
          diary={selectedDiary}
          onClose={handleCloseModal}
        />
      )}
    </Wrap>
  );
}
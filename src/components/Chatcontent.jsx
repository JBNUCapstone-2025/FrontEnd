// src/components/Chatcontent.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { PiAirplaneTakeoffFill } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa";
import { IoPaperPlane } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import logo from "../logo/boarding_logo2.png";

// ✅ 감정 → 아이콘 색상 매핑
const EMOTION_ICON_MAP = {
  "기쁨": "yellow",
  "설렘": "pink",
  "보통": "gray",
  "슬픔": "blue",
  "불안": "purple",
  "분노": "red"
};

/* ========== 레이아웃 & 공통 스타일 ========== */
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-block: 20px;
  padding-inline: 12px;
  border-top: 1px solid #e9e8e8;
  gap: 12px;
  position: relative;
`;

/* 페이지 컨테이너: 가로 스크롤 + 스냅 */
const PagesViewport = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0;
  /* 스크롤바 숨김 */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

/* 각 페이지: 뷰포트 너비 100% 고정, 스냅 포인트 */
const Page = styled.div`
  flex: 0 0 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 6px;
`;

/* 인디케이터(도트) */
const Dots = styled.div`
  display: flex;
  align-self: center;
  gap: 10px;
  padding-top: 4px;
`;
const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0;
  background: ${(p) => (p.active ? "#000" : "rgba(0,0,0,0.3)")};
  cursor: pointer;
  padding: 0;
`;

/* ========== 카드 스타일 ========== */
export const Content = styled.div`
  display: grid;
  grid-template-columns: 7.5fr 2.5fr;
  align-items: stretch;
  padding-inline: 8px;
  padding-block: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-right: 2px;
`;

export const LeftTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${colors.sub};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  font-size: 20px;
  padding: 6px 10px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
`;

export const RightTop = styled.div`
  background-color: ${colors.sub};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  color: white;
  padding: 6px 0 4px 0;
  min-height: 22.5px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
`;

const Logo = styled.img`
  width: 70%;
  margin: 0;
  padding: 0;
  height: auto;
`

export const LeftBottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 10px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
  background: #fff;
  position: relative;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 20px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.airplanebody};
  opacity: 0.6;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: ${colors.deactivate};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const RightBottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  background: #fff;
`;

const Text = styled.p`
  font-size: 15px;
  margin: 0;
  padding: 5px 20px;

  &.title { padding: 0; padding-left: 10px; }
  &.sentiment { font-size: 10px; padding: 0; margin: 5px 0 0 0; }
`;

const SentimentImg = styled.img`
  width: 50%;
  height: auto;
  display: block;
  padding-bottom: 5px;
`;

/* 새 대화 시작 카드 */
const AddChatCard = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  align-items: center;
  width: 80px;
  align-self: flex-end;
  border-radius: 10px;
  margin-right: 8px;
  border: 2px solid ${colors.sub};
  &:hover{
    background: ${colors.chatinput};
  }
`;

const Plus = styled(FaPlus)`
  padding: 4px 1px 4px 5px;
  color: ${colors.sub};
`

const Start = styled.p`
  padding-right: 5px;
  margin: 0;
  color: ${colors.sub};
`

/* 제목 수정 모달 */
const EditOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const EditModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const EditModalTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: ${colors.text};
  text-align: center;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: white;
  color: black;
  &:focus {
    outline: none;
    border-color: ${colors.main};
  }
`;

const EditModalButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const EditModalButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.cancel {
    background: #f0f0f0;
    color: ${colors.text};

    &:hover {
      background: #e0e0e0;
    }
  }

  &.save {
    background: ${colors.main};
    color: white;

    &:hover {
      background: ${colors.hover};
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;



/* ========== 유틸 ========== */
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} - ${m} - ${day}`;
}

/* ========== 컴포넌트 ========== */
export default function ChatContent({
  initialItems = [],
  onAdd,
  addImage, // 오늘 카드에 붙일 이미지 (add.png)
  apiBase = "", // API 기본 URL
}) {
  const [items, setItems] = useState(initialItems);
  const [, setLoading] = useState(false);
  const [editingChat, setEditingChat] = useState(null); // 수정 중인 대화
  const [editTitle, setEditTitle] = useState(""); // 수정 중인 제목
  const [itemsPerPage, setItemsPerPage] = useState(4); // 페이지당 카드 개수

  // 현재 페이지 인덱스 (도트 & 스크롤 연동)
  const [pageIdx, setPageIdx] = useState(0);
  const viewportRef = useRef(null);

  const navigate = useNavigate();

  // 컨테이너 높이 기반으로 카드 개수 계산
  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (!viewportRef.current) return;

      const containerHeight = viewportRef.current.clientHeight;

      // 843px 이하: 3개, 844px 이상: 4개
      const cardsPerPage = containerHeight <= 843 ? 3 : 4;

      setItemsPerPage(cardsPerPage);
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);

    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // 페이지 계산 (itemsPerPage 기반)
  const pages = useMemo(() => {
    const chunk = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunk.push(items.slice(i, i + itemsPerPage));
    }
    return chunk.length ? chunk : [[]];
  }, [items, itemsPerPage]);

  // ✅ 백엔드에서 대화 목록 불러오기
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.log("No token found, skipping chat list fetch");
          setLoading(false);
          return;
        }

        const base = (apiBase || "").trim();
        const listUrl = base ? `${base}/chat/list` : "/chat/list";

        const res = await axios.get(listUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = res.data;

        // 감정별 색상 아이콘 모듈 불러오기
        const iconModules = import.meta.glob("../icon/*.png", { eager: true, import: "default" });

        // 백엔드 데이터를 카드 형식으로 변환
        const chatCards = data.map(chat => {
          // 감정이 있을 때만 아이콘 설정, 없으면 add.png
          let sentimentImage = null;
          if (chat.emotion) {
            const iconColor = EMOTION_ICON_MAP[chat.emotion] || "gray";
            const iconKey = `../icon/${iconColor}.png`;
            sentimentImage = iconModules[iconKey];
          } else {
            // 진행 중일 때 add.png 사용
            sentimentImage = addImage;
          }

          // 날짜 포맷 변환 (YYYY-MM-DDTHH:mm:ss → YYYY - MM - DD)
          let formattedDate = chat.create_date;
          if (chat.create_date) {
            const d = new Date(chat.create_date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            formattedDate = `${y} - ${m} - ${day}`;
          }

          // recommend_content에서 추천 정보 가져오기
          let rightHeader = "";
          if (chat.recommend_content) {
            if (chat.recommend_content.book) rightHeader = "📚";
            else if (chat.recommend_content.music) rightHeader = "🎵";
            else if (chat.recommend_content.food) rightHeader = "🍽️";
          }

          return {
            chat_id: chat.chat_id,
            title: chat.title || "대화",
            date: formattedDate,
            sentimentLabel: chat.emotion ? `${chat.emotion}` : "대화중",
            rightHeader: rightHeader,
            sentimentImage: sentimentImage,
            isQuickAdd: false
          };
        });

        // 백엔드 데이터와 initialItems 병합 (중복 제거)
        const merged = [...chatCards];
        initialItems.forEach(item => {
          if (!merged.some(m => m.chat_id === item.chat_id)) {
            merged.push(item);
          }
        });

        setItems(merged);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [apiBase, addImage, initialItems]);

  // 마운트 시 "오늘" 항목 없으면 자동 생성
  // ✅ 항상 오늘 카드가 1개 보장 + 새로고침/데이터 재주입에도 안정
  useEffect(() => {
    const today = todayStr();
    const hasTodayInItems = items.some((it) => it.date === today && it.isQuickAdd);
    const createdDate = localStorage.getItem("todayCardDate");

    // 이미 오늘 카드가 있으면 추가하지 않음
    if (hasTodayInItems) {
      localStorage.setItem("todayCardDate", today);
      return;
    }

    // 오늘 처음 생성해야 하는 경우
    if (createdDate !== today) {
      const newItem = {
        title: "",
        date: today,
        sentimentLabel: "감정 : ??",
        rightHeader: "",
        sentimentImage: addImage,
        isQuickAdd: true,
      };
      setItems(prev => [newItem, ...prev]);
      onAdd && onAdd(newItem);
      localStorage.setItem("todayCardDate", today);
    }
  }, [items, addImage, onAdd]);


  // 스크롤 위치로 현재 페이지 계산
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== pageIdx) setPageIdx(idx);
  };

  // 도트 클릭 시 해당 페이지로 스크롤
  const scrollToPage = (idx) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: "smooth",
    });
  };

  // 카드 클릭 핸들러
  const handleCardClick = (it) => {
    if (it.isQuickAdd) {
      // 새 대화 시작 (chat_id 없이)
      navigate("/chat");
    } else if (it.chat_id) {
      // 기존 대화 이어하기 (chat_id 전달)
      navigate(`/chat?chat_id=${it.chat_id}`);
    }
  };

  // 제목 수정 모달 열기
  const handleEditClick = (e, chat) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (chat.isQuickAdd) return; // 오늘 카드는 수정 불가
    setEditingChat(chat);
    setEditTitle(chat.title || "");
  };

  // 제목 수정 저장
  const handleSaveTitle = async () => {
    if (!editingChat || !editTitle.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const base = (apiBase || "").trim();
      const titleUrl = base
        ? `${base}/chat/${editingChat.chat_id}/title`
        : `/chat/${editingChat.chat_id}/title`;

      await axios.patch(titleUrl, {
        title: editTitle.trim()
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // 로컬 state 업데이트
      setItems(prev => prev.map(item =>
        item.chat_id === editingChat.chat_id
          ? { ...item, title: editTitle.trim() }
          : item
      ));

      // 모달 닫기
      setEditingChat(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating title:", error);
      alert("제목 수정에 실패했습니다.");
    }
  };

  // 제목 수정 취소
  const handleCancelEdit = () => {
    setEditingChat(null);
    setEditTitle("");
  };

  return (
    <ContentWrapper>
      {/* 뷰포트: 스와이프/스크롤로 페이지 이동 */}
      <PagesViewport ref={viewportRef} onScroll={handleScroll}>
        {pages.map((pageItems, p) => (
          <Page key={p}>
            {/* 첫 페이지 첫 번째에 새 대화 시작 카드 추가 */}
            {
              <AddChatCard onClick={() => navigate("/chat")}>
                    <Plus/>
                    <Start>새 채팅</Start>
              </AddChatCard>
            }

            {pageItems.map((it, idx) => (
              <Content key={`${p}-${idx}`} onClick={() => handleCardClick(it)}>
                <Left>
                  <LeftTop>
                    <PiAirplaneTakeoffFill size={16} style={{ paddingLeft: 5 }} />
                    <Text className="title">BOARDING PASS</Text>
                  </LeftTop>
                  <LeftBottom>
                    <TitleRow>
                      <Text style={{ padding: 0, margin: 0}}>
                        제목 : {it.title || "\u00A0"}
                      </Text>
                      {!it.isQuickAdd && (
                        <EditButton
                          onClick={(e) => handleEditClick(e, it)}
                          aria-label="제목 수정"
                        >
                          <FaPencilAlt size={12} />
                        </EditButton>
                      )}
                    </TitleRow>
                    <Text>날짜 : {it.date}</Text>
                  </LeftBottom>
                </Left>

                <Right>
                  <RightTop>  {it.rightHeader && <span>{it.rightHeader}</span>}<Logo src={logo}/></RightTop>
                  <RightBottom
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                  >
                    {it.sentimentLabel && <Text className="sentiment">{it.sentimentLabel}</Text>}
                    {it.sentimentImage && (
                      <SentimentImg src={it.sentimentImage} alt="sentiment" />
                    )}
                  </RightBottom>
                </Right>
              </Content>
            ))}
          </Page>
        ))}
      </PagesViewport>

      {/* 페이지 도트 */}
      <Dots>
        {pages.map((_, i) => (
          <Dot key={i} active={i === pageIdx} aria-label={`page ${i + 1}`} onClick={() => scrollToPage(i)} />
        ))}
      </Dots>

      {/* 제목 수정 모달 */}
      {editingChat && (
        <EditOverlay onClick={handleCancelEdit}>
          <EditModalContainer onClick={(e) => e.stopPropagation()}>
            <EditModalTitle>제목 수정</EditModalTitle>
            <EditInput
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              autoFocus
            />
            <EditModalButtons>
              <EditModalButton className="cancel" onClick={handleCancelEdit}>
                취소
              </EditModalButton>
              <EditModalButton
                className="save"
                onClick={handleSaveTitle}
                disabled={!editTitle.trim()}
              >
                저장
              </EditModalButton>
            </EditModalButtons>
          </EditModalContainer>
        </EditOverlay>
      )}
    </ContentWrapper>
  );
}

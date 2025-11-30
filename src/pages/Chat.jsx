// src/pages/Main.jsx
import React,{useState, useEffect, useRef, useMemo} from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import logo from "../logo/logo.png";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

// ✅ avatars 폴더의 png를 한 번에 import (Vite)
const avatarModules = import.meta.glob("../img/character/*.png", { eager: true, import: "default" });

// UUID 생성 함수 (crypto.randomUUID 대체)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  background-color: white;
  position: relative;
  overflow: hidden;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${colors.text};
  line-height: 0px;
  padding: 30px 0;
  flex-shrink: 0;
`;

const Header = styled.img`
  width: 150px;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  background: white;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: ${p => (p.me ? "flex-end" : "flex-start")};
`;

const RowInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 85%;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
  margin-right: 10px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colors.text};
  padding: 5px;
  object-fit: cover;
  background: transparent;
  user-select: none;
  transform: scaleX(-1);
`;

const CharacterName = styled.span`
  font-size: 11px;
  white-space: nowrap;
  font-weight: 500;
`;

const Bubble = styled.div`
  max-width: 50%;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${p => (p.me ? "#dddddd" : colors.main)};
  color: #000;
  font-size: 13px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  word-break: break-word;
  white-space: pre-wrap;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: calc(100%);
  line-height: 0;
  padding: 20px 0;
  flex-shrink: 0;
  background-color: white;
  border-top: 1px solid #f0f0f0;
`;

const CompletedMessage = styled.div`
  color: #e74c3c;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  padding-block: 10px;
`;

const ChatInput = styled.textarea`
  width: calc(80%);
  min-height: 20px;
  max-height: 120px;
  background-color: ${colors.chatinput};
  border-radius: 15px;
  border: none;
  margin-top: auto;
  font: bold 13px 'arial';
  color: black;
  padding: 10px 20px;
  resize: none;
  overflow-y: auto;
  line-height: 1.5;
  box-sizing: border-box;

  &:disabled {
    background-color: #f0f0f0;
    color: #999;
    cursor: not-allowed;
  }
`;

// icon
const TopLeft = styled(FaAngleLeft)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;

  &:hover {
    color: ${colors.hover};
  }
`;

const TopRight = styled(FaRegBell)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;

  &:hover {
    color: ${colors.hover};
  }
`;

const Send = styled(FaCircleArrowUp)`
  width: 30px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;
  &:hover{
    color: ${colors.hover};
  }
`

const TrashIcon = styled(FaTrashAlt)`
  width: 15px;
  height: auto;
  color: gray;
  cursor: pointer;
  transition: all 0.2s;

  &:hover{
    color: ${colors.hover};
  }

  &:active {
    transform: scale(0.95);
  }
`

// 추천 메뉴 모달 스타일
const Overlay = styled.div`
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
  padding: 40px 25px;
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

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

const ModalTitle = styled.h2`
  font-size: 50px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: ${colors.text};
  text-align: center;
`;

const CategoryButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const CategoryButton = styled.button`
  flex: 1;
  padding: 16px 12px;
  background: #8a8a8a;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin: 10px 0;
  outline: none;

  &:hover {
    background: ${colors.text};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    color: white;
    border: none;
  }

  &:focus {
    outline: none;
    border: none;
  }

  &:active {
    transform: translateY(0);
    border: none;
  }
`;

const CategoryTitle = styled.span`
  font-size: 17px;
  text-align: left;
  width: 100%;
`;

const CategoryLabel = styled.span`
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  line-height: 1.4;
  width: 100%;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${colors.text};
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.hover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 삭제 확인 모달 스타일
const DeleteModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px 24px;
  max-width: 350px;
  width: 85%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  text-align: center;
`;

const DeleteModalText = styled.p`
  font-size: 16px;
  color: ${colors.check};
  margin: 0 0 24px 0;
  line-height: 1.5;
  padding: 30px 0;
`;

const DeleteModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const DeleteModalButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &.cancel {
    background: gray;
    color: white;

    &:hover {
      background: #d0d0d0;
    }
  }

  &.confirm {
    background: ${colors.text};
    color: white;

    &:hover {
      background: 
      ${colors.deactivate};
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 추천 컨텐츠 스타일 (RecommendationModal과 동일)
const RecommendationItem = styled.div`
  background: #fffcf8;
  padding: 16px;
  border-radius: 12px;

`;

const ItemTitle = styled.div`
  font: bold 16px arial;
  font-weight: bold;
  margin-bottom: 6px;
  text-align: center;
`;

const ItemSubtitle = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  text-align: center;
`;

const CoverImage = styled.img`
  width: 80%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
  object-fit: cover;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const IntroText = styled.div`
  margin-bottom: 6px;
  line-height: 1.5;
  font-size: 13px;
`;

const DetailLink = styled.a`
  color: #007bff;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

// ✅ 캐릭터별 인삿말
const CHARACTER_GREETINGS = {
  "dog": "왈왈! 반갑다멍! 오늘 하루는 어땠나멍?",
  "cat": "냥... 왔구나. 오늘 어땠어? 흠, 별로 궁금하진 않지만...",
  "bear": "으음... 어서 와. 오늘 하루 어땠어? 괜찮아, 천천히 얘기해봐.",
  "rabbit": "음... 안녕하세요. 오늘 하루 어떠셨어요? 괜찮으시다면 들려주세요!",
  "racoon": "후후~ 왔구나! 오늘 어떤 일이 있었어? 재밌는 얘기 들려줘!",
  "hamster": "안녕하세요! 오늘 하루 어떠셨나요? 히히, 얘기 들려주세요~"
};

// ✅ 캐릭터별 추천 불가 메시지
const CHARACTER_NO_CHAT_MESSAGES = {
  "dog": "왈왈! 주인님, 먼저 오늘 하루에 대해 이야기를 나눠주세요멍! 그래야 주인님께 딱 맞는 추천을 해드릴 수 있다멍~ 🐾",
  "cat": "냥... 대화도 안 하고 추천만 받으려고? 흠... 먼저 네 얘기 좀 들려줘. 그래야 뭘 추천해줄지 알 수 있잖아. 귀찮지만 말이야.",
  "bear": "으음... 조금 기다려줘. 먼저 오늘 하루에 대해 천천히 이야기를 나눠보자. 그래야 네게 맞는 걸 추천해줄 수 있어.",
  "rabbit": "음... 죄송하지만, 먼저 오늘 하루에 대해 이야기를 나눠주실 수 있을까요? 그래야 더 좋은 추천을 해드릴 수 있어요!",
  "racoon": "후후~ 급한 건 알겠지만! 먼저 오늘 무슨 일이 있었는지 얘기 좀 해줘~ 그래야 재밌는 추천을 해줄 수 있단 말이야!",
  "hamster": "히히, 주인님! 먼저 오늘 하루 어떠셨는지 말씀해주세요~ 그래야 주인님께 꼭 맞는 추천을 해드릴 수 있어요!"
};

// 추천 메시지 렌더링 컴포넌트
const RecommendMessage = ({ text }) => {
  // 텍스트에서 정보 추출
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  const data = {
    intro: '',
    category: '',
    title: '',
    metadata: {}
  };

  // 첫 줄은 intro (감정 분석 결과)
  if (lines.length > 0 && lines[0].includes('감정')) {
    data.intro = lines[0];
  }

  // 카테고리 파악 (도서/음악/식사 추천) - 더 유연하게
  lines.forEach(line => {
    if (line.includes('도서') && line.includes('추천')) data.category = 'book';
    else if (line.includes('음악') && line.includes('추천')) data.category = 'music';
    else if (line.includes('식사') && line.includes('추천')) data.category = 'food';
  });

  // 제목 추출 (다양한 따옴표 지원)
  const titleMatch = text.match(/"([^"]+)"|"([^"]+)"|'([^']+)'/);
  if (titleMatch) {
    data.title = titleMatch[1] || titleMatch[2] || titleMatch[3];
  }

  // 메타데이터 추출
  lines.forEach(line => {
    if (line.startsWith('IMAGE:')) {
      data.metadata.coverImage = line.replace('IMAGE:', '').trim();
    } else if (line.includes('저자:')) {
      data.metadata.author = line.replace('저자:', '').trim();
    } else if (line.includes('출판사:')) {
      data.metadata.publisher = line.replace('출판사:', '').trim();
    } else if (line.includes('부제:')) {
      data.metadata.subtitle = line.replace('부제:', '').trim();
    } else if (line.includes('아티스트:')) {
      data.metadata.artist = line.replace('아티스트:', '').trim();
    } else if (line.includes('앨범:')) {
      data.metadata.album = line.replace('앨범:', '').trim();
    } else if (line.includes('장르:')) {
      data.metadata.genre = line.replace('장르:', '').trim();
    } else if (line.includes('메뉴:')) {
      data.metadata.menu = line.replace('메뉴:', '').trim();
    } else if (line.includes('위치:')) {
      data.metadata.position = line.replace('위치:', '').trim();
    } else if (line.includes('평점:')) {
      data.metadata.scope = line.replace('평점:', '').trim();
    } else if (line.includes('영업시간:')) {
      data.metadata.time = line.replace('영업시간:', '').trim();
    } else if (line.includes('상세 링크:')) {
      data.metadata.detailUrl = line.replace('상세 링크:', '').trim();
    } else if (line.includes('DJ 태그:')) {
      data.metadata.djTags = line.replace('DJ 태그:', '').trim();
    } else if (!line.includes('추천:') && !line.includes('감정') && !line.includes('"') &&
               !line.includes('저자') && !line.includes('출판사') && !line.includes('부제') &&
               !line.includes('아티스트') && !line.includes('앨범') &&
               !line.includes('장르') && !line.includes('메뉴') && !line.includes('위치') &&
               !line.includes('평점') && !line.includes('영업시간') &&
               !line.includes('상세 링크') && !line.includes('설명') && !line.includes('DJ 태그') &&
               !line.startsWith('IMAGE:')) {
      // 추가 설명이 있는 경우
      if (data.category && line.length > 0) {
        data.metadata.description = line;
      }
    }
  });

  // 추천 컨텐츠가 아니면 일반 텍스트로 표시
  if (!data.category || !data.title) {
    return <>{text}</>;
  }

  return (
    <>
      {/* 인트로 메시지 */}
      {data.intro && <IntroText>{data.intro}</IntroText>}

      {/* 추천 아이템 */}
      <RecommendationItem>
        {data.category === 'book' && (
          <>
            {data.metadata.coverImage && <CoverImage src={data.metadata.coverImage} alt={data.title} />}
            <ItemTitle>{data.title}</ItemTitle>
            {data.metadata.subtitle && <ItemSubtitle>{data.metadata.subtitle}</ItemSubtitle>}
            {data.metadata.author && <ItemSubtitle>저자: {data.metadata.author}</ItemSubtitle>}
            {data.metadata.publisher && <ItemSubtitle>출판사: {data.metadata.publisher}</ItemSubtitle>}
            {data.metadata.detailUrl && (
              <ItemSubtitle>
                <DetailLink href={data.metadata.detailUrl} target="_blank" rel="noopener noreferrer">바로가기</DetailLink>
              </ItemSubtitle>
            )}
          </>
        )}
        {data.category === 'music' && (
          <>
            {data.metadata.coverImage && <CoverImage src={data.metadata.coverImage} alt={data.title} />}
            <ItemTitle>{data.title}</ItemTitle>
            {data.metadata.artist && <ItemSubtitle>아티스트: {data.metadata.artist}</ItemSubtitle>}
            {data.metadata.album && <ItemSubtitle>앨범: {data.metadata.album}</ItemSubtitle>}
            {data.metadata.genre && <ItemSubtitle>장르: {data.metadata.genre}</ItemSubtitle>}
            {data.metadata.detailUrl && (
              <ItemSubtitle>
                상세 링크: <DetailLink href={data.metadata.detailUrl} target="_blank" rel="noopener noreferrer">{data.metadata.detailUrl}</DetailLink>
              </ItemSubtitle>
            )}
            {data.metadata.djTags && <ItemSubtitle>DJ 태그: {data.metadata.djTags}</ItemSubtitle>}
          </>
        )}
        {data.category === 'food' && (
          <>
            {data.metadata.coverImage && <CoverImage src={data.metadata.coverImage} alt={data.title} />}
            <ItemTitle>{data.title}</ItemTitle>
            {data.metadata.menu && <ItemSubtitle>메뉴: {data.metadata.menu}</ItemSubtitle>}
            {data.metadata.position && <ItemSubtitle>위치: {data.metadata.position}</ItemSubtitle>}
            {data.metadata.time && <ItemSubtitle>영업시간: {data.metadata.time}</ItemSubtitle>}
            {data.metadata.scope && <ItemSubtitle>평점: {data.metadata.scope}</ItemSubtitle>}
            {data.metadata.latitude && data.metadata.longitude && (
              <ItemSubtitle>
                <DetailLink
                  href={`https://www.google.com/maps?q=${data.metadata.latitude},${data.metadata.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍 지도에서 보기
                </DetailLink>
              </ItemSubtitle>
            )}
          </>
        )}
      </RecommendationItem>
    </>
  );
};

export default function Test({ apiBase = "" }){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const composingRef = useRef(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [showRecommendMenu, setShowRecommendMenu] = useState(false);
  const [chatId, setChatId] = useState(null); // 현재 대화방 ID
  const [chatCompleted, setChatCompleted] = useState(false); // 채팅 완료 여부 (추천 완료)
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달

  const apiUrl = useMemo(() => {
    const base = (apiBase || "").trim();
    return base ? `${base}/chat/message` : "/chat/message";
  }, [apiBase]);

  // ✅ 현재 선택된 캐릭터 이름 (localStorage → state)
  const [character, setCharacter] = useState(() => {
    return localStorage.getItem("character") || "dog";
  });

  // ✅ 캐릭터 이름 (localStorage → state)
  const [characterName, setCharacterName] = useState(() => {
    return localStorage.getItem("character_name") || "친구";
  });

  // ✅ 캐릭터에 따른 초기 메시지 설정
  const [messages, setMessages] = useState(() => {
    const initialCharacter = localStorage.getItem("character") || "dog";
    const greeting = CHARACTER_GREETINGS[initialCharacter] || CHARACTER_GREETINGS["dog"];
    return [{ id: 1, role: "other", text: greeting }];
  });

  // ✅ 다른 탭에서 character가 바뀌어도 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "character") {
        setCharacter(e.newValue || "dog");
      }
      if (e.key === "character_name") {
        setCharacterName(e.newValue || "친구");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ 캐릭터가 변경되면 인삿말도 업데이트
  useEffect(() => {
    const greeting = CHARACTER_GREETINGS[character] || CHARACTER_GREETINGS["dog"];
    setMessages([{ id: 1, role: "other", text: greeting }]);
  }, [character]);

  // ✅ URL에서 chat_id를 받아 기존 대화 불러오기
  useEffect(() => {
    const chatIdFromUrl = searchParams.get("chat_id");
    if (!chatIdFromUrl) return;

    const loadChat = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const base = (apiBase || "").trim();
        const detailUrl = base ? `${base}/chat/${chatIdFromUrl}` : `/chat/${chatIdFromUrl}`;

        const res = await axios.get(detailUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = res.data;

        // chat_id 설정
        setChatId(data.chat_id);

        // 추천 완료 여부 확인 (emotion이 있으면 완료된 것)
        if (data.emotion) {
          setChatCompleted(true);
        }

        // 메시지 불러오기
        const loadedMessages = [];

        // 인사말 추가
        const greeting = CHARACTER_GREETINGS[character] || CHARACTER_GREETINGS["dog"];
        loadedMessages.push({ id: generateUUID(), role: "other", text: greeting });

        // 기존 메시지 추가
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(msg => {
            loadedMessages.push({ id: generateUUID(), role: "me", text: msg.user_message });
            loadedMessages.push({ id: generateUUID(), role: "other", text: msg.bot_response });
          });
        }

        // 추천 내용이 있으면 추가
        if (data.emotion && data.recommend_content) {
          const emotion = data.emotion;
          const recommendContent = data.recommend_content || {};

          // recommend_content에서 book, music, food 중 하나 찾기
          let rec = null;
          let category = '';

          if (recommendContent.book) {
            rec = recommendContent.book;
            category = 'book';
          } else if (recommendContent.music) {
            rec = recommendContent.music;
            category = 'music';
          } else if (recommendContent.food) {
            rec = recommendContent.food;
            category = 'food';
          }

          if (rec) {
            const metadata = rec.metadata || {};
            let item = {};

            // 카테고리별로 다른 정보 구성
            if (category === 'book') {
              item = {
                category: 'book',
                title: metadata.title || "제목 없음",
                subtitle: metadata.subtitle || "",
                author: metadata.author || "",
                publisher: metadata.publisher || "",
                cover_image_url: metadata.cover_image_url || "",
                detail_url: metadata.detail_url || "",
              };
            } else if (category === 'music') {
              item = {
                category: 'music',
                title: metadata.title || "제목 없음",
                artist: metadata.artist || "",
                album: metadata.album || "",
                cover_url: metadata.cover_url || metadata.cover_image_url || "",
                detail_url: metadata.detail_url || "",
                dj_tags: metadata.dj_tags || [],
                genre: metadata.genre || ""
              };
            } else if (category === 'food') {
              item = {
                category: 'food',
                name: metadata.name || metadata.title || "음식 이름 없음",
                menu: metadata.menu || "",
                position: metadata.position || "",
                scope: metadata.scope || "",
                time: metadata.time || "",
                latitude: metadata.latitude || "",
                longitude: metadata.longitude || "",
                cover_image_url: metadata.cover_image_url || "",
                description: rec.page_content || metadata.description || ""
              };
            }

            // 감정 분석 메시지
            const emotionMsg = `대화 분석 결과, 당신의 감정은 "${emotion}"이에요.`;

            // 추천 콘텐츠 메시지
            let recommendMsg = '';

            if (item.category === 'book') {
              recommendMsg += `도서 추천:\n"${item.title}"\n`;
              if (item.cover_image_url) recommendMsg += `IMAGE:${item.cover_image_url}\n`;
              if (item.subtitle) recommendMsg += `부제: ${item.subtitle}\n`;
              if (item.author) recommendMsg += `저자: ${item.author}\n`;
              if (item.publisher) recommendMsg += `출판사: ${item.publisher}\n`;
              if (item.detail_url) recommendMsg += `상세 링크: ${item.detail_url}\n`;
            } else if (item.category === 'music') {
              recommendMsg += `음악 추천:\n"${item.title}"\n`;
              if (item.cover_url) recommendMsg += `IMAGE:${item.cover_url}\n`;
              if (item.artist) recommendMsg += `아티스트: ${item.artist}\n`;
              if (item.album) recommendMsg += `앨범: ${item.album}\n`;
              if (item.genre) recommendMsg += `장르: ${item.genre}\n`;
              if (item.dj_tags && item.dj_tags.length > 0) recommendMsg += `DJ 태그: ${item.dj_tags.join(', ')}`;
            } else if (item.category === 'food') {
              recommendMsg += `식사 추천:\n"${item.name}"\n`;
              if (item.cover_image_url) recommendMsg += `IMAGE:${item.cover_image_url}\n`;
              if (item.menu) recommendMsg += `메뉴: ${item.menu}\n`;
              if (item.position) recommendMsg += `위치: ${item.position}\n`;
              if (item.time) recommendMsg += `영업시간: ${item.time}\n`;
              if (item.scope) recommendMsg += `평점: ${item.scope}\n`;
            }

            // 두 개의 별도 메시지로 추가
            loadedMessages.push({ id: generateUUID(), role: "other", text: emotionMsg });
            loadedMessages.push({ id: generateUUID(), role: "other", text: recommendMsg });
          }
        }

        setMessages(loadedMessages);
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [searchParams, apiBase, character]);

  // ✅ character명 → 실제 이미지 경로
  const avatarSrc = useMemo(() => {
    const key = `../img/character/${character}.png`;
    const fallback = `../img/character/dog.png`;
    return avatarModules[key] || avatarModules[fallback] || "";
  }, [character]);

  // 새 메시지마다 자동 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // Textarea 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  // Enter로 전송 (Shift+Enter는 줄바꿈)
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.isComposing || composingRef.current) return;
      e.preventDefault();
      sendMessage();
    }
  };

  // 추천 요청 함수
  async function requestRecommendation(type) {
    if (loading) return;

    // 대화방 ID 확인
    if (!chatId) {
      const noChatMessage = CHARACTER_NO_CHAT_MESSAGES[character] || CHARACTER_NO_CHAT_MESSAGES["dog"];
      setError("채팅을 먼저 나눠주세요!");
      setMessages(prev => [
        ...prev,
        { id: generateUUID(), role: "other", text: noChatMessage },
      ]);
      setShowRecommendMenu(false);
      return;
    }

    setError("");
    setShowRecommendMenu(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 카테고리 매핑 (한글 → 영어)
      const categoryMap = {
        "도서": "book",
        "음악": "music",
        "식사": "food"
      };
      const category = categoryMap[type] || "book";

      const base = (apiBase || "").trim();
      const completeUrl = base ? `${base}/chat/${chatId}/complete` : `/chat/${chatId}/complete`;

      const res = await axios.post(completeUrl, {
        category: category
      }, {
        headers: headers
      });

      const data = res.data;
      console.log("=== 백엔드 응답 데이터 ===");
      console.log(data);
      console.log("emotion:", data?.emotion);
      console.log("recommend_content:", data?.recommend_content);

      // 추천 결과 표시
      const emotion = data?.emotion || "알 수 없음";
      const recommendContent = data?.recommend_content || {};

      // category에 따라 book, music, food 중 하나를 선택
      const rec = recommendContent[category] || {};
      const metadata = rec.metadata || {};

      console.log("rec:", rec);
      console.log("metadata:", metadata);

      // 카테고리별로 전체 메타데이터 구조화
      let item = {};

      if (category === "book") {
        item = {
          category: 'book',
          title: metadata.title || "제목 없음",
          author: metadata.author || "",
          publisher: metadata.publisher || "",
          cover_image_url: metadata.cover_image_url || "",
          detail_url: metadata.detail_url || "",
          subtitle : metadata.subtitle || "",
        };
      } else if (category === "music") {
        item = {
          category: 'music',
          title: metadata.title || "제목 없음",
          artist: metadata.artist || "",
          album: metadata.album || "",
          cover_url: metadata.cover_url || metadata.cover_image_url || "",
          dj_tags: metadata.dj_tags || [],
          genre: metadata.genre || ""
        };
      } else if (category === "food") {
        item = {
          category: 'food',
          name: metadata.name || metadata.title || "음식 이름 없음",
          menu: metadata.menu || "",
          position: metadata.position || "",
          scope: metadata.scope || "",
          time: metadata.time || "",
          latitude: metadata.latitude || "",
          longitude: metadata.longitude || "",
          cover_image_url: metadata.cover_image_url || "",
          description: rec.page_content || metadata.description || ""
        };
      }

      console.log("=== 생성된 item 객체 ===");
      console.log("item:", item);

      // 감정 분석 메시지
      const emotionMsg = `대화 분석 결과, 당신의 감정은 "${emotion}"이에요.`;

      // 추천 콘텐츠 메시지 (IMAGE: 접두사로 커버 이미지 전달)
      let recommendMsg = '';

      if (item.category === 'book') {
        recommendMsg += `도서 추천:\n"${item.title}"\n`;
        if (item.cover_image_url) recommendMsg += `IMAGE:${item.cover_image_url}\n`;
        if (item.subtitle) recommendMsg += `부제: ${item.subtitle}\n`;
        if (item.author) recommendMsg += `저자: ${item.author}\n`;
        if (item.publisher) recommendMsg += `출판사: ${item.publisher}\n`;
        if (item.detail_url) recommendMsg += `상세 링크: ${item.detail_url}\n`;
      } else if (item.category === 'music') {
        recommendMsg += `음악 추천:\n"${item.title}"\n`;
        if (item.cover_url) recommendMsg += `IMAGE:${item.cover_url}\n`;
        if (item.artist) recommendMsg += `아티스트: ${item.artist}\n`;
        if (item.album) recommendMsg += `앨범: ${item.album}\n`;
        if (item.genre) recommendMsg += `장르: ${item.genre}\n`;
        if (item.dj_tags && item.dj_tags.length > 0) recommendMsg += `DJ 태그: ${item.dj_tags.join(', ')}`;
      } else if (item.category === 'food') {
        recommendMsg += `식사 추천:\n"${item.name}"\n`;
        if (item.cover_image_url) recommendMsg += `IMAGE:${item.cover_image_url}\n`;
        if (item.menu) recommendMsg += `메뉴: ${item.menu}\n`;
        if (item.position) recommendMsg += `위치: ${item.position}\n`;
        if (item.time) recommendMsg += `영업시간: ${item.time}\n`;
        if (item.scope) recommendMsg += `평점: ${item.scope}\n`;
      }

      console.log("=== 생성된 메시지 ===");
      console.log("emotionMsg:", emotionMsg);
      console.log("recommendMsg:", recommendMsg);

      // 두 개의 별도 메시지로 추가
      const emotionBubble = { id: generateUUID(), role: "other", text: emotionMsg };
      const recommendBubble = { id: generateUUID(), role: "other", text: recommendMsg };
      setMessages(prev => [...prev, emotionBubble, recommendBubble]);

      // 채팅 완료 상태로 변경 (더 이상 채팅 불가)
      setChatCompleted(true);
    } catch (e) {
      const msg = e?.message || "네트워크 오류가 발생했어요!";
      setError(msg);
      setMessages(prev => [
        ...prev,
        { id: generateUUID(), role: "other", text: `⚠️ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError("");

    // 나의 메시지 추가
    const myMsg = { id: generateUUID(), role: "me", text };
    setMessages(prev => [...prev, myMsg]);
    setInput("");
    setLoading(true);

    try {
      // 토큰 가져오기
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post(apiUrl, {
        sentence: text,
        chat_id: chatId  // 대화방 ID 전송 (없으면 자동 생성)
      }, {
        headers: headers
      });

      const data = res.data;
      const answer = data?.answer ?? "미안하다멍! 서버에 문제가 있다 멍!";

      // 대화방 ID 저장 (첫 메시지 시 생성된 ID)
      if (data?.chat_id && !chatId) {
        setChatId(data.chat_id);
      }

      // LLM 메시지 추가 (상대)
      const botMsg = { id: generateUUID(), role: "other", text: answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const msg = e?.message || "네트워크 오류가 발생했다멍!";
      setError(msg);
      setMessages(prev => [
        ...prev,
        { id: generateUUID(), role: "other", text: `⚠️ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // 추천 메뉴 열기 전 채팅 확인
  const handleOpenRecommendMenu = () => {
    const userMessageCount = messages.filter(m => m.role === "me").length;

    if (userMessageCount === 0) {
      // 캐릭터별 메시지 가져오기
      const noChatMessage = CHARACTER_NO_CHAT_MESSAGES[character] || CHARACTER_NO_CHAT_MESSAGES["dog"];

      setError("채팅을 먼저 나눠주세요!");
      setMessages(prev => [
        ...prev,
        { id: generateUUID(), role: "other", text: noChatMessage },
      ]);
      return;
    }

    // 채팅이 있으면 모달 열기
    setShowRecommendMenu(true);
  };

  // 삭제 모달 열기
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // 채팅 삭제 확인
  const handleConfirmDelete = async () => {
    if (!chatId) {
      navigate("/main");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        setShowDeleteModal(false);
        return;
      }

      const base = (apiBase || "").trim();
      const deleteUrl = base ? `${base}/chat/${chatId}` : `/chat/${chatId}`;

      await axios.delete(deleteUrl, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // 삭제 성공 후 메인으로 이동
      navigate("/main");
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("대화 삭제에 실패했습니다.");
      setShowDeleteModal(false);
    }
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return(
    <Wrapper>
      <HeaderWrapper>
        <TopLeft onClick={() => navigate("/main")}/>
        <Header src={logo} alt="logo"/>
        {chatCompleted ? (
          <TrashIcon onClick={handleDeleteClick} />
        ) : (
          <TopRight onClick={handleOpenRecommendMenu}/>
        )}
      </HeaderWrapper>

      {/* 추천 메뉴 모달 */}
      {showRecommendMenu && (
        <Overlay onClick={() => setShowRecommendMenu(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>MENU</ModalTitle>
            <CategoryButtonContainer>
              <CategoryButton onClick={() => {
                requestRecommendation("도서");
                setShowRecommendMenu(false);
              }}>
                <CategoryTitle>도서 추천</CategoryTitle>
                <CategoryLabel>
                  차분히 넘기는 페이지마다 새로운 시선과 같은 사유를 담아,<br />
                  오늘을 더욱 특별하게 채워줄 한 권을 곁들였습니다.
                </CategoryLabel>
              </CategoryButton>
              <CategoryButton onClick={() => {
                requestRecommendation("음악");
                setShowRecommendMenu(false);
              }}>
                <CategoryTitle>음악 추천</CategoryTitle>
                <CategoryLabel>
                  잔잔히 스며드는 선율과 포근하게 머무는 울림을 모아,<br />
                  마음에 머무를 작은 휴식 같은 한 곡을 준비하였습니다.
                </CategoryLabel>
              </CategoryButton>
              <CategoryButton onClick={() => {
                requestRecommendation("식사");
                setShowRecommendMenu(false);
              }}>
                <CategoryTitle>식사 추천</CategoryTitle>
                <CategoryLabel>
                  따뜻한 온기와 풍성한 맛을 고루 담아,<br />
                  몸과 마음을 든든히 채워줄 한 끼를 곁들였습니다.
                </CategoryLabel>
              </CategoryButton>
            </CategoryButtonContainer>
            <CloseButton onClick={() => setShowRecommendMenu(false)}>취소</CloseButton>
          </ModalContainer>
        </Overlay>
      )}

      {/* 대화창 영역 */}
      <MessageList ref={listRef}>
        {messages.map(m => {
          const isMe = m.role === "me";
          if (isMe) {
            // 나의 말풍선 (오른쪽, 아바타 없음)
            return (
              <Row key={m.id} me>
                <Bubble me>{m.text}</Bubble>
              </Row>
            );
          }
          // 상대 말풍선 (왼쪽, 아바타 표시)
          // 추천 메시지인지 확인
          // 1. 큰따옴표로 감싸진 책/음악/음식 제목이 있는 경우
          // 2. 번호 형식(1., 2., 3.)이 있는 경우
          const hasQuotedTitles = /"[^"]+"/g.test(m.text) || /"[^"]+"/g.test(m.text);
          const hasNumberedList = /\d+[.)]\s/.test(m.text);
          const isRecommendation = (hasQuotedTitles || hasNumberedList) &&
                                   (m.text.includes('추천') || m.text.includes('책') ||
                                    m.text.includes('음악') || m.text.includes('노래') ||
                                    m.text.includes('식사') || m.text.includes('음식'));

          return (
            <Row key={m.id}>
              <RowInner>
                <AvatarContainer>
                  <Avatar src={avatarSrc} alt={`${character} avatar`} />
                  <CharacterName>{characterName}</CharacterName>
                </AvatarContainer>
                <Bubble>
                  {isRecommendation ? (
                    <RecommendMessage text={m.text} />
                  ) : (
                    m.text
                  )}
                </Bubble>
              </RowInner>
            </Row>
          );
        })}

        {/* 타이핑 인디케이터 */}
        {loading && (
          <Row>
            <RowInner>
              <AvatarContainer>
                <Avatar src={avatarSrc} alt={`${character} avatar`} />
                <CharacterName>{characterName}</CharacterName>
              </AvatarContainer>
              <Bubble>…</Bubble>
            </RowInner>
          </Row>
        )}
      </MessageList>

      {/* 입력창 */}
      <ChatWrapper>
        {chatCompleted ? (
          <CompletedMessage>대화가 완료되었습니다</CompletedMessage>
        ) : (
          <>
            <ChatInput
              ref={textareaRef}
              placeholder="오늘 하루 어땠어?"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown = {onKeyDown}
              onCompositionStart = {() => (composingRef.current = true)}
              onCompositionEnd = {() => (composingRef.current = false)}
            />
            <Send onClick={sendMessage} />
          </>
        )}
      </ChatWrapper>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <Overlay onClick={handleCancelDelete}>
          <DeleteModalContainer onClick={(e) => e.stopPropagation()}>
            <DeleteModalText>정말 삭제하시겠습니까?</DeleteModalText>
            <DeleteModalButtons>
              <DeleteModalButton className="cancel" onClick={handleCancelDelete}>
                취소
              </DeleteModalButton>
              <DeleteModalButton className="confirm" onClick={handleConfirmDelete}>
                확인
              </DeleteModalButton>
            </DeleteModalButtons>
          </DeleteModalContainer>
        </Overlay>
      )}
    </Wrapper>
  );
}

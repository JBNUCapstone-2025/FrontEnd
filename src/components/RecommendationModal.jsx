// src/components/RecommendationModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../styles/colors";

// 캐릭터 이미지 import
import dog from "../img/character/dog.png";
import cat from "../img/character/cat.png";
import rabbit from "../img/character/rabbit.png";
import racoon from "../img/character/racoon.png";
import bear from "../img/character/bear.png";
import hamster from "../img/character/hamster.png";

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
  max-width: 400px;
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

const Title = styled.h2`
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  color: ${colors.text};
  text-align: center;
`;

const EmotionBadge = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background: ${colors.main};
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: ${colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecommendationItem = styled.div`
  background: #e9e7e7;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
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

const ItemDescription = styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.5;
`;

const CoverImage = styled.img`
  width:40%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
  object-fit: cover;
  // align-self: center; // Flex/Grid의 교차 축 정렬.

  // 💡 아래 두 줄을 추가하여 블록 레벨 요소의 가운데 정렬을 구현합니다.
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const DetailLink = styled.a`
  color: #007bff;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
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
  margin-top: 20px;
  transition: all 0.2s;

  &:hover {
    background: ${colors.hover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmotionText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 0 0 20px 0;
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

const BackButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
  &:hover {
    background: #e9ecef;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${colors.main};
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.hover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
    transform: none;
  }
`;

const SelectItemButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  margin-top: 8px;
  background: ${props => props.selected ? colors.main : 'white'};
  border: 2px solid ${props => props.selected ? colors.main : '#e0e0e0'};
  border-radius: 8px;
  font-size: 13px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  color: ${props => props.selected ? 'black' : '#666'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? colors.main : '#f8f9fa'};
  }
`;

const CharacterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px;
  border-radius: 12px;
`;

const CharacterImage = styled.img`
  width: 50px;
  height: auto;
  object-fit: contain;
  border-radius: 50px;
  padding: 1px;
  border: 1px solid ${colors.text};
  transform: scaleX(-1);
`;

const GreetingMessage = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: white;
  font-weight: 500;
  background: ${colors.text};
  border-radius: 15px;
  padding: 10px 15px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 20px;
`;

const LoadingMessage = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: black;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export default function RecommendationModal({ data, onClose, onSave, onCategorySelect }) {
  // 선택된 카테고리 (null: 카테고리 선택 화면, 'books'/'music'/'food': 해당 카테고리 아이템 선택)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 닉네임과 캐릭터 가져오기
  const [nickname, setNickname] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterImage, setCharacterImage] = useState(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nick_name") || "사용자";
    const storedCharacterName = localStorage.getItem("character_name") || "친구";
    const storedCharacter = localStorage.getItem("character"); // character로 변경

    setNickname(storedNickname);
    setCharacterName(storedCharacterName);

    // 캐릭터 이미지 매핑 (캐릭터 ID에 따라)
    const characterMap = {
      dog: dog,
      cat: cat,
      rabbit: rabbit,
      racoon: racoon,
      bear: bear,
      hamster: hamster
    };

    setCharacterImage(characterMap[storedCharacter] || dog);
  }, []);

  if (!data) return null;

  // API 응답 데이터 파싱
  const { emotion, recommendation } = data;

  // API 응답에서 추천 데이터 추출
  let books = [], music = [], food = [];

  if (recommendation && recommendation.recommendation) {
    const rec = recommendation.recommendation;
    const categoryKey = recommendation.category;

    // 카테고리에 따라 데이터 구성
    if (categoryKey === "도서") {
      const item = {
        title: rec.metadata?.title || "",
        author: rec.metadata?.author || "",
        publisher: rec.metadata?.publisher || "",
        cover_image_url: rec.metadata?.cover_image_url || "",
        detail_url: rec.metadata?.detail_url || "",
        subtitle : rec.metadata?.subtitle || ""
      };
      books = [item];
    } else if (categoryKey === "음악") {
      const item = {
        title: rec.metadata?.title || "",
        artist: rec.metadata?.artist || "",
        album: rec.metadata?.album || "",
        cover_url: rec.metadata?.cover_url || rec.metadata?.cover_image_url || "",
        dj_tags: rec.metadata?.dj_tags || [],
        genre: rec.metadata?.genre || ""
      };
      music = [item];
    } else if (categoryKey === "식사" || categoryKey === "음식") {
      const item = {
        name: rec.metadata?.name || rec.metadata?.title || "",
        menu: rec.metadata?.menu || "",
        position: rec.metadata?.position || "",
        scope: rec.metadata?.scope || "",
        time: rec.metadata?.time || "",
        latitude: rec.metadata?.latitude || "",
        longitude: rec.metadata?.longitude || "",
        cover_image_url: rec.metadata?.cover_image_url || "",
        description: rec.page_content || rec.metadata?.description || ""
      };
      food = [item];
    }
  }

  const categories = [
    { key: 'book', label: '차분히 넘기는 페이지마다 새로운 시선과 같은 사유를 담아,오늘을 더욱 특별하게 채워줄 한 권을 곁들였습니다.', title: '도서 추천', displayName: '도서', items: books || [] },
    { key: 'music', label: '잔잔히 스며디는 선율과 포근하게 머무는 울림을 모아, 마음에 머무를 작은 휴식 같은 한 곡을 준비하였습니다.', title: '음악 추천', displayName: '음악', items: music || [] },
    { key: 'food', label: '따뜻한 온기와 풍성한 맛을 고루 담아, 몸과 마음을 든든히 채워줄 한 끼를 곁들였습니다.', title: '식사 추천', displayName: '음식', items: food || [] }
  ];

  const handleCategorySelect = async (categoryKey) => {
    // console.log("=== RecommendationModal handleCategorySelect 호출됨 ===");
    // console.log("선택된 카테고리:", categoryKey);
    // console.log("onCategorySelect 함수 존재:", !!onCategorySelect);

    setSelectedCategory(categoryKey);
    setIsLoading(true);

    // Diary.jsx에서 전달된 onCategorySelect 호출 (API 요청)
    if (onCategorySelect) {
      // console.log("onCategorySelect 호출 중...");
      await onCategorySelect(categoryKey);
      // console.log("onCategorySelect 완료");
      setIsLoading(false);
    } else {
      // console.warn("onCategorySelect 함수가 전달되지 않았습니다!");
      setIsLoading(false);
    }
  };


  const handleSave = () => {
    if (selectedCategory) {
      const category = categories.find(c => c.key === selectedCategory);
      // 1개 아이템만 전달
      const itemsToSave = category.items.slice(0, 1);

      onSave?.({
        category: selectedCategory,
        items: itemsToSave,
        emotion: emotion
      });
      onClose();
    }
  };

  const currentCategory = categories.find(c => c.key === selectedCategory);
  const greetingMessage = currentCategory ? (
    <>
      오늘 하루도 너무 수고 많았어요! <br />
      {nickname}님을 위한 {currentCategory.displayName} 추천 바로 준비해드겠습니다!
    </>
  ) : (
    ""
  );


  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>

        {/* 카테고리 선택 화면 */}
        {!selectedCategory && (
          <>
            <Title>MENU</Title>
            <CategoryButtonContainer>
              {categories.map((category) => (
                <CategoryButton
                  key={category.key}
                  onClick={() => handleCategorySelect(category.key)}
                >
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryLabel>
                    {category.label.split(',').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line.trim()}
                        {idx < category.label.split(',').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </CategoryLabel>
                </CategoryButton>
              ))}
            </CategoryButtonContainer>
            <CloseButton onClick={onClose}>취소</CloseButton>
          </>
        )}

        {/* 아이템 선택 화면 */}
        {selectedCategory && currentCategory && (
          <>
            {isLoading ? (
              <LoadingContainer>
                <CharacterImage src={characterImage} alt="character" />
                <LoadingMessage>{characterName}가 추천 컨텐츠 찾는 중...</LoadingMessage>
              </LoadingContainer>
            ) : (
              <>
                {/* 캐릭터와 인사 메시지 */}
                <CharacterSection>
                  <CharacterImage src={characterImage} alt="character" />
                  <GreetingMessage>{greetingMessage}</GreetingMessage>
                </CharacterSection>

                <Section>
                  {currentCategory.items.slice(0, 1).map((item, idx) => (
                    <RecommendationItem key={idx}>
                      {selectedCategory === 'book' && (
                        <>
                          {item.cover_image_url && <CoverImage src={item.cover_image_url} alt={item.title} />}
                          <ItemTitle>{item.title || item}</ItemTitle>
                          {item.subtitle && <ItemSubtitle>{item.subtitle}</ItemSubtitle>}
                          {item.author && <ItemSubtitle>저자: {item.author}</ItemSubtitle>}
                          {item.publisher && <ItemSubtitle>출판사: {item.publisher}</ItemSubtitle>}
                          {item.detail_url && (
                            <ItemSubtitle>
                              <DetailLink href={item.detail_url} target="_blank" rel="noopener noreferrer">바로가기</DetailLink>
                            </ItemSubtitle>
                          )}
                        </>
                      )}
                      {selectedCategory === 'music' && (
                        <>
                          {item.cover_url && <CoverImage src={item.cover_url} alt={item.title} />}
                          <ItemTitle>{item.title || item}</ItemTitle>
                          {item.artist && <ItemSubtitle>아티스트: {item.artist}</ItemSubtitle>}
                          {item.album && <ItemSubtitle>앨범: {item.album}</ItemSubtitle>}
                          {item.genre && <ItemSubtitle>장르: {item.genre}</ItemSubtitle>}
                          {item.dj_tags && item.dj_tags.length > 0 && (
                            <ItemSubtitle>태그: {item.dj_tags.join(', ')}</ItemSubtitle>
                          )}
                        </>
                      )}
                      {selectedCategory === 'food' && (
                        <>
                          {item.cover_image_url && <CoverImage src={item.cover_image_url} alt={item.name} />}
                          <ItemTitle>{item.name || item}</ItemTitle>
                          {item.menu && <ItemSubtitle>메뉴: {item.menu}</ItemSubtitle>}
                          {item.position && <ItemSubtitle>위치: {item.position}</ItemSubtitle>}
                          {item.time && <ItemSubtitle>영업시간: {item.time}</ItemSubtitle>}
                          {item.scope && <ItemSubtitle>평점: {item.scope}</ItemSubtitle>}

                        </>
                      )}
                    </RecommendationItem>
                  ))}
                </Section>

                <SaveButton onClick={handleSave}>
                  저장하기
                </SaveButton>
              </>
            )}
          </>
        )}
      </ModalContainer>
    </Overlay>
  );
}
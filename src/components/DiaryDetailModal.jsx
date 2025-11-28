// src/components/DiaryDetailModal.jsx
import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

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
  padding: 15px 15px;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 2px solid ${colors.sub};
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: black;
  padding-left: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const DateText = styled.div`
  font-size: 15px;
  color: #666;
`;

const EmotionBadge = styled.div`
  display: inline-block;
  padding: 4px 10px;
  background: ${props => props.bgColor || colors.main};
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  color: ${props => props.textColor || 'black'};
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: ${colors.text};
`;

const ContentText = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
`;

const RecommendSection = styled.div`
  margin-top: 20px;
`;

const RecommendItem = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CoverImage = styled.img`
  width: 30%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
  object-fit: cover;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const ItemTitle = styled.div`
  font-size: 16px;
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

const CategoryLabel = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 10px;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background: ${colors.main};
    border-radius: 2px;
  }
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
  background: ${colors.main};
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  color: black;
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

const categoryNameMap = {
  book: '도서 추천',
  books: '도서 추천',
  music: '음악 추천',
  food: '음식 추천',
  도서: '도서 추천',
  음악: '음악 추천',
  식사: '음식 추천'
};

// 감정별 색상 매핑
const emotionColorMap = {
  "기쁨": { bg: "#f5e796", text: "black" },      // 노란색
  "슬픔": { bg: "#86bbf9", text: "white" },      // 파란색
  "분노": { bg: "#fb7a6c", text: "white" },      // 빨간색
  "불안": { bg: "#c589dd", text: "white" },      // 보라색
  "설렘": { bg: "#e97bb2", text: "white" },      // 분홍색
  "보통": { bg: "#95A5A6", text: "white" }     // 회색
};

export default function DiaryDetailModal({ diary, onClose }) {
  if (!diary) return null;

  const { title, content, diary_date, emotion, recommend_content } = diary;

  // 감정에 따른 색상 가져오기
  const emotionColors = emotionColorMap[emotion] || { bg: colors.main, text: "black" };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>제목 : {title || "제목 없음"}</Title>
        </Header>

        <InfoRow>
          <DateText>{diary_date}</DateText>
          {emotion && (
            <EmotionBadge
              bgColor={emotionColors.bg}
              textColor={emotionColors.text}
            >
              {emotion}
            </EmotionBadge>
          )}
        </InfoRow>

        <Section>
          <ContentText>{content || "내용이 없습니다."}</ContentText>
        </Section>

        {recommend_content && Object.keys(recommend_content).length > 0 && (
          <RecommendSection>
            {Object.entries(recommend_content).map(([category, itemData]) => {
              // itemData를 파싱 (JSON 문자열일 수 있음)
              let item = itemData;
              if (typeof itemData === 'string') {
                try {
                  item = JSON.parse(itemData);
                } catch {
                  item = { description: itemData };
                }
              }

              // metadata가 있으면 metadata를 item으로 사용
              if (item.metadata) {
                item = item.metadata;
              }

              return (
                <div key={category}>
                  <CategoryLabel>
                    {categoryNameMap[category] || category}
                  </CategoryLabel>
                  <RecommendItem>
                    {category === 'book' && (
                      <>
                        {item.cover_image_url && <CoverImage src={item.cover_image_url} alt={item.title} />}
                        <ItemTitle>{item.title || '제목 없음'}</ItemTitle>
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
                    {category === 'music' && (
                      <>
                        {item.cover_url && <CoverImage src={item.cover_url} alt={item.title} />}
                        <ItemTitle>{item.title || '제목 없음'}</ItemTitle>
                        {item.artist && <ItemSubtitle>아티스트: {item.artist}</ItemSubtitle>}
                        {item.album && <ItemSubtitle>앨범: {item.album}</ItemSubtitle>}
                        {item.genre && <ItemSubtitle>장르: {item.genre}</ItemSubtitle>}
                        {item.dj_tags && item.dj_tags.length > 0 && (
                          <ItemSubtitle>태그: {item.dj_tags.join(', ')}</ItemSubtitle>
                        )}
                      </>
                    )}
                    {category === 'food' && (
                      <>
                        {item.cover_image_url && <CoverImage src={item.cover_image_url} alt={item.name} />}
                        <ItemTitle>{item.name || item.title || '이름 없음'}</ItemTitle>
                        {item.menu && <ItemSubtitle>메뉴: {item.menu}</ItemSubtitle>}
                        {item.position && <ItemSubtitle>위치: {item.position}</ItemSubtitle>}
                        {item.time && <ItemSubtitle>영업시간: {item.time}</ItemSubtitle>}
                        {item.scope && <ItemSubtitle>평점: {item.scope}</ItemSubtitle>}
                      </>
                    )}
                    {!['book', 'music', 'food'].includes(category) && (
                      <div>{typeof item === 'string' ? item : JSON.stringify(item)}</div>
                    )}
                  </RecommendItem>
                </div>
              );
            })}
          </RecommendSection>
        )}

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContainer>
    </Overlay>
  );
}

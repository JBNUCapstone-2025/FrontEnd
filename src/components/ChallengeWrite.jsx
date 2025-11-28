import React, { useState } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { completeChallenge } from "../api/challengeApi";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  background: #FCFCFC;
  padding: 0 20px 0 20px;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  padding: 15px 0;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(FaAngleLeft)`
  font-size: 25px;
  cursor: pointer;
  color: ${colors.airplanebody};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${colors.text};
  flex: 1;
  text-align: center;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${({ $type }) => {
    if ($type === "basic") return "#92A8D1";
    if ($type === "book") return "#F7CAC9";
    if ($type === "music") return "#B5EAD7";
    if ($type === "food") return "#FFE4B5";
    return "#E5E7EB";
  }};
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${colors.text};
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  background: white;
  color: black;
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);

  &:focus {
    outline: none;
    border-color: none;
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #BBD2EA 0%, #FFCFE7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
  transition: all 0.2s;
  margin-bottom: 40px;
  &:hover{
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingMessage = styled.div`
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;


const TextWrapper = styled.div`
    background: ${colors.text};
    border-radius: 15px;
    padding: 30px 25px;
    transform: rotate(-0.5deg);
    box-shadow: 0 5px 10px rgba(0,0,0,0.15);
`;

const SubTitle = styled.div`
    background: white;
    color: #578DC5;
    width: 120px;
    text-align: center;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 18px;
    margin-bottom: 10px;
`

const ChallengeText = styled.div`
    color: white;
    padding: 10px 10px;
    font-size: 18px;
`;

// const typeNameMap = {
//   basic: "기본 챌린지",
//   book: "도서 챌린지",
//   music: "음악 챌린지",
//   food: "음식 챌린지",
// };

const ChallengeWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { challenge, continentId } = location.state || {};

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("챌린지 완료 내용을 입력해주세요!");
      return;
    }

    try {
      setValidating(true);

      // 1단계: GPT API로 챌린지 완료 여부 검증
      const validationUrl = "/validate";

      console.log('🚀 Sending validation request to!:', validationUrl);
      console.log('📝 Request payload:', {
        question: challenge.challenge_text,
        answer: content,
      });

      const validationResponse = await fetch(validationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: challenge.challenge_text,
          answer: content,
        }),
      });

      console.log('✅ Validation response received:', {
        status: validationResponse.status,
        statusText: validationResponse.statusText,
        url: validationResponse.url,
      });

      const validationData = await validationResponse.json();
      console.log('📊 Validation data:', validationData);

      setValidating(false);

      if (!validationData.success) {
        alert("검증 중 오류가 발생했습니다.");
        return;
      }

      // 2단계: 검증 결과가 'yes'인 경우에만 챌린지 완료 처리
      if (!validationData.isValid) {
        alert(validationData.message || "챌린지 완료 내용이 충분하지 않습니다. 더 구체적으로 작성해주세요.");
        return;
      }

      // 3단계: 백엔드에 챌린지 완료 요청
      setSubmitting(true);
      await completeChallenge(challenge.challenge_id, content);

      alert("챌린지를 완료했습니다!");

      // 완료 후 챌린지 맵으로 돌아가기
      navigate("/challenge/content", {
        state: { continentId },
      });
    } catch (error) {
      console.error("챌린지 완료 실패:", error);
      alert(error.response?.data?.detail || "챌린지 완료에 실패했습니다.");
    } finally {
      setValidating(false);
      setSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <Wrapper>
        <p>챌린지 정보가 없습니다.</p>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <TopBar>
          <BackButton
            onClick={() =>
              navigate("/challenge/content", {
                state: { continentId },
              })
            }
          />
          <div style={{ width: 25 }} />
        </TopBar>

        <ContentArea>
          <TextWrapper>
            <SubTitle>Today's Journey</SubTitle>
            <ChallengeText>{challenge.challenge_text}</ChallengeText>
          </TextWrapper>

          <div>
            <TextArea
              placeholder="챌린지 완료 내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          <Label>챌린지를 어떻게 수행했는지 작성해주세요</Label>
          </div>
        </ContentArea>
          <SubmitButton
            onClick={handleSubmit}
            disabled={validating || submitting || !content.trim()}
          >
            {validating ? "AI가 평가 중입니다..." : submitting ? "완료 중..." : "Stamp on Passport"}
          </SubmitButton>
      </Wrapper>

      {/* 로딩 오버레이 */}
      {(validating || submitting) && (
        <LoadingOverlay>
          <LoadingMessage>
            {validating ? "🤖 AI가 평가 중입니다..." : "💾 저장하는 중..."}
          </LoadingMessage>
        </LoadingOverlay>
      )}
    </>
  );
};

export default ChallengeWrite;
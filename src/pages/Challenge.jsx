// Challenge.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

import IntroAnimation from "../components/IntroAnimation";
import { getChallengeStatus } from "../api/challengeApi";

import bearImg from "../img/island/bear.png";
import catImg from "../img/island/cat.png";
import dogImg from "../img/island/dog.png";
import hamsterImg from "../img/island/hamster.png";
import rabbitImg from "../img/island/rabbit.png";
import racoonImg from "../img/island/racoon.png";

// 캐릭터 이미지
import bearCharacterImg from "../img/character/bear.png";
import catCharacterImg from "../img/character/cat.png";
import dogCharacterImg from "../img/character/dog.png";
import hamsterCharacterImg from "../img/character/hamster.png";
import rabbitCharacterImg from "../img/character/rabbit.png";
import racoonCharacterImg from "../img/character/racoon.png";


import challengebackground from "../img/challenge/challenge_background.jpeg";

// 섬 키 → 대륙 ID 매핑
const islandContinentMap = {
  bear: 1,    // 아시아
  racoon: 2,  // 유럽
  dog: 3,     // 아프리카
  hamster: 4, // 북아메리카
  rabbit: 5,  // 남아메리카
  cat: 6,     // 오세아니아
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  background-image: url(${challengebackground});
  background-size: cover;       // 이미지 꽉 채우기
  background-position: center;  // 가운데 정렬
  background-repeat: no-repeat; // 반복 없음
  opacity: 0.9;
`;

const TopBar = styled.div`
  display: flex;
  padding: 15px;
  justify-content: space-between;
`;

const BackButton = styled(FaAngleLeft)`
  font-size: 25px;
  cursor: pointer;
  color: ${colors.airplanebody};
`;

const IslandArea = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  aspect-ratio: 470 / 700;
`;

/* 🔴 섬 사이 선을 그릴 SVG (섬 뒤에 깔림) */
const PathSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const Island = styled.img`
  position: absolute;
  width: ${(props) => props.size || "15%"};
  max-width: ${(props) => props.maxSize || "230px"};
  transition: transform 0.25s ease, filter 0.25s ease;
  cursor: ${(props) => (props.$locked ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$locked ? 0.4 : 1)};
  filter: ${(props) => (props.$locked ? "grayscale(80%)" : "none")};
  pointer-events: ${(props) => (props.$locked ? "none" : "auto")};
  z-index: 1;

  /* 기본 상태에서 flip 적용 */
  transform: ${(props) => (props.$flip ? "scaleX(-1)" : "none")};

  &:hover {
    transform: ${(props) =>
      props.$locked
        ? (props.$flip ? "scaleX(-1)" : "none")
        : (props.$flip ? "scaleX(-1) scale(1.1)" : "scale(1.1)")};
    filter: drop-shadow(0 0 10px rgba(246, 248, 248, 0.9));
    outline-offset: -3px;
  }
`;

/* ===== 모달 ===== */
const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  margin-top: 50px;
  width: 80%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 16px 18px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CharacterRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const CharacterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const CharacterAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 999px;
  object-fit: contain;
  background: #fff;
  padding: 4px;
  transform: scaleX(-1);
  border: 0.5px solid black;
  margin-top: 10px;
`;

const CharacterName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: black;
`;

const CharacterBubble = styled.div`
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  word-break: keep-all;
`;

const ModalTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
`;

const ModalText = styled.div`
  font-size: 13px;
  padding-top: 10px;
`;

const ProgressContainer = styled.div`
  margin-top: 10px;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarBg = styled.div`
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${colors.main}, ${colors.text});
  border-radius: 6px;
  width: ${({ $percent }) => $percent || 0}%;
  transition: width 0.3s ease;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-right: 10px;
`;

const PrimaryButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background-color: ${colors.text};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  cursor: pointer;
  color: black;
  font-size: 14px;
`;

const Highlight = styled.span`
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
  background: ${colors.text};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const Text = styled.div`
  color: white;
  padding: 3px 6px;
  border-radius: 15px;
  background: #80a4bb;
  margin-bottom: 10px;
  font-size: 13px;
`;

const TextTitle = styled.p`
  color: #80a4bb;
  font-size: 30px;
  padding: 0;
  margin: 0;
  font-weight: bold;
`;

/* ===== MAIN COMPONENT ===== */

const Challenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [introDone, setIntroDone] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIslandKey, setSelectedIslandKey] = useState(null);
  const [selectedIslandName, setSelectedIslandName] = useState("");
  const [characterKey, setCharacterKey] = useState(null);

  // API 응답 전체 저장
  const [statusData, setStatusData] = useState(null);

  // 페이지 로드 시 애니메이션 표시 여부 결정
  useEffect(() => {
    // /challenge/content에서 돌아온 경우 애니메이션 스킵
    if (location.state?.fromChallengeContent) {
      setIntroDone(true);
      setIsReturning(false);
    } else {
      // 일반적인 진입 (예: /main에서)
      setIntroDone(false);
      setIsReturning(false);
    }
  }, [location.state]);

  const islandNameMap = {
    bear: "곰섬",
    racoon: "너구리섬",
    dog: "코코도",
    hamster: "햄스터섬",
    rabbit: "토끼섬",
    cat: "고양이섬",
  };

  const characterImageMap = {
    bear: bearCharacterImg,
    racoon: racoonCharacterImg,
    dog: dogCharacterImg,
    hamster: hamsterCharacterImg,
    rabbit: rabbitCharacterImg,
    cat: catCharacterImg,
  };

  // 챌린지 현황 조회
  const fetchStatus = async () => {
    try {
      const data = await getChallengeStatus();
      console.log(data);
      setStatusData(data);
    } catch (err) {
      console.error("챌린지 현황 조회 실패:", err);
    }
  };

  // 인트로 완료 후 및 페이지 재진입 시 상태 조회
  useEffect(() => {
    if (introDone) {
      fetchStatus();
    }
  }, [introDone, location.key]);

  // 섬이 잠겨있는지 확인
  const isIslandLocked = (islandKey) => {
    if (!statusData) return false; // 로딩 중에는 모두 활성화

    const currentContinentId = statusData.current_continent_id;
    const continentId = islandContinentMap[islandKey];

    // current_continent_id가 null이면 모든 섬 선택 가능
    if (currentContinentId === null) return false;

    // 현재 진행 중인 대륙만 선택 가능
    return currentContinentId !== continentId;
  };

  // 대륙 진행 상황 가져오기
  const getContinentProgress = (continentId) => {
    if (!statusData?.continents) return null;
    return statusData.continents.find((c) => c.continent_id === continentId);
  };

  // 캐릭터 이름 상태
  const [characterName, setCharacterName] = useState("");

  const handleIslandClick = (islandKey) => {
    if (isIslandLocked(islandKey)) return;

    const storedCharacter = localStorage.getItem("character") || "dog";
    const storedCharacterName = localStorage.getItem("character_name") || "";
    setCharacterKey(storedCharacter);
    setCharacterName(storedCharacterName);
    setSelectedIslandKey(islandKey);
    setSelectedIslandName(islandNameMap[islandKey]);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleCheckIn = () => {
    const continentId = islandContinentMap[selectedIslandKey];
    setModalOpen(false);
    navigate("/challenge/content", {
      state: { continentId },
    });
  };

  // BackButton 클릭 시 reverse 애니메이션 재생
  const handleBackClick = () => {
    setIsReturning(true);
    setIntroDone(false);
  };

  // reverse 애니메이션 완료 후 /main으로 이동
  const handleAnimationFinish = () => {
    if (isReturning) {
      navigate("/main");
    } else {
      setIntroDone(true);
    }
  };

  const characterImg = characterImageMap[characterKey] || dogCharacterImg;

  // 선택한 섬의 진행 상황
  const selectedContinentId = selectedIslandKey
    ? islandContinentMap[selectedIslandKey]
    : null;
  const selectedProgress = selectedContinentId
    ? getContinentProgress(selectedContinentId)
    : null;

  // 🔴 SVG 상에서 사용할 섬의 대략적 좌표 (0~100 기준)
  const islandCoords = {
    cat: { x: 19, y: 20 },
    bear: { x: 88, y: 18 },
    dog: { x: 35, y: 37 },
    hamster: { x: 82, y: 44 },
    racoon: { x: 18, y: 65 },
    rabbit: { x: 85, y: 65 },
  };

  // 🔴 연결 관계 (중복 제거한 undirected edge 목록)
  const connections = [
    ["cat", "dog"],
    ["cat", "bear"],
    ["bear", "hamster"],
    ["hamster", "dog"],
    ["hamster", "rabbit"],
    ["dog", "racoon"],
    ["racoon", "rabbit"],
  ];

  return (
    <Wrapper>
      {!introDone && (
        <IntroAnimation
          onFinish={handleAnimationFinish}
          reverse={isReturning}
        />
      )}

      {modalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <CharacterRow>
              <CharacterWrapper>
                <CharacterAvatar src={characterImg} alt="character" />
                {characterName && (
                  <CharacterName>{characterName}</CharacterName>
                )}
              </CharacterWrapper>
              <CharacterBubble>
                <ModalTitle>
                  <Highlight>{selectedIslandName}</Highlight> 체크인 안내
                </ModalTitle>
                <ModalText>
                  세계로 통하는 하늘의 입구, {selectedIslandName} 비행장에 오신
                  것을 환영합니다!
                </ModalText>
                {selectedProgress && (
                  <ProgressContainer>
                    <ProgressLabel>
                      <span>진행도</span>
                      <span>
                        {selectedProgress.completed_challenges}/{10} (
                        {Math.round(
                          (selectedProgress.completed_challenges / 10) * 100
                        )}
                        %)
                      </span>
                    </ProgressLabel>
                    <ProgressBarBg>
                      <ProgressBarFill
                        $percent={
                          (selectedProgress.completed_challenges /
                            (10)) *
                          100
                        }
                      />
                    </ProgressBarBg>
                  </ProgressContainer>
                )}
              </CharacterBubble>
            </CharacterRow>

            <ButtonRow>
              <SecondaryButton onClick={handleCloseModal}>
                취소하기
              </SecondaryButton>
              <PrimaryButton onClick={handleCheckIn}>
                체크인하기
              </PrimaryButton>
            </ButtonRow>
          </ModalContainer>
        </ModalOverlay>
      )}

      <TopBar>
        <BackButton onClick={handleBackClick} />
      </TopBar>
      <TextWrapper>
        <Text>Start Your Journey</Text>
        <TextTitle>어느 섬으로</TextTitle>
        <TextTitle>떠나볼까요?</TextTitle>
      </TextWrapper>

      <IslandArea>
        {/* 🔴 얇은 빨간 선으로 섬들 연결 */}
        <PathSvg viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map(([from, to], idx) => {
            const a = islandCoords[from];
            const b = islandCoords[to];
            if (!a || !b) return null;

            // 선택 여부 확인
            const isConnected =
              selectedIslandKey && (from === selectedIslandKey || to === selectedIslandKey);

            return (
              <line
                key={idx}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isConnected ? "#ff4b4b" : "#BDBDBD"}  // 선택 연결은 빨강, 나머지 회색
                strokeWidth="0.4"
                strokeLinecap="round"
                strokeDasharray="2 2"
                opacity={isConnected ? 1 : 0.6}
              />
            );
          })}
        </PathSvg>


        {Object.entries({
          bear: bearImg,
          racoon: racoonImg,
          dog: dogImg,
          hamster: hamsterImg,
          rabbit: rabbitImg,
          cat: catImg,
        }).map(([key, img]) => {
          const locked = isIslandLocked(key);
          const flip = key === "cat" || key === "racoon";

          return (
            <Island
              key={key}
              src={img}
              $locked={locked}
              $flip={flip}
              onClick={() => handleIslandClick(key)}
              style={{
                ...(key === "cat"
                  ? { top: "12%", left: "-1%" }
                  : key === "bear"
                  ? { top: "10%", right: "-3%" }
                  : key === "dog"
                  ? { top: "29%", left: "13%" }
                  : key === "hamster"
                  ? { top: "35%", right: "-3%" }
                  : key === "racoon"
                  ? { bottom: "25%", left: "-4%" }
                  : { bottom: "28%", right: "1%" }),
              }}
              size="50%"
            />
          );
        })}
      </IslandArea>
    </Wrapper>
  );
};

export default Challenge;

// ChallengeContent.jsx
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { FaAngleLeft, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getContinentChallenges,
  selectChallenge,
  getChallengeStatus,
} from "../api/challengeApi";

// 대륙별 캐릭터 이미지
import bearImg from "../img/challenge/bear.png";
import catImg from "../img/challenge/cat.png";
import dogImg from "../img/challenge/dog.png";
import hamsterImg from "../img/challenge/hamster.png";
import rabbitImg from "../img/challenge/rabbit.png";
import racoonImg from "../img/challenge/racoon.png";
import yellowMilegeImg from "../img/challenge/yellowmilege.png";
import hoverbackground from "../img/challenge/background.png";
import background from "../img/challenge/hoverbackground.png";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #f5fafa 10%,
    #ecf5f6 19%,
    #e1f0f1 30%,
    #d5e9eb 42%,
    #d0e4eb 46%,
    #c9deea 50%,
    #bbd2ea 59%,
    #bbd2ea 65%,
    #bbd2ea 78%,
    #bbd2ea 93%
  );
`;

const TopBar = styled.div`
  display: flex;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled(FaAngleLeft)`
  font-size: 25px;
  cursor: pointer;
  color: ${colors.airplanebody};
`;

const TopInfo = styled.div`
  display: flex;
  gap: 10px;
`;

const Badge = styled.div`
  background: rgba(115, 113, 113, 0.9);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  color: white;
`;

const PathArea = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  padding: 40px 0;
  overflow-y: auto;
`;

const PathSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const NodeWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 1;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const NodeCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 3px solid #ffffff;
  background: ${({ $variant, $isTreasure}) => {
    if ($isTreasure) {
      return "white";
    }
    if ($variant === "completed") return "white";
    if ($variant === "current") return "#BBF7D0";
    if ($variant === "locked") return "#E5E7EB";
    return "#F7CAC9";
  }};
  opacity: ${({ $isTreasure, $isCompleted }) => {
    if ($isTreasure && !$isCompleted) return 0.55;
    return 1;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${({ $clickable }) => ($clickable ? "scale(1.1)" : "none")};
  }
`;

const CharacterStamp = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 999px;
  position: absolute;
  top: 0;
  left: 0;
`;

const MilegeStamp = styled.img`
  width: 110%;
  height: 110%;
  object-fit: cover;
  border-radius: 999px;
  position: absolute;
  top: 10;
  left: 10;
`;

const CompletedDate = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 700;
  color: #FF0000;
  z-index: 2;
  white-space: nowrap;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
`;

const NodeLabel = styled.span`
  margin-top: 22px;
  font-size: 12px;
  font-weight: 600;
  color: black;
  text-align: center;
  max-width: 80px;
`;

const NodeNumber = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: white;
  z-index: 1;
`;

/* ===================== 모달 ===================== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const ModalTitle1 = styled.h3`
  padding: 0;
  margin: 0 0 24px 0;
  font-size: 20px;
  text-align: center;
  color: ${colors.text};
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  text-align: center;
  color: black;
`;

const ChallengeText = styled.div`
  background: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: center;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: ${({ $type }) => {
    if ($type === "basic") return "#92A8D1";
    if ($type === "book") return "#F7CAC9";
    if ($type === "music") return "#B5EAD7";
    if ($type === "food") return "#FFE4B5";
    return "#E5E7EB";
  }};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.main};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${colors.text};
  color: white;
  border: none;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #333;
  border: 1px solid #ddd;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
  &:hover {
    border: #f5f5f5;
  }
`;

const SelectTypeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;  // 두 개의 동일한 칸
  gap: 12px;
  margin-bottom: 16px;
  background: white;
`;

const TypeOption = styled.button`
  height: 250px;
  padding: 16px;
  border: 2px solid ${({ $selected }) => ($selected ? colors.text : colors.text)};
  border-radius: 12px;

  background-color: white;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.text};
    background-image: url(${hoverbackground});
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TypeTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 4px;
  color: #838383;
`;

const TypeDesc = styled.div`
  text-align: center;
  font-size: 12px;
  color: #aeaaaa;
`;

/* ===================== 유틸 ===================== */

const generatePathD = (nodes) => {
  if (!nodes.length) return "";
  const pts = nodes.map((n) => [n.x, n.y]);

  let d = `M ${pts[0][0]} ${pts[0][1]}`;

  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + (i % 2 === 0 ? 4 : -4);
    d += ` Q ${cx} ${cy}, ${x2} ${y2}`;
  }

  return d;
};

const typeNameMap = {
  basic: "기본 챌린지",
  book: "도서 챌린지",
  music: "음악 챌린지",
  food: "음식 챌린지",
};

/* ===================== 메인 컴포넌트 ===================== */

const ChallengeContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { continentId = 1 } = location.state || {};

  const [challenges, setChallenges] = useState([]);
  const [status, setStatus] = useState(null);

  // 🔹 마일리지 상태
  const [milege, setMilege] = useState(0);

  // 모달 상태
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 추가 정보
  const [basicRemaining, setBasicRemaining] = useState(5);
  const [canSelectBasic, setCanSelectBasic] = useState(true);

  // 대륙 ID에 따른 캐릭터 이미지 매핑
  const continentCharacterMap = {
    1: bearImg,      // 곰섬
    2: racoonImg,    // 너구리섬
    3: catImg,       // 고양이섬
    4: rabbitImg,    // 토끼섬
    5: dogImg,       // 강아지섬
    6: hamsterImg,   // 햄스터섬
  };

  const characterImage = continentCharacterMap[continentId] || bearImg;

  // 데이터 로드
  const fetchData = useCallback(async () => {
    try {
      const [challengeData, statusData] = await Promise.all([
        getContinentChallenges(continentId),
        getChallengeStatus(),
      ]);

      setChallenges(challengeData.challenges || []);
      setBasicRemaining(challengeData.basic_remaining || 0);
      setCanSelectBasic(challengeData.can_select_basic || false);
      setStatus(statusData);

      // 🔹 마일리지 저장
      setMilege(statusData?.mileage || 0);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // 실패 시 마일리지는 0으로
      setMilege(0);
    }
  }, [continentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 노드 10개 정의
  const nodes = [
    { id: 1, x: 15, y: 12, label: "Start" },
    { id: 2, x: 50, y: 20 },
    { id: 3, x: 85, y: 28 },
    { id: 4, x: 50, y: 36 },
    { id: 5, x: 15, y: 44, isTreasure: true },
    { id: 6, x: 50, y: 52 },
    { id: 7, x: 85, y: 60 },
    { id: 8, x: 50, y: 68 },
    { id: 9, x: 15, y: 77 },
    { id: 10, x: 50, y: 90, label: "Finish", isTreasure: true },
  ];

  const pathD = generatePathD(nodes);

  // 노드 상태 계산
  const getNodeStatus = (nodeId) => {
    const challenge = challenges.find((c) => c.challenge_number === nodeId);

    if (challenge) {
      return {
        status: challenge.is_completed ? "completed" : "current",
        challenge,
      };
    }

    // 다음 선택 가능한 노드
    const hasIncomplete = challenges.some((c) => !c.is_completed);

    if (!hasIncomplete && nodeId === challenges.length + 1) {
      return { status: "selectable", challenge: null };
    }

    return { status: "locked", challenge: null };
  };

  // 노드 클릭 핸들러
  const handleNodeClick = (nodeId) => {
    const { status: nodeStatus, challenge } = getNodeStatus(nodeId);

    if (nodeStatus === "completed") {
      // 완료된 챌린지 상세 보기 (모달)
      setSelectedChallenge(challenge);
      setDetailModalOpen(true);
      return;
    }

    if (nodeStatus === "current" && challenge && !challenge.is_completed) {
      // 진행 중인 챌린지 완료하기 (ChallengeWrite로 이동)
      navigate("/challenge/write", {
        state: {
          challenge,
          continentId,
        },
      });
      return;
    }

    if (nodeStatus === "selectable") {
      // 새 챌린지 선택 전 검증

      // 1. 미완료 챌린지 체크
      const hasIncompleteChallenge = challenges.some((c) => !c.is_completed);
      if (hasIncompleteChallenge) {
        alert("미완료 챌린지가 있습니다. 먼저 완료해주세요!");
        return;
      }

      // 2. 사용 가능한 챌린지 횟수 체크
      if (status?.available_challenges <= 0) {
        alert("챌린지 기회가 없습니다. 일기를 작성해주세요!");
        return;
      }

      // 3. 대륙 완료 체크 (10개 이미 선택했는지)
      if (challenges.length >= 10) {
        alert("이미 이 대륙의 모든 챌린지를 선택했습니다!");
        return;
      }

      setSelectModalOpen(true);
      return;
    }
  };

  // 챌린지 선택 (TypeOption 클릭 시 자동 선택)
  const handleSelectChallenge = async (type) => {
    if (status?.available_challenges <= 0) {
      alert("챌린지 기회가 없습니다. 일기를 작성해주세요!");
      setSelectModalOpen(false);
      return;
    }

    const hasIncompleteChallenge = challenges.some((c) => !c.is_completed);
    if (hasIncompleteChallenge) {
      alert("미완료 챌린지가 있습니다. 먼저 완료해주세요!");
      setSelectModalOpen(false);
      return;
    }

    if (challenges.length >= 10) {
      alert("이미 이 대륙의 모든 챌린지를 선택했습니다!");
      setSelectModalOpen(false);
      return;
    }

    if (type === "basic" && !canSelectBasic) {
      alert("기본 챌린지를 더 이상 선택할 수 없습니다. (최대 5개)");
      return;
    }

    try {
      setSubmitting(true);
      const newChallenge = await selectChallenge(continentId, type);
      setSelectModalOpen(false);
      await fetchData();

      // 챌린지 선택 후 ChallengeWrite로 이동
      navigate("/challenge/write", {
        state: {
          challenge: newChallenge,
          continentId,
        },
      });
    } catch (error) {
      console.error("챌린지 선택 실패:", error);
      console.log("에러 응답 전체:", error.response);
      console.log("에러 응답 data:", error.response?.data);
      console.log("에러 상태:", error.response?.status);

      const errorDetail = error.response?.data?.detail;
      const errorMessage =
        typeof errorDetail === "string"
          ? errorDetail
          : JSON.stringify(errorDetail) || "챌린지 선택에 실패했습니다.";

      if (type === "recommend" && error.response?.status === 400) {
        alert(
          `추천 챌린지를 선택할 수 없습니다.\n\n서버 응답: ${errorMessage}\n\n가능한 원인:\n1. 오늘 일기를 아직 작성하지 않았습니다.\n2. 일기에 추천 항목(도서/음악/음식)이 저장되지 않았습니다.`
        );
      } else {
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Wrapper>
      <TopBar>
        <BackButton
          onClick={() => navigate("/challenge/map", {
            state: { fromChallengeContent: true }
          })}
        />
        <TopInfo>
          {status && <Badge>남은 기회: {status.available_challenges}회</Badge>}
          <Badge>{milege} M</Badge>
        </TopInfo>
      </TopBar>

      <PathArea>
        <PathSvg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathD}
            stroke="gray"
            strokeWidth="1"
            strokeDasharray="1 3"
            fill="none"
            strokeLinecap="round"
          />
        </PathSvg>

        {nodes.map((node) => {
          const { status: nodeStatus, challenge } = getNodeStatus(node.id);
          const isClickable =
            nodeStatus === "completed" ||
            nodeStatus === "current" ||
            nodeStatus === "selectable";

          let variant = "locked";
          if (nodeStatus === "completed") variant = "completed";
          else if (nodeStatus === "current") variant = "current";
          else if (nodeStatus === "selectable") variant = "current";

          const isTreasure = node.isTreasure;
          const isCompleted = nodeStatus === "completed";

          return (
            <NodeWrapper
              key={node.id}
              style={{ top: `${node.y}%`, left: `${node.x}%` }}
              $clickable={isClickable}
              onClick={() => isClickable && handleNodeClick(node.id)}
            >
              <NodeCircle
                $variant={variant}
                $clickable={isClickable}
                $isTreasure={isTreasure}
                $isCompleted={isCompleted}
              >
                {/* 완료된 챌린지: 캐릭터 도장 이미지 */}
                {isCompleted && !isTreasure && (
                  <CharacterStamp src={characterImage} alt="character" />
                )}

                {/* 보물상자: 마일리지 이미지 */}
                {isTreasure && (
                  <MilegeStamp src={yellowMilegeImg} alt="milege" />
                )}

                {/* 잠긴 보물상자: 열쇠 아이콘 */}
                {isTreasure && !isCompleted && (
                  <FaLock size={16} color="#6f6f6f" style={{ zIndex: 3}} />
                )}

                {/* 잠긴 노드 */}
                {nodeStatus === "locked" && !isTreasure && (
                  <FaLock size={16} color="#999" />
                )}

                {/* 선택 가능하거나 진행 중인 노드 */}
                {(nodeStatus === "current" || nodeStatus === "selectable") && !isTreasure && !isCompleted && (
                  <NodeNumber>{node.id}</NodeNumber>
                )}

                {/* 완료 날짜 표시 - 보물상자는 제외 */}
                {isCompleted && !isTreasure && challenge?.completed_date && (
                  <CompletedDate>
                    {new Date(challenge.completed_date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\. /g, '.').replace(/\.$/, '')}
                  </CompletedDate>
                )}
              </NodeCircle>
            </NodeWrapper>
          );
        })}
      </PathArea>

      {/* 챌린지 선택 모달 */}
      {selectModalOpen && (
        <ModalOverlay onClick={() => setSelectModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle1>오늘은 어떤 여정을<br/>떠나볼까요?</ModalTitle1>

            <SelectTypeContainer>
                <TypeOption
                onClick={() => !submitting && canSelectBasic && handleSelectChallenge("basic")}
                disabled={!canSelectBasic || submitting}
                >
                  <TypeTitle>
                    일상 여정
                  </TypeTitle>
                  <TypeDesc>
                    일반적인 자기계발 챌린지({basicRemaining}/5)
                  </TypeDesc>
                </TypeOption>
                <TypeOption
                  onClick={() => !submitting && handleSelectChallenge("recommend")}
                  disabled={submitting}
                >
                <TypeTitle>
                  모험 여정
                </TypeTitle>
                <TypeDesc>
                  오늘 일기의 추천 항목 기반 챌린지
                </TypeDesc>
              </TypeOption>
            </SelectTypeContainer>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* 챌린지 상세 보기 모달 */}
      {detailModalOpen && selectedChallenge && (
        <ModalOverlay onClick={() => setDetailModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>챌린지 상세</ModalTitle>

            <TypeBadge $type={selectedChallenge.challenge_type}>
              {typeNameMap[selectedChallenge.challenge_type] ||
                selectedChallenge.challenge_type}
            </TypeBadge>

            <ChallengeText>{selectedChallenge.challenge_text}</ChallengeText>

            <div style={{ marginBottom: 8, fontWeight: 600 }}>완료 내용:</div>
            <ChallengeText>{selectedChallenge.content}</ChallengeText>

            <ButtonRow>
              <PrimaryButton onClick={() => setDetailModalOpen(false)}>
                닫기
              </PrimaryButton>
            </ButtonRow>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default ChallengeContent;

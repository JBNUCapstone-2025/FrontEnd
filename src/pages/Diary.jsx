// src/pages/Diary.jsx
import React,{useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import logo from "../logo/logo.png";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";

import ClassModal from "../components/ClassModal";
import RecommendationModal from "../components/RecommendationModal";
import SuccessModal from "../components/SuccessModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  background-color: white;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${colors.text};
  line-height: 0px;
  padding: 30px 0;

  &.info{
    border: none;
    padding: 10px 0;
    align-items: center;
    gap: 12px;
  }
  &.class{
    justify-content: space-evenly;
    border: none;
    padding: 10px 0;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
`;

const Bell = styled(FaRegBell)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;

  &:hover {
    color: ${colors.hover};
  }
`;

const Header = styled.img`
  width: calc(30%);
`;

const TopLeft = styled(FaAngleLeft)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;
  &:hover { color: ${colors.hover}; }
`;


const Text = styled.p`
  font-size: 15px;
  margin: 10px 0;
  line-height: 1.2;
`;

const ClassThumb = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
`;

const MoodUnder = styled.span`
  font-size: 12px;
  color: ${colors.text};
`;

const DiarySection = styled.div`
  flex: 1;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${colors.chatinput};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  box-sizing: border-box;
  background: #d6d5d5;
  color: black;
  &:focus {
    outline: none;
    border-color: ${colors.main};
  }

  &::placeholder {
    color: #aaa;
    font-weight: 400;
  }
`;

const DiaryTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border: 2px solid ${colors.chatinput};
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  background: #d6d5d5;
  color: black;
  &:focus {
    outline: none;
    border-color: ${colors.main};
  }

  &::placeholder {
    color: #aaa;
  }
`;

const AnalyzeButton = styled.button`
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

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${colors.text};
`;

export default function Diary(){
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 날짜가 있으면 사용, 없으면 오늘 날짜 (서버 시간대 기준 - UTC)
  const getDateString = () => {
    // 편집 모드일 때는 일기의 원래 날짜 사용
    if (location.state?.editMode && location.state?.diaryData?.diary_date) {
      return location.state.diaryData.diary_date;
    }
    if (location.state?.selectedDate) {
      return location.state.selectedDate;
    }
    // 서버가 UTC 기준으로 저장하므로, UTC 날짜를 사용
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");
    const day = String(today.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const dateString = getDateString();

  // 선택된 클래스(이미지+라벨)
  const [selectedClass, setSelectedClass] = useState(null);
  // { key, label, src }

  // 모달 오픈 상태
  const [open, setOpen] = useState(false);

  // 일기 제목
  const [diaryTitle, setDiaryTitle] = useState("");

  // 일기 내용
  const [diaryText, setDiaryText] = useState("");

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 추천 모달 상태
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendationData, setRecommendationData] = useState(null);

  // 선택된 추천 아이템
  const [, setSelectedRecommendation] = useState(null);

  // 저장된 일기 ID
  const [savedDiaryId, setSavedDiaryId] = useState(null);

  // 저장 성공 모달
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  // 편집 모드로 진입했을 때 기존 일기 데이터를 로드
  useEffect(() => {
    if (location.state?.editMode && location.state?.diaryData) {
      const { diaryData, diaryId } = location.state;
      setDiaryTitle(diaryData.title || "");
      setDiaryText(diaryData.content || "");
      setSavedDiaryId(diaryId);
      console.log("편집 모드로 일기 로드:", diaryData);
    }
  }, [location.state]);

  const closeModal = () => setOpen(false);

  const handleSelect = (item) => {
    setSelectedClass(item);
    closeModal();
  };

  // 일기 저장 함수
  const saveDiary = async () => {
    if (!diaryTitle.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }
    if (!diaryText.trim()) {
      alert("일기를 작성해주세요!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 편집 모드인지 확인
      const isEditMode = location.state?.editMode && savedDiaryId;

      if (isEditMode) {
        // 편집 모드: PUT 요청으로 업데이트 (emotion은 null 유지)
        const updateData = {
          title: diaryTitle,
          content: diaryText
        };

        // console.log("=== PUT /diary/ 요청 데이터 ===");
        // console.log("Diary ID:", savedDiaryId);
        // console.log(updateData);
        // console.log("================================");

        const response = await axios.put(`/diary/${savedDiaryId}`, updateData, {
          headers: headers
        });

        console.log("=== PUT /diary/ 응답 ===");
        console.log("응답 데이터:", response.data);
        console.log("=======================");

        // 수정 성공 모달 표시
        setShowSaveSuccessModal(true);
        setTimeout(() => {
          setShowSaveSuccessModal(false);
        }, 1500);
      } else {
        // 새 일기 작성 모드: POST 요청
        // emotion 값 설정 (선택 안 했으면 "보통"으로 기본값 설정)
        const emotion = selectedClass ? selectedClass.label : "보통";

        // POST /diary/ 요청 데이터
        const requestData = {
          title: diaryTitle,
          content: diaryText,
          diary_date: dateString,
          emotion: emotion,
          recommend_content: {}
        };

        console.log("=== POST /diary/ 요청 데이터 ===");
        console.log(requestData);
        console.log("================================");

        const response = await axios.post("/diary/", requestData, {
          headers: headers
        });

        console.log("=== POST /diary/ 응답 ===");
        console.log("응답 데이터:", response.data);
        console.log("저장된 diary_id:", response.data.diary.diary_id);
        console.log("저장된 emotion:", response.data.diary.emotion);
        console.log("=======================");

        setSavedDiaryId(response.data.diary.diary_id);

        // 저장 성공 모달 표시
        setShowSaveSuccessModal(true);
        setTimeout(() => {
          setShowSaveSuccessModal(false);
        }, 1500);
      }
    } catch (e) {
      console.error("일기 저장 오류:", e);
      alert(e?.response?.data?.detail || e?.message || "저장 중 오류가 발생했습니다!");
    } finally {
      setLoading(false);
    }
  };

  // 벨 아이콘 클릭 - 카테고리 선택 모달만 열기
  const handleBellClick = () => {
    if (!savedDiaryId) {
      alert("먼저 일기를 저장해주세요!");
      return;
    }

    // 빈 객체로 모달 열기 (카테고리 선택 화면 표시)
    setRecommendationData({});
    setShowRecommendation(true);
  };

  // 카테고리 선택 시
  const handleCategorySelect = async (category) => {
    console.log("=== handleCategorySelect 호출됨 ===");
    console.log("선택된 카테고리:", category);
    console.log("savedDiaryId:", savedDiaryId);

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("API 호출 시작...");

      // 선택한 카테고리로 complete API 호출
      const response = await axios.post(`/diary/${savedDiaryId}/complete`, {
        category: category
      }, {
        headers: headers
      });

      console.log(`=== ${category} 카테고리 선택 시 응답 ===`);
      console.log("전체 응답:", response.data);
      console.log("recommendation:", response.data.recommendation);
      console.log("category:", response.data.recommendation?.category);
      console.log("metadata:", response.data.recommendation?.recommendation?.metadata);
      console.log("page_content:", response.data.recommendation?.recommendation?.page_content);
      console.log("========================================");

      // API 응답으로 모달 데이터 업데이트
      setRecommendationData(response.data);
    } catch (e) {
      console.error("카테고리 선택 오류:", e);
      console.error("에러 상세:", e.response?.data);
      alert(e?.response?.data?.detail || e?.message || "카테고리 선택 중 오류가 발생했습니다!");
      setShowRecommendation(false);
    }
  };

  // 추천 확인 후 메인으로 이동
  const handleSaveRecommendation = () => {
    // API에서 이미 저장 완료되었으므로 단순히 모달 닫고 이동
    setShowRecommendation(false);
    setRecommendationData(null);
    setSelectedRecommendation(null);

    // 폼 초기화
    setDiaryTitle("");
    setDiaryText("");
    setSelectedClass(null);
    setSavedDiaryId(null);

    // /main 경로로 이동 (일기 탭으로)
    navigate("/main", { state: { initialTab: "diary" } });
  };

  return(
    <Wrapper>
      {/* 저장 성공 모달 */}
      <SuccessModal
        message="일기가 저장되었습니다!"
        show={showSaveSuccessModal}
        centered
      />

      <Container>
        <TopLeft onClick={() => navigate("/main", { state: { initialTab: "diary" } })}/>
        <Header src={logo} alt="logo"/>
        <Bell onClick={handleBellClick} style={{ opacity: savedDiaryId ? 1 : 0.3, cursor: savedDiaryId ? 'pointer' : 'not-allowed' }} />
      </Container>

      <Container className="info">
        <Text>{dateString}</Text>
      </Container>

      {/* 일기 입력 영역 */}
      <DiarySection>
        <TitleInput
          placeholder="제목을 입력하세요"
          value={diaryTitle}
          onChange={(e) => setDiaryTitle(e.target.value)}
          maxLength={100}
        />
        <DiaryTextArea
          placeholder="오늘 하루는 어땠나요? 들려주고 싶은 이야기가 있나요?"
          value={diaryText}
          onChange={(e) => setDiaryText(e.target.value)}
          maxLength={2000}
        />
        <CharCount>{diaryText.length} / 2000자</CharCount>
        <AnalyzeButton onClick={saveDiary} disabled={loading}>
          {loading ? "저장 중..." : "저장하기"}
        </AnalyzeButton>
      </DiarySection>

      {/* 클래스 선택 모달 */}
      {open && (
        <ClassModal
          onSelect={handleSelect}
          onClose={closeModal}
        />
      )}

      {/* 추천 모달 */}
      {showRecommendation && recommendationData && (
        <RecommendationModal
          data={recommendationData}
          onClose={() => setShowRecommendation(false)}
          onSave={handleSaveRecommendation}
          onCategorySelect={handleCategorySelect}
        />
      )}
    </Wrapper>
  )
};
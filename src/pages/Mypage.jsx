import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiUserCircleGearFill } from "react-icons/pi";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import axios from "axios";

import logo from "../logo/logo.png";

// 캐릭터 이미지 import
const avatarModules = import.meta.glob("../img/character/*.png", { eager: true, import: "default" });

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 470px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  padding-inline: 15px;
`;

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: space-between;
    height: 30px;
    border-bottom: 1px solid ${colors.text};
    padding-inline: 10px;
    padding-bottom: 15px;
`

const Setting = styled(PiUserCircleGearDuotone)`
    width: 25px;
    height: auto; 
    :hover{
        cursor: pointer;
        color: ${colors.hover};
    }
`


const Logo = styled.img`
    width: 120px;
    align-items: center;
    padding-block: 5px;
`

const Container =styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    &.info{
        padding: 0px 3px 0 10px;
    }
    &.date{
        justify-content: space-between;
        padding-block: 20px;
    }
`

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Left = styled(FaAngleLeft)`
    cursor: pointer;
    font-size: 20px;
    color: ${colors.text};
    &:hover {
        color: ${colors.hover};
    }
`

const Right = styled(FaAngleRight)`
    cursor: pointer;
    font-size: 20px;
    color: ${colors.text};
    &:hover {
        color: ${colors.hover};
    }
`

const Text = styled.p`
    margin: 0;
    &.date{
        color: ${colors.text};
        font-size: 16px;
        font-weight: bold;
    }
`

const MonthlyStats = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    padding: 0px 25px;
    justify-content: space-between;
`

const StatsText = styled.p`
    margin: 0;
    font-size: 18px;
    font-weight: bold;
`

const GraphTitle = styled.p`
    padding-inline: 25px;    
    padding-block: 0;
    margin: 20px 0 0 0;
    font-size: 20px;
`

const Label = styled.p`
    padding: 3px 9px;
    border-radius: 15px;
    font-size: 10px;
    &.checkin{
        background: ${colors.checkin};
    }

    &.mileage{
        background: ${colors.mileage};
    }
`

const EmotionContainer = styled.div`
    background: ${colors.emotiongraph};
    border-radius: 8px;
    padding: 20px;
    margin: 10px 20px;
`

const EmotionGraph = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const EmotionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const EmotionLabel = styled.span`
    min-width: 60px;
    font-size: 14px;
`

const EmotionBarContainer = styled.div`
    flex: 1;
    height: 20px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
`

const EmotionBar = styled.div`
    height: 100%;
    background: ${props => props.color || colors.main};
    border-radius: 10px;
    width: ${props => props.percentage || 0}%;
    transition: width 0.3s ease;
`

const EmotionPercentage = styled.span`
    min-width: 40px;
    text-align: right;
    font-size: 12px;
`

const Log = styled.div`

`
const LogTitle = styled.p`
    padding-inline: 25px;    
    padding-block: 0;
    margin: 30px 0 0 0;
    font-size: 20px;
`

const LogContainer = styled.div`
    background: ${colors.emotiongraph};
    border-radius: 8px;
    padding: 20px;
    margin: 10px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
`

const LogContent = styled.p`
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    flex: 1;
`

const CharacterImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: contain;
    flex-shrink: 0;
    background: white;
    border-radius: 50%;
    border: 1px solid black;
`

const MomentsContainer = styled.div`
    border-radius: 8px;
`

const MomentItem = styled.p`
    background: ${colors.mileage};
    margin: 1px 0;
    font-size: 14px;
    line-height: 1.5;
    margin-inline: 2px;
    border-radius: 15px;
    padding-inline: 5px;
    display: inline-block;
`

const Mypage = () => {
    const navigate = useNavigate();

    // 현재 년월 상태
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1~12

    // 일기 데이터 상태
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(false);

    // 마일리지 상태
    const [mileage, setMileage] = useState(0);

    // 닉네임 상태
    const [nickname, setNickname] = useState("");

    // 캐릭터 상태
    const [character, setCharacter] = useState("");

    // 좋은 순간들 상태
    const [moments, setMoments] = useState([]);
    const [momentsLoading, setMomentsLoading] = useState(false);

    // 감정별 색상 매핑
    const emotionColors = {
        "기쁨": "#ede3ae",
        "설렘":"#f1a4e7",
        "보통": "#a2a2a2",
        "슬픔": "#96adf4",
        "불안": "#c4aef1",
        "분노": "#f6906a",
    };

    // 일기 데이터 가져오기
    useEffect(() => {
        const fetchDiaries = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem("access_token");
                const response = await axios.get(
                    `/diary/calendar/${currentYear}/${currentMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                setDiaries(response.data.diaries || []);
            } catch (error) {
                console.error("일기 데이터를 가져오는데 실패했습니다:", error);
                setDiaries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDiaries();
    }, [currentYear, currentMonth]);

    // 챌린지 상태 (마일리지) 가져오기
    useEffect(() => {
        const fetchChallengeStatus = async () => {
            try {
                const accessToken = localStorage.getItem("access_token");
                const response = await axios.get("/challenge/status", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setMileage(response.data.mileage || 0);
            } catch (error) {
                console.error("챌린지 상태를 가져오는데 실패했습니다:", error);
                setMileage(0);
            }
        };

        fetchChallengeStatus();
    }, []);

    // 닉네임 가져오기
    useEffect(() => {
        const storedNickname = localStorage.getItem("nick_name") || "여행자";
        setNickname(storedNickname);
    }, []);

    // 캐릭터 가져오기
    useEffect(() => {
        const storedCharacter = localStorage.getItem("character") || "dog";
        setCharacter(storedCharacter);
    }, []);

    // 감정 분포 계산
    const emotionDistribution = useCallback(() => {
        // 모든 감정을 0으로 초기화
        const emotionCount = {
            "기쁨": 0,
            "설렘": 0,
            "보통": 0,
            "슬픔": 0,
            "불안": 0,
            "분노": 0
        };

        // 일기 데이터가 있으면 카운트
        diaries.forEach(diary => {
            const emotion = diary.emotion || "평온";
            if (emotion in emotionCount) {
                emotionCount[emotion] += 1;
            }
        });

        const total = diaries.length || 1; // 0으로 나누는 것 방지
        return Object.entries(emotionCount).map(([emotion, count]) => ({
            emotion,
            count,
            percentage: diaries.length > 0 ? ((count / total) * 100).toFixed(1) : "0.0"
        }));
    }, [diaries]);

    // 좋은 순간들 가져오기
    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const distribution = emotionDistribution();
                const validEmotions = distribution.filter(item => parseFloat(item.percentage) > 0);

                console.log("감정 분포:", distribution);

                if (validEmotions.length === 0) {
                    console.log("유효한 감정이 없습니다.");
                    setMoments([]);
                    return;
                }

                // 가장 높은 감정 찾기
                const topEmotion = validEmotions.reduce((max, item) =>
                    parseFloat(item.percentage) > parseFloat(max.percentage) ? item : max
                );

                console.log("가장 높은 감정:", topEmotion);

                // 기쁨 또는 설렘 감정이 하나라도 있는지 확인
                const hasPositiveEmotion = validEmotions.some(
                    item => item.emotion === "기쁨" || item.emotion === "설렘"
                );

                if (!hasPositiveEmotion) {
                    console.log("기쁨/설렘 감정이 없습니다.");
                    setMoments([]);
                    return;
                }

                // 여기서부터 로딩 시작
                console.log("moments 가져오기 시작");
                setMomentsLoading(true);

                const accessToken = localStorage.getItem("access_token");

                // 1. /diary/list에서 해당 감정의 일기 목록 가져오기
                const listResponse = await axios.get("/diary/list", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                // 응답 데이터 확인
                if (!Array.isArray(listResponse.data)) {
                    console.error("일기 목록 응답 형식이 올바르지 않습니다:", listResponse.data);
                    setMoments([]);
                    return;
                }

                // 해당 월의 기쁨 또는 설렘 감정 일기 필터링
                const targetDiaries = listResponse.data.filter(diary => {
                    const diaryDate = new Date(diary.diary_date);
                    const diaryYear = diaryDate.getFullYear();
                    const diaryMonth = diaryDate.getMonth() + 1;

                    return (
                        diaryYear === currentYear &&
                        diaryMonth === currentMonth &&
                        (diary.emotion === "기쁨" || diary.emotion === "설렘")
                    );
                });

                console.log("필터링된 일기:", targetDiaries);

                if (targetDiaries.length === 0) {
                    console.log("기쁨/설렘 감정의 일기가 없습니다.");
                    setMoments([]);
                    return;
                }

                // 2. 각 일기의 상세 내용 가져오기
                const diaryContents = await Promise.all(
                    targetDiaries.map(async (diary) => {
                        try {
                            const detailResponse = await axios.get(`/diary/${diary.diary_id}`, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            });
                            return detailResponse.data.content || "";
                        } catch (error) {
                            console.error(`일기 ${diary.diary_id} 가져오기 실패:`, error);
                            return "";
                        }
                    })
                );

                // 3. 모든 내용을 하나의 문자열로 합치기
                const combinedText = diaryContents.filter(content => content).join(" ");

                console.log("결합된 텍스트 길이:", combinedText.length);
                console.log("결합된 텍스트:", combinedText.substring(0, 100) + "...");

                if (!combinedText) {
                    console.log("결합된 텍스트가 없습니다.");
                    setMoments([]);
                    return;
                }

                // 4. 외부 API로 좋은 순간 추출 요청
                console.log("extract-moments API 호출 중...");
                const momentsResponse = await axios.post(
                    "/extract-moments",
                    { text: combinedText },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("extract-moments 응답:", momentsResponse.data);

                if (momentsResponse.data.success && momentsResponse.data.moments) {
                    console.log("moments 설정:", momentsResponse.data.moments);
                    setMoments(momentsResponse.data.moments);
                } else {
                    console.log("moments 응답이 올바르지 않습니다.");
                    setMoments([]);
                }

            } catch (error) {
                console.error("좋은 순간 가져오기 실패:", error);
                setMoments([]);
            } finally {
                setMomentsLoading(false);
            }
        };

        // 일기 데이터가 로딩되지 않았거나 비어있으면 실행하지 않음
        if (!loading && diaries.length > 0) {
            fetchMoments();
        } else {
            setMoments([]);
        }
    }, [diaries, loading, currentYear, currentMonth, emotionDistribution]);

    // 기쁨/설렘 중 가장 높은 감정 가져오기
    const getTopPositiveEmotion = () => {
        const distribution = emotionDistribution();
        const positiveEmotions = distribution.filter(
            item => parseFloat(item.percentage) > 0 && (item.emotion === "기쁨" || item.emotion === "설렘")
        );

        if (positiveEmotions.length === 0) {
            return null;
        }

        // 기쁨과 설렘 중 더 높은 것 반환
        const topPositive = positiveEmotions.reduce((max, item) =>
            parseFloat(item.percentage) > parseFloat(max.percentage) ? item : max
        );

        return topPositive.emotion;
    };

    // 캐릭터 이미지 경로 가져오기
    const getCharacterImage = () => {
        const key = `../img/character/${character}.png`;
        const fallback = `../img/character/dog.png`;
        return avatarModules[key] || avatarModules[fallback] || "";
    };

    // 월 이동 핸들러
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return(
        <Wrapper>
            <Top>
                <Logo src={logo}/>
                <Setting onClick={() => navigate("/profile")}/>
            </Top>
            <Container className="date">
                <Left onClick={handlePrevMonth}/>
                <Text className="date">{currentYear}년 {currentMonth}월</Text>
                <Right onClick={handleNextMonth}/>
            </Container>
            <MonthlyStats>
                <StatsText>월간 기록</StatsText>
                <InfoWrapper>
                    <Container className="info">
                        <Label className="checkin">체크인</Label>
                        <Text>{diaries.length}</Text>
                    </Container>
                    <Container className="info">
                        <Label className="mileage">마일리지</Label>
                        <Text>{mileage}</Text>
                    </Container>
                </InfoWrapper>
            </MonthlyStats>
            <GraphTitle>감정 비행 경로</GraphTitle>
            <EmotionContainer>
                {loading ? (
                    <p style={{ textAlign: "center", margin: 0 }}>로딩 중...</p>
                ) : diaries.length === 0 ? (
                    <p style={{ textAlign: "center", margin: 0 }}>이번 달 기록이 없습니다.</p>
                ) : (
                    <EmotionGraph>
                        {emotionDistribution().map((item, index) => (
                            <EmotionRow key={index}>
                                <EmotionLabel>{item.emotion}</EmotionLabel>
                                <EmotionBarContainer>
                                    <EmotionBar
                                        percentage={item.percentage}
                                        color={emotionColors[item.emotion]}
                                    />
                                </EmotionBarContainer>
                                <EmotionPercentage>{item.percentage}%</EmotionPercentage>
                            </EmotionRow>
                        ))}
                    </EmotionGraph>
                )}
            </EmotionContainer>
            <Log>
                <LogTitle>이전 비행 로그</LogTitle>
                <LogContainer>
                    <LogContent>
                        {momentsLoading ? (
                            <>일기를 살펴보는 중이에요...</>
                        ) : getTopPositiveEmotion() ? (
                            <>
                                {nickname}님은 이번 달 이럴 때 가장 {
                                    getTopPositiveEmotion() === "기쁨" ? "행복했어요" : "설렜어요"
                                }<br/>
                                {moments.length >= 2 ? (
                                    <MomentsContainer>
                                        <MomentItem> {moments[0]}</MomentItem>
                                        <MomentItem> {moments[1]}</MomentItem>
                                    </MomentsContainer>
                                ) : null}
                                오늘도 즐거운 하루 보내세요!
                            </>
                        ) : (
                            <>
                                이번 달엔 아직 {nickname}님의 행복한 순간이 기록되지 않았어요. 기억하고 싶은 행복한 일들이 있다면 언제든 들려주세요.
                            </>
                        )}
                    </LogContent>
                    <CharacterImage src={getCharacterImage()} alt={`${character} character`} />
                </LogContainer>
            </Log>
            <Header/>
        </Wrapper>
    );
}

export default Mypage;
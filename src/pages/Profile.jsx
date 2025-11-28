import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Modal from "../components/Modal";
import colors from "../styles/colors";
import { FaAngleLeft, FaAngleRight, FaCheck } from "react-icons/fa";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import bearImg from "../img/character/bear.png";
import catImg from "../img/character/cat.png";
import dogImg from "../img/character/dog.png";
import hamsterImg from "../img/character/hamster.png";
import rabbitImg from "../img/character/rabbit.png";
import racoonImg from "../img/character/racoon.png";

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
    padding: 10px 25px 10px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
`

const Left = styled(FaAngleLeft)`
    width: 25px;
    height: auto;
    color: ${colors.text};
    position: absolute;
    left: 25px;
    cursor: pointer;
    &:hover{
        color: ${colors.hover};
    }
`

const Title = styled.p`
    align-self: center;
    font-size: 20px;
`

const Container = styled.div`
    padding-inline: 25px;
    display: flex;
    flex-direction: column;


    &.bottom{
        border-top: 1px solid ${colors.text};
    }
`

const Content = styled.p`
    &:hover{
        cursor: pointer;
        color: ${colors.hover};
    }
    &.alarm:hover {
        color: inherit; /* 원래 색 유지 */
        cursor: default; /* 포인터 커서 제거 */
    }
`

const CharacterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;
    justify-items: center;
`

const CharacterCard = styled.div`
    width: 60px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1px;
    border: 2px solid ${props => props.selected ? colors.text : 'gray'};
    border-radius: 50%;
    cursor: pointer;
    position: relative;

    &:hover {
        border-color: ${colors.text};
    }
`

const CharacterImage = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50px;
    object-fit: contain;
    filter: ${props => props.selected ? 'grayscale(100%)' : 'none'};
    transition: filter 0.2s ease;
`

const CheckIcon = styled(FaCheck)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${colors.text};
    font-size: 24px;
    pointer-events: none;
    z-index: 1;
`


const Input = styled.input`
    width: 80%;
    padding: 10px;
    margin: 0 auto 15px auto;
    display: block;
    color: black;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    background: ${colors.chatinput};
    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
`;

const FormLabel = styled.label`
    font-size: 12px;
    text-align: left;
    margin-left: 10%;
    margin-bottom: -5px;
`;

const Select = styled.select`
    width: 80%;
    padding: 10px;
    margin: 0 auto 15px auto;
    display: block;
    color: black;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    background: ${colors.chatinput};
    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
`;


const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`

const Button = styled.button`
    width: 100px;
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.confirm {
        background-color: ${colors.text};

        &:hover {
            background-color: ${colors.hover};
        }
    }

    &.cancel {
        background-color: ${colors.text};

        &:hover {
            background-color: ${colors.hover};
        }
    }
`

const WithdrawContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 0;
`

const WithdrawTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 20px;
    margin-top: 40px;
    font-weight: bold;
    color: #636161;
`

const WithdrawWarning = styled.p`
    font-size: 10px;
    color: #e74242;
    margin-bottom: 30px;
    line-height: 1.5;
`

const UserIcon = styled(FaRegUserCircle)`
    justify-self: center;
    align-items: center;
    align-self: center;
    width: 50px;
    height: auto;
`


const Profile = () => {
    const navigate = useNavigate();
    const [modalType, setModalType] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterName, setCharacterName] = useState("");

    // 회원정보 수정 state
    const [userInfo, setUserInfo] = useState({
        person_name: localStorage.getItem("person_name") || "",
        nick_name: localStorage.getItem("nick_name") || "",
        email: localStorage.getItem("email") || "",
        phone: localStorage.getItem("phone") || "",
        birth: localStorage.getItem("birth") || "",
        gender: localStorage.getItem("gender") || "male"
    });

    // 비밀번호 변경 state (별도)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const characters = [
        { id: "bear", name: "곰", img: bearImg },
        { id: "cat", name: "고양이", img: catImg },
        { id: "dog", name: "강아지", img: dogImg },
        { id: "hamster", name: "햄스터", img: hamsterImg },
        { id: "rabbit", name: "토끼", img: rabbitImg },
        { id: "racoon", name: "너구리", img: racoonImg }
    ];

    const closeModal = () => {
        setModalType(null);
        setSelectedCharacter(null);
        setCharacterName("");
        setCurrentPassword("");
        setNewPassword("");
    };

    const handleCharacterSubmit = async () => {
        if (!selectedCharacter || !characterName.trim()) {
            alert("캐릭터와 이름을 모두 선택/입력해주세요.");
            return;
        }

        try {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            // 캐릭터 정보 업데이트
            await axios.patch("/user/character", {
                character: selectedCharacter,
                character_name: characterName.trim()
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 업데이트된 사용자 정보 가져오기
            const response = await axios.get("/user/profile", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 로컬 스토리지에 업데이트된 캐릭터 정보 저장
            if (response.data) {
                localStorage.setItem("character", response.data.character);
                localStorage.setItem("character_name", response.data.character_name);
            }

            alert("캐릭터가 성공적으로 변경되었습니다.");
            closeModal();
        } catch (error) {
            console.error("캐릭터 변경 실패:", error);
            alert("캐릭터 변경에 실패했습니다.");
        }
    };

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            if (accessToken) {
                await axios.post("/auth/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }

            // 로컬 스토리지 클리어
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
            // 에러가 발생해도 로컬 스토리지를 클리어하고 로그인 페이지로 이동
            localStorage.clear();
            navigate("/login");
        }
    };

    const handleWithdraw = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            await axios.delete("/user/withdraw", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            alert("회원탈퇴가 완료되었습니다.");
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("회원탈퇴 실패:", error);
            alert("회원탈퇴에 실패했습니다.");
        }
    };

    const handleUserInfoSubmit = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            // 빈 값 검증
            if (!userInfo.person_name || !userInfo.nick_name || !userInfo.email || !userInfo.phone || !userInfo.birth) {
                alert("모든 필드를 입력해주세요.");
                return;
            }

            const requestData = {
                person_name: userInfo.person_name.trim(),
                nick_name: userInfo.nick_name.trim(),
                email: userInfo.email.trim(),
                phone: userInfo.phone.trim(),
                birth: userInfo.birth,
                gender: userInfo.gender
            };

            console.log("요청 데이터:", requestData);

            await axios.patch("/user/profile", requestData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 로컬 스토리지 업데이트
            localStorage.setItem("person_name", userInfo.person_name);
            localStorage.setItem("nick_name", userInfo.nick_name);
            localStorage.setItem("email", userInfo.email);
            localStorage.setItem("phone", userInfo.phone);
            localStorage.setItem("birth", userInfo.birth);
            localStorage.setItem("gender", userInfo.gender);

            alert("회원정보가 성공적으로 변경되었습니다.");
            closeModal();
        } catch (error) {
            console.error("회원정보 변경 실패:", error);
            console.error("에러 응답:", error.response?.data);
            const errorMessage = error.response?.data?.detail || "회원정보 변경에 실패했습니다.";
            alert(errorMessage);
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            if (!currentPassword || !newPassword) {
                alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
                return;
            }

            await axios.patch("/user/password", {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            alert("비밀번호가 성공적으로 변경되었습니다.");
            closeModal();
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
            console.error("에러 응답:", error.response?.data);
            const errorMessage = error.response?.data?.detail || "비밀번호 변경에 실패했습니다.";
            alert(errorMessage);
        }
    };

    const renderModalContent = () => {
        switch(modalType) {
            case 'userInfo':
                return (
                    <FormContainer>
                        <FormLabel>이름</FormLabel>
                        <Input
                            type="text"
                            value={userInfo.person_name}
                            onChange={(e) => setUserInfo({...userInfo, person_name: e.target.value})}
                            placeholder="이름"
                        />

                        <FormLabel>불리고 싶은 이름을 알려주세요.</FormLabel>
                        <Input
                            type="text"
                            value={userInfo.nick_name}
                            onChange={(e) => setUserInfo({...userInfo, nick_name: e.target.value})}
                            placeholder="닉네임"
                        />

                        <FormLabel>이메일</FormLabel>
                        <Input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                            placeholder="user@example.com"
                        />

                        <FormLabel>전화번호</FormLabel>
                        <Input
                            type="text"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            placeholder="010-0000-0000"
                        />

                        <FormLabel>생년월일</FormLabel>
                        <Input
                            type="date"
                            value={userInfo.birth}
                            onChange={(e) => setUserInfo({...userInfo, birth: e.target.value})}
                        />

                        <FormLabel>성별</FormLabel>
                        <Select
                            value={userInfo.gender}
                            onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        >
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </Select>

                        <ButtonGroup>
                            <Button className="cancel" onClick={closeModal}>
                                취소
                            </Button>
                            <Button className="confirm" onClick={handleUserInfoSubmit}>
                                수정
                            </Button>
                        </ButtonGroup>
                    </FormContainer>
                );
            case 'password':
                return (
                    <FormContainer>
                        <FormLabel>현재 비밀번호</FormLabel>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호"
                        />

                        <FormLabel>새 비밀번호</FormLabel>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호"
                        />

                        <ButtonGroup>
                            <Button className="cancel" onClick={closeModal}>
                                취소
                            </Button>
                            <Button className="confirm" onClick={handlePasswordSubmit}>
                                변경
                            </Button>
                        </ButtonGroup>
                    </FormContainer>
                );
            case 'crew':
                return (
                    <div>
                        <CharacterGrid>
                            {characters.map((char) => (
                                <CharacterCard
                                    key={char.id}
                                    selected={selectedCharacter === char.id}
                                    onClick={() => setSelectedCharacter(char.id)}
                                >
                                    <CharacterImage
                                        src={char.img}
                                        alt={char.name}
                                        selected={selectedCharacter === char.id}
                                    />
                                    {selectedCharacter === char.id && <CheckIcon />}
                                </CharacterCard>
                            ))}
                        </CharacterGrid>
                        <Input
                            type="text"
                            placeholder="같이 여행할 승무원을 입력하세요."
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                        />
                        <ButtonGroup>
                            <Button className="cancel" onClick={closeModal}>
                                취소
                            </Button>
                            <Button className="confirm" onClick={handleCharacterSubmit}>
                                확인
                            </Button>
                        </ButtonGroup>
                    </div>
                );
            case 'withdraw':
                return (
                    <WithdrawContainer>
                        <WithdrawTitle>여기서 비행을<br/> 마무리할까요?</WithdrawTitle>
                        <WithdrawWarning>
                            탈퇴 시, 모든 여정의 기록이 다 사라져
                            다시 복구할 수 없어요
                        </WithdrawWarning>
                        <ButtonGroup>
                            <Button className="cancel" onClick={closeModal}>
                                취소
                            </Button>
                            <Button className="confirm" onClick={handleWithdraw}>
                                탈퇴하기
                            </Button>
                        </ButtonGroup>
                    </WithdrawContainer>
                );
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        switch(modalType) {
            case 'userInfo':
                return '회원정보 변경';
            case 'password':
                return '비밀번호 변경';
            case 'crew':
                return '승무원 선택';
            case 'withdraw':
                return '';  // 회원탈퇴는 제목 없음
            default:
                return '';
        }
    };

    return(
        <Wrapper>
            <Top>
                <Left onClick={() => navigate("/mypage")}/>
                <Title>내 계정</Title>
            </Top>
            <UserIcon/>
            <Container>
                <Content onClick={() => setModalType('userInfo')}>회원정보 변경</Content>
                <Content onClick={() => setModalType('password')}>비밀번호 변경</Content>
                <Content onClick={() => setModalType('crew')}>승무원 선택</Content>
            </Container>
            <Container className="bottom">
                <Content onClick={handleLogout}>로그아웃</Content>
                <Content onClick={() => setModalType('withdraw')}>회원탈퇴</Content>
            </Container>
            <Header/>

            <Modal
                isOpen={modalType !== null}
                onClose={closeModal}
                title={getModalTitle()}
            >
                {renderModalContent()}
            </Modal>
        </Wrapper>
    );
}

export default Profile;
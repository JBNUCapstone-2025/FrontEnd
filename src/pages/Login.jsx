import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../styles/colors";
import SuccessModal from "../components/SuccessModal";
import FailureModal from "../components/FailureModal";
// import logo from "../logo/logo.png";
// import background from "../img/challenge_background.png";
// import back1 from "../img/login_back1.png";
import back2 from "../img/login_back2.png";
import logo1 from "../logo/logo3.png";
// API는 상대경로로 호출 (nginx가 백엔드 7777 포트로 프록시)
const API_BASE_URL = "";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  background-image: url(${back2});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;


const Container = styled.div`
  width: 90%;
  min-height: 400px;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  margin: auto auto;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.4);
`;


const Title = styled.img`
  width: calc(60%);
  align-self: center;
  margin-block: 35px;
`;

const Input = styled.input`
  width: 80%;
  height: 50px;
  margin: 10px auto;
  border-radius: 15px;
  padding-left: 20px;
  color: black;
  border: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
`;

const Util = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Link = styled.p`
  padding: 0 15px;
  font-size: 13px;
  cursor: pointer;
`;

const Button = styled.button`
  margin: auto auto;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${({ disabled }) => (disabled ? "#ccc" : colors.main)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const navigate = useNavigate();

  const isDisabled = id.trim() === "" || password.trim() === "";

  // ✅ 로그인 핸들러
  const handleLogin = async () => {
    if (isDisabled || loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: id,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "로그인에 실패했습니다.");
      }

      // ✅ access_token을 localStorage에 저장
      const token = data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      }

      // ✅ 유저 정보 저장
      if (data?.user) {
        localStorage.setItem("user_id", String(data.user.user_id));
        localStorage.setItem("person_name", data.user.person_name || "");
        localStorage.setItem("nick_name", data.user.nick_name || "");
        localStorage.setItem("phone", data.user.phone || "");
        localStorage.setItem("birth", data.user.birth || "");
        localStorage.setItem("gender", data.user.gender || "");
        localStorage.setItem("email", data.user.email || "")

        // ✅ 캐릭터 정보가 있으면 localStorage에 저장
        if (data.user.character) {
          localStorage.setItem("character", data.user.character);
        } else {
          // 캐릭터 정보가 없으면 localStorage에서 제거 (캐릭터 선택 모달을 띄우기 위함)
          localStorage.removeItem("character");
        }

        // ✅ 캐릭터 이름 저장
        if (data.user.character_name) {
          localStorage.setItem("character_name", data.user.character_name);
        }
      }

      // 성공 모달 표시
      setShowSuccessModal(true);

      // 2초 후 메인 페이지로 이동
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/main");
      }, 1000);
    } catch (err) {
      console.error("로그인 에러:", err);

      // 실패 모달 표시
      setFailureMessage(err.message || "로그인 중 오류가 발생했습니다.");
      setShowFailureModal(true);

      // 3초 후 실패 모달 닫기
      setTimeout(() => {
        setShowFailureModal(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    navigate("/join");
  };

  return (
    <Wrapper>
      {/* 성공 모달 */}
      <SuccessModal
        message="마음으로 통하는 하늘의 입구,"
        subMessage="MINDTRIP에 오신 걸 환영합니다!"
        show={showSuccessModal}
        alignCenter
      />

      {/* 실패 모달 */}
      <FailureModal
        message={failureMessage}
        show={showFailureModal}
        alignCenter
      />

      <Container>
        <Title src={logo1} alt="logo" />
        <Input
          className="id"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          className="password"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Util>
          <Link onClick={handleJoin}>회원가입</Link>
        </Util>
        <Button disabled={isDisabled || loading} onClick={handleLogin}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </Container>
    </Wrapper>
  );
}

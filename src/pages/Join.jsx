import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../styles/colors";
import logo from "../logo/logo.png";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  background: ${colors.main};
`;

const Container = styled.div`
  width: 90%;
  min-height: 500px;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  margin: auto auto;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Title = styled.img`
  width: calc(60%);
  align-self: center;
  margin-block: 35px;
`;

const Input = styled.input`
  width: 80%;
  height: 45px;
  margin: 10px auto;
  border-radius: 15px;
  padding-left: 15px;
  color: black;
  border: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
`;

const Select = styled.select`
  width: 80%;
  height: 45px;
  margin: 10px auto;
  border-radius: 15px;
  padding-left: 15px;
  color: black;
  border: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
`;

const Button = styled.button`
  width: 80%;
  margin: 20px auto 0;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${({ disabled }) => (disabled ? "#ccc" : colors.main)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 10px;
  font-size: 13px;
  cursor: pointer;
  color: ${colors.main};
`;

// API는 상대경로로 호출 (nginx가 백엔드 7777 포트로 프록시)
const API_BASE_URL = "";

export default function Join() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    person_name: "",
    nick_name: "",
    email: "",
    phone: "",
    birth: "",
    gender: "male"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isDisabled =
    loading ||
    !formData.username.trim() ||
    !formData.password.trim() ||
    !formData.person_name.trim() ||
    !formData.nick_name.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.birth.trim();

  const handleJoin = async () => {
    if (isDisabled) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 백엔드 에러 응답 로깅
        console.error("백엔드 에러 응답:", data);
        console.error("전송한 데이터:", formData);

        // detail이 배열인 경우 처리 (FastAPI 유효성 검증 에러)
        let errorMessage = "회원가입에 실패했습니다.";
        if (data?.detail) {
          if (Array.isArray(data.detail)) {
            console.error("유효성 검증 에러 상세:", JSON.stringify(data.detail, null, 2));
            errorMessage = data.detail.map(err =>
              `${err.loc?.join('.')} : ${err.msg}`
            ).join('\n');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        } else if (data?.message) {
          errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }

      // 성공 케이스: 예시 응답 구조 사용
      // {
      //   "message": "회원가입이 완료되었습니다",
      //   "user": { "user_id": 0, "nick_name": "...", ... }
      // }
      const msg = data?.message || "회원가입이 완료되었습니다";
      const user = data?.user;

      if (user) {
        localStorage.setItem("user_id", String(user.user_id));
        localStorage.setItem("nick_name", String(user.nick_name));
      }

      alert(msg);
      navigate("/"); // 로그인 페이지로 이동
    } catch (err) {
      console.error(err);
      alert(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title src={logo} alt="logo" />
        <Input
          name="username"
          placeholder="아이디"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          name="person_name"
          placeholder="이름"
          value={formData.person_name}
          onChange={handleChange}
        />
        <Input
          name="nick_name"
          placeholder="닉네임(8자리 이하)"
          value={formData.nick_name}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="phone"
          type="tel"
          placeholder="전화번호 (예: 010-1234-5678)"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          name="birth"
          type="date"
          placeholder="생년월일"
          value={formData.birth}
          onChange={handleChange}
        />
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="male">남성</option>
          <option value="female">여성</option>
        </Select>
        <Button disabled={isDisabled} onClick={handleJoin}>
          {loading ? "처리 중..." : "회원가입"}
        </Button>
        <LinkText onClick={() => navigate("/login")}>로그인으로 돌아가기</LinkText>
      </Container>
    </Wrapper>
  );
}

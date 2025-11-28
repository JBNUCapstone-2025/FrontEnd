import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";
import { PiAirplaneTakeoffFill } from "react-icons/pi";
import { FaCloud } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { FaUser } from "react-icons/fa";

// Header 영역
const Container = styled.header`
  width: 100%;
  background: ${colors.header};
  height: 50px;
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 5px 0 20px 0;
  border-top: 1px solid ${colors.text};
`;


const Icon = styled.div`
  width: 30px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  svg {
    width: 100%;
    height: 100%;
    color: ${colors.text};
  }
  &.big{

  }
  &.small{
    width: 27px;
    height: auto;
  }
  :hover{
    cursor: pointer;
    color: ${colors.hover};
  }
`;

const Header = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Icon onClick={() => navigate("/main")}><PiAirplaneTakeoffFill/></Icon>
      <Icon onClick={() => navigate("/challenge/map")}><FaCloud/></Icon>
      <Icon onClick={() => navigate("/board")}><IoIosChatbubbles /></Icon>
      <Icon onClick={() => navigate("/shop")}><FaShoppingCart /></Icon>
      <Icon className="small" onClick={() => navigate("/mypage")}><FaUser /></Icon>
    </Container>
  );
};

export default Header;

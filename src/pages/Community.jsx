import React,{useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import logo from "../logo/logo.png";
import colors from "../styles/colors";

import airplane from "../img/airplane/airplane.png";

import { FaSearch } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 470px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  padding-inline: 15px;
  overflow: hidden;
`;

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: space-between;
    height: 30px;
    padding-inline: 10px;
`

const Logo = styled.img`
    width: 120px;
    padding-block: 5px;
`

const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const Search = styled(FaSearch)`
    width: 20px;
    height: auto;
    padding-inline: 10px;
    cursor: pointer;
`

const Bell = styled(FaRegBell)`
    width: 20px;
    height: auto;  
    padding-inline: 10px;
    cursor: pointer;
`

const User = styled(FaRegUserCircle)`
    width: 20px;
    height: auto;  
    padding-inline: 10px;
    cursor: pointer;

`

const SearchSpace = styled.input`
    margin: 20px 10px;
    height: 20px;
    border: 1px solid ${colors.text};
    background-color: white;
    border-radius: 15px;
    color: black;
    padding-inline: 10px;
`

const Default = styled.div`
    margin: 20px 10px;
    height: 20px;
    padding-inline: 10px;
`

const AirplaneWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-height: 0;
    position: relative;
    justify-content: flex-end;
    overflow: hidden;
`

const Airplane = styled.img`
    width: 70%;
    object-fit: contain;
`

const BoardOverlay = styled.div`
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 12px 8px;
    width: 52%;
`

const BoardButton = styled.div`
    aspect-ratio: 1;
    background: ${colors.airplanecontent};
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    color: white;
    font-weight: 500;

    &:hover {
        background: ${colors.airplanehover};
    }
`

const RowNumber = styled.div`
    color: white;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
`

const Community = () => {
    const navigate = useNavigate();
    const [clicksearch, setClickSearch] = useState(false);
    const [searchText, setSearchText] = useState("");

    const handleBoardClick = (category) => {
        navigate(`/board/list?category=${category}`);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // 한글 입력 중 Enter 중복 방지 (IME 조합 중이면 무시)
            if (e.isComposing || e.nativeEvent?.isComposing) return;

            if (searchText.trim().length >= 2) {
                // 모든 카테고리에서 검색
                navigate(`/board/search?search=${encodeURIComponent(searchText.trim())}`);
            } else {
                alert("검색어는 2글자 이상 입력해주세요.");
            }
        }
    };
    
    return(
        <Wrapper>
            <Top>
                <Logo src={logo}></Logo>
                <IconWrapper>
                    <Search onClick={() => setClickSearch(prev => !prev)}/>
                </IconWrapper>
            </Top>
            {clicksearch ? (
                <SearchSpace
                    placeholder="검색어를 입력하세요 (2글자 이상)"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleSearch}
                />
            ) : (<Default/>)}

            <AirplaneWrapper>
                <Airplane src={airplane}/>
                <BoardOverlay>
                    <BoardButton onClick={() => handleBoardClick('free')}>자유게시판</BoardButton>
                    <RowNumber>01</RowNumber>
                    <BoardButton onClick={() => handleBoardClick('praise')}>칭찬게시판</BoardButton>

                    <BoardButton onClick={() => handleBoardClick('secret')}>비밀게시판</BoardButton>
                    <RowNumber>02</RowNumber>
                    <BoardButton onClick={() => handleBoardClick('worry')}>고민게시판</BoardButton>

                    <BoardButton onClick={() => handleBoardClick('info')}>정보게시판</BoardButton>
                    <RowNumber>03</RowNumber>
                    <BoardButton onClick={() => handleBoardClick('comfort')}>위로게시판</BoardButton>
                </BoardOverlay>
            </AirplaneWrapper>
            <Header/>
        </Wrapper>
    );
};

export default Community;
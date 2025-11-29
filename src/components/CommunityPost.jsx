import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import SuccessModal from "./SuccessModal";
import FailureModal from "./FailureModal";

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

const TopBar = styled.div`
    display: flex;
    align-items: center;
    padding: 20px 15px;
    margin-top: 20px;
    justify-content: space-between;
    border-bottom: 1px solid ${colors.deactivate};
`;

const BackButton = styled(FaAngleLeft)`
    font-size: 20px;
    cursor: pointer;
    color : ${colors.text};
`;

const Submit = styled.div`
    font-size: 15px;
    cursor: ${props => props.$active ? 'pointer' : 'default'};
    color: ${props => props.$active ? colors.airplanebody : colors.deactivate};
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: bold;
    color: ${colors.text};
    margin: 0;
`;

const ContentTextarea = styled.textarea`
    margin-block: 10px;
    min-height: 200px;
    border-radius: 15px;
    padding: 10px;
    background: white;
    color: black;
    border: none;
    margin-inline: 10px;
    resize: none;
    overflow: hidden;
    &:focus {
        outline: none;
        border: none;
    }
`;

/* 🔽 이용 규칙 박스 스타일 추가 */
const RulesBox = styled.div`
    margin: 0 10px 20px;
    padding: 12px 14px;
    border-radius: 10px;
    background: #f9f9f9;
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 12px;
    color: ${colors.deactivate};
    line-height: 1.5;
`;

const RulesTitle = styled.div`
    font-weight: 600;
    margin-bottom: 6px;
    color: red;
`;

const RulesList = styled.ul`
    padding-left: 16px;
    margin: 0;
`;

const RuleItem = styled.li`
    margin-bottom: 4px;
    color: ${colors.airplanebody};
`;

const CommunityPost = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    const category = location.state?.category || "free";

    const [content, setContent] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [failureMessage, setFailureMessage] = useState("");

    const handleTextareaChange = (e) => {
        setContent(e.target.value);
        // 자동 높이 조절
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // 공통 이동 함수
    const goToList = () => {
        navigate(`/board/list?category=${category}`);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            setFailureMessage("내용을 입력해주세요.");
            setShowFailureModal(true);
            setTimeout(() => setShowFailureModal(false), 1500);
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            await axios.post(
                "/community/board",
                {
                    category,
                    title: "string",
                    content,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                goToList();
            }, 1500);
        } catch (error) {
            console.error("게시글 작성 중 오류:", error);
            setFailureMessage("게시글 작성에 실패했습니다.");
            setShowFailureModal(true);
            setTimeout(() => setShowFailureModal(false), 1500);
        }
    };

    return (
        <Wrapper>
            {/* 성공 모달 */}
            <SuccessModal
                message="게시글이 성공적으로 작성되었습니다."
                show={showSuccessModal}
                alignCenter
            />

            {/* 실패 모달 */}
            <FailureModal
                message={failureMessage}
                show={showFailureModal}
                alignCenter
            />

            <TopBar>
                <BackButton onClick={goToList} />
                <Title>글 쓰기</Title>
                <Submit $active={content.trim().length > 0} onClick={handleSubmit}>완료</Submit>
            </TopBar>

            <ContentTextarea
                ref={textareaRef}
                placeholder="게시글을 작성해주세요!"
                value={content}
                onChange={handleTextareaChange}
            />

            {/* 🔽 이용 규칙 영역 */}
            <RulesBox>
                <RulesTitle>커뮤니티 이용 규칙 안내</RulesTitle>
                <RulesList>
                    <RuleItem>상대방을 비난하거나 혐오, 차별적인 표현은 삼가주세요.</RuleItem>
                    <RuleItem>실명, 연락처 등 다른 사람의 개인정보를 공유하지 마세요.</RuleItem>
                    <RuleItem>허위 사실 유포, 광고·홍보성 글은 예고 없이 삭제될 수 있습니다.</RuleItem>
                    <RuleItem>타인의 글·댓글을 인용할 때는 출처를 남겨주세요.</RuleItem>
                    <RuleItem>심각한 고민이나 위험한 상황은 전문가, 보호자와 상의하는 것을 권장합니다.</RuleItem>
                </RulesList>
            </RulesBox>
        </Wrapper>
    );
};

export default CommunityPost;

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import colors from "../styles/colors";

import { FaAngleLeft, FaRegHeart } from "react-icons/fa";
import { PiUserCircleLight } from "react-icons/pi";
import { FaRegBell, FaRegComment } from "react-icons/fa6";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
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
    color : ${colors.text};
    cursor: pointer;
`;

const Bell = styled(FaRegBell)`
    font-size: 20px;
    cursor: pointer;
    color : ${colors.text};
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: bold;
    color: ${colors.text};
    margin: 0;
`;

const SearchInfo = styled.div`
    padding: 15px 10px;
    font-size: 14px;
    color: ${colors.text};
    border-bottom: 1px solid ${colors.deactivate};
`;

const Content = styled.div`
    padding-inline: 10px;
    flex: 1;
    overflow-y: auto;
`;

const PostList = styled.div`
    display: flex;
    flex-direction: column;
`;

const PostItem = styled.div`
    padding: 10px 0;
    cursor: pointer;
    border-bottom: 1px solid ${colors.deactivate};
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
`;

const UserIcon = styled(PiUserCircleLight)`
    font-size: 45px;
    color: ${colors.airplanebody};
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserName = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${colors.airplanebody};
    display: flex;
    align-items: center;
`;

const PostTime = styled.span`
    font-size: 12px;
    color: ${colors.deactivate};
`;

const CategoryBadge = styled.span`
    font-size: 11px;
    color: white;
    background: ${colors.text};
    padding: 1px 5px;
    border-radius: 10px;
    margin-left: 8px;
`;

const PostContent = styled.div`
    font-size: 16px;
    color: ${colors.airplanebody};
    margin-bottom: 15px;
    margin-left: 55px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const PostStats = styled.div`
    display: flex;
    gap: 20px;
    margin-left: 55px;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
`;

const HeartIcon = styled(FaRegHeart)`
    font-size: 18px;
`;

const CommentIcon = styled(FaRegComment)`
    font-size: 18px;
`;

const EmptyMessage = styled.div`
    text-align: center;
    color: #888;
    padding: 40px 0;
`;

const categoryNames = {
    free: "자유",
    secret: "비밀",
    info: "정보",
    praise: "칭찬",
    worry: "고민",
    comfort: "위로"
};

const CATEGORIES = ["free", "secret", "info", "praise", "worry", "comfort"];

const CommunitySearch = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const search = searchParams.get("search") || "";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllPosts = async () => {
        if (!search || search.length < 2) return;

        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");

            // 모든 카테고리에서 병렬로 검색
            const requests = CATEGORIES.map(category =>
                axios.get(`/community/board/list?category=${category}&search=${encodeURIComponent(search)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(res => res.data.map(post => ({ ...post, category })))
                  .catch(() => []) // 에러 시 빈 배열 반환
            );

            const results = await Promise.all(requests);
            const allPosts = results.flat();

            // 날짜순 정렬 (최신순)
            allPosts.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

            setPosts(allPosts);
        } catch (error) {
            console.error("검색 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, [search]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return "방금 전";
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
        return date.toLocaleDateString("ko-KR");
    };

    return (
        <Wrapper>
            <TopBar>
                <BackButton onClick={() => navigate("/board")} />
                <Title>검색 결과</Title>
                <Bell />
            </TopBar>

            <SearchInfo>
                "{search}" 검색 결과 {posts.length}건
            </SearchInfo>

            <Content>
                {loading ? (
                    <EmptyMessage>검색 중...</EmptyMessage>
                ) : posts.length > 0 ? (
                    <PostList>
                        {posts.map((post) => (
                            <PostItem key={`${post.category}-${post.board_id}`} onClick={() => navigate(`/board/content/${post.board_id}`, { state: { from: 'search', search } })}>
                                <PostHeader>
                                    <UserIcon />
                                    <UserInfo>
                                        <UserName>
                                            익명
                                            <CategoryBadge>{categoryNames[post.category]} 게시판</CategoryBadge>
                                        </UserName>
                                        <PostTime>{formatDate(post.create_date)}</PostTime>
                                    </UserInfo>
                                </PostHeader>
                                <PostContent>{post.content_preview}</PostContent>
                                <PostStats>
                                    <StatItem>
                                        <HeartIcon />
                                        <span>{post.likes_count}</span>
                                    </StatItem>
                                    <StatItem>
                                        <CommentIcon />
                                        <span>{post.comment_count}</span>
                                    </StatItem>
                                </PostStats>
                            </PostItem>
                        ))}
                    </PostList>
                ) : (
                    <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
                )}
            </Content>
        </Wrapper>
    );
};

export default CommunitySearch;

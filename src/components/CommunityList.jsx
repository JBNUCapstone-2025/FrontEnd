import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import colors from "../styles/colors";

import { FaAngleLeft, FaPlus, FaRegHeart, FaRegUserCircle } from "react-icons/fa";
import { PiUserCircleLight } from "react-icons/pi";
import { FaRegBell, FaRegComment } from "react-icons/fa6";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;                /* 전체 높이 고정 */
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

const Content = styled.div`
    padding-inline: 10px;
    flex: 1;
    overflow-y: auto;            /* 내부 스크롤 */
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

const UserIcon = styled(PiUserCircleLight )`
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
`;

const PostTime = styled.span`
    font-size: 12px;
    color: ${colors.deactivate};
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
    padding: 20px 0;
`;

const WriteButton = styled.button`
    position: fixed;
    bottom: 20px;
    right: calc(50% - 230px);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${colors.sub};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);

    @media (max-width: 470px) {
        right: 20px;
    }
`;

const PlusIcon = styled(FaPlus)`
    font-size: 20px;
    color: white;
`;

const categoryNames = {
    free: "자유게시판",
    secret: "비밀게시판",
    info: "정보게시판",
    praise: "칭찬게시판",
    worry: "고민게시판",
    comfort: "위로게시판"
};

const PAGE_SIZE = 10;

const CommunityList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const category = searchParams.get("category") || "free";
    const search = searchParams.get("search") || "";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            let url = `/community/board/list?category=${category}`;
            if (search && search.length >= 2) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const data = response.data;
            setPosts(prev => [...prev, ...data]);

            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // category 또는 search 변경 시 초기화
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [category, search]);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (!loading && hasMore && scrollHeight - scrollTop - clientHeight < 80) {
            setPage(prev => prev + 1);
        }
    };

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
                <Title>{categoryNames[category] || "게시판"}</Title>
                <Bell />
            </TopBar>

            <Content onScroll={handleScroll}>
                {posts.length > 0 ? (
                    <PostList>
                        {posts.map((post) => (
                            <PostItem key={post.board_id} onClick={() => navigate(`/board/content/${post.board_id}`)}>
                                <PostHeader>
                                    <UserIcon />
                                    <UserInfo>
                                        <UserName>익명</UserName>
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
                    !loading && <EmptyMessage>게시글이 없습니다.</EmptyMessage>
                )}

                {loading && <EmptyMessage>불러오는 중...</EmptyMessage>}
            </Content>

            <WriteButton onClick={() => navigate("/board/post", { state: { category } })}>
                <PlusIcon />
            </WriteButton>
        </Wrapper>
    );
};

export default CommunityList;

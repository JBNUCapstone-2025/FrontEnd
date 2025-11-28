import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import colors from "../styles/colors";

import { FaAngleLeft, FaRegHeart, FaHeart, FaRegUserCircle, FaEllipsisV } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { HiOutlineMenu } from "react-icons/hi";
import { PiUserCircleLight } from "react-icons/pi";


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
    cursor: pointer;
    color: ${colors.text};
`;

const MenuIcon = styled.div`
    height: 20px;
    width: auto;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: bold;
    color: ${colors.text};
    margin: 0;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px 10px;
    overflow-y: auto;
`;

const PostSection = styled.div`
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: space-between;
`;

const UserIcon = styled(PiUserCircleLight)`
    font-size: 40px;
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
    line-height: 1.6;
    margin-bottom: 20px;
    white-space: pre-wrap;
    padding-left: 10px;
`;

const PostStats = styled.div`
    display: flex;
    gap: 15px;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${colors.deactivate};
    font-size: 14px;
    padding-left: 10px;
    cursor: ${props => props.$clickable ? 'pointer' : 'default'};
`;

const HeartIcon = styled(FaRegHeart)`
    font-size: 15px;
    color: red;
`;

const HeartIconFilled = styled(FaHeart)`
    font-size: 15px;
    color: red;
`;

const CommentIcon = styled(FaRegComment)`
    font-size: 15px;
`;

const CommentSection = styled.div`
    padding-top: 15px;
`;

const CommentItem = styled.div`
    padding: 15px 10px;
    margin: 0 -10px;
    border-bottom: 1px solid #eee;
    background: ${props => props.$isReplyTarget ? colors.deactivate + '30' : 'transparent'};
    border-radius: ${props => props.$isReplyTarget ? '10px' : '0'};
    transition: background 0.2s;
`;

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const CommentUserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CommentUserIcon = styled(PiUserCircleLight)`
    font-size: 35px;
    color: ${colors.airplanebody};
`;

const CommentUserName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$isAuthor ? colors.text : colors.airplanebody};
`;

const CommentTime = styled.span`
    font-size: 11px;
    color: ${colors.deactivate};
    margin-left: 8px;
`;

const CommentStats = styled.div`
    display: flex;
    gap: 10px;
`;

const CommentStatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${colors.airplanebody};
    font-size: 12px;
    cursor: pointer;
`;

const CommentContent = styled.div`
    font-size: 14px;
    color: ${colors.airplanebody};
    margin-left: 42px;
    padding-left: 10px;
`;

const ReplyItem = styled.div`
    padding: 12px 0;
    margin-left: 42px;
`;

const ReplyHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const ReplyContent = styled.div`
    font-size: 14px;
    color: ${colors.airplanebody};
    margin-left: 42px;
`;

const LoadingMessage = styled.div`
    text-align: center;
    color: #888;
    padding: 40px 0;
`;

const CommentInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    border-top: 1px solid #eee;
    background: white;
`;

const CommentInputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CommentInput = styled.input`
    flex: 1;
    padding: 12px 15px;
    border: 1px solid ${colors.deactivate};
    border-radius: 20px;
    font-size: 14px;
    background: white;
    color: black;
    &:focus {
        outline: none;
        border-color: ${colors.sub};
    }
`;

const SendButton = styled.button`
    padding: 10px 16px;
    background: ${colors.sub};
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const MenuButton = styled(FaEllipsisV)`
    font-size: 14px;
    color: ${colors.deactivate};
    cursor: pointer;
    padding: 5px;
`;

const DropdownMenu = styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 100;
    overflow: hidden;
`;

const MenuItem = styled.div`
    padding: 10px 20px;
    font-size: 14px;
    color: ${colors.airplanebody};
    cursor: pointer;
    white-space: nowrap;
    &:hover {
        background: #f5f5f5;
    }
`;

const MenuWrapper = styled.div`
    position: relative;
`;

const EditTextarea = styled.textarea`
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid ${colors.deactivate};
    border-radius: 10px;
    font-size: 14px;
    min-height: 80px;
    resize: vertical;
    background: white;
    color: black;
    margin-bottom: 10px;
    &:focus {
        outline: none;
        border-color: ${colors.sub};
    }
`;

const EditButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const EditButton = styled.button`
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    border: none;
    background: ${props => props.$primary ? colors.sub : '#eee'};
    color: ${props => props.$primary ? 'white' : colors.text};
`;

const categoryNames = {
    free: "자유게시판",
    secret: "비밀게시판",
    info: "정보게시판",
    praise: "칭찬게시판",
    worry: "고민게시판",
    comfort: "위로게시판"
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const CommunityContent = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [replyTo, setReplyTo] = useState(null); // 대댓글 대상 comment_id
    const [commentLiking, setCommentLiking] = useState({});
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [editingPost, setEditingPost] = useState(false);
    const [editPostContent, setEditPostContent] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [showCommentMenu, setShowCommentMenu] = useState(null);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const headers = {};
            
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/board/${boardId}`, {
                method: "GET",
                headers
            });

            if (!response.ok) {
                console.error("게시글 조회 실패:", response.status);
                return;
            }

            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (liking) return;

        setLiking(true);
        try {
            const token = localStorage.getItem("access_token");
            const headers = {};

            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/board/${boardId}/like`, {
                method: "POST",
                headers
            });

            if (!response.ok) {
                console.error("좋아요 실패:", response.status);
                return;
            }

            setPost(prev => ({
                ...prev,
                is_liked: !prev.is_liked,
                likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
            }));
        } catch (error) {
            console.error("좋아요 오류:", error);
        } finally {
            setLiking(false);
        }
    };

    useEffect(() => {
        if (boardId) {
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    };

    const handleBack = () => {
        // 검색 결과에서 왔으면 검색 결과로 돌아감
        if (location.state?.from === 'search' && location.state?.search) {
            navigate(`/board/search?search=${encodeURIComponent(location.state.search)}`);
        } else if (post?.category) {
            navigate(`/board/list?category=${post.category}`);
        } else {
            navigate("/board");
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;

        setSubmittingComment(true);
        try {
            const token = localStorage.getItem("access_token");
            const headers = {
                "Content-Type": "application/json"
            };

            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/comment`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    board_id: Number(boardId),
                    parent_comment_id: replyTo || 0,
                    content: commentContent
                })
            });

            if (!response.ok) {
                console.error("댓글 작성 실패:", response.status);
                alert("댓글 작성에 실패했습니다.");
                return;
            }

            setCommentContent("");
            setReplyTo(null);
            fetchPost();
        } catch (error) {
            console.error("댓글 작성 오류:", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleCommentLike = async (commentId) => {
        if (commentLiking[commentId]) return;

        setCommentLiking(prev => ({ ...prev, [commentId]: true }));
        try {
            const token = localStorage.getItem("access_token");
            const headers = {};

            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/comment/${commentId}/like`, {
                method: "POST",
                headers
            });

            if (!response.ok) {
                console.error("댓글 좋아요 실패:", response.status);
                return;
            }

            fetchPost();
        } catch (error) {
            console.error("댓글 좋아요 오류:", error);
        } finally {
            setCommentLiking(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleReplyClick = (commentId) => {
        setReplyTo(commentId);
    };

    const cancelReply = () => {
        setReplyTo(null);
    };

    // 게시글 삭제
    const handleDeletePost = async () => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("access_token");
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/board/${boardId}`, {
                method: "DELETE",
                headers
            });

            if (!response.ok) {
                console.error("게시글 삭제 실패:", response.status);
                alert("게시글 삭제에 실패했습니다.");
                return;
            }

            alert("게시글이 삭제되었습니다.");
            navigate("/board");
        } catch (error) {
            console.error("게시글 삭제 오류:", error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
        setShowPostMenu(false);
    };

    // 게시글 수정 시작
    const startEditPost = () => {
        setEditPostContent(post.content);
        setEditingPost(true);
        setShowPostMenu(false);
    };

    // 게시글 수정 완료
    const handleEditPost = async () => {
        if (!editPostContent.trim()) return;

        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/board/${boardId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    category: post.category,
                    title: "string",
                    content: editPostContent
                })
            });

            if (!response.ok) {
                console.error("게시글 수정 실패:", response.status);
                alert("게시글 수정에 실패했습니다.");
                return;
            }

            setEditingPost(false);
            fetchPost();
        } catch (error) {
            console.error("게시글 수정 오류:", error);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("access_token");
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/comment/${commentId}`, {
                method: "DELETE",
                headers
            });

            if (!response.ok) {
                console.error("댓글 삭제 실패:", response.status);
                alert("댓글 삭제에 실패했습니다.");
                return;
            }

            fetchPost();
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
            alert("댓글 삭제 중 오류가 발생했습니다.");
        }
        setShowCommentMenu(null);
    };

    // 댓글 수정 시작
    const startEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditCommentContent(content);
        setShowCommentMenu(null);
    };

    // 댓글 수정 완료
    const handleEditComment = async (commentId) => {
        if (!editCommentContent.trim()) return;

        try {
            const token = localStorage.getItem("access_token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/community/comment/${commentId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ content: editCommentContent })
            });

            if (!response.ok) {
                console.error("댓글 수정 실패:", response.status);
                alert("댓글 수정에 실패했습니다.");
                return;
            }

            setEditingCommentId(null);
            setEditCommentContent("");
            fetchPost();
        } catch (error) {
            console.error("댓글 수정 오류:", error);
            alert("댓글 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Wrapper>
            <TopBar>
                <BackButton onClick={handleBack} />
                <Title>{post ? categoryNames[post.category] || "게시판" : "게시판"}</Title>
                <MenuIcon />
            </TopBar>

            <Content onClick={cancelReply}>
                {loading ? (
                    <LoadingMessage>불러오는 중...</LoadingMessage>
                ) : post ? (
                    <>
                        <PostSection>
                            <PostHeader>
                                <CommentUserInfo>
                                    <UserIcon />
                                    <UserInfo>
                                        <UserName>익명</UserName>
                                        <PostTime>{formatDate(post.create_date)}</PostTime>
                                    </UserInfo>
                                </CommentUserInfo>
                                {post.is_mine && (
                                    <MenuWrapper>
                                        <MenuButton onClick={() => setShowPostMenu(!showPostMenu)} />
                                        {showPostMenu && (
                                            <DropdownMenu>
                                                <MenuItem onClick={startEditPost}>수정</MenuItem>
                                                <MenuItem $danger onClick={handleDeletePost}>삭제</MenuItem>
                                            </DropdownMenu>
                                        )}
                                    </MenuWrapper>
                                )}
                            </PostHeader>

                            {editingPost ? (
                                <>
                                    <EditTextarea
                                        value={editPostContent}
                                        onChange={(e) => setEditPostContent(e.target.value)}
                                    />
                                    <EditButtonGroup>
                                        <EditButton onClick={() => setEditingPost(false)}>취소</EditButton>
                                        <EditButton $primary onClick={handleEditPost}>저장</EditButton>
                                    </EditButtonGroup>
                                </>
                            ) : (
                                <PostContent>{post.content}</PostContent>
                            )}

                            <PostStats>
                                <StatItem $clickable onClick={handleLike}>
                                    {post.is_liked ? <HeartIconFilled /> : <HeartIcon />}
                                    <span>{post.likes_count}</span>
                                </StatItem>
                                <StatItem>
                                    <CommentIcon />
                                    <span>{post.comment_count}</span>
                                </StatItem>
                            </PostStats>
                        </PostSection>

                        <CommentSection>
                            {post.comments && [...post.comments].sort((a, b) => new Date(a.create_date) - new Date(b.create_date)).map((comment) => (
                                <CommentItem key={comment.comment_id} $isReplyTarget={replyTo === comment.comment_id} onClick={(e) => e.stopPropagation()}>
                                    <CommentHeader>
                                        <CommentUserInfo>
                                            <CommentUserIcon />
                                            <div>
                                                <CommentUserName $isAuthor={comment.is_author}>
                                                    {comment.is_author ? "익명(글쓴이)" : `익명${comment.anonymous_number - 1}`}
                                                </CommentUserName>
                                                <CommentTime>{formatDate(comment.create_date)}</CommentTime>
                                            </div>
                                        </CommentUserInfo>
                                        <CommentStats>
                                            <CommentStatItem onClick={() => handleCommentLike(comment.comment_id)}>
                                                {comment.is_liked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                                                {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                                            </CommentStatItem>
                                            <CommentStatItem onClick={() => handleReplyClick(comment.comment_id)}>
                                                <FaRegComment />
                                                {comment.reply_count > 0 && <span>{comment.reply_count}</span>}
                                            </CommentStatItem>
                                            {comment.is_mine && (
                                                <MenuWrapper>
                                                    <MenuButton onClick={() => setShowCommentMenu(showCommentMenu === comment.comment_id ? null : comment.comment_id)} />
                                                    {showCommentMenu === comment.comment_id && (
                                                        <DropdownMenu>
                                                            <MenuItem onClick={() => startEditComment(comment.comment_id, comment.content)}>수정</MenuItem>
                                                            <MenuItem $danger onClick={() => handleDeleteComment(comment.comment_id)}>삭제</MenuItem>
                                                        </DropdownMenu>
                                                    )}
                                                </MenuWrapper>
                                            )}
                                        </CommentStats>
                                    </CommentHeader>
                                    {editingCommentId === comment.comment_id ? (
                                        <>
                                            <EditTextarea
                                                value={editCommentContent}
                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                            />
                                            <EditButtonGroup>
                                                <EditButton onClick={() => setEditingCommentId(null)}>취소</EditButton>
                                                <EditButton $primary onClick={() => handleEditComment(comment.comment_id)}>저장</EditButton>
                                            </EditButtonGroup>
                                        </>
                                    ) : (
                                        <CommentContent>{comment.content}</CommentContent>
                                    )}

                                    {comment.replies && [...comment.replies].sort((a, b) => new Date(a.create_date) - new Date(b.create_date)).map((reply) => (
                                        <ReplyItem key={reply.comment_id}>
                                            <ReplyHeader>
                                                <CommentUserInfo>
                                                    <CommentUserIcon />
                                                    <div>
                                                        <CommentUserName $isAuthor={reply.is_author}>
                                                            {reply.is_author ? "익명(글쓴이)" : `익명${reply.anonymous_number - 1}`}
                                                        </CommentUserName>
                                                        <CommentTime>{formatDate(reply.create_date)}</CommentTime>
                                                    </div>
                                                </CommentUserInfo>
                                                <CommentStats>
                                                    <CommentStatItem onClick={() => handleCommentLike(reply.comment_id)}>
                                                        {reply.is_liked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                                                        {reply.likes_count > 0 && <span>{reply.likes_count}</span>}
                                                    </CommentStatItem>
                                                    <CommentStatItem onClick={() => handleReplyClick(comment.comment_id)}>
                                                        <FaRegComment />
                                                    </CommentStatItem>
                                                    {reply.is_mine && (
                                                        <MenuWrapper>
                                                            <MenuButton onClick={() => setShowCommentMenu(showCommentMenu === reply.comment_id ? null : reply.comment_id)} />
                                                            {showCommentMenu === reply.comment_id && (
                                                                <DropdownMenu>
                                                                    <MenuItem onClick={() => startEditComment(reply.comment_id, reply.content)}>수정</MenuItem>
                                                                    <MenuItem $danger onClick={() => handleDeleteComment(reply.comment_id)}>삭제</MenuItem>
                                                                </DropdownMenu>
                                                            )}
                                                        </MenuWrapper>
                                                    )}
                                                </CommentStats>
                                            </ReplyHeader>
                                            {editingCommentId === reply.comment_id ? (
                                                <>
                                                    <EditTextarea
                                                        value={editCommentContent}
                                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                                    />
                                                    <EditButtonGroup>
                                                        <EditButton onClick={() => setEditingCommentId(null)}>취소</EditButton>
                                                        <EditButton $primary onClick={() => handleEditComment(reply.comment_id)}>저장</EditButton>
                                                    </EditButtonGroup>
                                                </>
                                            ) : (
                                                <ReplyContent>{reply.content}</ReplyContent>
                                            )}
                                        </ReplyItem>
                                    ))}
                                </CommentItem>
                            ))}
                        </CommentSection>
                    </>
                ) : (
                    <LoadingMessage>게시글을 찾을 수 없습니다.</LoadingMessage>
                )}
            </Content>

            <CommentInputWrapper>
                <CommentInputRow>
                    <CommentInput
                        placeholder={"댓글을 입력해주세요"}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <SendButton
                        onClick={handleCommentSubmit}
                        disabled={submittingComment || !commentContent.trim()}
                    >
                        {submittingComment ? "..." : "전송"}
                    </SendButton>
                </CommentInputRow>
            </CommentInputWrapper>
        </Wrapper>
    );
};

export default CommunityContent;

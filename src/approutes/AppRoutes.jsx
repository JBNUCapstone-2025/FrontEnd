import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Main from "../pages/Main";
import Chat from "../pages/Chat";
// import Test from "../pages/Test";
import Login from "../pages/Login";
import Diary from "../pages/Diary";
import Join from "../pages/Join";
import Mypage from "../pages/Mypage";
import Profile from "../pages/Profile";
import Community from '../pages/Community';
import Shop from '../pages/Shop';
import CommunityList from '../components/CommunityList';
import CommunityPost from "../components/CommunityPost";
import CommunityContent from "../components/CommunityContent";
import CommunitySearch from "../components/CommunitySearch";
import Challenge from "../pages/Challenge";
import ChallengeContent from "../components/ChallengeContent";
import ChallengeWrite from "../components/ChallengeWrite";

const AppRoutes = () => {
  return (
    <Routes>
      {/* "/"로 접근하면 자동으로 "/login"으로 이동 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/diary/write" element={<Diary />} />
      <Route path="/chat" element={<Chat apiBase={import.meta.env.VITE_API_BASE_URL || ""} />} />
      <Route path="/join" element={<Join/>}/>
      <Route path="/mypage" element={<Mypage/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/shop" element={<Shop/>}/>
      <Route path="/board" element={<Community/>}/>
      <Route path="/board/list" element={<CommunityList/>}/>
      <Route path="/board/search" element={<CommunitySearch/>}/>
      <Route path="/board/post" element={<CommunityPost/>}/>
      <Route path="/board/content/:boardId" element={<CommunityContent/>}/>
      <Route path="/challenge/map" element={<Challenge/>}/>
      <Route path="/challenge/content" element={<ChallengeContent/>}/>
      <Route path="/challenge/write" element={<ChallengeWrite/>}/>


      {/* <Route path="/test" element={<Test />} /> */}

      {/* 잘못된 경로는 로그인으로 */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;

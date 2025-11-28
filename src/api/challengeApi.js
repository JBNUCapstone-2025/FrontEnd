import axios from 'axios';

const api = axios.create({
  baseURL: '/challenge',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 챌린지 현황 조회
export const getChallengeStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

// 대륙 목록 조회
export const getContinents = async () => {
  const response = await api.get('/continents');
  return response.data;
};

// 대륙별 챌린지 목록 조회
export const getContinentChallenges = async (continentId) => {
  const response = await api.get(`/continent/${continentId}`);
  return response.data;
};

// 챌린지 선택
export const selectChallenge = async (continentId, challengeType) => {
  const response = await api.post(`/select/${continentId}`, {
    challenge_type: challengeType, // 'basic' or 'recommend'
  });
  return response.data;
};

// 챌린지 완료
export const completeChallenge = async (challengeId, content) => {
  const response = await api.patch(`/${challengeId}/complete`, {
    content: content,
  });
  return response.data;
};

// 챌린지 상세 조회
export const getChallengeDetail = async (challengeId) => {
  const response = await api.get(`/${challengeId}`);
  return response.data;
};

// 전체 챌린지 목록 조회
export const getAllChallenges = async () => {
  const response = await api.get('/');
  return response.data;
};

export default api;

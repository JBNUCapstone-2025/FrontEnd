# 배포 가이드 (175.123.55.182 서버)

## 빠른 배포 방법

### 1. 서버에 파일 전송

로컬에서 서버로 프로젝트 전송:
```bash
scp -r /Users/coticoger/development/capstone/capstone_front root@175.123.55.182:/root/capstone_front
```

또는 Git 사용:
```bash
ssh root@175.123.55.182
cd /root
git clone <repository-url> capstone_front
cd capstone_front
```

### 2. 서버에서 도커 실행

```bash
# 서버 접속
ssh root@175.123.55.182

# 프로젝트 디렉토리로 이동
cd /root/capstone_front

# 도커 컴포즈로 빌드 및 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f
```

### 3. 접속 확인

브라우저에서 접속:
```
http://175.123.55.182:7001
```

## 생성된 파일 설명

### Dockerfile
- Multi-stage 빌드로 최적화된 프로덕션 이미지
- Node.js 20 Alpine으로 빌드
- Nginx Alpine으로 서빙
- 포트: 7001

### docker-compose.yml
- 컨테이너 이름: capstone-front
- 외부 포트: 7001
- 자동 재시작 설정

### nginx.conf
- React Router 지원 (SPA)
- API 프록시: /api → http://175.123.55.182:7777/api
- Diary 프록시: /diary → http://175.123.55.182:7777/diary
- Gzip 압축 및 캐싱 설정

### .dockerignore
- 빌드 시 불필요한 파일 제외

## 유용한 명령어

```bash
# 컨테이너 관리
docker-compose down          # 중지 및 삭제
docker-compose up -d         # 백그라운드 실행
docker-compose restart       # 재시작
docker-compose logs -f       # 실시간 로그
docker-compose ps            # 상태 확인

# 개별 도커 명령어
docker ps                              # 실행 중인 컨테이너
docker logs capstone-front            # 로그 확인
docker restart capstone-front         # 재시작
docker stop capstone-front            # 중지
docker start capstone-front           # 시작
```

## 코드 업데이트 배포

```bash
ssh root@175.123.55.182
cd /root/capstone_front

# Git 사용 시
git pull

# 재빌드 및 재시작
docker-compose down
docker-compose up -d --build
```

## 포트 변경 방법

7001 포트가 사용 중이라면:

1. [docker-compose.yml](docker-compose.yml) 수정:
```yaml
ports:
  - "7002:7001"  # 또는 원하는 포트
```

2. [nginx.conf](nginx.conf)는 변경 불필요 (내부 포트는 7001 유지)

## 문제 해결

### 포트 충돌 확인
```bash
sudo lsof -i :7001
sudo netstat -tulpn | grep 7001
```

### 캐시 없이 재빌드
```bash
docker-compose build --no-cache
docker-compose up -d
```

### 컨테이너 내부 확인
```bash
docker exec -it capstone-front sh
cat /etc/nginx/conf.d/default.conf
```

### 방화벽 설정
```bash
sudo ufw allow 7001/tcp
sudo ufw status
```

## 요구사항

- Docker 및 Docker Compose 설치 필요
- 백엔드 서버가 7777 포트에서 실행 중이어야 함
- 방화벽에서 7001 포트 오픈 필요

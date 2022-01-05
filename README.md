# human-love-music-client

휴먼들을 위한 음악 공유 어플리케이션. 휴뮤 🧑‍🤝‍🧑❤️🎶

- [클라이언트](https://github.com/humanscape/human-love-music-client)
- [서버](https://github.com/humanscape/human-love-music-server)

## 개발환경 구성

### 1. node 14 버전을 설치해주세요.

> 14.17.6 버전에서 동작이 확인되었습니다

### 2. 의존성을 설치합니다.

```
yarn install
```

### 3. 환경 변수를 설정합니다.

`.env.sample` 파일을 보고 새로운 파일을 작성합니다.

- `.env.local`: 로컬 환경
- `.env.production`: 운영 환경

```
REACT_APP_API_BASE_URL= # API 서버를 지정합니다

# 유튜브와 사운드 클라우드 위젯의 사전 로딩을 위한 미디어 URL을 지정합니다.
# 소리가 없고, 검은 영상이며 길이가 짧은(수초) 것이 적합합니다.
REACT_APP_DEFAULT_YT_TRACK_URL=
REACT_APP_DEFAULT_SC_TRACK_URL=
```

### 4. 앱을 실행시킵니다.

```
yarn start
```

## 빌드와 배포

`yarn build`로 빌드합니다.

> 위 커맨드로 앱 실행시 .env.production 파일을 환경변수로 사용합니다.

배포와 관련된 내용은 현재 변동 가능성이 커서 추후에 작성합니다.

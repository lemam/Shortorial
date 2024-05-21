<div align="center">

# SHORTORIAL | 모션 인식 기반 댄스 학습 서비스
<img src="/uploads/a3e23c258661246bc3789930f2efcc13/logo.png" width="" height="150"></img>   

숏토리얼은 댄스 챌린지를 중심으로 춤을 연습하고, 촬영하고, 공유할 수 있는 댄스 학습 서비스입니다.

**2024.04.08 ~ 2024.05.20 (6주)**   

**Team. 둠칫둠칫**    
총 6명 (프론트엔드 2, 백엔드 3, AI 1)  
</div>

# 주요 기능

#### 1. 연습 모드
- 웹캠 또는 핸드폰 카메라를 전신 거울 삼아 언제 어디서는 영상을 보며 춤을 따라 출 수 있습니다.
- 영상의 구간 반복, 배속 변경, 좌우 반전의 기능으로 편리한 연습 환경을 제공합니다.
- 모션 인식을 이용한 유사도 측정으로 점수를 표시해줍니다.

#### 2. 챌린지 모드
- 챌린지를 촬영하고 저장합니다.
- 촬영된 영상은 마이페이지에서 확인하실 수 있습니다.

#### 3. 유튜브 공유
- 챌린지 모드에서 저장된 영상은 마이페이지에서 연동된 유튜브 계정으로 게시할 수 있습니다.


### 팀원 소개 & 역할
| 팀원  | 역할        |
| --- | --------- | 
| 우지민 | 팀장, BE   |
| 조민준 | BE, INFRA  |
| 전성수 | BE        |
| 김다윤 | FE        | 
| 이현정 | AI        |
| 임지은 | FE        |


## Stack

![image](/uploads/21d4bd258a58958aa69ed8c6fafd56eb/서비스아키텍처.png)

**Environment**  
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)

**BackEnd**  
![Spring Boot](https://img.shields.io/badge/spring%20boot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=gradle" height="25"/>
![FLASK](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=nodedotjs" height="25"/>

**Data**

<img src="https://img.shields.io/badge/Anaconda-44A833?style=flat-square&logo=Anaconda&logoColor=white" height="25"/>  
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=pandas" height="25"/>
<img src="https://a11ybadges.com/badge?logo=numpy" height="25"/>
<img src="https://a11ybadges.com/badge?logo=scikitlearn" height="25"/> <img src="https://a11ybadges.com/badge?logo=scipy" height="25"/>

**FrontEnd**  
![React.js](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-%235B2C6F.svg?style=for-the-badge&logo=React&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=styledcomponents" height="25"/>

**DataBase**  
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=amazons3" height="25"/>
<img src="https://a11ybadges.com/badge?logo=redis" height="25"/>

**Version Control**  
![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)

**Deployment**  
![EC2](https://img.shields.io/badge/EC2-%23FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
<img src="https://a11ybadges.com/badge?logo=jenkins" height="25"/>

**API**  
<img src="https://a11ybadges.com/badge?logo=youtube" height="25"/>

**Communication**  
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)
![Mattermost](https://img.shields.io/badge/-Mattermost-blue?style=for-the-badge&logo=mattermost&logoColor=white)



## 주요 화면
#### 랜딩 페이지
![랜딩페이지](/uploads/56174d7986671d2201b41b7aa303a1e5/랜딩페이지.gif){: width="688" }

#### 메인 페이지  
- 추천 쇼츠 챌린지, 인기 쇼츠 챌린지, 전체 쇼츠 챌린지  
- 쇼츠 상세 정보  
![메인페이지](/uploads/ac155778e68321c6c917a8540cbadbe7/메인페이지.gif){: width="688" }

#### 연습 모드  
- 연습 모드 화면 구성  
- 영상을 일정 시간마다 나누어 여러 구간으로 표시  
- 구간 반복, 거울 모드(좌우 반전), 배속 변경 기능 사용 가능  
![연습페이지](/uploads/750fb15c197e564ab56da0a27a6f3fb3/연습페이지.png){: width="688" }  

- 모션 인식을 활용한 버튼 클릭  
![연습모드_버튼](/uploads/afafdd4ce87982a8c14000d0ac1c8b47/연습모드_버튼.gif){: width="688" }  

- 손 제스처로 구간 이동  
![연습모드_제스처](/uploads/ee486e62271755b3e018399152bd0501/연습모드_제스처.gif){: width="688" }  

- 구간마다 포즈 유사도 점수 표시  
![연습모드](/uploads/d4e0dd66fcd86818fd615a4d3b831a32/연습모드.gif){: width="688" }  


#### 챌린지 모드
- 챌린지 모드 화면 구성  
- 영상 녹화 가능  
- 타이머, 거울 모드(좌우 반전) 기능 사용 가능  
![챌린지페이지](/uploads/a27e8b2ac78aa06e9ab1f755e991212d/챌린지페이지.png){: width="688" }  

- 모션 인식을 활용한 버튼 클릭  
![챌린지모드_버튼](/uploads/29ea128059b6d15f2ac45ad6b0492d5e/챌린지모드_버튼.gif){: width="688" }  

- 녹화 후 영상 저장  
![챌린지녹화](/uploads/9a87bdf5bedaabede4ee6dfdcc7c4e4c/챌린지녹화.gif){: width="688" }  

#### 마이 페이지
- 촬영한 영상과 시도한 영상 확인  
![mypage](/uploads/757e7fd8311f4da75c87e7c3f54ad10d/mypage.gif){: width="688" }  

## 사용 기술


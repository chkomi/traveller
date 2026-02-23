# 🇰🇷 Korea Travel Map (한국여행 지도)

> Leaflet 기반 인터랙티브 한국 여행 지도 프로젝트
> Interactive Korean travel map built with Leaflet.js

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://chkomi.github.io/traveller/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 소개

한국의 아름다운 관광지, 맛집, 숙소를 지도에서 쉽게 찾아볼 수 있는 웹 애플리케이션입니다. KRC-Global 프로젝트를 기반으로 한국 국내 여행에 특화된 기능을 제공합니다.

### ✨ 주요 기능

- 🗺️ **인터랙티브 지도**: Leaflet.js 기반 반응형 지도
- 📍 **다양한 장소**: 관광지, 맛집, 숙소 정보 제공
- 📅 **일정 관리**: 날짜별 여행 일정 타임라인
- 🎨 **한국 전통 디자인**: 오방색 기반 컬러 시스템
- 📱 **모바일 최적화**: 터치 제스처 및 반응형 UI
- 🔍 **필터링**: 카테고리별, 날짜별 필터 기능

---

## 🚀 빠른 시작

### 로컬 실행

```bash
# 레포지토리 클론
git clone https://github.com/chkomi/traveller.git
cd traveller

# 로컬 서버 실행
python3 -m http.server 8000

# 브라우저에서 열기
open http://localhost:8000
```

### SuperClaude Skills 사용

```bash
# 프로젝트 초기화
/korea-map-init --region seoul --days 3

# 데이터 수집
/data-collector --type attractions --region seoul --count 20

# 디자인 커스터마이징
/map-designer --theme korean-traditional

# 배포
/korea-map-deploy --optimize-all
```

---

## 📂 프로젝트 구조

```
traveller/
├── README.md                   # 프로젝트 소개
├── KOREA_TRAVEL_MAP.md        # 상세 문서
├── KOREA_MAP_SKILLS.md        # Skills & Subagents 가이드
├── skills/                     # SuperClaude Skill 정의
│   ├── korea-map-init.yaml
│   └── data-collector.yaml
├── index.html                  # 메인 HTML (준비중)
├── script.js                   # JavaScript 로직 (준비중)
├── styles.css                  # 스타일시트 (준비중)
├── data/                       # 여행 데이터 (준비중)
│   └── korea-travel-data.json
└── images/                     # 이미지 리소스 (준비중)
    ├── attractions/
    ├── restaurants/
    └── hotels/
```

---

## 🎨 디자인 시스템

### 한국 전통 오방색 팔레트

| 색상 | Hex Code | 용도 |
|------|----------|------|
| 🔵 청색 (靑) | `#1E3A8A` | 관광지 마커 |
| 🔴 적색 (赤) | `#DC2626` | 맛집 마커 |
| 🟡 황색 (黃) | `#F59E0B` | 숙소 마커 |
| ⚪ 백색 (白) | `#F8F9FA` | 배경 |
| ⚫ 흑색 (黑) | `#1F2937` | 텍스트 |

---

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - Flexbox, Grid, 애니메이션
- **Vanilla JavaScript** - ES6+
- **Leaflet.js 1.9.4** - 지도 라이브러리
- **Font Awesome 6.0** - 아이콘

### 개발 도구
- **SuperClaude Framework** - AI 기반 개발 자동화
- **Python HTTP Server** - 로컬 개발 서버
- **GitHub Pages** - 정적 사이트 호스팅

---

## 📚 문서

- 📖 [프로젝트 상세 가이드](./KOREA_TRAVEL_MAP.md)
- 🤖 [SuperClaude Skills 가이드](./KOREA_MAP_SKILLS.md)
- 🎯 [Skill 정의 파일](./skills/)

---

## 🗺️ 지원 지역

### 현재 지원
- ✅ **서울**: 경복궁, 남산타워, 광장시장 등
- 🔄 **부산**: 해운대, 감천문화마을 (추가 예정)
- 🔄 **제주**: 한라산, 성산일출봉 (추가 예정)

### 향후 추가 예정
- 경주, 인천, 강릉, 전주, 속초 등

---

## 🎯 로드맵

### Phase 1: 기반 구축 ✅
- [x] 프로젝트 구조 설정
- [x] SuperClaude Skills 정의
- [x] 디자인 시스템 구축
- [ ] 기본 지도 렌더링
- [ ] 서울 데이터 수집

### Phase 2: 핵심 기능 🔄
- [ ] 마커 시스템 구현
- [ ] 일정 관리 타임라인
- [ ] 필터링 기능
- [ ] 모바일 최적화

### Phase 3: 확장 📋
- [ ] 부산, 제주 데이터 추가
- [ ] 검색 기능
- [ ] 사용자 리뷰
- [ ] PWA 지원

### Phase 4: 배포 & 운영 📋
- [ ] GitHub Pages 배포
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 사용자 피드백

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. 이 레포지토리를 Fork
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 설정 등 기타 변경
```

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🙏 감사의 말

- [KRC-Global](https://github.com/chkomi/KRC-Global) - 기반 프로젝트
- [Leaflet.js](https://leafletjs.com/) - 오픈소스 지도 라이브러리
- [한국관광공사](https://api.visitkorea.or.kr/) - 관광 데이터 API

---

## 📧 연락처

- **GitHub**: [@chkomi](https://github.com/chkomi)
- **Issues**: [GitHub Issues](https://github.com/chkomi/traveller/issues)

---

<div align="center">

**Made with ❤️ for Korean Travelers**

[🌟 Star this repo](https://github.com/chkomi/traveller) if you find it helpful!

</div>

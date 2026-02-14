# 한국여행 지도 프로젝트 (Korea Travel Map)

## 📋 프로젝트 개요

**목적**: KRC-Global 레포지토리의 디자인과 구조를 기반으로 한국 국내여행을 위한 인터랙티브 웹 지도 서비스 구축

**기반 레포지토리**: https://github.com/chkomi/KRC-Global
- 상하이 여행 지도 → 한국 국내 여행 지도로 전환
- Leaflet.js 기반 지도 시스템 재사용
- 타임라인 기반 일정 관리 시스템 활용

---

## 🎯 핵심 목표

1. **지역 기반 여행 정보 제공**
   - 서울, 부산, 제주도 등 주요 관광지
   - 지역별 맛집, 숙소, 관광명소 정보

2. **일정 관리 시스템**
   - 날짜별 여행 일정 시각화
   - 이동 경로 및 거리 표시
   - 예산 관리 (₩ 원화 기준)

3. **사용자 경험 최적화**
   - 모바일 친화적 UI/UX
   - 실시간 위치 추적
   - 다양한 지도 타일 옵션

---

## 🏗️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 반응형 디자인, 애니메이션
- **Vanilla JavaScript**: ES6+ 문법
- **Leaflet.js v1.9.4**: 지도 렌더링
- **Font Awesome 6.0**: 아이콘
- **Google Fonts**: Noto Sans KR

### 데이터
- **JSON**: 여행지 정보 저장 (`data/korea-travel-data.json`)
- **구조**:
  ```json
  {
    "attractions": [...],
    "restaurants": [...],
    "hotels": [...],
    "itinerary": {
      "day1": {...},
      "day2": {...}
    }
  }
  ```

### 배포
- **GitHub Pages**: 정적 사이트 호스팅
- **로컬 개발**: Python HTTP Server

---

## 📁 프로젝트 구조

```
korea-travel-map/
├── index.html              # 메인 HTML
├── script.js               # 핵심 JavaScript 로직
├── styles.css              # 스타일시트
├── data/
│   └── korea-travel-data.json  # 여행지 데이터
├── images/
│   ├── attractions/        # 관광지 이미지
│   ├── restaurants/        # 맛집 이미지
│   └── hotels/             # 숙소 이미지
├── test/                   # 테스트 샌드박스
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── AGENTS.md               # 에이전트 가이드
```

---

## 🎨 디자인 가이드라인

### 컬러 팔레트 (한국 전통색 기반)
```css
--primary-color: #1E3A8A;      /* 청색 (전통 한복) */
--secondary-color: #DC2626;    /* 단청 빨강 */
--accent-color: #F59E0B;       /* 금빛 */
--background: #F8F9FA;         /* 백자 흰색 */
--text-primary: #1F2937;       /* 먹색 */
--text-secondary: #6B7280;     /* 회색 */
```

### 타입별 마커 색상
- **관광지**: `#1E3A8A` (청색)
- **맛집**: `#DC2626` (빨강)
- **숙소**: `#F59E0B` (금빛)
- **교통**: `#10B981` (녹색)

### 폰트
- **주 폰트**: Noto Sans KR (400, 500, 700)
- **영문 표기**: Roboto (부가 정보용)

---

## 🗺️ 기능 요구사항

### 1. 지도 기본 기능
- ✅ Leaflet 기반 지도 렌더링
- ✅ 다중 타일 레이어 (기본, 위성, 교통)
- ✅ 마커 클러스터링 (밀집 지역 자동 그룹화)
- ✅ 현재 위치 탐지
- ✅ 줌/패닝 제스처 지원

### 2. 마커 시스템
- ✅ 카테고리별 커스텀 아이콘
- ✅ 팝업으로 상세 정보 표시
  - 장소명 (한글/영문)
  - 주소
  - 설명
  - 가격 정보
  - 특징 태그
  - 외부 지도 링크 (네이버, 카카오)
- ✅ 라벨 가시성 자동 조절 (줌 레벨 기반)

### 3. 일정 관리
- ✅ 날짜별 일정 타임라인
- ✅ 이동 경로 및 거리 표시
- ✅ 이동 수단 표시 (도보, 대중교통, 택시)
- ✅ 비용 계산 (교통비, 식비, 관광비)
- ✅ 하단 시트 / 팝업 UI

### 4. 필터링 & 검색
- ✅ 날짜별 필터 (전체/1일차/2일차...)
- ✅ 카테고리별 필터 (관광지/맛집/숙소)
- 🔲 키워드 검색 (장소명, 태그)
- 🔲 지역별 필터 (서울/부산/제주...)

### 5. 모바일 최적화
- ✅ 반응형 레이아웃
- ✅ 터치 제스처 지원
- ✅ 가로 스크롤 타임라인
- 🔲 PWA (Progressive Web App) 기능

---

## 📊 데이터 스키마

### 관광지 (Attractions)
```json
{
  "name": "경복궁 (Gyeongbokgung Palace, 景福宮)",
  "latitude": 37.5796,
  "longitude": 126.9770,
  "address": "서울특별시 종로구 사직로 161",
  "description": "조선 왕조의 법궁",
  "features": ["역사", "문화재", "포토스팟"],
  "price": "3000",
  "type": "attractions",
  "image": "images/attractions/gyeongbokgung.jpg"
}
```

### 맛집 (Restaurants)
```json
{
  "name": "광장시장 (Gwangjang Market, 広蔵市場)",
  "latitude": 37.5703,
  "longitude": 126.9995,
  "address": "서울특별시 종로구 창경궁로 88",
  "description": "전통 시장 먹거리",
  "features": ["길거리음식", "현지식", "분위기"],
  "menu": ["빈대떡", "마약김밥", "육회"],
  "price": "15000",
  "type": "restaurants"
}
```

### 일정 (Itinerary)
```json
{
  "day1": {
    "morning": {
      "time": "09:00",
      "location": "경복궁",
      "description": "궁궐 투어",
      "distance": null,
      "cost": {
        "transport": "0",
        "activity": "3000",
        "meal": null
      }
    },
    "lunch": {
      "time": "12:00",
      "location": "광장시장",
      "description": "전통 먹거리",
      "distance": "2.3km",
      "moveMode": "도보",
      "cost": {
        "transport": "0",
        "meal": "15000"
      }
    }
  }
}
```

---

## 🔧 개발 워크플로우

### 1. 초기 설정
```bash
# 레포지토리 생성
git clone <base-repo-url>
cd korea-travel-map

# 로컬 서버 실행
python3 -m http.server 8000
# http://localhost:8000
```

### 2. 개발 사이클
1. **테스트 폴더에서 작업**: `test/` 디렉토리 사용
2. **변경사항 검증**: 브라우저 개발자 도구 활용
3. **메인 반영**: 검증 완료 후 루트로 복사
4. **커밋**: 의미 있는 단위로 커밋

### 3. 테스트 체크리스트
- [ ] 지도가 올바르게 렌더링되는가?
- [ ] 모든 마커가 정확한 위치에 표시되는가?
- [ ] 팝업이 제대로 작동하는가?
- [ ] 일정 필터가 올바르게 동작하는가?
- [ ] 모바일에서 터치가 정상 작동하는가?
- [ ] JSON 데이터가 유효한가?
- [ ] 이미지 경로가 올바른가?
- [ ] 콘솔 에러가 없는가?

---

## 🚀 배포 가이드

### GitHub Pages 설정
1. 레포지토리 Settings → Pages
2. Source: `main` 브랜치, `/root` 폴더
3. URL: `https://<username>.github.io/korea-travel-map/`

### 성능 최적화
- 이미지 압축 (WebP/JPEG, ≤200KB)
- JSON 최소화 (불필요한 공백 제거)
- CSS/JS 압축 (프로덕션)
- CDN 활용 (Leaflet, Font Awesome)

---

## 📝 코딩 컨벤션

### JavaScript
```javascript
// ✅ Good
const markerGroups = {
    attractions: L.featureGroup(),
    restaurants: L.featureGroup()
};

function displayMarkers() {
    // 4-space indent
    if (!map || !koreaData) {
        console.error('지도 또는 데이터가 초기화되지 않았습니다.');
        return;
    }
}

// ❌ Bad
var marker_groups={attractions:L.featureGroup()};
```

### CSS
```css
/* ✅ Good */
.custom-marker-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ❌ Bad */
.customMarkerIcon{display:flex}
```

### 파일명
- ✅ `gyeongbokgung-palace.jpg`
- ✅ `korea-travel-data.json`
- ❌ `GyeongbokgungPalace.jpg`
- ❌ `KoreaTravelData.json`

---

## 🤝 협업 가이드

### 커밋 메시지
```
feat: 경복궁 마커 추가
fix: 모바일 타임라인 스크롤 오류 수정
style: 마커 색상 한국 전통색으로 변경
docs: README에 데이터 스키마 추가
```

### PR 템플릿
```markdown
## 변경사항
- 제주도 관광지 데이터 10개 추가
- 지역별 필터 기능 구현

## 스크린샷
[Before/After 이미지]

## 테스트
- [ ] 로컬 서버에서 정상 작동 확인
- [ ] 모바일 반응형 확인
- [ ] JSON 유효성 검증

## 관련 이슈
#12, #15
```

---

## 🛠️ 트러블슈팅

### 지도가 로드되지 않을 때
```javascript
// 브라우저 콘솔에서 확인
console.log('Map instance:', map);
console.log('Korea data:', koreaData);
```

### 마커가 표시되지 않을 때
- JSON 데이터의 위도/경도 확인
- 마커 그룹이 지도에 추가되었는지 확인
- `displayMarkers()` 함수 호출 여부 확인

### 이미지가 깨질 때
- 파일 경로 확인 (`images/attractions/...`)
- 파일 존재 여부 확인
- 이미지 형식 확인 (JPEG/PNG/WebP)

---

## 📚 참고 자료

### 외부 라이브러리
- [Leaflet.js 공식 문서](https://leafletjs.com/)
- [Leaflet MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)
- [Font Awesome Icons](https://fontawesome.com/icons)

### 한국 지도 데이터
- [카카오 로컬 API](https://developers.kakao.com/docs/latest/ko/local/common)
- [네이버 지도 API](https://www.ncloud.com/product/applicationService/maps)
- [공공데이터포털](https://www.data.go.kr/)

### 디자인 참고
- [한국관광공사](https://korean.visitkorea.or.kr/)
- [Material Design](https://material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)

---

## 🎓 학습 목표

### 개발자 역량
- ✅ Leaflet.js 지도 라이브러리 마스터
- ✅ GeoJSON 데이터 핸들링
- ✅ 반응형 웹 디자인
- ✅ 성능 최적화 기법

### 프로젝트 관리
- ✅ Git 버전 관리
- ✅ 이슈 트래킹
- ✅ 문서화 (README, 주석)
- ✅ 테스트 기반 개발

---

## 📅 로드맵

### Phase 1: 기반 구축 (2주)
- [ ] 프로젝트 구조 설정
- [ ] 기본 지도 렌더링
- [ ] 서울 관광지 데이터 수집 (20개)
- [ ] 마커 시스템 구현

### Phase 2: 핵심 기능 (3주)
- [ ] 일정 관리 시스템
- [ ] 타임라인 UI
- [ ] 필터링 기능
- [ ] 모바일 최적화

### Phase 3: 확장 (2주)
- [ ] 부산, 제주 데이터 추가
- [ ] 검색 기능
- [ ] 사용자 리뷰 시스템
- [ ] PWA 기능

### Phase 4: 배포 & 운영 (1주)
- [ ] GitHub Pages 배포
- [ ] 성능 최적화
- [ ] 문서 정리
- [ ] 사용자 피드백 수집

---

## 📞 연락처 & 기여

**프로젝트 관리자**: [Your Name]
**이메일**: [Your Email]
**이슈 제보**: [GitHub Issues Link]

**기여 환영**: Pull Request는 언제나 환영합니다!

---

**마지막 업데이트**: 2026-02-14
**버전**: 0.1.0

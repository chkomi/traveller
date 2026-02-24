# 한국여행 지도 프로젝트 Skills & Subagents

## 📋 개요

이 문서는 한국여행 지도 프로젝트에 특화된 SuperClaude skill과 subagent를 정의합니다.

---

## 🎯 프로젝트 특화 Skills

### 1. `/korea-map-init` - 프로젝트 초기화
**목적**: 한국여행 지도 프로젝트 구조 자동 생성 및 기본 설정

**자동 활성화**:
- 키워드: "프로젝트 시작", "초기화", "setup", "새 프로젝트"
- 컨텍스트: 빈 디렉토리 또는 새 레포지토리

**기능**:
```yaml
operations:
  - 디렉토리 구조 생성 (/, /data, /images, /test)
  - 기본 HTML/CSS/JS 파일 생성 (KRC-Global 템플릿 기반)
  - package.json 생성 (로컬 서버 스크립트 포함)
  - .gitignore 설정
  - README.md 초기화
  - 샘플 데이터 JSON 생성

auto_persona: architect, frontend
mcp_servers: [Context7, Sequential]
tools: [Write, Bash, Edit]
```

**사용 예시**:
```bash
/korea-map-init --region seoul --days 3
```

**출력**:
- ✅ 프로젝트 디렉토리 구조 완성
- ✅ 기본 파일 생성 (index.html, script.js, styles.css)
- ✅ 샘플 데이터 (서울 관광지 5개)
- ✅ 로컬 서버 실행 가이드

---

### 2. `/data-collector` - 여행지 데이터 수집
**목적**: 한국 관광지, 맛집, 숙소 데이터 자동 수집 및 JSON 생성

**자동 활성화**:
- 키워드: "데이터 수집", "관광지 추가", "맛집 정보"
- 파일 패턴: `*-data.json`, `/data/*.json`

**기능**:
```yaml
operations:
  - 웹 크롤링 (한국관광공사, 네이버/카카오 API)
  - 데이터 정제 및 표준화
  - JSON 스키마 검증
  - 위도/경도 자동 변환
  - 이미지 다운로드 및 최적화
  - 중복 데이터 제거

auto_persona: analyzer, scribe
mcp_servers: [Sequential, Context7]
tools: [WebFetch, Write, Bash, Grep]
flags: [--validate, --uc]
```

**사용 예시**:
```bash
/data-collector --type attractions --region busan --count 20
/data-collector --type restaurants --keyword "부산 해운대 맛집" --auto-geocode
```

**출력**:
```json
{
  "attractions": [
    {
      "name": "해운대 해수욕장 (Haeundae Beach, 海云台海水浴場)",
      "latitude": 35.1587,
      "longitude": 129.1603,
      "address": "부산광역시 해운대구 중동",
      "description": "한국 최고의 해변 휴양지",
      "features": ["해변", "야경", "축제"],
      "price": "0",
      "type": "attractions"
    }
  ]
}
```

---

### 3. `/map-designer` - 지도 UI/UX 디자인
**목적**: Leaflet 지도 커스터마이징 및 한국 전통 디자인 적용

**자동 활성화**:
- 키워드: "디자인", "마커", "스타일", "색상"
- 파일 패턴: `styles.css`, `script.js`

**기능**:
```yaml
operations:
  - 커스텀 마커 아이콘 디자인
  - 한국 전통색 팔레트 적용
  - 팝업 스타일 커스터마이징
  - 애니메이션 효과 추가
  - 반응형 레이아웃 구현
  - 지도 타일 레이어 설정

auto_persona: frontend, designer
mcp_servers: [Magic, Context7]
tools: [Edit, Write, Read]
flags: [--magic, --uc]
```

**사용 예시**:
```bash
/map-designer --theme korean-traditional --markers custom-icons
/map-designer --popup-style elegant --animation smooth
```

**생성 예시** (CSS):
```css
:root {
    --korean-blue: #1E3A8A;      /* 청색 */
    --korean-red: #DC2626;       /* 단청 빨강 */
    --korean-gold: #F59E0B;      /* 금빛 */
}

.custom-marker-icon.attractions-bg {
    background: var(--korean-blue);
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(30, 58, 138, 0.4);
}
```

---

### 4. `/itinerary-builder` - 일정 관리 시스템
**목적**: 날짜별 여행 일정 자동 생성 및 타임라인 UI 구축

**자동 활성화**:
- 키워드: "일정", "타임라인", "스케줄"
- 파일 패턴: `itinerary`, `schedule`

**기능**:
```yaml
operations:
  - 날짜별 일정 데이터 구조화
  - 이동 경로 최적화 (A* 알고리즘)
  - 이동 시간/거리 자동 계산
  - 비용 집계 (교통비, 식비, 관광비)
  - 타임라인 UI 생성
  - 필터링 기능 구현

auto_persona: analyzer, frontend
mcp_servers: [Sequential, Magic]
tools: [Edit, Write, Read, Bash]
flags: [--seq, --validate]
```

**사용 예시**:
```bash
/itinerary-builder --days 3 --region seoul --budget 500000
/itinerary-builder --optimize-route --include-meals
```

**생성 데이터 예시**:
```json
{
  "day1": {
    "morning": {
      "time": "09:00",
      "location": "경복궁",
      "description": "궁궐 투어 및 수문장 교대식 관람",
      "distance": null,
      "cost": {
        "transport": "0",
        "activity": "3000"
      }
    },
    "lunch": {
      "time": "12:00",
      "location": "광장시장",
      "description": "전통 먹거리 체험",
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

### 5. `/mobile-optimizer` - 모바일 최적화
**목적**: 모바일 환경 최적화 및 터치 제스처 구현

**자동 활성화**:
- 키워드: "모바일", "반응형", "터치"
- 화면 폭: < 768px

**기능**:
```yaml
operations:
  - 반응형 CSS 미디어 쿼리 추가
  - 터치 이벤트 핸들러 구현
  - 가로 스크롤 타임라인 최적화
  - 하단 시트 UI 구현
  - 이미지 레이지 로딩
  - 성능 최적화 (throttle, debounce)

auto_persona: frontend, performance
mcp_servers: [Magic, Sequential]
tools: [Edit, Read, Bash]
flags: [--focus performance, --uc]
```

**사용 예시**:
```bash
/mobile-optimizer --breakpoint 768px --gestures swipe,pinch
/mobile-optimizer --lazy-load images --optimize-bundle
```

**생성 코드 예시**:
```css
@media (max-width: 768px) {
    .mobile-timeline {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .custom-marker-icon {
        transform: scale(0.8);
    }
}
```

---

### 6. `/korea-map-deploy` - 배포 자동화
**목적**: GitHub Pages 배포 및 성능 최적화

**자동 활성화**:
- 키워드: "배포", "deploy", "publish"
- 브랜치: `main`, `gh-pages`

**기능**:
```yaml
operations:
  - 이미지 압축 (WebP 변환)
  - CSS/JS 압축 (minify)
  - JSON 최소화
  - GitHub Pages 설정
  - 배포 전 검증
  - 성능 측정 (Lighthouse)

auto_persona: devops, performance
mcp_servers: [Sequential, Playwright]
tools: [Bash, Edit, Read]
flags: [--validate, --safe-mode]
```

**사용 예시**:
```bash
/korea-map-deploy --optimize-all --lighthouse-check
/korea-map-deploy --branch gh-pages --custom-domain korea-travel.com
```

---

## 🤖 프로젝트 특화 Subagents

### 1. GeoJSON Expert
**역할**: GeoJSON 데이터 처리 및 지리 정보 변환 전문가

**전문 분야**:
- GeoJSON 포맷 변환 (Feature, FeatureCollection)
- 좌표계 변환 (WGS84, GRS80, Bessel)
- 공간 쿼리 (Point-in-Polygon, 거리 계산)
- TopoJSON 최적화

**활성화 트리거**:
```yaml
keywords: [geojson, 위도, 경도, 좌표, coordinate]
file_patterns: ["*.geojson", "*.json"]
operations: [geocoding, coordinate_conversion]
```

**사용 예시**:
```javascript
// 주소 → 위도/경도 변환
const coords = await geocodeAddress("서울특별시 종로구 사직로 161");
// → { lat: 37.5796, lng: 126.9770 }

// 두 지점 간 거리 계산
const distance = calculateDistance(
    { lat: 37.5796, lng: 126.9770 },  // 경복궁
    { lat: 37.5703, lng: 126.9995 }   // 광장시장
);
// → "2.3km"
```

---

### 2. Leaflet Specialist
**역할**: Leaflet.js 지도 구현 및 커스터마이징 전문가

**전문 분야**:
- 지도 초기화 및 설정
- 마커/폴리라인/폴리곤 관리
- 클러스터링 최적화
- 커스텀 컨트롤 구현
- 타일 레이어 관리

**활성화 트리거**:
```yaml
keywords: [leaflet, marker, map, tile, layer]
file_patterns: ["script.js", "map*.js"]
operations: [map_rendering, marker_clustering]
```

**구현 패턴**:
```javascript
// 효율적인 마커 클러스터링
const markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
            html: `<div class="cluster-icon">${count}</div>`,
            className: 'marker-cluster',
            iconSize: L.point(40, 40)
        });
    }
});
```

---

### 3. Travel Data Curator
**역할**: 여행 데이터 품질 관리 및 검증 전문가

**전문 분야**:
- 데이터 스키마 검증
- 중복 데이터 탐지 및 병합
- 데이터 일관성 체크
- 다국어 이름 정규화
- 가격 정보 업데이트

**활성화 트리거**:
```yaml
keywords: [data validation, 데이터 검증, quality]
file_patterns: ["*-data.json", "/data/*.json"]
operations: [data_validation, deduplication]
```

**검증 규칙**:
```javascript
const validationRules = {
    name: {
        required: true,
        pattern: /^[\u3131-\u318E\uAC00-\uD7A3\w\s]+\([^)]+\)$/,
        example: "경복궁 (Gyeongbokgung Palace, 景福宮)"
    },
    latitude: {
        required: true,
        range: [33.0, 38.5],  // 한국 위도 범위
        precision: 4
    },
    longitude: {
        required: true,
        range: [124.0, 132.0],  // 한국 경도 범위
        precision: 4
    },
    price: {
        required: false,
        type: "string",
        pattern: /^\d+$/
    }
};
```

---

### 4. UI Designer (Korean Traditional)
**역할**: 한국 전통 디자인 컨셉 적용 전문가

**전문 분야**:
- 한국 전통색 팔레트 적용
- 한글 타이포그래피 최적화
- 전통 문양 패턴 디자인
- 문화적 UI/UX 고려사항

**활성화 트리거**:
```yaml
keywords: [디자인, 전통, korean design, color]
file_patterns: ["styles.css", "*.scss"]
operations: [styling, theming]
```

**디자인 시스템**:
```css
/* 한국 전통 오방색 팔레트 */
:root {
    --오방-청: #1E3A8A;    /* 동쪽, 봄 */
    --오방-적: #DC2626;    /* 남쪽, 여름 */
    --오방-황: #F59E0B;    /* 중앙, 환절기 */
    --오방-백: #F8F9FA;    /* 서쪽, 가을 */
    --오방-흑: #1F2937;    /* 북쪽, 겨울 */

    /* 단청 색상 */
    --단청-주홍: #E63946;
    --단청-연두: #52B788;
    --단청-하늘: #457B9D;
}

/* 한글 최적화 폰트 스택 */
body {
    font-family:
        'Noto Sans KR',
        'Apple SD Gothic Neo',
        'Malgun Gothic',
        sans-serif;
    letter-spacing: -0.02em;  /* 한글 자간 최적화 */
    word-break: keep-all;      /* 단어 단위 줄바꿈 */
}
```

---

### 5. Performance Tuner
**역할**: 웹 성능 최적화 전문가

**전문 분야**:
- 번들 사이즈 최적화
- 이미지 압축 및 레이지 로딩
- JavaScript 성능 최적화
- 렌더링 최적화
- Lighthouse 점수 개선

**활성화 트리거**:
```yaml
keywords: [성능, performance, optimize, lazy load]
operations: [performance_analysis, optimization]
flags: [--focus performance]
```

**최적화 체크리스트**:
```javascript
// 1. 이미지 레이지 로딩
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});

// 2. Debounce 함수로 이벤트 최적화
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

map.on('moveend', debounce(updateLabelVisibility, 200));

// 3. 번들 사이즈 분석
console.log('Total bundle size:',
    (script.js + styles.css + data.json) / 1024, 'KB'
);
```

---

## 🔄 Skill & Subagent 통합 워크플로우

### 프로젝트 초기화 → 데이터 수집 → 디자인 → 배포
```mermaid
graph LR
    A[/korea-map-init] --> B[/data-collector]
    B --> C[/map-designer]
    C --> D[/itinerary-builder]
    D --> E[/mobile-optimizer]
    E --> F[/korea-map-deploy]

    B -.-> G[GeoJSON Expert]
    C -.-> H[Leaflet Specialist]
    B -.-> I[Travel Data Curator]
    C -.-> J[UI Designer]
    E -.-> K[Performance Tuner]
```

### 전형적인 개발 시나리오

#### 시나리오 1: 새 프로젝트 시작
```bash
# 1. 프로젝트 초기화
/korea-map-init --region seoul --days 3

# 2. 데이터 수집 (GeoJSON Expert 자동 활성화)
/data-collector --type attractions --region seoul --count 20

# 3. 디자인 적용 (UI Designer 자동 활성화)
/map-designer --theme korean-traditional --markers custom-icons

# 4. 일정 생성 (Leaflet Specialist 자동 활성화)
/itinerary-builder --days 3 --optimize-route

# 5. 모바일 최적화 (Performance Tuner 자동 활성화)
/mobile-optimizer --breakpoint 768px --lazy-load images

# 6. 배포
/korea-map-deploy --optimize-all --lighthouse-check
```

#### 시나리오 2: 기존 데이터 업데이트
```bash
# 1. 데이터 검증 (Travel Data Curator 자동 활성화)
/data-collector --validate --file data/korea-travel-data.json

# 2. 새 관광지 추가
/data-collector --type attractions --region busan --append

# 3. 중복 제거 및 품질 체크
/analyze --focus quality data/korea-travel-data.json --uc
```

#### 시나리오 3: 성능 최적화
```bash
# 1. 성능 분석 (Performance Tuner 자동 활성화)
/analyze --focus performance --lighthouse

# 2. 이미지 최적화
/mobile-optimizer --optimize-images --format webp

# 3. 번들 최적화
/korea-map-deploy --minify --tree-shaking
```

---

## 📊 Skill 우선순위 매트릭스

| Skill | 복잡도 | 우선순위 | 의존성 |
|-------|--------|----------|--------|
| `/korea-map-init` | Low | P0 | - |
| `/data-collector` | Medium | P1 | GeoJSON Expert |
| `/map-designer` | Medium | P1 | UI Designer, Leaflet Specialist |
| `/itinerary-builder` | High | P2 | Travel Data Curator |
| `/mobile-optimizer` | Medium | P2 | Performance Tuner |
| `/korea-map-deploy` | Low | P3 | All |

**우선순위**:
- **P0**: 프로젝트 시작에 필수
- **P1**: 핵심 기능 구현
- **P2**: 사용자 경험 개선
- **P3**: 배포 및 운영

---

## 🧪 테스트 가이드

### Skill 테스트
```bash
# 각 skill의 기본 동작 확인
/korea-map-init --test
/data-collector --validate --test-mode
/map-designer --preview --dry-run
```

### Subagent 검증
```javascript
// GeoJSON Expert 테스트
const testCoords = await geocodeAddress("서울특별시 종로구 사직로 161");
console.assert(
    Math.abs(testCoords.lat - 37.5796) < 0.01,
    "Geocoding failed"
);

// Travel Data Curator 테스트
const validationResult = validateData(koreaData);
console.assert(
    validationResult.errors.length === 0,
    "Data validation failed"
);
```

---

## 📚 참고 자료

### Skill 개발 가이드
- [SuperClaude COMMANDS.md](/Users/hyungchangyoun/.claude/COMMANDS.md)
- [SuperClaude FLAGS.md](/Users/hyungchangyoun/.claude/FLAGS.md)
- [SuperClaude PERSONAS.md](/Users/hyungchangyoun/.claude/PERSONAS.md)

### Subagent 개발 가이드
- [SuperClaude ORCHESTRATOR.md](/Users/hyungchangyoun/.claude/ORCHESTRATOR.md)
- [Task Tool Documentation](https://docs.anthropic.com/claude/docs/task-tool)

### 프로젝트 관련
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [GeoJSON Specification](https://geojson.org/)
- [한국 전통색 가이드](https://www.colordic.org/ko)

---

**마지막 업데이트**: 2026-02-14
**버전**: 1.0.0

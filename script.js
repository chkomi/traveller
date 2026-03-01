// 부산 여행 지도 - JavaScript
// Busan Travel Map - Main Script (KRC-Global Style)

// ========================================
// 전역 변수
// ========================================
let map;
let allMarkers = [];
let markerCluster;
let busanData = [];
let tileLayers = {};
let currentTile = 'positron';

// 경로 관련
let routeLayers = {};   // { 1: L.polyline, 2: L.polyline, 3: L.polyline }
let routeCache = {};    // OSRM 응답 캐시
let gatheringLayers = {};  // { '1-0': L.polyline, '1-1': L.polyline, ... }
let gatheringCache = {};   // { '1-0': { coords, distance, duration, ... }, ... }
let dispersalLayers = {};  // { '3-0': L.polyline, '3-1': L.polyline, ... }
let dispersalCache = {};   // { '3-0': { coords, distance, duration, ... }, ... }

const DAY_COLORS = { 1: '#D4634A', 2: '#4A7FB5', 3: '#8B6D3F' };

// 4가족 집결 경로 (각 출발지 → 김가네토속식당)
const GATHERING_ROUTES = {
    1: [
        {
            family: '나주팀',
            waypoints: [
                { name: '나주 빛가람코오롱하늘채', lat: 35.031807, lng: 126.773710 },
                { name: '김가네토속식당', lat: 34.9866128, lng: 127.8364813 }
            ]
        },
        {
            family: '광주팀',
            waypoints: [
                { name: '광주 그랜드센트럴', lat: 35.156172, lng: 126.915643 },
                { name: '김가네토속식당', lat: 34.9866128, lng: 127.8364813 }
            ]
        },
        {
            family: '광양팀',
            waypoints: [
                { name: '광양', lat: 34.915321, lng: 127.639434 },
                { name: '김가네토속식당', lat: 34.9866128, lng: 127.8364813 }
            ]
        },
        {
            family: 'TW팀',
            waypoints: [
                { name: 'TW바이오매스에너지', lat: 34.808775, lng: 127.655259 },
                { name: '순천', lat: 34.934311, lng: 127.488927 },
                { name: '김가네토속식당', lat: 34.9866128, lng: 127.8364813 }
            ]
        }
    ]
};

// 4가족 해산 경로 (일신명품한우 → 각 귀가지)
const DISPERSAL_ROUTES = {
    3: [
        {
            family: '나주팀',
            waypoints: [
                { name: '일신명품한우', lat: 35.101948, lng: 129.025667 },
                { name: '나주 빛가람코오롱하늘채', lat: 35.031807, lng: 126.773710 }
            ]
        },
        {
            family: '광주팀',
            waypoints: [
                { name: '일신명품한우', lat: 35.101948, lng: 129.025667 },
                { name: '광주 그랜드센트럴', lat: 35.156172, lng: 126.915643 }
            ]
        },
        {
            family: '광양팀',
            waypoints: [
                { name: '일신명품한우', lat: 35.101948, lng: 129.025667 },
                { name: '광양', lat: 34.915321, lng: 127.639434 }
            ]
        },
        {
            family: 'TW팀',
            waypoints: [
                { name: '일신명품한우', lat: 35.101948, lng: 129.025667 },
                { name: '순천', lat: 34.934311, lng: 127.488927 },
                { name: 'TW바이오매스에너지', lat: 34.808775, lng: 127.655259 }
            ]
        }
    ]
};

const DAY_ROUTES = {
    1: [
        { name: '김가네토속식당', lat: 34.9866128, lng: 127.8364813 },
        { name: '브라운스위트', lat: 35.11639, lng: 129.046002 },
        { name: '송도해상케이블카', lat: 35.076833, lng: 129.022845 },
        { name: '하이디라오', lat: 35.113075, lng: 129.038314 }
    ],
    2: [
        { name: '브라운스위트', lat: 35.11639, lng: 129.046002 },
        { name: '부산근현대역사관', lat: 35.102423, lng: 129.032152 },
        { name: '딘타이펑', lat: 35.097535, lng: 129.036834 },
        { name: '블루라인파크 송정정거장', lat: 35.180882, lng: 129.200172 },
        { name: '씨라이프', lat: 35.159162, lng: 129.160875 },
        { name: '더파티', lat: 35.173989, lng: 129.126247 },
        { name: '브라운스위트', lat: 35.11639, lng: 129.046002 }
    ],
    3: [
        { name: '브라운스위트', lat: 35.11639, lng: 129.046002 },
        { name: '피아크 카페385', lat: 35.084237, lng: 129.076404 },
        { name: '일신명품한우', lat: 35.101948, lng: 129.025667 }
    ]
};

// ========================================
// 지도 초기화
// ========================================
function initMap() {
    // 부산 중심 좌표 (부산역 기준)
    const busanCenter = [35.1796, 129.0756];

    // Leaflet 지도 생성
    map = L.map('map', {
        center: busanCenter,
        zoom: 12,
        zoomControl: true,
        attributionControl: true
    });

    // 타일 레이어 정의
    tileLayers = {
        positron: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap, © CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
        }),
        streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
        }),
        transit: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap, HOT',
            maxZoom: 19
        })
    };

    // 기본 타일 (Positron) 추가
    tileLayers.positron.addTo(map);

    // 줌 레벨에 따라 마커 크기 조절
    map.on('zoomend', updateMarkerSize);

    console.log('✅ 지도 초기화 완료 (Positron)');
}

// ========================================
// 데이터 로드
// ========================================
async function loadData() {
    try {
        const response = await fetch('data/busan-travel-data.json');
        busanData = await response.json();

        console.log(`✅ 데이터 로드 완료: ${busanData.length}개 장소`);

        // 마커 생성
        displayMarkers(busanData);

        // 경로 로드
        loadAllRoutes();

    } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
    }
}

// ========================================
// 마커 표시
// ========================================
function displayMarkers(data) {
    // 기존 마커 제거
    allMarkers.forEach(({ marker }) => map.removeLayer(marker));
    allMarkers = [];

    data.forEach(place => {
        // 마커 아이콘 생성
        const icon = getMarkerIcon(place);

        // 마커 생성하고 지도에 바로 추가
        const marker = L.marker([place.latitude, place.longitude], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(place));

        // 마커 저장
        allMarkers.push({
            marker: marker,
            data: place
        });
    });

    // 초기 마커 크기 설정
    updateMarkerSize();

    console.log(`✅ ${allMarkers.length}개 마커 생성 완료`);
}

// ========================================
// 줌 레벨에 따라 마커 크기 조절 (실제 겹침 감지)
// ========================================
function updateMarkerSize() {
    const currentZoom = map.getZoom();

    // 줌이 16 이상이면 모든 마커를 아이콘으로 표시 (같은 위치에 있어도)
    if (currentZoom >= 16) {
        allMarkers.forEach(({ marker }) => {
            const iconElement = marker.getElement();
            if (iconElement) {
                const circleMarker = iconElement.querySelector('.circle-marker');
                if (circleMarker) {
                    circleMarker.classList.remove('small-dot');
                }
            }
        });
        return;
    }

    // 모든 줌 레벨에서 먼저 모든 마커를 일반 마커로 초기화
    allMarkers.forEach(({ marker }) => {
        const iconElement = marker.getElement();
        if (iconElement) {
            const circleMarker = iconElement.querySelector('.circle-marker');
            if (circleMarker) {
                circleMarker.classList.remove('small-dot');
            }
        }
    });

    // 줌 레벨에 따라 체크 반경 조정 (줌이 높을수록 더 가까이 있어야 겹침으로 판단)
    const checkRadius = Math.max(15, 80 - (currentZoom * 4)); // 줌 낮을수록 넓은 반경으로 겹침 판단

    // 그 다음 실제로 겹치는 마커만 작은 점으로 변경
    allMarkers.forEach(({ marker, data }, index) => {
        const iconElement = marker.getElement();
        if (!iconElement) return;

        const circleMarker = iconElement.querySelector('.circle-marker');
        if (!circleMarker) return;

        // 현재 마커의 화면 좌표
        const markerPos = map.latLngToContainerPoint([data.latitude, data.longitude]);

        // 주변에 겹치는 마커가 있는지 확인
        let hasNearbyMarker = false;

        for (let i = 0; i < allMarkers.length; i++) {
            if (i === index) continue; // 자기 자신은 제외

            const otherData = allMarkers[i].data;
            const otherPos = map.latLngToContainerPoint([otherData.latitude, otherData.longitude]);

            // 거리 계산
            const distance = Math.sqrt(
                Math.pow(markerPos.x - otherPos.x, 2) +
                Math.pow(markerPos.y - otherPos.y, 2)
            );

            if (distance < checkRadius) {
                hasNearbyMarker = true;
                break;
            }
        }

        // 겹치면 작은 점으로 변경
        if (hasNearbyMarker) {
            circleMarker.classList.add('small-dot');
        }
    });
}

// ========================================
// 마커 아이콘 생성 (KRC-Global 스타일)
// ========================================
function getMarkerIcon(place) {
    const lang = TravelLang.getLang();
    const displayName = TravelLang.getName(place, lang);

    const iconMap = {
        attractions: 'fa-landmark',
        restaurants: 'fa-utensils',
        hotels: 'fa-hotel',
        airports: 'fa-plane'
    };

    const typeColors = {
        attractions: '#8B5A6B',
        restaurants: '#6B8E5A',
        hotels: '#7B9EA8',
        airports: '#B87A8F'
    };

    const color = typeColors[place.type] || typeColors.attractions;

    return L.divIcon({
        className: 'custom-marker-icon',
        html: `
            <div class="circle-marker ${place.type}-bg">
                <i class="fas ${iconMap[place.type] || 'fa-landmark'}"></i>
            </div>
            <div class="marker-label" style="color: ${color};">${displayName}</div>
        `,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

// ========================================
// 팝업 콘텐츠 생성 (스크린샷 스타일)
// ========================================
function createPopupContent(place) {
    // 타입별 시그니처 색상
    const typeColors = {
        attractions: '#8B5A6B',  // 관광지 - 보라/와인색
        restaurants: '#6B8E5A',  // 맛집 - 녹색
        hotels: '#7B9EA8',       // 숙소 - 청록색
        airports: '#B87A8F'      // 공항 - 핑크/와인색
    };
    const signatureColor = typeColors[place.type] || typeColors.attractions;

    // 언어 및 이름
    const lang = TravelLang.getLang();
    const ui = TravelLang.getUI(lang);
    const displayName = TravelLang.getName(place, lang);
    const koreanName = TravelLang.getName(place, 'ko');
    const subtitleName = lang !== 'ko' ? koreanName : (TravelLang.getName(place, 'en') || extractEnglishName(place.name));
    const desc = TravelLang.getDesc(place, lang);
    const typeLabel = TravelLang.getTypeLabel(place.type || 'attractions', lang);

    // 특징 태그 (언어별 선택, 쉼표로 구분)
    const featuresArr = lang === 'zh' ? (place.featuresZh || place.features)
                      : lang === 'ko' ? place.features
                      : lang === 'ja' ? (place.featuresJa || place.featuresZh || place.features)
                      : lang === 'en' ? (place.featuresEn || place.features)
                      : lang === 'es' ? (place.featuresEs || place.featuresEn || place.features)
                      : place.features;
    const features = featuresArr ? featuresArr.join(', ') : '';

    // 주소 (언어별: 번역 주소 + 한국어 병기)
    const addrKo = place.address || '';
    const addrZh = place.addressZh || '';
    const addrEn = place.addressEn || '';
    let addrDisplay;
    if (lang === 'ko') {
        addrDisplay = addrKo;
    } else if (lang === 'zh' || lang === 'ja') {
        const local = addrZh;
        addrDisplay = local ? `${local}<br><small style="color:#888;">${addrKo}</small>` : addrKo;
    } else {
        const local = addrEn;
        addrDisplay = local ? `${local}<br><small style="color:#888;">${addrKo}</small>` : addrKo;
    }

    // 지도 링크
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(koreanName)}&query=${place.latitude},${place.longitude}`;
    const naverMapsUrl = `https://map.naver.com/v5/search/${encodeURIComponent(koreanName)}`;

    let html = `<div class='custom-popup' style='border-color: ${signatureColor};'>`;

    // 닫기 버튼
    html += `<button class='popup-close-btn' style='color: ${signatureColor};'><i class="fas fa-times"></i></button>`;

    // 헤더 (표시명 + 서브타이틀)
    html += `<div class='popup-header' style='border-bottom-color: ${signatureColor};'>`;
    html += `<h3 class='popup-title' style='color: ${signatureColor};'>${displayName}</h3>`;
    if (subtitleName && subtitleName !== displayName) {
        html += `<p class='popup-subtitle' style='color: ${signatureColor};'>${subtitleName}</p>`;
    }
    html += `<span class='type-badge' style='background: ${signatureColor};'>${typeLabel}</span>`;
    html += `</div>`;

    // 본문
    html += `<div class='popup-body'>`;

    // 주소
    html += `<div class='popup-row'>`;
    html += `<i class="fas fa-map-marker-alt popup-icon" style='color: ${signatureColor};'></i>`;
    html += `<span>${addrDisplay}</span>`;
    html += `</div>`;

    // 설명
    html += `<div class='popup-row'>`;
    html += `<i class="fas fa-info-circle popup-icon" style='color: ${signatureColor};'></i>`;
    html += `<span>${desc}</span>`;
    html += `</div>`;

    // 특징
    if (features) {
        html += `<div class='popup-row'>`;
        html += `<i class="fas fa-star popup-icon" style='color: ${signatureColor};'></i>`;
        html += `<span>${features}</span>`;
        html += `</div>`;
    }

    // 행사 정보 (2026년 2월 27일 ~ 3월 1일)
    if (place.event) {
        html += `<div class='popup-row' style='background: #fff9e6; padding: 8px; border-radius: 4px; margin-top: 8px;'>`;
        html += `<i class="fas fa-calendar-check popup-icon" style='color: ${signatureColor};'></i>`;
        html += `<span>${place.event}</span>`;
        html += `</div>`;
    }

    html += `</div>`;

    // 푸터 (지도 버튼)
    html += `<div class='popup-footer'>`;
    html += `<a href="${googleMapsUrl}" target="_blank" class="map-btn" style='border-color: ${signatureColor}; color: ${signatureColor};'>`;
    html += `<i class="fab fa-google" style='color: ${signatureColor};'></i> ${ui.googleMap}</a>`;
    html += `<a href="${naverMapsUrl}" target="_blank" class="map-btn" style='border-color: ${signatureColor}; color: ${signatureColor};'>`;
    html += `<i class="fas fa-map" style='color: ${signatureColor};'></i> ${ui.naverMap}</a>`;
    html += `</div>`;

    html += `</div>`;

    return html;
}

// 한글 이름 추출
function extractKorean(name) {
    const match = name.match(/^([^(]+)/);
    return match ? match[1].trim() : name;
}

// 영어 이름 추출
function extractEnglishName(name) {
    const match = name.match(/\(([^,)]+)/);
    return match ? match[1].trim() : '';
}


// ========================================
// 타일 변경
// ========================================
function changeTile(tileName) {
    // 기존 타일 제거
    map.removeLayer(tileLayers[currentTile]);

    // 새 타일 추가
    tileLayers[tileName].addTo(map);
    currentTile = tileName;

    console.log(`🗺️ 타일 변경: ${tileName}`);
}

// ========================================
// 필터링
// ========================================
function filterMarkers() {
    const checkboxes = document.querySelectorAll('.legend-checkbox');
    const visibleTypes = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            visibleTypes.push(checkbox.dataset.type);
        }
    });

    // 마커 필터링 (작은 점)
    allMarkers.forEach(({ marker, data }) => {
        if (visibleTypes.includes(data.type)) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });

    console.log(`🔍 필터링: ${visibleTypes.join(', ')}`);
}

// ========================================
// 경로 관련 함수
// ========================================
async function fetchRouteForDay(day) {
    const waypoints = DAY_ROUTES[day];
    if (!waypoints || waypoints.length < 2) return null;

    const coordStr = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
    const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        const data = await response.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
            const route = data.routes[0];
            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            const segments = route.legs.map((leg, i) => ({
                from: waypoints[i].name,
                to: waypoints[i + 1].name,
                distance: leg.distance,
                duration: leg.duration
            }));
            return { coords, segments, totalDistance: route.distance, totalDuration: route.duration };
        }
    } catch (error) {
        console.warn(`⚠️ ${day}일차 경로 API 실패, 직선 폴백:`, error.message);
    }

    return createFallbackRoute(waypoints);
}

function createFallbackRoute(waypoints) {
    const coords = waypoints.map(wp => [wp.lat, wp.lng]);
    const segments = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        const dist = haversineDistance(waypoints[i].lat, waypoints[i].lng, waypoints[i + 1].lat, waypoints[i + 1].lng);
        segments.push({
            from: waypoints[i].name,
            to: waypoints[i + 1].name,
            distance: dist,
            duration: dist * 0.12
        });
    }
    return {
        coords,
        segments,
        totalDistance: segments.reduce((sum, s) => sum + s.distance, 0),
        totalDuration: segments.reduce((sum, s) => sum + s.duration, 0)
    };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function drawRoute(day, coords) {
    if (routeLayers[day]) {
        map.removeLayer(routeLayers[day]);
    }
    routeLayers[day] = L.polyline(coords, {
        color: DAY_COLORS[day],
        weight: 2,
        opacity: 0.75,
        lineJoin: 'round',
        lineCap: 'round'
    }).addTo(map);
}

// ========================================
// 집결/해산 경로 공통 유틸
// ========================================
async function fetchFanRoute(waypoints, logLabel) {
    const coordStr = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
    const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await response.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
            const r = data.routes[0];
            return { coords: r.geometry.coordinates.map(c => [c[1], c[0]]), distance: r.distance, duration: r.duration };
        }
    } catch (error) {
        console.warn(`⚠️ ${logLabel} 경로 API 실패:`, error.message);
    }
    const coords = waypoints.map(wp => [wp.lat, wp.lng]);
    const dist = haversineDistance(waypoints[0].lat, waypoints[0].lng, waypoints[1].lat, waypoints[1].lng);
    return { coords, distance: dist, duration: dist * 0.12 };
}

// ========================================
// 집결 경로 (각 출발지 → 김가네토속식당)
// ========================================
async function fetchRouteForFamily(day, index) {
    const route = GATHERING_ROUTES[day]?.[index];
    if (!route) return null;
    return fetchFanRoute(route.waypoints, '집결');
}

function drawGatheringRoute(day, index, coords) {
    const key = `${day}-${index}`;
    if (gatheringLayers[key]) map.removeLayer(gatheringLayers[key]);
    gatheringLayers[key] = L.polyline(coords, {
        color: DAY_COLORS[day],
        weight: 2,
        opacity: 0.55,
        dashArray: '6, 8',
        lineJoin: 'round',
        lineCap: 'round'
    }).addTo(map);
}

function addDepartureMarker(waypoint, day) {
    const color = DAY_COLORS[day];
    L.marker([waypoint.lat, waypoint.lng], {
        icon: L.divIcon({
            className: 'custom-marker-icon',
            html: `
                <div class="departure-marker" style="border-color: ${color};">
                    <i class="fas fa-house" style="color: ${color};"></i>
                </div>
                <div class="marker-label" style="color: ${color};">${waypoint.name}</div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, -11]
        })
    }).addTo(map);
}

// ========================================
// 해산 경로 (일신명품한우 → 각 귀가지)
// ========================================
async function fetchRouteForDispersal(day, index) {
    const route = DISPERSAL_ROUTES[day]?.[index];
    if (!route) return null;
    return fetchFanRoute(route.waypoints, '해산');
}

function drawDispersalRoute(day, index, coords) {
    const key = `${day}-${index}`;
    if (dispersalLayers[key]) map.removeLayer(dispersalLayers[key]);
    dispersalLayers[key] = L.polyline(coords, {
        color: DAY_COLORS[day],
        weight: 2,
        opacity: 0.55,
        dashArray: '3, 7',
        lineJoin: 'round',
        lineCap: 'round'
    }).addTo(map);
}

function addArrivalMarker(waypoint, day) {
    const color = DAY_COLORS[day];
    L.marker([waypoint.lat, waypoint.lng], {
        icon: L.divIcon({
            className: 'custom-marker-icon',
            html: `
                <div class="arrival-marker" style="border-color: ${color};">
                    <i class="fas fa-house" style="color: ${color};"></i>
                </div>
                <div class="marker-label" style="color: ${color};">${waypoint.name}</div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, -11]
        })
    }).addTo(map);
}

async function loadAllRoutes() {
    const days = Object.keys(DAY_ROUTES).map(Number);
    await Promise.allSettled([
        ...days.map(async (day) => {
            const result = await fetchRouteForDay(day);
            if (result) {
                routeCache[day] = result;
                drawRoute(day, result.coords);
            }
        }),
        ...Object.keys(GATHERING_ROUTES).flatMap(dayKey => {
            const day = Number(dayKey);
            return GATHERING_ROUTES[day].map(async (route, index) => {
                const result = await fetchRouteForFamily(day, index);
                if (result) {
                    const key = `${day}-${index}`;
                    gatheringCache[key] = { ...result, ...route };
                    drawGatheringRoute(day, index, result.coords);
                    addDepartureMarker(route.waypoints[0], day);
                }
            });
        }),
        ...Object.keys(DISPERSAL_ROUTES).flatMap(dayKey => {
            const day = Number(dayKey);
            return DISPERSAL_ROUTES[day].map(async (route, index) => {
                const result = await fetchRouteForDispersal(day, index);
                if (result) {
                    const key = `${day}-${index}`;
                    dispersalCache[key] = { ...result, ...route };
                    drawDispersalRoute(day, index, result.coords);
                    addArrivalMarker(route.waypoints[route.waypoints.length - 1], day);
                }
            });
        })
    ]);
    populateRoutePanel();
    populateRemarksPanel();
    console.log('✅ 모든 경로 로드 완료');
}

function populateRoutePanel() {
    const container = document.getElementById('route-days-container');
    container.innerHTML = '';

    Object.keys(DAY_ROUTES).forEach(dayKey => {
        const day = Number(dayKey);
        const data = routeCache[day];
        if (!data) return;

        const dayDiv = document.createElement('div');
        dayDiv.className = 'route-day';

        const header = document.createElement('label');
        header.className = 'route-day-header';
        header.innerHTML = `
            <input type="checkbox" class="route-checkbox" data-day="${day}" checked>
            <span class="route-dot" style="background: ${DAY_COLORS[day]};"></span>
            <span class="route-day-title">${day}일차</span>
            <span class="route-day-summary">${formatDistance(data.totalDistance)} · ${formatDuration(data.totalDuration)}</span>
        `;

        const segmentsDiv = document.createElement('div');
        segmentsDiv.className = 'route-segments';

        // 1일차: 집결 경로 먼저 표시
        if (day === 1 && GATHERING_ROUTES[1]) {
            const gatherLabel = document.createElement('div');
            gatherLabel.className = 'route-segment-label';
            gatherLabel.textContent = '집결';
            segmentsDiv.appendChild(gatherLabel);

            GATHERING_ROUTES[1].forEach((route, index) => {
                const key = `1-${index}`;
                const gData = gatheringCache[key];
                const segDiv = document.createElement('div');
                segDiv.className = 'route-segment gathering-segment';
                segDiv.innerHTML = `
                    <span class="segment-order gathering-order"><i class="fas fa-house"></i></span>
                    <span class="segment-names">${route.family} → 김가네토속식당</span>
                    <span class="segment-info">${gData ? formatDistance(gData.distance) + ' · ' + formatDuration(gData.duration) : '-'}</span>
                `;
                segmentsDiv.appendChild(segDiv);
            });

            const mainLabel = document.createElement('div');
            mainLabel.className = 'route-segment-label';
            mainLabel.textContent = '본 경로';
            segmentsDiv.appendChild(mainLabel);
        }

        // 3일차: 본 경로 먼저, 해산 경로 나중
        if (day === 3 && DISPERSAL_ROUTES[3]) {
            const mainLabel = document.createElement('div');
            mainLabel.className = 'route-segment-label';
            mainLabel.textContent = '본 경로';
            segmentsDiv.appendChild(mainLabel);
        }

        data.segments.forEach((seg, i) => {
            const segDiv = document.createElement('div');
            segDiv.className = 'route-segment';
            segDiv.innerHTML = `
                <span class="segment-order">${i + 1}</span>
                <span class="segment-names">${seg.from} → ${seg.to}</span>
                <span class="segment-info">${formatDistance(seg.distance)} · ${formatDuration(seg.duration)}</span>
            `;
            segmentsDiv.appendChild(segDiv);
        });

        // 3일차: 해산 경로 표시
        if (day === 3 && DISPERSAL_ROUTES[3]) {
            const dispersalLabel = document.createElement('div');
            dispersalLabel.className = 'route-segment-label';
            dispersalLabel.textContent = '해산';
            segmentsDiv.appendChild(dispersalLabel);

            DISPERSAL_ROUTES[3].forEach((route, index) => {
                const key = `3-${index}`;
                const dData = dispersalCache[key];
                const segDiv = document.createElement('div');
                segDiv.className = 'route-segment dispersal-segment';
                segDiv.innerHTML = `
                    <span class="segment-order dispersal-order"><i class="fas fa-house"></i></span>
                    <span class="segment-names">일신명품한우 → ${route.family}</span>
                    <span class="segment-info">${dData ? formatDistance(dData.distance) + ' · ' + formatDuration(dData.duration) : '-'}</span>
                `;
                segmentsDiv.appendChild(segDiv);
            });
        }

        dayDiv.appendChild(header);
        dayDiv.appendChild(segmentsDiv);
        container.appendChild(dayDiv);
    });

    container.querySelectorAll('.route-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const day = Number(e.target.dataset.day);
            toggleRoute(day, e.target.checked);
        });
    });
}

function toggleRoute(day, visible) {
    if (visible && routeCache[day]) {
        if (!routeLayers[day] || !map.hasLayer(routeLayers[day])) {
            drawRoute(day, routeCache[day].coords);
        }
    } else if (routeLayers[day]) {
        map.removeLayer(routeLayers[day]);
    }

    // 집결 경로도 함께 토글
    if (GATHERING_ROUTES[day]) {
        GATHERING_ROUTES[day].forEach((_, index) => {
            const key = `${day}-${index}`;
            if (visible && gatheringCache[key]) {
                if (!gatheringLayers[key] || !map.hasLayer(gatheringLayers[key])) {
                    drawGatheringRoute(day, index, gatheringCache[key].coords);
                }
            } else if (gatheringLayers[key]) {
                map.removeLayer(gatheringLayers[key]);
            }
        });
    }

    // 해산 경로도 함께 토글
    if (DISPERSAL_ROUTES[day]) {
        DISPERSAL_ROUTES[day].forEach((_, index) => {
            const key = `${day}-${index}`;
            if (visible && dispersalCache[key]) {
                if (!dispersalLayers[key] || !map.hasLayer(dispersalLayers[key])) {
                    drawDispersalRoute(day, index, dispersalCache[key].coords);
                }
            } else if (dispersalLayers[key]) {
                map.removeLayer(dispersalLayers[key]);
            }
        });
    }
}

// ========================================
// 비고 패널 (팀별 이동거리 & 하이패스 추정)
// ========================================
function populateRemarksPanel() {
    const container = document.getElementById('route-remarks');
    if (!container) return;
    container.innerHTML = '';

    const families = ['나주팀', '광주팀', '광양팀', 'TW팀'];

    // 팀별 데이터 수집
    const dayRouteDist = [1, 2, 3].reduce((sum, day) => sum + (routeCache[day]?.totalDistance || 0), 0);
    const teamData = families.map((family, index) => {
        const gDist = gatheringCache[`1-${index}`]?.distance || 0;
        const dDist = dispersalCache[`3-${index}`]?.distance || 0;
        const totalDist = gDist + dDist;
        const totalTripDist = gDist + dayRouteDist + dDist;
        const totalToll = (Math.round(gDist / 1000 * 47 / 100) + Math.round(dDist / 1000 * 47 / 100)) * 100;
        return { family, gDist, dDist, totalDist, totalTripDist, totalToll };
    });

    // 그리드: 비고 | 나주팀 | 광주팀 | TW팀
    const grid = document.createElement('div');
    grid.className = 'remarks-grid';

    // 헤더 행
    ['비고', ...families].forEach(text => {
        const cell = document.createElement('div');
        cell.className = 'remarks-header';
        cell.textContent = text;
        grid.appendChild(cell);
    });

    // 데이터 행 정의
    const rows = [
        { label: '집결',    getValue: td => td.gDist     ? formatDistance(td.gDist)     : '-' },
        { label: '해산',    getValue: td => td.dDist     ? formatDistance(td.dDist)     : '-' },
        { label: '왕복',    getValue: td => td.totalDist ? formatDistance(td.totalDist) : '-' },
        { label: '하이패스', getValue: td => td.totalToll ? '~' + td.totalToll.toLocaleString() + '원' : '-', toll: true },
        { label: '총 거리',  getValue: td => td.totalTripDist ? formatDistance(td.totalTripDist) : '-' },
    ];

    rows.forEach(row => {
        const labelCell = document.createElement('div');
        labelCell.className = 'remarks-label';
        labelCell.textContent = row.label;
        grid.appendChild(labelCell);

        teamData.forEach(td => {
            const valueCell = document.createElement('div');
            valueCell.className = 'remarks-value' + (row.toll ? ' toll' : '');
            valueCell.textContent = row.getValue(td);
            grid.appendChild(valueCell);
        });
    });

    container.appendChild(grid);

    const note = document.createElement('div');
    note.className = 'remarks-note';
    note.textContent = '* 하이패스: 고속도로 1종 47원/km 추정 | 총 거리: 집결+공동구간+해산';
    container.appendChild(note);
}

function formatDistance(meters) {
    if (meters >= 1000) {
        return (meters / 1000).toFixed(1) + 'km';
    }
    return Math.round(meters) + 'm';
}

function formatDuration(seconds) {
    const minutes = Math.round(seconds / 60);
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    }
    return `${minutes}분`;
}

// ========================================
// 내 위치 찾기
// ========================================
function findMyLocation() {
    if (!navigator.geolocation) {
        alert('위치 서비스를 사용할 수 없습니다.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);

            L.marker([latitude, longitude], {
                icon: L.divIcon({
                    html: '<div class="my-location"><i class="fas fa-location-dot"></i></div>',
                    className: 'my-location-wrapper',
                    iconSize: [24, 24]
                })
            }).addTo(map).bindPopup('현재 위치').openPopup();

            console.log(`📍 현재 위치: ${latitude}, ${longitude}`);
        },
        (error) => {
            console.error('위치 오류:', error);
            alert('위치를 찾을 수 없습니다.');
        }
    );
}

// ========================================
// 이벤트 리스너
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 지도 초기화
    initMap();

    // 데이터 로드
    loadData();

    // 타일 선택 콤보박스
    document.getElementById('tile-select').addEventListener('change', (e) => {
        const tileName = e.target.value;
        changeTile(tileName);
    });

    // 내 위치 찾기 버튼
    document.getElementById('locate-btn').addEventListener('click', findMyLocation);

    // 경로 패널 토글
    document.getElementById('route-panel-toggle').addEventListener('click', () => {
        document.getElementById('route-panel').classList.toggle('collapsed');
    });

    // 타임라인 닫기
    document.querySelector('.timeline-close')?.addEventListener('click', () => {
        document.querySelector('.mobile-timeline').classList.toggle('hidden');
    });

    // 시트 닫기
    document.querySelector('.sheet-close')?.addEventListener('click', () => {
        document.getElementById('bottom-sheet').classList.remove('active');
    });

    // 팝업 닫기
    document.querySelector('.popup-close')?.addEventListener('click', () => {
        document.getElementById('itinerary-popup').classList.remove('active');
    });

    // ===== UI 언어 초기화 =====
    (function() {
        const lang = TravelLang.getLang();
        const ui = TravelLang.getUI(lang);
        const types = ui.types;
        // 범례 텍스트
        const legA = document.getElementById('leg-attraction');
        const legF = document.getElementById('leg-food');
        const legH = document.getElementById('leg-hotel');
        if (legA) legA.textContent = types.attraction || types.attractions || '관광지';
        if (legF) legF.textContent = types.restaurants || '맛집';
        if (legH) legH.textContent = types.hotels || '숙소';
        // 타일 패널 라벨
        const tileSpan = document.getElementById('tile-label-span');
        if (tileSpan && ui.tileLabel) tileSpan.textContent = ui.tileLabel;
        // 타일 옵션 텍스트
        if (ui.tileOptions) {
            document.querySelectorAll('#tile-select option').forEach(o => {
                const key = o.getAttribute('data-tile') || o.value;
                if (ui.tileOptions[key]) o.textContent = ui.tileOptions[key];
            });
        }
        // 메인으로 버튼
        const backLink = document.querySelector('a[href="index.html"]');
        if (backLink) {
            const icon = backLink.querySelector('i');
            backLink.textContent = ' ' + ui.backMain;
            if (icon) backLink.prepend(icon);
        }
    })();
});

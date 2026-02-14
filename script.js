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

    // 마커 클러스터 그룹 생성
    markerCluster = L.markerClusterGroup({
        maxClusterRadius: 50,        // 클러스터링 반경
        spiderfyOnMaxZoom: true,     // 최대 줌에서 마커 펼치기
        showCoverageOnHover: false,  // hover 시 범위 표시 안함
        zoomToBoundsOnClick: true,   // 클릭 시 해당 영역으로 줌
        disableClusteringAtZoom: 13  // 줌 레벨 13부터는 클러스터링 해제
    });

    // 줌 레벨에 따라 마커 크기 조절
    map.on('zoomend', updateMarkerSize);

    console.log('✅ 지도 초기화 완료 (Positron + 마커 클러스터링)');
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
    markerCluster.clearLayers();
    allMarkers = [];

    data.forEach(place => {
        // 마커 아이콘 생성
        const icon = getMarkerIcon(place.type);

        // 마커 생성
        const marker = L.marker([place.latitude, place.longitude], { icon })
            .bindPopup(createPopupContent(place));

        // 마커를 클러스터 그룹에 추가
        markerCluster.addLayer(marker);

        // 마커 저장
        allMarkers.push({
            marker: marker,
            data: place
        });
    });

    // 클러스터 그룹을 지도에 추가
    map.addLayer(markerCluster);

    // 초기 마커 크기 설정
    updateMarkerSize();

    console.log(`✅ ${allMarkers.length}개 마커 생성 완료 (클러스터링 활성화)`);
}

// ========================================
// 줌 레벨에 따라 마커 크기 조절
// ========================================
function updateMarkerSize() {
    const currentZoom = map.getZoom();

    allMarkers.forEach(({ marker }) => {
        const iconElement = marker.getElement();
        if (iconElement) {
            const circleMarker = iconElement.querySelector('.circle-marker');
            if (circleMarker) {
                // 줌 13-14: 작은 점 5px
                // 줌 15 이상: 일반 마커 25px
                if (currentZoom >= 13 && currentZoom < 15) {
                    circleMarker.classList.add('small-dot');
                } else {
                    circleMarker.classList.remove('small-dot');
                }
            }
        }
    });
}

// ========================================
// 마커 아이콘 생성 (KRC-Global 스타일)
// ========================================
function getMarkerIcon(type) {
    const iconMap = {
        attractions: 'fa-landmark',
        restaurants: 'fa-utensils',
        hotels: 'fa-hotel',
        airports: 'fa-plane'
    };

    return L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="circle-marker ${type}-bg"><i class="fas ${iconMap[type] || 'fa-landmark'}"></i></div>`,
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

    // 이름 추출
    const koreanName = extractKorean(place.name);
    const englishName = extractEnglishName(place.name);

    const typeLabel = getTypeLabel(place.type || 'attractions');

    // 특징 태그 (쉼표로 구분)
    const features = place.features ? place.features.join(', ') : '';

    // 지도 링크
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(koreanName)}&query=${place.latitude},${place.longitude}`;
    const naverMapsUrl = `https://map.naver.com/v5/search/${encodeURIComponent(koreanName)}`;

    let html = `<div class='custom-popup' style='border-color: ${signatureColor};'>`;

    // 닫기 버튼
    html += `<button class='popup-close-btn' style='color: ${signatureColor};'><i class="fas fa-times"></i></button>`;

    // 헤더 (한글명 + 영문명)
    html += `<div class='popup-header' style='border-bottom-color: ${signatureColor};'>`;
    html += `<h3 class='popup-title' style='color: ${signatureColor};'>${koreanName}</h3>`;
    if (englishName) {
        html += `<p class='popup-subtitle' style='color: ${signatureColor};'>${englishName}</p>`;
    }
    html += `<span class='type-badge' style='background: ${signatureColor};'>${typeLabel}</span>`;
    html += `</div>`;

    // 본문
    html += `<div class='popup-body'>`;

    // 주소
    html += `<div class='popup-row'>`;
    html += `<i class="fas fa-map-marker-alt popup-icon" style='color: ${signatureColor};'></i>`;
    html += `<span>${place.address}</span>`;
    html += `</div>`;

    // 설명
    html += `<div class='popup-row'>`;
    html += `<i class="fas fa-info-circle popup-icon" style='color: ${signatureColor};'></i>`;
    html += `<span>${place.description}</span>`;
    html += `</div>`;

    // 특징
    if (features) {
        html += `<div class='popup-row'>`;
        html += `<i class="fas fa-star popup-icon" style='color: ${signatureColor};'></i>`;
        html += `<span>${features}</span>`;
        html += `</div>`;
    }

    html += `</div>`;

    // 푸터 (지도 버튼)
    html += `<div class='popup-footer'>`;
    html += `<a href="${googleMapsUrl}" target="_blank" class="map-btn" style='border-color: ${signatureColor}; color: ${signatureColor};'>`;
    html += `<i class="fab fa-google" style='color: ${signatureColor};'></i> 구글지도</a>`;
    html += `<a href="${naverMapsUrl}" target="_blank" class="map-btn" style='border-color: ${signatureColor}; color: ${signatureColor};'>`;
    html += `<i class="fas fa-map" style='color: ${signatureColor};'></i> 네이버지도</a>`;
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

// 타입 라벨
function getTypeLabel(type) {
    const labels = {
        attractions: '관광지',
        restaurants: '맛집',
        hotels: '숙소',
        airports: '공항'
    };
    return labels[type] || '관광지';
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

    // 타일 선택 버튼
    document.querySelectorAll('.tile-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tile-option').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const tileName = e.currentTarget.dataset.tile;
            changeTile(tileName);
        });
    });

    // 범례 체크박스
    document.querySelectorAll('.legend-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterMarkers);
    });

    // 내 위치 찾기 버튼
    document.getElementById('locate-btn').addEventListener('click', findMyLocation);

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
});

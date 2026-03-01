// TravelLang - 공유 다국어 유틸리티
(function(w) {
    const UI = {
        ko: {
            googleMap: '구글지도',
            naverMap: '네이버지도',
            backMain: '메인으로',
            types: {
                attractions: '관광지', restaurants: '맛집', hotels: '숙소', airports: '공항',
                makchang: '막창', bulgogi: '불고기', mackerel: '고등어쌈밥',
                crab: '간장게장', attraction: '관광지'
            }
        },
        en: {
            googleMap: 'Google Maps',
            naverMap: 'Naver Map',
            backMain: 'Home',
            types: {
                attractions: 'Attraction', restaurants: 'Restaurant', hotels: 'Hotel', airports: 'Airport',
                makchang: 'BBQ Intestine', bulgogi: 'Grilled Pork', mackerel: 'Mackerel Rice',
                crab: 'Soy Crab', attraction: 'Attraction'
            }
        },
        zh: {
            googleMap: '谷歌地图',
            naverMap: 'Naver地图',
            backMain: '返回主页',
            types: {
                attractions: '景点', restaurants: '餐厅', hotels: '酒店', airports: '机场',
                makchang: '烤大肠', bulgogi: '烤肉', mackerel: '炖鲭鱼',
                crab: '酱蟹', attraction: '景点'
            }
        },
        ja: {
            googleMap: 'Googleマップ',
            naverMap: 'Naverマップ',
            backMain: 'メインへ',
            types: {
                attractions: '観光地', restaurants: 'グルメ', hotels: 'ホテル', airports: '空港',
                makchang: '焼き大腸', bulgogi: '焼き肉', mackerel: 'サバ包み飯',
                crab: '醤油蟹', attraction: '観光地'
            }
        },
        es: {
            googleMap: 'Google Maps',
            naverMap: 'Naver Maps',
            backMain: 'Inicio',
            types: {
                attractions: 'Atracción', restaurants: 'Restaurante', hotels: 'Hotel', airports: 'Aeropuerto',
                makchang: 'BBQ Intestino', bulgogi: 'Cerdo a la Parrilla', mackerel: 'Arroz con Caballa',
                crab: 'Cangrejo en Soja', attraction: 'Atracción'
            }
        }
    };

    function getLang() { return localStorage.getItem('travellang') || 'ko'; }
    function setLang(l) { localStorage.setItem('travellang', l); }

    function getName(place, lang) {
        lang = lang || getLang();
        if (place.names && place.names[lang]) return place.names[lang];
        // 개별 필드 fallback
        if (lang === 'en' && place.nameEn) return place.nameEn;
        if (lang === 'zh' && place.nameZh) return place.nameZh;
        if (lang === 'ja' && place.nameJa) return place.nameJa;
        if (lang === 'es' && place.nameEs) return place.nameEs;
        // 최종 fallback: 한국어 이름
        return (place.names && place.names.ko) || (place.name && place.name.split(' (')[0].trim()) || place.name || '';
    }

    function getDesc(place, lang) {
        lang = lang || getLang();
        if (place.descs && place.descs[lang]) return place.descs[lang];
        if (lang === 'en' && place.descEn) return place.descEn;
        if (lang === 'zh' && place.descZh) return place.descZh;
        if (lang === 'ja' && place.descJa) return place.descJa;
        if (lang === 'es' && place.descEs) return place.descEs;
        return (place.descs && place.descs.ko) || place.description || place.desc || '';
    }

    function getTypeLabel(type, lang) {
        lang = lang || getLang();
        return ((UI[lang] || UI.ko).types[type]) || type;
    }

    function getUI(lang) {
        lang = lang || getLang();
        return UI[lang] || UI.ko;
    }

    // 언어 플래그 데이터
    const FLAGS = {
        ko: { flag: '🇰🇷', label: '한국어' },
        en: { flag: '🇺🇸', label: 'EN' },
        zh: { flag: '🇨🇳', label: '中文' },
        ja: { flag: '🇯🇵', label: '日本語' },
        es: { flag: '🇪🇸', label: 'ES' }
    };

    w.TravelLang = { getLang, setLang, getName, getDesc, getTypeLabel, getUI, FLAGS, UI };
})(window);

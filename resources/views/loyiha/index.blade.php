@extends('layouts.app')

@section('title', 'Kriminologiya tadqiqot instituti — Loyihalar xaritasi (2026-yil)')

@section('content')
<div class="presentation-screen">

    <div class="map-bg-pattern"></div>

    @include('components.header')

    <div class="map-wrapper">

        {{-- Loyihalar umumiy statistikasi paneli (chap tomon) --}}
        <div class="country-stats-panel" id="country-stats-panel">
            <div class="country-stats-header">
                <div class="stats-header-titles">
                    <h2>O'zbekiston Respublikasi</h2>
                    <p>Kriminologik ilmiy-tadqiqot loyihalari — {{ $overall['year'] ?? 2026 }}-yil</p>
                </div>
                <button type="button" class="panel-close-btn" id="close-country-panel" aria-label="Yopish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {{-- Big count --}}
            <div class="total-crimes-big" style="background: linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 100%); border-color: rgba(16,185,129,0.35);">
                <span class="total-number" style="color: #34D399;">{{ $overall['total_projects'] ?? 14 }} ta</span>
                <span class="total-label" style="color: var(--text-light);">Hududiy ilmiy-amaliy loyihalar</span>
            </div>

            <div class="country-stat-cards">
                <div class="stat-card-dark" style="border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08);">
                    <div class="stat-value" style="color: #10B981; display:flex; align-items:center; justify-content:center; gap:6px;">
                        <span>✓</span> <span>{{ $overall['completed_count'] ?? 7 }} ta</span>
                    </div>
                    <div class="stat-label">Bajarilgan loyihalar</div>
                </div>
                <div class="stat-card-dark" style="border-color: rgba(56,189,248,0.4); background: rgba(56,189,248,0.08);">
                    <div class="stat-value" style="color: #38BDF8; display:flex; align-items:center; justify-content:center; gap:6px;">
                        <span>🔍</span> <span>{{ $overall['in_progress_count'] ?? 7 }} ta</span>
                    </div>
                    <div class="stat-label">Bajarilayotgan loyihalar</div>
                </div>
                <div class="stat-card-dark">
                    <div class="stat-value" style="color: #F59E0B;">{{ $overall['completed_pct'] ?? 50 }}%</div>
                    <div class="stat-label">Bajarilish salmog'i</div>
                </div>
            </div>

            {{-- Filter tabs --}}
            <div class="loyiha-filter-tabs">
                <button type="button" class="loyiha-tab-btn active" data-filter="all">
                    Barchasi (14)
                </button>
                <button type="button" class="loyiha-tab-btn" data-filter="completed">
                    ✓ Bajarilgan (7)
                </button>
                <button type="button" class="loyiha-tab-btn" data-filter="in_progress">
                    🔍 Jarayonda (7)
                </button>
            </div>

            {{-- Quick list of regions --}}
            <div class="summary-section-title" style="margin-top: 12px;">
                <span>Hududiy loyihalar ro'yxati</span>
                <span class="badge badge-loyiha-count">14 hudud</span>
            </div>

            <div class="regions-ranking-list loyiha-regions-list" id="loyiha-regions-list" style="max-height: 380px; overflow-y: auto;">
                @foreach($regionsLoyiha as $slug => $item)
                <div class="region-rank-item loyiha-item-row" data-region="{{ $slug }}" data-status="{{ $item['status'] }}" style="cursor: pointer;">
                    <span class="loyiha-badge-icon badge-icon-{{ $item['status'] }}">
                        {{ $item['badge_icon'] }}
                    </span>
                    <div style="flex: 1; min-width: 0;">
                        <div class="rank-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600;">{{ $item['name'] }}</div>
                        <div style="font-size: 11px; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $item['project_title'] }}</div>
                    </div>
                    <span class="badge badge-status-{{ $item['status'] }}" style="font-size: 11px; padding: 3px 7px; border-radius: 6px;">
                        {{ $item['status'] === 'completed' ? 'Bajarilgan' : 'Jarayonda' }}
                    </span>
                </div>
                @endforeach
            </div>

            {{-- Muassasa eslatmasi --}}
            <div class="loyiha-notice-card">
                <strong>Eslatma:</strong> O'zbekiston Respublikasi Kriminologiya tadqiqot instituti tomonidan tasdiqlangan ilmiy-amaliy loyihalar rejasi asosida shakllantirilgan.
            </div>

        </div>

        {{-- Map container --}}
        <div class="map-container loyiha-map-canvas" id="map-container">

            {{-- Sarlavha banner --}}
            <div class="map-top-banner">
                <h1 class="map-main-title">Oʻzbekiston Respublikasining Kriminologik loyihalar xaritasi</h1>
                @include('components.pipeline-flow')
            </div>

            {{-- Zoom controls --}}
            <div class="map-controls">
                <button type="button" class="map-btn" id="zoom-in" title="Kattalashtirish" aria-label="Kattalashtirish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button type="button" class="map-btn" id="zoom-out" title="Kichiklashtirish" aria-label="Kichiklashtirish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button type="button" class="map-btn" id="reset-view" title="Dastlabki holat" aria-label="Dastlabki holat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
            </div>

            {{-- Loyihalar afsonasi (Legend) --}}
            <div class="map-legend loyiha-legend">
                <div class="legend-title">
                    Ilmiy loyihalar holati
                </div>
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-status-badge badge-completed">✓</span>
                        <div>
                            <span class="legend-item-title title-completed">Bajarilgan loyihalar (7 ta)</span>
                            <div class="legend-item-desc">To'q yashil hudud va ✓ belgisi</div>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="legend-status-badge badge-progress">🔍</span>
                        <div>
                            <span class="legend-item-title title-progress">Bajarilayotgan loyihalar (7 ta)</span>
                            <div class="legend-item-desc">Och musaffo yashil va 🔍 belgisi</div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- SVG Map --}}
            @include('components.map-loyiha')

            {{-- Viloyat tumanlari interaktiv xaritasi (Viloyat tanlanganda asosiyga chiqadi) --}}
            <div id="district-map-container" class="district-map-container" style="display:none;">
                <div class="district-map-header">
                    <button type="button" class="back-to-country-btn" id="btn-back-to-country" title="O'zbekiston xaritasiga qaytish">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>O'zbekiston xaritasi</span>
                    </button>
                    <div class="district-map-title-wrap">
                        <h3 class="district-map-title" id="district-map-region-name">Viloyat</h3>
                        <span class="district-map-subtitle" id="district-map-subtitle">Tumanlar kesimida ilmiy loyihalar xaritasi</span>
                    </div>
                    <div class="district-map-badge" id="district-map-count-badge">
                        Tumanlar
                    </div>
                </div>

                <div class="district-svg-stage" id="district-svg-stage">
                    {{-- Dinamik tumanlar SVG xaritasi --}}
                </div>

                {{-- Navoiy viloyati tadqiqot hisoboti muqovasi (faqat rasmning o'zi, kattaroq, orqa foni o'ynab turuvchi) --}}
                <div class="navoi-report-cover-badge" id="navoi-report-cover-badge" style="display:none;" onclick="if(window.openNavoiSlidesModal) window.openNavoiSlidesModal(0);" role="button" tabindex="0" title="Navoiy viloyati tadqiqot hisoboti va taqdimot slaydlarini ko'rish uchun bosing">
                    <div class="navoi-ambient-glow"></div>
                    <div class="navoi-cover-book-wrapper">
                        <img src="/img/rasm.jpg" alt="Navoiy viloyati jinoyatchiligini tadqiq qilish hisoboti muqovasi" class="navoi-cover-full-img">
                        <div class="navoi-cover-floating-tag">
                            <span class="navoi-tag-dot"></span>
                            <span>3 ta slayd</span>
                        </div>
                    </div>
                </div>

                <div class="district-map-hint">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Tumanni bosib, unga tegishli ilmiy loyiha va tadqiqot tafsilotlari bilan tanishing</span>
                </div>
            </div>

            {{-- Map tooltip --}}
            <div class="map-tooltip" id="map-tooltip" role="tooltip" aria-hidden="true" style="display:none;">
                <div class="tooltip-name" id="tooltip-name"></div>
                <div class="tooltip-stat" id="tooltip-stat"></div>
            </div>

        </div>

        {{-- O'ng tomon: Tanlangan hudud loyihasi tafsilotlari paneli --}}
        <div class="region-info-panel" id="region-info-panel" aria-hidden="true">
            <div class="panel-header">
                <div class="region-titles">
                    <span class="region-type-badge" id="panel-region-type">Ilmiy loyiha</span>
                    <h2 id="panel-region-name">Hududni tanlang</h2>
                    <p id="panel-region-capital" class="region-capital-text"></p>
                </div>
                <button type="button" class="panel-close-btn" id="close-panel" aria-label="Yopish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="panel-body" id="panel-body">
                <div class="panel-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                        <line x1="8" y1="2" x2="8" y2="18"/>
                        <line x1="16" y1="6" x2="16" y2="22"/>
                    </svg>
                    <p>Loyihani ko'rish uchun xaritadagi istalgan hudud yoki belgi ustiga bosing</p>
                </div>
            </div>
        </div>

        @include('components.back-button')

    </div>

</div>

{{-- To'liq loyiha pasporti modali --}}
<div class="modal-overlay" id="loyiha-modal" style="display:none;" role="dialog" aria-modal="true">
    <div class="modal-window" style="max-width: 820px;">
        <div class="modal-header">
            <div>
                <span class="badge" id="modal-status-badge" style="margin-bottom:6px; display:inline-block;"></span>
                <h3 id="modal-title" style="margin:0; font-size:18px;">Loyiha pasporti</h3>
            </div>
            <button type="button" class="modal-close" id="close-modal">&times;</button>
        </div>
        <div class="modal-body" id="modal-body" style="padding:20px; max-height:70vh; overflow-y:auto;">
            <!-- JS renders dynamic project passport -->
        </div>
        <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:14px 20px; border-top:1px solid rgba(255,255,255,0.1);">
            <div id="modal-footer-pdf-action"></div>
            <button type="button" class="btn btn-secondary" id="modal-close-btn" style="padding:8px 18px; border-radius:8px; background:rgba(255,255,255,0.1); color:#fff; border:none; cursor:pointer;">Yopish</button>
        </div>
    </div>
</div>

{{-- Kreativ PDF Taqdimot / Slayd Ko'rish Modali --}}
<div class="modal-overlay pdf-modal-overlay" id="loyiha-pdf-modal" style="display:none;" role="dialog" aria-modal="true">
    <div class="modal-window pdf-modal-window" id="pdf-modal-window">
        <div class="pdf-modal-header">
            <div class="pdf-header-meta">
                <div class="pdf-badge-glow" id="pdf-badge-glow">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span id="pdf-header-mode-text">Slayd</span>
                </div>
                <div style="min-width:0;">
                    <h3 id="pdf-modal-title" class="pdf-modal-title">Ilmiy loyiha hisoboti</h3>
                    <div class="pdf-modal-sub" id="pdf-modal-sub">
                        <span class="pdf-tag" id="pdf-tag-number">№ 1628-son</span>
                        <span class="pdf-tag status-slide" id="pdf-slide-counter-badge">
                            <span style="color:#10B981; font-weight:800;">●</span> Slayd <span id="pdf-slide-curr">1</span> / <span id="pdf-slide-total">15</span>
                        </span>
                        <span class="pdf-tag" id="pdf-tag-size">6.1 MB</span>
                        <span class="pdf-tag status-success">✓ Rasmiy hujjat</span>
                    </div>
                </div>
            </div>

            {{-- Quick Slide Navigation Center --}}
            <div class="pdf-slide-nav-controls" id="pdf-slide-nav-controls">
                <button type="button" class="pdf-nav-ctrl-btn" id="pdf-btn-prev-slide" title="Oldingi slayd (←)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span>Oldingi</span>
                </button>
                <div class="pdf-slide-num-pill">
                    <span id="pdf-pill-curr">1</span> / <span id="pdf-pill-total">15</span>
                </div>
                <button type="button" class="pdf-nav-ctrl-btn" id="pdf-btn-next-slide" title="Keyingi slayd (→ / Space)">
                    <span>Keyingi</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                <button type="button" class="pdf-autoplay-btn" id="pdf-btn-autoplay" title="Avtomatik slayd-shou (har 4 soniyada)">
                    <svg class="icon-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <svg class="icon-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:none;">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    <span>Slayd-shou</span>
                </button>
            </div>

            <div class="pdf-modal-actions">
                <button type="button" class="pdf-action-btn pdf-mode-toggle-btn" id="pdf-btn-toggle-mode" title="Slayd yoki To'liq hujjat rejimini almashtirish">
                    <svg class="icon-mode-doc" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span id="pdf-mode-label">Hujjat ko'rinishi</span>
                </button>
                <a href="/loyiha/hujjat/pdf/download" class="pdf-action-btn pdf-btn-download" id="pdf-btn-download" title="PDF faylni yuklab olish">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Yuklab olish</span>
                </a>
                <button type="button" class="pdf-action-btn" id="pdf-btn-fullscreen" title="To'liq ekranga yoyish">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                </button>
                <button type="button" class="modal-close pdf-modal-close" id="close-pdf-modal" title="Yopish">&times;</button>
            </div>
        </div>

        <div class="pdf-modal-body">
            {{-- Top Slide Progress indicator --}}
            <div class="pdf-slide-progress-container">
                <div class="pdf-slide-progress-bar" id="pdf-slide-progress" style="width: 6.66%;"></div>
            </div>

            {{-- 1. Slayd Taqdimot Maydoni (Asosiy) --}}
            <div class="pdf-slide-stage" id="pdf-slide-stage">
                <button type="button" class="pdf-slide-nav-floating pdf-slide-prev" id="pdf-prev-slide-float" aria-label="Oldingi slayd">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div class="pdf-slide-canvas-card" id="pdf-slide-canvas-card">
                    <canvas id="pdf-slide-canvas" class="pdf-slide-canvas"></canvas>
                    <div class="pdf-slide-loading-overlay" id="pdf-slide-loading-overlay">
                        <div class="pdf-spinner"></div>
                        <p id="pdf-slide-loading-text">Slayd yuklanmoqda...</p>
                    </div>
                </div>

                <button type="button" class="pdf-slide-nav-floating pdf-slide-next" id="pdf-next-slide-float" aria-label="Keyingi slayd">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            {{-- 2. Hujjat Iframe Maydoni (Rejim almashtirilganda ochiladi) --}}
            <div class="pdf-doc-container" id="pdf-doc-container" style="display:none;">
                <iframe id="pdf-frame" class="pdf-frame" src="about:blank" title="Loyiha hujjati"></iframe>
            </div>

            {{-- 3. Pastki Slaydlar Lentasi (Thumbnails Reel) --}}
            <div class="pdf-slides-reel-wrapper" id="pdf-slides-reel-wrapper">
                <div class="pdf-reel-header">
                    <span class="pdf-reel-title">Taqdimot slaydlari:</span>
                    <span class="pdf-reel-hint">Istalgan slaydni tanlang yoki klaviaturadagi ← → tugmalaridan foydalaning</span>
                </div>
                <div class="pdf-slides-strip" id="pdf-slides-strip">
                    <!-- Slayd miniatyuralari JS orqali joylanadi -->
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Dala tadqiqoti fotogalereyasi Lightbox modali --}}
<div class="modal-overlay gallery-modal-overlay" id="loyiha-gallery-modal" style="display:none;" role="dialog" aria-modal="true">
    <div class="gallery-modal-window">
        <div class="gallery-modal-header">
            <div class="gallery-header-left">
                <span class="gallery-badge" id="gallery-category-badge">Profilaktika xizmati</span>
                <h3 id="gallery-photo-title" class="gallery-photo-title">Manzil nomi</h3>
            </div>
            <div class="gallery-header-right">
                <span class="gallery-counter" id="gallery-counter">1 / 4</span>
                <button type="button" class="gallery-close-btn" id="close-gallery-modal" title="Yopish">&times;</button>
            </div>
        </div>

        <div class="gallery-stage">
            <button type="button" class="gallery-nav-btn gallery-prev-btn" id="gallery-prev-btn" aria-label="Oldingi rasm">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <div class="gallery-image-wrap">
                <img id="gallery-current-image" src="" alt="Dala tadqiqoti fotosurati" class="gallery-main-image">
            </div>

            <button type="button" class="gallery-nav-btn gallery-next-btn" id="gallery-next-btn" aria-label="Keyingi rasm">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>

        <div class="gallery-footer-info">
            <div class="gallery-meta-row">
                <div class="gallery-meta-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span id="gallery-address">Manzil</span>
                </div>
                <div class="gallery-meta-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span id="gallery-date">Sana</span>
                </div>
            </div>
            <p id="gallery-caption" class="gallery-caption">Tadqiqot tafsilotlari</p>

            <div class="gallery-thumbs-row" id="gallery-thumbs-row">
                <!-- Thumbs injected by JS -->
            </div>
        </div>
    </div>
</div>

{{-- Navoiy viloyati ilmiy tahlil va takliflar taqdimot slaydlari Creative Modali (1.jpg, 2.jpg, 3.jpg) --}}
<div class="modal-overlay navoi-slides-modal-overlay" id="navoi-slides-modal" style="display:none;" role="dialog" aria-modal="true">
    <div class="modal-window navoi-slides-window" id="navoi-slides-window">
        <div class="navoi-modal-header">
            <div class="navoi-modal-meta">
                <div class="navoi-header-badge">
                    <img src="/logo/photo_2025-09-03_15-19-21.jpg" alt="Logo" class="navoi-header-logo">
                    <span>Kriminologiya tadqiqot instituti</span>
                </div>
                <div class="navoi-header-titles">
                    <h3 class="navoi-modal-title" id="navoi-slide-modal-title">Navoiy viloyati jinoyatchiligini tadqiq qilish</h3>
                    <div class="navoi-modal-subtitle" id="navoi-slide-modal-desc">Ilmiy-amaliy tadqiqot hisoboti va ilmiy tahliliy taqdimoti</div>
                </div>
            </div>

            <div class="navoi-modal-controls">
                <div class="navoi-slide-counter-pill" id="navoi-slide-counter-pill">
                    Slayd <span id="navoi-current-slide-idx">1</span> / <span id="navoi-total-slides">3</span>
                </div>
                <button type="button" class="navoi-ctrl-btn" id="navoi-btn-prev" title="Oldingi slayd (←)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span>Oldingi</span>
                </button>
                <button type="button" class="navoi-ctrl-btn" id="navoi-btn-next" title="Keyingi slayd (→ / Space)">
                    <span>Keyingi</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                <button type="button" class="navoi-ctrl-btn navoi-autoplay-btn" id="navoi-btn-autoplay" title="Avtomatik slayd-shou (har 5 soniyada)">
                    <svg class="icon-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <svg class="icon-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:none;">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    <span>Slayd-shou</span>
                </button>
                <button type="button" class="navoi-ctrl-btn" id="navoi-btn-fullscreen" title="To'liq ekranga yoyish">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                </button>
                <button type="button" class="modal-close navoi-modal-close" id="close-navoi-slides-modal" title="Yopish">&times;</button>
            </div>
        </div>

        <div class="navoi-modal-body">
            {{-- Slide Progress Bar --}}
            <div class="navoi-progress-bar-wrap">
                <div class="navoi-progress-bar" id="navoi-slide-progress" style="width: 33.33%;"></div>
            </div>

            {{-- Main Slide Presentation Stage --}}
            <div class="navoi-slide-stage" id="navoi-slide-stage">
                <button type="button" class="navoi-floating-arrow navoi-arrow-prev" id="navoi-float-prev" aria-label="Oldingi slayd">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div class="navoi-slide-frame" id="navoi-slide-frame">
                    <img id="navoi-active-slide-img" src="/img/1.jpg" alt="Navoiy slayd 1" class="navoi-slide-img">
                    <div class="navoi-slide-caption-bar" id="navoi-slide-caption-bar">
                        <span class="navoi-caption-tag" id="navoi-caption-tag">1-Slayd</span>
                        <div class="navoi-caption-text" id="navoi-caption-text">Respublika bo‘yicha jinoyatlar turlari (2025 yilda qayd etilgan jinoyatlar — Navoiy viloyati tahlili)</div>
                    </div>
                </div>

                <button type="button" class="navoi-floating-arrow navoi-arrow-next" id="navoi-float-next" aria-label="Keyingi slayd">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            {{-- Bottom Thumbnails Reel --}}
            <div class="navoi-thumbs-reel-wrapper">
                <div class="navoi-thumbs-reel-header">
                    <span>Taqdimot slaydlari:</span>
                    <span class="navoi-reel-hint">Slaydni tanlang yoki klaviaturadagi ← → tugmalaridan foydalaning</span>
                </div>
                <div class="navoi-thumbs-reel" id="navoi-thumbs-reel">
                    <div class="navoi-thumb-item active" data-index="0">
                        <div class="navoi-thumb-img-box">
                            <img src="/img/1.jpg" alt="Slayd 1">
                            <span class="navoi-thumb-idx">1</span>
                        </div>
                        <div class="navoi-thumb-title">Jinoyatlar turlari</div>
                    </div>
                    <div class="navoi-thumb-item" data-index="1">
                        <div class="navoi-thumb-img-box">
                            <img src="/img/2.jpg" alt="Slayd 2">
                            <span class="navoi-thumb-idx">2</span>
                        </div>
                        <div class="navoi-thumb-title">Jinoyatchilik omillari</div>
                    </div>
                    <div class="navoi-thumb-item" data-index="2">
                        <div class="navoi-thumb-img-box">
                            <img src="/img/3.jpg" alt="Slayd 3">
                            <span class="navoi-thumb-idx">3</span>
                        </div>
                        <div class="navoi-thumb-title">11 ta ilmiy taklif</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    window.LOYIHALAR_DATA = @json($regionsLoyiha);
    window.LOYIHALAR_OVERALL = @json($overall);
    window.REGIONS_DATA = @json($regionsData);
</script>
<script src="{{ asset('assets/js/pdf.min.js') }}"></script>
<script src="{{ asset('assets/js/loyiha.js') }}?v={{ file_exists(public_path('assets/js/loyiha.js')) ? filemtime(public_path('assets/js/loyiha.js')) : '1.0' }}"></script>
@endsection

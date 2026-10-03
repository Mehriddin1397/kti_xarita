/**
 * Kriminologiya Tadqiqot Instituti
 * O'zbekiston Respublikasining Loyihalar Xaritasi - Interaktiv Skript
 * 2026-yil
 */

(function () {
    'use strict';

    // State
    let currentRegion = null;
    let isAnimating = false;
    let originalViewBox = { x: 0, y: 0, width: 792.49, height: 516.88 };

    // Pan / Drag State
    let isDragging = false;
    let hasMoved = false;
    let dragStart = { x: 0, y: 0 };
    let vbStart = { x: 0, y: 0 };

    // District map breakdown state & DOM
    let districtsSvgData = null;
    let currentDistrict = null;
    let backButton, districtMapContainer, districtSvgStage;
    let districtMapRegionName, districtMapSubtitle, districtMapCountBadge, btnBackToCountry;

    // DOM Elements
    let svgMap, mapContainer, countryPanel, infoPanel;
    let toggleStatsBtn, closeCountryPanel, fullscreenBtn;
    let zoomInBtn, zoomOutBtn, resetViewBtn;
    let tooltip, tooltipName, tooltipStat;
    let loyihaModal, modalTitle, modalBody, modalStatusBadge, closeModalBtn, modalCloseFooterBtn, modalFooterPdfAction;

    // PDF Modal & Slide Presentation State
    let pdfModal, pdfModalWindow, pdfFrame, pdfModalTitle;
    let pdfTagNumber, pdfTagSize, pdfBtnDownload, pdfBtnFullscreen, closePdfModalBtn;
    let pdfSlideStage, pdfDocContainer, pdfSlideCanvas, pdfSlideCanvasCard, pdfSlideLoadingOverlay, pdfSlideLoadingText;
    let pdfSlideCurr, pdfSlideTotal, pdfPillCurr, pdfPillTotal, pdfSlideProgress;
    let pdfBtnPrevSlide, pdfBtnNextSlide, pdfPrevSlideFloat, pdfNextSlideFloat;
    let pdfBtnAutoplay, pdfBtnToggleMode, pdfModeLabel, pdfBadgeGlow, pdfHeaderModeText;
    let pdfSlidesStrip, pdfSlidesReelWrapper;

    let currentPdfDoc = null;
    let currentSlidePage = 1;
    let totalSlidePages = 15;
    let isRenderingSlide = false;
    let pendingSlidePage = null;
    let isAutoPlay = false;
    let autoPlayTimer = null;
    let isSlideMode = true;
    let currentPdfUrl = null;
    
    let galleryModal, galleryPhotoTitle, galleryCategoryBadge, galleryCounter, closeGalleryModalBtn;
    let galleryCurrentImage, galleryAddress, galleryDate, galleryCaption, galleryThumbsRow;
    let galleryPrevBtn, galleryNextBtn;
    let currentGalleryLocations = [];
    let currentGalleryIndex = 0;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        svgMap = document.getElementById('uzbekistan-loyiha-map');
        mapContainer = document.getElementById('map-container');
        countryPanel = document.getElementById('country-stats-panel');
        infoPanel = document.getElementById('region-info-panel');

        toggleStatsBtn = document.getElementById('toggle-stats-btn');
        closeCountryPanel = document.getElementById('close-country-panel');
        fullscreenBtn = document.getElementById('fullscreen-btn');

        zoomInBtn = document.getElementById('zoom-in');
        zoomOutBtn = document.getElementById('zoom-out');
        resetViewBtn = document.getElementById('reset-view');

        tooltip = document.getElementById('map-tooltip');
        tooltipName = document.getElementById('tooltip-name');
        tooltipStat = document.getElementById('tooltip-stat');

        loyihaModal = document.getElementById('loyiha-modal');
        modalTitle = document.getElementById('modal-title');
        modalBody = document.getElementById('modal-body');
        modalStatusBadge = document.getElementById('modal-status-badge');
        closeModalBtn = document.getElementById('close-modal');
        modalCloseFooterBtn = document.getElementById('modal-close-btn');

        // District Breakdown elements
        backButton = document.getElementById('back-button');
        districtMapContainer = document.getElementById('district-map-container');
        districtSvgStage = document.getElementById('district-svg-stage');
        districtMapRegionName = document.getElementById('district-map-region-name');
        districtMapSubtitle = document.getElementById('district-map-subtitle');
        districtMapCountBadge = document.getElementById('district-map-count-badge');
        btnBackToCountry = document.getElementById('btn-back-to-country');

        if (backButton) {
            backButton.addEventListener('click', closeRegionPanel);
        }
        if (btnBackToCountry) {
            btnBackToCountry.addEventListener('click', closeRegionPanel);
        }

        // Setup PDF modal, Photo Lightbox and Navoiy Creative Slides Modal
        setupPdfModal();
        setupGalleryModal();
        setupNavoiSlidesModal();

        // Pre-fetch district SVGs for instant rendering
        fetch('/assets/maps/all_regions_districts_svg.json')
            .then(r => r.json())
            .then(json => {
                districtsSvgData = json;
            })
            .catch(() => {});

        // Keyboard navigation (Escape key & Arrow navigation)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (navoiSlidesModal && navoiSlidesModal.style.display === 'flex') {
                    closeNavoiSlidesModal();
                    return;
                }
                if (galleryModal && galleryModal.style.display === 'flex') {
                    closeGalleryModal();
                    return;
                }
                if (pdfModal && pdfModal.style.display === 'flex') {
                    closePdfModal();
                    return;
                }
                if (loyihaModal && loyihaModal.style.display === 'flex') {
                    closeLoyihaModal();
                    return;
                }
                if (currentRegion) closeRegionPanel();
                else if (countryPanel) countryPanel.classList.remove('drawer-open');
            } else if (navoiSlidesModal && navoiSlidesModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    navoiPrevSlide();
                } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                    e.preventDefault();
                    navoiNextSlide();
                }
            } else if (pdfModal && pdfModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    goToPrevSlide();
                } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                    e.preventDefault();
                    goToNextSlide();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    renderSlidePage(1, 'prev');
                } else if (e.key === 'End') {
                    e.preventDefault();
                    renderSlidePage(totalSlidePages, 'next');
                }
            } else if (galleryModal && galleryModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    navigateGallery(-1);
                } else if (e.key === 'ArrowRight') {
                    navigateGallery(1);
                }
            }
        });

        if (!svgMap) return;

        // Store original viewBox
        if (svgMap.dataset.originalViewbox) {
            const parts = svgMap.dataset.originalViewbox.split(/[\s,]+/).map(Number);
            originalViewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
        } else {
            const vb = svgMap.viewBox.baseVal;
            originalViewBox = { x: vb.x, y: vb.y, width: vb.width, height: vb.height };
        }

        // Region paths and badges
        setupMapInteractions();

        // Left panel list items
        setupLeftPanelList();

        // Filter tabs
        setupFilterTabs();

        // Zoom & Pan controls
        setupZoomAndPan();

        // Header controls (fullscreen & font size)
        setupHeaderControls();

        // Right panel close button
        const closePanelBtn = document.getElementById('close-panel');
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', closeRegionPanel);
        }

        // Modal controls
        setupModal();

        // Initial responsive check
        handleResize();
        window.addEventListener('resize', handleResize);
    }

    // ==========================================
    // MAP INTERACTIONS (Paths & Badges)
    // ==========================================
    function setupMapInteractions() {
        const regionPaths = svgMap.querySelectorAll('path.region-path');
        const badges = svgMap.querySelectorAll('.map-badge');

        regionPaths.forEach(path => {
            path.addEventListener('click', onRegionElementClick);
            path.addEventListener('touchend', onRegionElementTouch, { passive: false });
            path.addEventListener('mouseenter', onRegionElementHover);
            path.addEventListener('mousemove', onRegionElementMove);
            path.addEventListener('mouseleave', onRegionElementLeave);
        });

        badges.forEach(badge => {
            badge.addEventListener('click', onBadgeClick);
            badge.addEventListener('touchend', onBadgeTouch, { passive: false });
            badge.addEventListener('mouseenter', onBadgeHover);
            badge.addEventListener('mousemove', onRegionElementMove);
            badge.addEventListener('mouseleave', onRegionElementLeave);
        });
    }

    function onBadgeClick(e) {
        if (hasMoved) return;
        e.stopPropagation();
        const slug = e.currentTarget.dataset.region;
        if (slug) selectRegion(slug);
    }

    function onBadgeTouch(e) {
        if (hasMoved) return;
        e.stopPropagation();
        e.preventDefault();
        const slug = e.currentTarget.dataset.region;
        if (slug) selectRegion(slug);
    }

    function onRegionElementClick(e) {
        if (hasMoved) return;
        const slug = e.currentTarget.dataset.region;
        if (slug) selectRegion(slug);
    }

    function onRegionElementTouch(e) {
        if (hasMoved) return;
        e.preventDefault();
        const slug = e.currentTarget.dataset.region;
        if (slug) selectRegion(slug);
    }

    function onRegionElementHover(e) {
        const slug = e.currentTarget.dataset.region;
        showTooltipForRegion(slug, e);
    }

    function onBadgeHover(e) {
        const slug = e.currentTarget.dataset.region;
        showTooltipForRegion(slug, e);
    }

    function onRegionElementMove(e) {
        if (!tooltip || tooltip.style.display === 'none') return;
        positionTooltip(e);
    }

    function onRegionElementLeave() {
        if (tooltip) tooltip.style.display = 'none';
    }

    function showTooltipForRegion(slug, e) {
        if (!tooltip || !window.LOYIHALAR_DATA || !window.LOYIHALAR_DATA[slug]) return;
        const data = window.LOYIHALAR_DATA[slug];

        tooltipName.textContent = data.name;
        if (data.status === 'completed') {
            tooltipStat.innerHTML = `<span style="color:#10B981;font-weight:700;">✓ Bajarilgan loyiha</span><br><span style="font-size:11px;color:var(--text-muted);">${data.project_title}</span>`;
        } else {
            tooltipStat.innerHTML = `<span style="color:#0284C7;font-weight:700;">🔍 Bajarilayotgan loyiha</span><br><span style="font-size:11px;color:var(--text-muted);">${data.project_title}</span>`;
        }

        tooltip.style.display = 'block';
        positionTooltip(e);
    }

    function positionTooltip(e) {
        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        const pad = 15;

        let left = x + pad;
        let top = y + pad;

        const rect = tooltip.getBoundingClientRect();
        if (left + rect.width > window.innerWidth - 10) {
            left = x - rect.width - pad;
        }
        if (top + rect.height > window.innerHeight - 10) {
            top = y - rect.height - pad;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // ==========================================
    // DISTRICT NAME NORMALIZATION & MATCHING
    // ==========================================
    function cleanDistrictName(str) {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/(tumani|shahri|shahar|rayoni)$/i, '')
            .replace(/[\s'ʻʼ`\-_.]/g, '')
            .trim();
    }

    function matchDistrict(svgName, dbDistricts) {
        if (!dbDistricts || !dbDistricts.length) return null;
        const cSvg = cleanDistrictName(svgName);
        for (let i = 0; i < dbDistricts.length; i++) {
            const d = dbDistricts[i];
            const cDb = cleanDistrictName(d.district_name || d.name);
            if (cSvg === cDb || cSvg.includes(cDb) || cDb.includes(cSvg)) {
                return d;
            }
        }
        return null;
    }

    function formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return Number(num).toLocaleString('uz-UZ').replace(/,/g, ' ');
    }

    // ==========================================
    // SELECT AND RENDER REGION PROJECT
    // ==========================================
    function selectRegion(slug) {
        if (isAnimating) return;
        currentRegion = slug;
        currentDistrict = null;

        // Navoiy viloyati tanlanganda muqova rasmini darhol ko'rsatish
        const navoiBadge = document.getElementById('navoi-report-cover-badge');
        if (navoiBadge) {
            navoiBadge.style.display = (slug === 'navoi') ? 'block' : 'none';
        }

        const data = window.LOYIHALAR_DATA ? window.LOYIHALAR_DATA[slug] : null;
        if (!data) return;

        // Hide left stats panel to allow maximum screen space for map
        if (countryPanel) countryPanel.classList.add('hidden');

        // Show back button
        if (backButton) backButton.classList.add('visible');

        // Highlight map path with 3D raised dark look (no red borders)
        const allPaths = svgMap.querySelectorAll('path.region-path');
        allPaths.forEach(p => {
            p.classList.remove('region-active', 'region-inactive');
            if (p.dataset.region === slug) {
                p.classList.add('region-active');
            } else {
                p.classList.add('region-inactive');
            }
        });

        // Highlight badge
        const allBadges = svgMap.querySelectorAll('.map-badge');
        allBadges.forEach(b => {
            b.classList.remove('badge-active');
            if (b.dataset.region === slug) {
                b.classList.add('badge-active');
            }
        });

        // Highlight list item in left panel
        const listItems = document.querySelectorAll('.loyiha-item-row');
        listItems.forEach(item => {
            if (item.dataset.region === slug) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });

        // Open right panel
        if (infoPanel) {
            infoPanel.classList.add('visible');
            infoPanel.setAttribute('aria-hidden', 'false');
        }
        if (mapContainer) {
            mapContainer.classList.add('panel-open');
        }

        // Render right details panel with region project summary
        renderRegionPanel(data);

        // Zoom to region and show district map breakdown
        const targetPath = svgMap.querySelector(`path[data-region="${slug}"]`);
        if (targetPath) {
            zoomToElement(targetPath, function () {
                renderDistrictMap(slug);
            });
        } else {
            renderDistrictMap(slug);
        }
    }

    function renderRegionPanel(data) {
        const titleEl = document.getElementById('panel-region-name');
        const capitalEl = document.getElementById('panel-region-capital');
        const typeEl = document.getElementById('panel-region-type');
        const bodyEl = document.getElementById('panel-body');

        if (titleEl) titleEl.textContent = data.name;
        if (capitalEl) {
            capitalEl.textContent = `Ma'muriy markaz: ${data.capital} • Aholi: ${Number(data.population).toLocaleString('uz-UZ')} kishi`;
        }
        if (typeEl) {
            typeEl.textContent = data.status === 'completed' ? 'Bajarilgan ilmiy loyiha' : 'Jarayondagi ilmiy loyiha';
            typeEl.style.background = data.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)';
            typeEl.style.color = data.status === 'completed' ? '#34D399' : '#38BDF8';
            typeEl.style.borderColor = data.status === 'completed' ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)';
        }

        const isComp = data.status === 'completed';
        const badgeColor = isComp ? '#10B981' : '#38BDF8';
        const badgeBg = isComp ? 'rgba(16,185,129,0.12)' : 'rgba(56,189,248,0.12)';
        const badgeBorder = isComp ? 'rgba(16,185,129,0.35)' : 'rgba(56,189,248,0.35)';

        let resultsHtml = '';
        if (Array.isArray(data.results)) {
            resultsHtml = data.results.map(r => `
                <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: var(--text-light);">
                    <span style="color: ${badgeColor}; font-weight: bold; flex-shrink: 0; margin-top: 1px;">${isComp ? '✓' : '•'}</span>
                    <span>${r}</span>
                </li>
            `).join('');
        }

        // PDF Card HTML
        let pdfHtml = '';
        if (data.pdf && data.pdf.has_pdf) {
            pdfHtml = `
                <div class="loyiha-pdf-card">
                    <div class="loyiha-pdf-header">
                        <div class="loyiha-pdf-pill">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span>${data.pdf.badge || 'Rasmiy PDF Hisobot'}</span>
                        </div>
                        <span class="pdf-tag">${data.pdf.file_size || '6.1 MB'}</span>
                    </div>
                    <div class="loyiha-pdf-title">${data.pdf.title}</div>
                    <div class="loyiha-pdf-desc">${data.pdf.summary || 'O\'zbekiston Respublikasi Kriminologiya tadqiqot instituti tomonidan tasdiqlangan ilmiy-amaliy loyiha rasmiy hisoboti.'}</div>
                    <div class="loyiha-pdf-buttons">
                        <button type="button" class="btn-pdf-view" id="btn-open-panel-pdf">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            Loyiha hisoboti
                        </button>
                        <a href="${data.pdf.download_url || '/loyiha/hujjat/pdf/download'}" class="btn-pdf-download-icon" title="Yuklab olish">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }

        // Visited Field Locations Gallery HTML
        let locationsHtml = '';
        if (Array.isArray(data.visited_locations) && data.visited_locations.length > 0) {
            locationsHtml = `
                <div class="loyiha-gallery-section">
                    <div class="summary-section-title" style="margin-bottom: 6px;">
                        <span>📸 Dala tadqiqotlari va borilgan manzillar</span>
                        <span class="badge" style="background:rgba(56,189,248,0.15); color:#38BDF8; border-color:rgba(56,189,248,0.35);">
                            ${data.visited_locations.length} ta manzil
                        </span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">
                        Institut ilmiy guruhi borgan obyektlar, IIB va mahallalardan fotosuratlar:
                    </div>
                    <div class="loyiha-gallery-grid">
                        ${data.visited_locations.map((loc, idx) => `
                            <div class="location-photo-card" data-idx="${idx}">
                                <div class="location-img-wrap">
                                    <img src="${loc.image}" alt="${loc.title}" loading="lazy">
                                    <div class="location-badge-overlay">${loc.category}</div>
                                    <div class="location-zoom-overlay">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            <line x1="11" y1="8" x2="11" y2="14"></line>
                                            <line x1="8" y1="11" x2="14" y2="11"></line>
                                        </svg>
                                        <span>Ko'rish</span>
                                    </div>
                                </div>
                                <div class="location-card-info">
                                    <div class="location-card-title" title="${loc.title}">${loc.title}</div>
                                    <div class="location-card-meta">
                                        <span>${loc.date}</span>
                                        <span style="color:#0284C7; font-weight:600;">Ochish 🔍</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Annotation Factsheet HTML
        let annotationHtml = '';
        if (data.annotation) {
            annotationHtml = `
                <div class="annotation-box" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <div style="font-size: 12px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                            <span>📊</span> Расмий аннотация кўрсаткичлари
                        </div>
                        <span style="font-size: 10.5px; background: rgba(16,185,129,0.15); color: #059669; padding: 2px 8px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3); font-weight: 600;">
                            Ҳисобот фактологияси
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px;">
                            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 3px;">👥 Тадқиқот жамоаси</div>
                            <div style="font-size: 12px; font-weight: 700; color: var(--text-white); line-height: 1.35;">${data.annotation.team_count || data.team}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px;">
                            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 3px;">📋 Социологик сўров</div>
                            <div style="font-size: 12px; font-weight: 700; color: var(--text-white); line-height: 1.35;">${data.annotation.respondents}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px;">
                            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 3px;">💡 Илмий таклиф ва прогноз</div>
                            <div style="font-size: 12px; font-weight: 700; color: var(--text-white); line-height: 1.35;">${data.annotation.proposals}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px;">
                            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 3px;">🏆 Расмий тасдиқ ва амалиёт</div>
                            <div style="font-size: 12px; font-weight: 700; color: #10B981; line-height: 1.35;">${data.annotation.certificates}</div>
                        </div>
                    </div>
                    ${data.annotation.presentation ? `
                        <div style="margin-top: 10px; padding: 8px 12px; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); border-radius: 6px; font-size: 11.5px; color: var(--text-light); display: flex; align-items: center; gap: 6px;">
                            <span>📢</span> <span>${data.annotation.presentation}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Implementation details HTML
        let implementationHtml = '';
        if (Array.isArray(data.implementation) && data.implementation.length > 0) {
            implementationHtml = `
                <div style="margin-bottom: 16px;">
                    <div class="summary-section-title" style="margin-bottom: 8px;">
                        <span>🏛️ Амалиётга жорий этиш ва расмий тақдимот</span>
                        <span class="badge" style="background: rgba(16,185,129,0.15); color: #10B981; border-color: rgba(16,185,129,0.35);">
                            ${data.implementation.length} та босқич
                        </span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${data.implementation.map(item => `
                            <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: var(--text-light);">
                                <span style="color: #10B981; font-weight: bold; flex-shrink: 0; margin-top: 1px;">✓</span>
                                <span>${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        bodyEl.innerHTML = `
            <!-- Status Banner Card -->
            <div style="background: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13px; color: ${badgeColor};">
                        <span style="width: 20px; height: 20px; border-radius: 50%; background: ${isComp ? '#059669' : '#1E293B'}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; border: 1px solid ${badgeColor};">
                            ${data.badge_icon}
                        </span>
                        ${data.status_label}
                    </span>
                    <span style="font-size: 11px; color: var(--text-muted); background: var(--bg-card-hover); border: 1px solid var(--border-color); padding: 2px 8px; border-radius: 4px;">${data.period}</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-white); line-height: 1.4; margin: 4px 0 0 0;">
                    «${data.project_title}»
                </h3>
            </div>

            <!-- PDF Hisobot Card -->
            ${pdfHtml}

            <!-- Annotatsiya ko'rsatkichlari -->
            ${annotationHtml}

            <!-- Research Team / Mas'ullar -->
            <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">
                    Tadqiqotchi guruh / Mas'ul ijrochilar
                </div>
                <div style="font-size: 13px; font-weight: 600; color: var(--text-white);">
                    ${data.team}
                </div>
            </div>

            <!-- Loyiha maqsadi -->
            <div style="margin-bottom: 16px;">
                <div class="summary-section-title" style="margin-bottom: 8px;">
                    <span>Loyiha maqsadi</span>
                </div>
                <div style="background: var(--bg-card-hover); border-left: 3px solid ${badgeColor}; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.55; color: var(--text-light);">
                    ${data.goal}
                </div>
            </div>

            <!-- Kutilgan / Erishilgan ilmiy-amaliy natijalar -->
            <div style="margin-bottom: 16px;">
                <div class="summary-section-title" style="margin-bottom: 8px;">
                    <span>${isComp ? 'Erishilgan ilmiy-amaliy natijalar' : 'Tadqiqotning kutilayotgan natijalari'}</span>
                    <span class="badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">
                        ${data.results ? data.results.length : 0} ta asosiy yo'nalish
                    </span>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${resultsHtml}
                </ul>
            </div>

            <!-- Amaliyotga joriy etish va rasmiy taqdimot -->
            ${implementationHtml}

            <!-- Dala tadqiqotlari va borilgan manzillar fotogalereyasi -->
            ${locationsHtml}

            <!-- Amaliy samara -->
            <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">
                    Amaliy samaradorlik va tadbiq
                </div>
                <div style="font-size: 13px; color: var(--text-light); line-height: 1.5;">
                    ${data.outcomes}
                </div>
            </div>

            <!-- Action buttons -->
            <div style="display: flex; gap: 10px; margin-top: 14px;">
                <button type="button" class="btn btn-primary" id="open-full-passport-btn" style="flex: 1; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    To'liq pasportni ko'rish
                </button>
            </div>
        `;

        const openBtn = document.getElementById('open-full-passport-btn');
        if (openBtn) {
            openBtn.addEventListener('click', function () {
                openLoyihaModal(data);
            });
        }

        // Attach PDF button click
        const panelPdfBtn = bodyEl.querySelector('#btn-open-panel-pdf');
        if (panelPdfBtn) {
            panelPdfBtn.addEventListener('click', function () {
                openPdfModal(data.pdf, data.name);
            });
        }

        // Attach Location cards click
        const photoCards = bodyEl.querySelectorAll('.location-photo-card');
        photoCards.forEach(card => {
            card.addEventListener('click', function () {
                const idx = parseInt(card.dataset.idx, 10) || 0;
                openGalleryModal(data.visited_locations, idx);
            });
        });
    }

    // ==========================================
    // RENDER DISTRICT BREAKDOWN MAP
    // ==========================================
    function renderDistrictMap(slug) {
        if (!districtMapContainer || !districtSvgStage) return;

        const regionLoyiha = window.LOYIHALAR_DATA ? window.LOYIHALAR_DATA[slug] : null;
        const regDbInfo = (window.REGIONS_DATA && window.REGIONS_DATA[slug]) ? window.REGIONS_DATA[slug] : null;
        const regDistricts = (regDbInfo && regDbInfo.districts) ? regDbInfo.districts : [];
        const svgInfo = districtsSvgData ? districtsSvgData[slug] : null;

        // Navoiy viloyati tanlanganda muqova rasmini ko'rsatish
        const navoiBadge = document.getElementById('navoi-report-cover-badge');
        if (navoiBadge) {
            navoiBadge.style.display = (slug === 'navoi') ? 'block' : 'none';
        }

        if (!svgInfo) {
            fetch('/assets/maps/all_regions_districts_svg.json')
                .then(r => r.json())
                .then(json => {
                    districtsSvgData = json;
                    renderDistrictMap(slug);
                })
                .catch(() => {});
            return;
        }

        const regionName = regionLoyiha ? regionLoyiha.name : svgInfo.name;
        const isComp = regionLoyiha && regionLoyiha.status === 'completed';

        if (districtMapRegionName) {
            districtMapRegionName.textContent = regionName;
        }
        if (districtMapSubtitle) {
            districtMapSubtitle.textContent = isComp
                ? 'Bajarilgan ilmiy loyihaning tumanlar kesimidagi tatbiqi'
                : 'Bajarilayotgan ilmiy loyihaning tumanlar kesimidagi tadqiqoti';
        }
        if (districtMapCountBadge) {
            const badgeIcon = isComp ? '✓' : '🔍';
            const badgeText = isComp ? 'Bajarilgan' : 'Jarayonda';
            districtMapCountBadge.innerHTML = `<span style="margin-right:4px;">${badgeIcon}</span> ${badgeText} (${svgInfo.districts.length} ta tuman va shahar)`;
            districtMapCountBadge.style.color = isComp ? '#34D399' : '#38BDF8';
            districtMapCountBadge.style.borderColor = isComp ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)';
            districtMapCountBadge.style.background = isComp ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)';
        }

        let svgHtml = `<svg id="district-svg" class="district-svg" viewBox="${svgInfo.viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${regionName} tumanlar xaritasi">`;
        svgHtml += `
            <defs>
                <filter id="filter-3d-raise-district" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.85"/>
                    <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#020617" flood-opacity="0.95"/>
                    <feDropShadow dx="0" dy="-1.5" stdDeviation="1.5" flood-color="#93C5FD" flood-opacity="0.6"/>
                </filter>
            </defs>
            <g id="district-paths-group">
        `;

        svgInfo.districts.forEach(d => {
            const matchedDb = matchDistrict(d.name, regDistricts);
            const total = matchedDb ? matchedDb.total_crimes : 0;
            const rate = matchedDb ? matchedDb.crime_rate_per_100k : 0;
            svgHtml += `<path class="district-path" data-district-name="${d.name}" data-total="${total}" data-rate="${rate}" d="${d.path}" />`;
        });

        svgHtml += `</g>`;
        svgHtml += `</svg>`;

        districtSvgStage.innerHTML = svgHtml;
        districtMapContainer.style.display = 'flex';

        // Navoiy viloyati tanlanganda chap tepa burchakda ajralib turuvchi tadqiqot hisoboti muqovasi (orqa foni o'ynovchi karta)
        if (navoiReportCoverBadge) {
            if (slug === 'navoi') {
                navoiReportCoverBadge.style.display = 'flex';
            } else {
                navoiReportCoverBadge.style.display = 'none';
            }
        }

        // Attach interactions
        const paths = districtSvgStage.querySelectorAll('.district-path');
        paths.forEach(p => {
            const distName = p.dataset.districtName;
            const matchedDb = matchDistrict(distName, regDistricts);

            // Hover tooltip
            p.addEventListener('mouseenter', function (e) {
                if (!tooltip) return;
                tooltipName.textContent = distName;
                const statusTxt = isComp ? '✓ Bajarilgan loyiha doirasida' : '🔍 Jarayondagi loyiha doirasida';
                const color = isComp ? '#34D399' : '#38BDF8';
                tooltipStat.innerHTML = `
                    <span style="color:${color};font-weight:700;">${statusTxt}</span><br>
                    <span style="font-size:11px;color:var(--text-muted);">${regionLoyiha ? regionLoyiha.project_title : ''}</span>
                `;
                tooltip.style.display = 'block';
                positionTooltip(e);
            });

            p.addEventListener('mousemove', function (e) {
                positionTooltip(e);
            });

            p.addEventListener('mouseleave', function () {
                if (tooltip) tooltip.style.display = 'none';
            });

            // Click district
            p.addEventListener('click', function (e) {
                e.stopPropagation();
                selectDistrict(matchedDb, distName, regionLoyiha, regDistricts);
            });
        });
    }

    // ==========================================
    // SELECT AND RENDER DISTRICT PROJECT DETAIL
    // ==========================================
    function selectDistrict(dStats, dName, regionLoyiha, regDistricts) {
        currentDistrict = dName;

        // Highlight active district on SVG with 3D raised dark look (no red)
        if (districtSvgStage) {
            districtSvgStage.querySelectorAll('.district-path').forEach(p => {
                if (p.dataset.districtName === dName) {
                    p.classList.add('district-active');
                    if (p.parentNode) p.parentNode.appendChild(p);
                } else {
                    p.classList.remove('district-active');
                }
            });
        }

        const isComp = regionLoyiha && regionLoyiha.status === 'completed';
        const color = isComp ? '#34D399' : '#38BDF8';
        const badgeBg = isComp ? 'rgba(16,185,129,0.14)' : 'rgba(56,189,248,0.14)';
        const badgeBorder = isComp ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)';

        const titleEl = document.getElementById('panel-region-name');
        const capitalEl = document.getElementById('panel-region-capital');
        const typeEl = document.getElementById('panel-region-type');
        const bodyEl = document.getElementById('panel-body');

        if (titleEl) titleEl.textContent = dName;
        if (capitalEl) {
            capitalEl.textContent = `${regionLoyiha.name} tarkibida • Tadqiqot obyekti`;
        }
        if (typeEl) {
            typeEl.textContent = isComp ? 'Bajarilgan tadqiqot obyekti' : 'Jarayondagi tadqiqot obyekti';
            typeEl.style.background = badgeBg;
            typeEl.style.color = color;
            typeEl.style.borderColor = badgeBorder;
        }

        const totalCrimes = dStats ? dStats.total_crimes : 0;
        const crimeRate = dStats ? dStats.crime_rate_per_100k : 0;
        const solvedRate = dStats ? dStats.solved_rate : 0;
        const cyberCrimes = dStats ? dStats.cybercrime : 0;

        let html = `
            {{-- Breadcrumbs & Back link --}}
            <div class="district-breadcrumbs" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:6px; font-size:12px;">
                    <button type="button" class="crumb-btn" id="crumb-to-region" style="background:none; border:none; color:#2563EB; font-weight:600; cursor:pointer; padding:0; text-decoration:underline;">
                        ${regionLoyiha.name}
                    </button>
                    <span class="crumb-sep" style="color:var(--text-dim);">/</span>
                    <span class="crumb-current" style="color:var(--text-white); font-weight:700;">${dName}</span>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-back-to-region-summary" style="padding:4px 10px; font-size:11px; border-radius:6px; background:var(--bg-card-hover); color:var(--text-light); border:1px solid var(--border-light); cursor:pointer;">
                    ← Viloyat
                </button>
            </div>

            {{-- Status Banner --}}
            <div style="background: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13px; color: ${color};">
                        <span style="width: 20px; height: 20px; border-radius: 50%; background: ${isComp ? '#059669' : '#1E293B'}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; border: 1px solid ${color};">
                            ${regionLoyiha.badge_icon}
                        </span>
                        ${regionLoyiha.status_label}
                    </span>
                    <span style="font-size: 11px; color: var(--text-muted); background: var(--bg-card-hover); border: 1px solid var(--border-color); padding: 2px 8px; border-radius: 4px;">${regionLoyiha.period}</span>
                </div>
                <h3 style="font-size: 15px; font-weight: 700; color: var(--text-white); line-height: 1.4; margin: 4px 0 0 0;">
                    «${regionLoyiha.project_title}»
                </h3>
            </div>

            {{-- 4 Key District Stat Cards --}}
            <div class="district-stats-grid" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin-bottom:16px;">
                <div class="district-stat-box" style="border-color:rgba(96,165,250,0.3); background:rgba(30,58,138,0.15); border-radius:8px; padding:10px 12px; text-align:center;">
                    <div class="district-stat-val" style="color:#2563EB; font-size:18px; font-weight:800;">${formatNumber(totalCrimes)}</div>
                    <div class="district-stat-lbl" style="font-size:10.5px; color:var(--text-muted); margin-top:4px;">Jami jinoyatlar (2026)</div>
                </div>
                <div class="district-stat-box" style="border-radius:8px; padding:10px 12px; text-align:center; background:var(--bg-card-hover); border:1px solid var(--border-color);">
                    <div class="district-stat-val" style="color:var(--text-white); font-size:18px; font-weight:800;">${crimeRate ? Number(crimeRate).toFixed(1) : '—'}</div>
                    <div class="district-stat-lbl" style="font-size:10.5px; color:var(--text-muted); margin-top:4px;">100 ming aholiga</div>
                </div>
                <div class="district-stat-box" style="border-radius:8px; padding:10px 12px; text-align:center; background:var(--bg-card-hover); border:1px solid var(--border-color);">
                    <div class="district-stat-val" style="color:#10B981; font-size:18px; font-weight:800;">${solvedRate ? Number(solvedRate).toFixed(1) + '%' : '78.5%'}</div>
                    <div class="district-stat-lbl" style="font-size:10.5px; color:var(--text-muted); margin-top:4px;">Ochilganlik darajasi</div>
                </div>
                <div class="district-stat-box" style="border-radius:8px; padding:10px 12px; text-align:center; background:var(--bg-card-hover); border:1px solid var(--border-color);">
                    <div class="district-stat-val" style="color:#06B6D4; font-size:18px; font-weight:800;">${formatNumber(cyberCrimes || Math.round(totalCrimes * 0.45))}</div>
                    <div class="district-stat-lbl" style="font-size:10.5px; color:var(--text-muted); margin-top:4px;">Kiberjinoyat (AT)</div>
                </div>
            </div>

            {{-- District Tadqiqot Mexanizmi --}}
            <div style="background: var(--bg-card-hover); border-left: 3px solid ${color}; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-bottom: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">
                    ${dName} kriminologik tavsifi
                </div>
                <div style="font-size: 13px; line-height: 1.55; color: var(--text-light);">
                    Mazkur tumanda kriminogen omillar kompleks tahlil qilinib, «${regionLoyiha.project_title}» ilmiy loyihasi doirasida xavflarni barvaqt aniqlash va bartaraf etishning manzilli choralari tatbiq etilmoqda.
                </div>
            </div>

            {{-- Ilmiy taklif va tadqiqot natijalari --}}
            <div style="margin-bottom: 16px;">
                <div class="summary-section-title" style="margin-bottom: 8px;">
                    <span>${isComp ? 'Tumanda amaliyotga joriy etilgan metodikalar' : 'Tumanda kutilayotgan profilaktik choralar'}</span>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:12.5px; line-height:1.5; color:var(--text-light);">
                        <span style="color:${color}; font-weight:bold; flex-shrink:0;">✓</span>
                        <span>Mahallalar kesimida kriminogen vaziyatni barqarorlashtirish va "qizil" toifalarni pasaytirish;</span>
                    </li>
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:12.5px; line-height:1.5; color:var(--text-light);">
                        <span style="color:${color}; font-weight:bold; flex-shrink:0;">✓</span>
                        <span>Axborot texnologiyalari orqali sodir etilayotgan kiberfiribgarliklar profilaktikasi;</span>
                    </li>
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:12.5px; line-height:1.5; color:var(--text-light);">
                        <span style="color:${color}; font-weight:bold; flex-shrink:0;">✓</span>
                        <span>Yoshlar va oila-turmush doirasidagi zo'ravonliklarning barvaqt oldini olish.</span>
                    </li>
                </ul>
            </div>

            {{-- Quick list of all other districts in this region --}}
            ${regDistricts && regDistricts.length > 0 ? `
                <div class="summary-section-title" style="margin-top: 14px; margin-bottom: 8px;">
                    <span>${regionLoyiha.name} boshqa tumanlari (${regDistricts.length} ta)</span>
                </div>
                <div class="district-table" style="max-height: 220px; overflow-y: auto; margin-bottom: 16px;">
                    ${regDistricts.map(d => {
                        const isActive = cleanDistrictName(d.district_name || d.name) === cleanDistrictName(dName);
                        return `
                            <div class="district-row ${isActive ? 'active-dist' : ''}" data-dist-name="${d.district_name || d.name}" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; padding:7px 10px; border-radius:6px; margin-bottom:4px; font-size:12px; ${isActive ? 'background:rgba(96,165,250,0.18); border:1px solid rgba(96,165,250,0.4);' : 'background:var(--bg-card-hover); border:1px solid var(--border-color);'}">
                                <span class="district-name" style="${isActive ? 'color:#2563EB; font-weight:700;' : 'color:var(--text-light);'}">${d.district_name || d.name}</span>
                                <span class="district-value" style="color:${isActive ? '#2563EB' : 'var(--text-muted)'}; font-weight:600;">${formatNumber(d.total_crimes)} ta</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            {{-- Action buttons --}}
            <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary" id="btn-back-to-overview" style="flex:1; padding:9px 12px; border-radius:8px; font-size:12px; font-weight:600; background:var(--bg-card-hover); color:var(--text-light); border:1px solid var(--border-light); cursor:pointer;">
                    ← Viloyat
                </button>
                <button type="button" class="btn btn-secondary" id="btn-district-pdf" style="padding:9px 12px; border-radius:8px; font-size:12px; font-weight:600; background:rgba(16,185,129,0.15); color:#34D399; border:1px solid rgba(16,185,129,0.35); cursor:pointer; display:flex; align-items:center; gap:5px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Loyiha hisoboti
                </button>
                <button type="button" class="btn btn-primary" id="open-full-passport-btn" style="flex:1; padding:9px 12px; border-radius:8px; font-size:12px; font-weight:600; background:linear-gradient(135deg, #059669 0%, #10B981 100%); color:#fff; border:none; cursor:pointer;">
                    To'liq pasport
                </button>
            </div>
        `;

        bodyEl.innerHTML = html;

        // Wire event listeners inside district view
        const crumbBtn = bodyEl.querySelector('#crumb-to-region');
        const backBtnOverview = bodyEl.querySelector('#btn-back-to-region-summary');
        const backBtnOverview2 = bodyEl.querySelector('#btn-back-to-overview');
        const distPdfBtn = bodyEl.querySelector('#btn-district-pdf');
        const openPassportBtn = bodyEl.querySelector('#open-full-passport-btn');

        if (crumbBtn) crumbBtn.addEventListener('click', () => restoreRegionOverview(regionLoyiha));
        if (backBtnOverview) backBtnOverview.addEventListener('click', () => restoreRegionOverview(regionLoyiha));
        if (backBtnOverview2) backBtnOverview2.addEventListener('click', () => restoreRegionOverview(regionLoyiha));
        if (distPdfBtn) distPdfBtn.addEventListener('click', () => openPdfModal(regionLoyiha.pdf, regionLoyiha.name));
        if (openPassportBtn) openPassportBtn.addEventListener('click', () => openLoyihaModal(regionLoyiha));

        // District table row clicks
        const rows = bodyEl.querySelectorAll('.district-row[data-dist-name]');
        rows.forEach(r => {
            r.addEventListener('click', function () {
                const targetName = r.dataset.distName;
                const dObj = matchDistrict(targetName, regDistricts);
                selectDistrict(dObj, targetName, regionLoyiha, regDistricts);
            });
        });
    }

    // ==========================================
    // RESTORE REGION OVERVIEW
    // ==========================================
    function restoreRegionOverview(regionLoyiha) {
        currentDistrict = null;

        // Clear active district path on map
        if (districtSvgStage) {
            districtSvgStage.querySelectorAll('.district-path').forEach(p => p.classList.remove('district-active'));
        }

        renderRegionPanel(regionLoyiha);
    }

    function closeRegionPanel() {
        currentRegion = null;
        currentDistrict = null;

        // Hide district breakdown
        if (districtMapContainer) {
            districtMapContainer.style.display = 'none';
        }
        if (districtSvgStage) {
            districtSvgStage.innerHTML = '';
        }
        if (navoiReportCoverBadge) {
            navoiReportCoverBadge.style.display = 'none';
        }

        if (infoPanel) {
            infoPanel.classList.remove('visible');
            infoPanel.setAttribute('aria-hidden', 'true');
        }
        if (mapContainer) {
            mapContainer.classList.remove('panel-open');
        }
        if (countryPanel) {
            countryPanel.classList.remove('hidden');
        }
        if (backButton) {
            backButton.classList.remove('visible');
        }

        // Reset paths and badges
        const allPaths = svgMap.querySelectorAll('path.region-path');
        allPaths.forEach(p => p.classList.remove('region-active', 'region-inactive'));

        const allBadges = svgMap.querySelectorAll('.map-badge');
        allBadges.forEach(b => b.classList.remove('badge-active'));

        const listItems = document.querySelectorAll('.loyiha-item-row');
        listItems.forEach(i => i.classList.remove('active'));

        resetMapZoom();
    }

    // ==========================================
    // LEFT PANEL LIST ITEMS
    // ==========================================
    function setupLeftPanelList() {
        const items = document.querySelectorAll('.loyiha-item-row');
        items.forEach(row => {
            row.addEventListener('click', function () {
                const slug = row.dataset.region;
                if (slug) selectRegion(slug);
            });
        });
    }

    // ==========================================
    // FILTER TABS (All / Completed / In Progress)
    // ==========================================
    function setupFilterTabs() {
        const tabs = document.querySelectorAll('.loyiha-tab-btn');
        const rows = document.querySelectorAll('.loyiha-item-row');
        const paths = svgMap.querySelectorAll('path.region-path');
        const badges = svgMap.querySelectorAll('.map-badge');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.background = 'transparent';
                });
                tab.classList.add('active');
                tab.style.background = 'rgba(255,255,255,0.08)';

                const filter = tab.dataset.filter;

                // Filter list rows
                rows.forEach(row => {
                    const st = row.dataset.status;
                    if (filter === 'all' || st === filter) {
                        row.style.display = 'flex';
                    } else {
                        row.style.display = 'none';
                    }
                });

                // Dim / highlight on map
                paths.forEach(p => {
                    const st = p.dataset.status;
                    if (filter === 'all' || st === filter) {
                        p.style.opacity = '1';
                    } else {
                        p.style.opacity = '0.25';
                    }
                });

                badges.forEach(b => {
                    const slug = b.dataset.region;
                    const data = window.LOYIHALAR_DATA ? window.LOYIHALAR_DATA[slug] : null;
                    if (data && (filter === 'all' || data.status === filter)) {
                        b.style.opacity = '1';
                        b.style.pointerEvents = 'all';
                    } else {
                        b.style.opacity = '0.25';
                        b.style.pointerEvents = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // ZOOM AND PAN (Mouse, Touch, Wheel, Buttons)
    // ==========================================
    function setupZoomAndPan() {
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => zoomBy(0.75));
        }
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => zoomBy(1.33));
        }
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                closeRegionPanel();
            });
        }

        // Wheel zoom
        svgMap.addEventListener('wheel', handleWheel, { passive: false });

        // Mouse drag pan
        svgMap.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch drag & pinch
        let initialPinchDistance = null;
        svgMap.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                isDragging = true;
                hasMoved = false;
                dragStart = { x: touch.clientX, y: touch.clientY };
                const vb = svgMap.viewBox.baseVal;
                vbStart = { x: vb.x, y: vb.y };
            } else if (e.touches.length === 2) {
                isDragging = false;
                initialPinchDistance = getTouchDistance(e.touches);
            }
        }, { passive: true });

        svgMap.addEventListener('touchmove', function (e) {
            if (isDragging && e.touches.length === 1) {
                const touch = e.touches[0];
                const dx = touch.clientX - dragStart.x;
                const dy = touch.clientY - dragStart.y;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    hasMoved = true;
                }
                const vb = svgMap.viewBox.baseVal;
                const rect = svgMap.getBoundingClientRect();
                const scaleX = vb.width / rect.width;
                const scaleY = vb.height / rect.height;

                svgMap.setAttribute('viewBox', `${vbStart.x - dx * scaleX} ${vbStart.y - dy * scaleY} ${vb.width} ${vb.height}`);
            } else if (e.touches.length === 2 && initialPinchDistance) {
                const dist = getTouchDistance(e.touches);
                const factor = initialPinchDistance / dist;
                if (Math.abs(factor - 1) > 0.05) {
                    zoomBy(factor > 1 ? 1.08 : 0.92);
                    initialPinchDistance = dist;
                }
            }
        }, { passive: true });

        svgMap.addEventListener('touchend', function () {
            isDragging = false;
            initialPinchDistance = null;
        });
    }

    function getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function handleMouseDown(e) {
        if (e.button !== 0) return;
        isDragging = true;
        hasMoved = false;
        dragStart = { x: e.clientX, y: e.clientY };
        const vb = svgMap.viewBox.baseVal;
        vbStart = { x: vb.x, y: vb.y };
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMoved = true;
        }

        const vb = svgMap.viewBox.baseVal;
        const rect = svgMap.getBoundingClientRect();
        const scaleX = vb.width / rect.width;
        const scaleY = vb.height / rect.height;

        svgMap.setAttribute('viewBox', `${vbStart.x - dx * scaleX} ${vbStart.y - dy * scaleY} ${vb.width} ${vb.height}`);
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleWheel(e) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.85 : 1.15;
        zoomBy(factor, e.clientX, e.clientY);
    }

    function zoomBy(factor, clientX, clientY) {
        const vb = svgMap.viewBox.baseVal;
        const rect = svgMap.getBoundingClientRect();

        let cx = vb.x + vb.width / 2;
        let cy = vb.y + vb.height / 2;

        if (clientX !== undefined && clientY !== undefined) {
            const relX = (clientX - rect.left) / rect.width;
            const relY = (clientY - rect.top) / rect.height;
            cx = vb.x + relX * vb.width;
            cy = vb.y + relY * vb.height;
        }

        let newW = vb.width * factor;
        let newH = vb.height * factor;

        // Constraints
        const minW = 120;
        const maxW = originalViewBox.width * 1.8;
        if (newW < minW) { newW = minW; newH = minW * (originalViewBox.height / originalViewBox.width); }
        if (newW > maxW) { newW = maxW; newH = maxW * (originalViewBox.height / originalViewBox.width); }

        const newX = cx - (cx - vb.x) * (newW / vb.width);
        const newY = cy - (cy - vb.y) * (newH / vb.height);

        animateViewBox({ x: newX, y: newY, width: newW, height: newH }, 250);
    }

    function zoomToElement(element, callback) {
        const bbox = element.getBBox();
        const pad = Math.max(bbox.width, bbox.height) * 0.4;

        let targetW = bbox.width + pad * 2;
        let targetH = bbox.height + pad * 2;

        const aspect = originalViewBox.width / originalViewBox.height;
        if (targetW / targetH > aspect) {
            targetH = targetW / aspect;
        } else {
            targetW = targetH * aspect;
        }

        const targetX = bbox.x + bbox.width / 2 - targetW / 2;
        const targetY = bbox.y + bbox.height / 2 - targetH / 2;

        animateViewBox({ x: targetX, y: targetY, width: targetW, height: targetH }, 350, callback);
    }

    function resetMapZoom() {
        animateViewBox(originalViewBox, 350);
    }

    function animateViewBox(target, duration = 300, callback) {
        isAnimating = true;
        const start = {
            x: svgMap.viewBox.baseVal.x,
            y: svgMap.viewBox.baseVal.y,
            width: svgMap.viewBox.baseVal.width,
            height: svgMap.viewBox.baseVal.height
        };
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            const curX = start.x + (target.x - start.x) * ease;
            const curY = start.y + (target.y - start.y) * ease;
            const curW = start.width + (target.width - start.width) * ease;
            const curH = start.height + (target.height - start.height) * ease;

            svgMap.setAttribute('viewBox', `${curX} ${curY} ${curW} ${curH}`);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                isAnimating = false;
                if (typeof callback === 'function') callback();
            }
        }

        requestAnimationFrame(step);
    }

    // ==========================================
    // MODAL
    // ==========================================
    function setupModal() {
        modalFooterPdfAction = document.getElementById('modal-footer-pdf-action');
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeLoyihaModal);
        if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeLoyihaModal);
        if (loyihaModal) {
            loyihaModal.addEventListener('click', function (e) {
                if (e.target === loyihaModal) closeLoyihaModal();
            });
        }
    }

    function openLoyihaModal(data) {
        if (!loyihaModal) return;
        const isComp = data.status === 'completed';
        const color = isComp ? '#10B981' : '#38BDF8';

        modalTitle.textContent = `${data.name} — «${data.project_title}»`;

        modalStatusBadge.textContent = `${data.badge_icon} ${data.status_label}`;
        modalStatusBadge.style.background = isComp ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)';
        modalStatusBadge.style.color = color;
        modalStatusBadge.style.borderColor = isComp ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)';

        let resultsHtml = '';
        if (Array.isArray(data.results)) {
            resultsHtml = data.results.map((r, i) => `
                <div style="display:flex; gap:12px; margin-bottom:12px; padding:10px 14px; background:var(--bg-card-hover); border:1px solid var(--border-color); border-radius:8px;">
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:${isComp ? '#059669' : '#1E293B'}; color:#fff; font-size:12px; font-weight:bold; flex-shrink:0;">
                        ${i + 1}
                    </span>
                    <span style="font-size:13.5px; line-height:1.55; color:var(--text-light);">${r}</span>
                </div>
            `).join('');
        }

        // Modal Annotation HTML
        let modalAnnotationHtml = '';
        if (data.annotation) {
            modalAnnotationHtml = `
                <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <div style="font-size: 13px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 16px;">📊</span> Расмий илмий-амалий ҳисобот аннотацияси кўрсаткичлари
                        </div>
                        <span style="font-size: 11px; background: rgba(16,185,129,0.15); color: #059669; padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3); font-weight: 600;">
                            Институт расмий маълумоти
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px;">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">👥 Илмий тадқиқот жамоаси</div>
                            <div style="font-size: 13px; font-weight: 700; color: var(--text-white); line-height: 1.4;">${data.annotation.team_count || data.team}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px;">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">📋 Социологик тадқиқот қамрови</div>
                            <div style="font-size: 13px; font-weight: 700; color: var(--text-white); line-height: 1.4;">${data.annotation.respondents}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px;">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">💡 Илмий таклиф ва диагноз</div>
                            <div style="font-size: 13px; font-weight: 700; color: var(--text-white); line-height: 1.4;">${data.annotation.proposals}</div>
                        </div>
                        <div style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px;">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">🏆 Расмий амалиёт далолатномалари</div>
                            <div style="font-size: 13px; font-weight: 700; color: #10B981; line-height: 1.4;">${data.annotation.certificates}</div>
                        </div>
                    </div>
                    ${data.annotation.presentation ? `
                        <div style="margin-top: 12px; padding: 10px 14px; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; font-size: 12px; color: var(--text-light); display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px;">📢</span> <span>${data.annotation.presentation}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Modal Implementation HTML
        let modalImplementationHtml = '';
        if (Array.isArray(data.implementation) && data.implementation.length > 0) {
            modalImplementationHtml = `
                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 14px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">
                        🏛️ Амалиётга жорий этиш ва расмий тақдимот (${data.implementation.length} та босқич)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${data.implementation.map(item => `
                            <div style="display: flex; gap: 12px; padding: 12px 14px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 8px;">
                                <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #059669; color: #fff; font-size: 12px; font-weight: bold; flex-shrink: 0;">
                                    ✓
                                </span>
                                <span style="font-size: 13.5px; line-height: 1.55; color: var(--text-light);">${item}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        modalBody.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:18px;">
                <div style="background:var(--bg-card-hover); padding:10px 14px; border-radius:8px; border:1px solid var(--border-color);">
                    <div style="font-size:11px; color:var(--text-muted);">Ma'muriy markaz</div>
                    <div style="font-size:14px; font-weight:600; color:var(--text-white);">${data.capital}</div>
                </div>
                <div style="background:var(--bg-card-hover); padding:10px 14px; border-radius:8px; border:1px solid var(--border-color);">
                    <div style="font-size:11px; color:var(--text-muted);">Aholi soni</div>
                    <div style="font-size:14px; font-weight:600; color:var(--text-white);">${Number(data.population).toLocaleString('uz-UZ')} nafar</div>
                </div>
                <div style="background:var(--bg-card-hover); padding:10px 14px; border-radius:8px; border:1px solid var(--border-color);">
                    <div style="font-size:11px; color:var(--text-muted);">Tadqiqot davri</div>
                    <div style="font-size:14px; font-weight:600; color:var(--text-white);">${data.period}</div>
                </div>
            </div>

            <!-- PDF Hisobot Banner in Passport -->
            ${data.pdf && data.pdf.has_pdf ? `
                <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:10px; padding:14px 16px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                        <span style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:8px; background:linear-gradient(135deg, #059669 0%, #10B981 100%); color:#fff; font-weight:800; font-size:12px; box-shadow:0 0 12px rgba(16,185,129,0.4); flex-shrink:0;">
                            PDF
                        </span>
                        <div style="min-width:0;">
                            <div style="font-size:14px; font-weight:700; color:var(--text-white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${data.pdf.title}</div>
                            <div style="font-size:11.5px; color:var(--text-muted);">${data.pdf.doc_number} • ${data.pdf.date} • ${data.pdf.file_size} • ${data.pdf.pages} sahifa</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="btn btn-primary" id="modal-body-pdf-btn" style="padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; background:linear-gradient(135deg, #059669 0%, #10B981 100%); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            Loyiha hisoboti
                        </button>
                        <a href="${data.pdf.download_url || '/loyiha/hujjat/pdf/download'}" style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:8px; background:var(--bg-card-hover); border:1px solid var(--border-color); color:var(--text-light); text-decoration:none;" title="Yuklab olish">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            ` : ''}

            <!-- Annotatsiya Faktologiyasi -->
            ${modalAnnotationHtml}

            <div style="margin-bottom:18px;">
                <h4 style="font-size:14px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Loyiha maqsadi</h4>
                <div style="padding:14px 16px; background:var(--bg-card-hover); border-left:4px solid ${color}; border-radius:0 8px 8px 0; font-size:14px; line-height:1.6; color:var(--text-light);">
                    ${data.goal}
                </div>
            </div>

            <div style="margin-bottom:18px;">
                <h4 style="font-size:14px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">
                    ${isComp ? 'Erishilgan asosiy ilmiy-amaliy natijalar' : 'Tadqiqotning kutilayotgan ilmiy-amaliy natijalari'}
                </h4>
                ${resultsHtml}
            </div>

            <!-- Amaliyotga joriy etish va rasmiy taqdimot -->
            ${modalImplementationHtml}

            <!-- Dala tadqiqotlari fotosuratlari in Passport -->
            ${Array.isArray(data.visited_locations) && data.visited_locations.length > 0 ? `
                <div style="margin-bottom:18px;">
                    <h4 style="font-size:14px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">
                        📸 Dala tadqiqotlari va borilgan manzillar fotohisoboti (${data.visited_locations.length} ta manzil)
                    </h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px;">
                        ${data.visited_locations.map((loc, idx) => `
                            <div class="passport-loc-card" data-idx="${idx}" style="cursor:pointer; background:var(--bg-card-hover); border:1px solid var(--border-color); border-radius:8px; overflow:hidden; transition:all 0.2s ease;">
                                <div style="height:115px; overflow:hidden; position:relative;">
                                    <img src="${loc.image}" alt="${loc.title}" style="width:100%; height:100%; object-fit:cover;">
                                    <span style="position:absolute; top:6px; left:6px; font-size:10px; font-weight:700; background:rgba(15,23,42,0.85); color:#38BDF8; padding:2px 6px; border-radius:4px; border:1px solid rgba(56,189,248,0.3);">${loc.category}</span>
                                </div>
                                <div style="padding:8px 10px;">
                                    <div style="font-size:12px; font-weight:600; color:var(--text-white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${loc.title}</div>
                                    <div style="font-size:11px; color:var(--text-muted); margin-top:3px; display:flex; justify-content:space-between;">
                                        <span>${loc.date}</span>
                                        <span style="color:#0284C7; font-weight:600;">Ochish 🔍</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div>
                <h4 style="font-size:14px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Amaliy ahamiyati va joriy etish</h4>
                <div style="padding:12px 16px; background:var(--bg-card-hover); border:1px solid var(--border-color); border-radius:8px; font-size:13.5px; line-height:1.55; color:var(--text-light);">
                    ${data.outcomes}
                </div>
            </div>
        `;

        if (modalFooterPdfAction) {
            if (data.pdf && data.pdf.has_pdf) {
                modalFooterPdfAction.innerHTML = `
                    <button type="button" class="btn btn-primary" id="modal-footer-pdf-btn" style="padding:8px 16px; border-radius:8px; font-size:12.5px; font-weight:700; background:linear-gradient(135deg, #059669 0%, #10B981 100%); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Loyiha hisoboti
                    </button>
                `;
                const footerPdfBtn = modalFooterPdfAction.querySelector('#modal-footer-pdf-btn');
                if (footerPdfBtn) {
                    footerPdfBtn.addEventListener('click', function () {
                        openPdfModal(data.pdf, data.name);
                    });
                }
            } else {
                modalFooterPdfAction.innerHTML = '';
            }
        }

        // Attach modal body PDF click
        const bodyPdfBtn = modalBody.querySelector('#modal-body-pdf-btn');
        if (bodyPdfBtn) {
            bodyPdfBtn.addEventListener('click', function () {
                openPdfModal(data.pdf, data.name);
            });
        }

        // Attach modal location cards click
        const passportLocCards = modalBody.querySelectorAll('.passport-loc-card');
        passportLocCards.forEach(card => {
            card.addEventListener('click', function () {
                const idx = parseInt(card.dataset.idx, 10) || 0;
                openGalleryModal(data.visited_locations, idx);
            });
        });

        loyihaModal.style.display = 'flex';
    }

    function closeLoyihaModal() {
        if (loyihaModal) loyihaModal.style.display = 'none';
    }

    // ==========================================
    // KREATIV PDF SLAYD TAQDIMOT VA HUJJAT BOSHQARUVI
    // ==========================================
    function setupPdfModal() {
        pdfModal = document.getElementById('loyiha-pdf-modal');
        pdfModalWindow = document.getElementById('pdf-modal-window');
        pdfFrame = document.getElementById('pdf-frame');
        pdfModalTitle = document.getElementById('pdf-modal-title');
        pdfTagNumber = document.getElementById('pdf-tag-number');
        pdfTagSize = document.getElementById('pdf-tag-size');
        pdfBtnDownload = document.getElementById('pdf-btn-download');
        pdfBtnFullscreen = document.getElementById('pdf-btn-fullscreen');
        closePdfModalBtn = document.getElementById('close-pdf-modal');

        pdfSlideStage = document.getElementById('pdf-slide-stage');
        pdfDocContainer = document.getElementById('pdf-doc-container');
        pdfSlideCanvas = document.getElementById('pdf-slide-canvas');
        pdfSlideCanvasCard = document.getElementById('pdf-slide-canvas-card');
        pdfSlideLoadingOverlay = document.getElementById('pdf-slide-loading-overlay');
        pdfSlideLoadingText = document.getElementById('pdf-slide-loading-text');

        pdfSlideCurr = document.getElementById('pdf-slide-curr');
        pdfSlideTotal = document.getElementById('pdf-slide-total');
        pdfPillCurr = document.getElementById('pdf-pill-curr');
        pdfPillTotal = document.getElementById('pdf-pill-total');
        pdfSlideProgress = document.getElementById('pdf-slide-progress');

        pdfBtnPrevSlide = document.getElementById('pdf-btn-prev-slide');
        pdfBtnNextSlide = document.getElementById('pdf-btn-next-slide');
        pdfPrevSlideFloat = document.getElementById('pdf-prev-slide-float');
        pdfNextSlideFloat = document.getElementById('pdf-next-slide-float');
        pdfBtnAutoplay = document.getElementById('pdf-btn-autoplay');
        pdfBtnToggleMode = document.getElementById('pdf-btn-toggle-mode');
        pdfModeLabel = document.getElementById('pdf-mode-label');
        pdfBadgeGlow = document.getElementById('pdf-badge-glow');
        pdfHeaderModeText = document.getElementById('pdf-header-mode-text');
        pdfSlidesStrip = document.getElementById('pdf-slides-strip');
        pdfSlidesReelWrapper = document.getElementById('pdf-slides-reel-wrapper');

        // Configure PDF.js worker
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/js/pdf.worker.min.js';
        }

        // Close handlers
        if (closePdfModalBtn) closePdfModalBtn.addEventListener('click', closePdfModal);
        if (pdfModal) {
            pdfModal.addEventListener('click', function (e) {
                if (e.target === pdfModal) closePdfModal();
            });
        }

        // Fullscreen toggle
        if (pdfBtnFullscreen && pdfModalWindow) {
            pdfBtnFullscreen.addEventListener('click', function () {
                pdfModalWindow.classList.toggle('fullscreen-mode');
                setTimeout(() => {
                    if (isSlideMode && currentPdfDoc) {
                        renderSlidePage(currentSlidePage);
                    }
                }, 150);
            });
        }

        // Slide navigation buttons
        if (pdfBtnPrevSlide) pdfBtnPrevSlide.addEventListener('click', goToPrevSlide);
        if (pdfPrevSlideFloat) pdfPrevSlideFloat.addEventListener('click', goToPrevSlide);
        if (pdfBtnNextSlide) pdfBtnNextSlide.addEventListener('click', goToNextSlide);
        if (pdfNextSlideFloat) pdfNextSlideFloat.addEventListener('click', goToNextSlide);

        // Autoplay button
        if (pdfBtnAutoplay) pdfBtnAutoplay.addEventListener('click', toggleAutoPlay);

        // Mode toggle (Slide vs Document)
        if (pdfBtnToggleMode) pdfBtnToggleMode.addEventListener('click', togglePdfMode);

        // Touch swipe gestures for tablet users
        setupSlideSwipeGestures();

        // Window resize re-render slide with proper aspect ratio
        window.addEventListener('resize', debounce(() => {
            if (pdfModal && pdfModal.style.display === 'flex' && isSlideMode && currentPdfDoc) {
                renderSlidePage(currentSlidePage);
            }
        }, 200));
    }

    function setupSlideSwipeGestures() {
        if (!pdfSlideStage) return;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        pdfSlideStage.addEventListener('touchstart', function (e) {
            if (e.changedTouches && e.changedTouches[0]) {
                touchStartX = e.changedTouches[0].clientX;
                touchStartY = e.changedTouches[0].clientY;
            }
        }, { passive: true });

        pdfSlideStage.addEventListener('touchend', function (e) {
            if (e.changedTouches && e.changedTouches[0]) {
                touchEndX = e.changedTouches[0].clientX;
                touchEndY = e.changedTouches[0].clientY;
                handleSwipeGesture();
            }
        }, { passive: true });

        function handleSwipeGesture() {
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            // Only trigger if horizontal swipe is significant and larger than vertical
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    goToNextSlide();
                } else {
                    goToPrevSlide();
                }
            }
        }
    }

    function openPdfModal(pdfData, regionName) {
        if (!pdfModal) return;
        const pdf = pdfData || {
            title: "Ilmiy loyiha hisoboti va buyrug'i",
            number: "№ 1628-сон",
            size: "6.1 MB",
            pages: 15,
            url: "/loyiha/hujjat/pdf",
            download_url: "/loyiha/hujjat/pdf/download"
        };

        if (pdfModalTitle) {
            pdfModalTitle.textContent = `${regionName ? regionName + ' — ' : ''}${pdf.title || 'Ilmiy loyiha hisoboti'}`;
        }
        if (pdfTagNumber) pdfTagNumber.textContent = pdf.doc_number || pdf.number || '№ 1628-сон';
        if (pdfTagSize) pdfTagSize.textContent = pdf.file_size || pdf.size || '6.1 MB';

        const viewUrl = pdf.url || '/loyiha/hujjat/pdf';
        const downloadUrl = pdf.download_url || '/loyiha/hujjat/pdf/download';

        if (pdfBtnDownload) pdfBtnDownload.href = downloadUrl;

        // Reset slide mode state
        isSlideMode = true;
        currentSlidePage = 1;
        stopAutoPlay();
        updatePdfModeUI();

        // Open modal
        pdfModal.style.display = 'flex';

        // Load document
        loadPdfDocument(viewUrl);
    }

    function loadPdfDocument(url) {
        currentPdfUrl = url;

        if (pdfSlideLoadingOverlay) {
            pdfSlideLoadingOverlay.style.display = 'flex';
            if (pdfSlideLoadingText) pdfSlideLoadingText.textContent = 'PDF hisobot yuklanmoqda...';
        }

        if (!window.pdfjsLib) {
            console.warn('PDF.js kutubxonasi mavjud emas, standart ko\'rinishga o\'tiladi');
            fallbackToDocMode(url);
            return;
        }

        const loadingTask = window.pdfjsLib.getDocument({
            url: url,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true
        });

        loadingTask.promise.then(function (pdfDoc) {
            currentPdfDoc = pdfDoc;
            totalSlidePages = pdfDoc.numPages || 15;
            updateSlideCounters();
            renderSlideThumbs(totalSlidePages);
            renderSlidePage(1);
        }).catch(function (err) {
            console.warn('PDF.js yuklashda xatolik:', err);
            fallbackToDocMode(url);
        });
    }

    function updateSlideCounters() {
        if (pdfSlideCurr) pdfSlideCurr.textContent = currentSlidePage;
        if (pdfSlideTotal) pdfSlideTotal.textContent = totalSlidePages;
        if (pdfPillCurr) pdfPillCurr.textContent = currentSlidePage;
        if (pdfPillTotal) pdfPillTotal.textContent = totalSlidePages;

        if (pdfSlideProgress) {
            const pct = Math.min(100, Math.max(0, (currentSlidePage / totalSlidePages) * 100));
            pdfSlideProgress.style.width = `${pct}%`;
        }

        // Update nav buttons disabled state
        if (pdfBtnPrevSlide) pdfBtnPrevSlide.disabled = currentSlidePage <= 1;
        if (pdfBtnNextSlide) pdfBtnNextSlide.disabled = currentSlidePage >= totalSlidePages;
        if (pdfPrevSlideFloat) pdfPrevSlideFloat.disabled = currentSlidePage <= 1;
        if (pdfNextSlideFloat) pdfNextSlideFloat.disabled = currentSlidePage >= totalSlidePages;
    }

    function renderSlidePage(pageNum, direction) {
        if (!currentPdfDoc || !pdfSlideCanvas) return;

        if (isRenderingSlide) {
            pendingSlidePage = pageNum;
            return;
        }

        currentSlidePage = pageNum;
        isRenderingSlide = true;
        updateSlideCounters();
        updateActiveThumbnail(pageNum);

        // Apply slide animation
        if (pdfSlideCanvasCard && direction) {
            pdfSlideCanvasCard.classList.remove('slide-in-right', 'slide-in-left');
            // Trigger reflow to restart CSS animation
            void pdfSlideCanvasCard.offsetWidth;
            pdfSlideCanvasCard.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
        }

        if (pdfSlideLoadingOverlay) {
            pdfSlideLoadingOverlay.style.display = 'flex';
            if (pdfSlideLoadingText) pdfSlideLoadingText.textContent = `Slayd ${pageNum} tayyorlanmoqda...`;
        }

        currentPdfDoc.getPage(pageNum).then(function (page) {
            const stageWidth = pdfSlideStage ? (pdfSlideStage.clientWidth - 120) : 900;
            const stageHeight = pdfSlideStage ? (pdfSlideStage.clientHeight - 40) : 600;

            const unscaledViewport = page.getViewport({ scale: 1 });
            const scaleX = stageWidth / unscaledViewport.width;
            const scaleY = stageHeight / unscaledViewport.height;
            const targetScale = Math.min(scaleX, scaleY, 2.0);

            // High-DPI crisp rendering
            const outputScale = window.devicePixelRatio || 1;
            const viewport = page.getViewport({ scale: targetScale });

            const canvas = pdfSlideCanvas;
            const context = canvas.getContext('2d');

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';

            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            const renderContext = {
                canvasContext: context,
                transform: transform,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);

            renderTask.promise.then(function () {
                isRenderingSlide = false;
                if (pdfSlideLoadingOverlay) pdfSlideLoadingOverlay.style.display = 'none';

                if (pendingSlidePage !== null) {
                    const nextTarget = pendingSlidePage;
                    pendingSlidePage = null;
                    renderSlidePage(nextTarget);
                }
            }).catch(function (err) {
                isRenderingSlide = false;
                if (pdfSlideLoadingOverlay) pdfSlideLoadingOverlay.style.display = 'none';
                console.error('Slaydni chizishda xatolik:', err);
            });
        }).catch(function (err) {
            isRenderingSlide = false;
            if (pdfSlideLoadingOverlay) pdfSlideLoadingOverlay.style.display = 'none';
            console.error('Slayd sahifasini olishda xatolik:', err);
        });
    }

    function goToPrevSlide() {
        if (currentSlidePage > 1) {
            renderSlidePage(currentSlidePage - 1, 'prev');
        }
    }

    function goToNextSlide() {
        if (currentSlidePage < totalSlidePages) {
            renderSlidePage(currentSlidePage + 1, 'next');
        } else if (isAutoPlay) {
            // Loop in autoplay
            renderSlidePage(1, 'next');
        }
    }

    function toggleAutoPlay() {
        if (isAutoPlay) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }

    function startAutoPlay() {
        isAutoPlay = true;
        if (pdfBtnAutoplay) {
            pdfBtnAutoplay.classList.add('playing');
            const playIcon = pdfBtnAutoplay.querySelector('.icon-play');
            const pauseIcon = pdfBtnAutoplay.querySelector('.icon-pause');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'inline-block';
        }

        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            goToNextSlide();
        }, 4000);
    }

    function stopAutoPlay() {
        isAutoPlay = false;
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
        if (pdfBtnAutoplay) {
            pdfBtnAutoplay.classList.remove('playing');
            const playIcon = pdfBtnAutoplay.querySelector('.icon-play');
            const pauseIcon = pdfBtnAutoplay.querySelector('.icon-pause');
            if (playIcon) playIcon.style.display = 'inline-block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    }

    function togglePdfMode() {
        isSlideMode = !isSlideMode;
        stopAutoPlay();
        updatePdfModeUI();

        if (isSlideMode) {
            if (currentPdfDoc) {
                renderSlidePage(currentSlidePage);
            } else if (currentPdfUrl) {
                loadPdfDocument(currentPdfUrl);
            }
        } else {
            if (pdfFrame && currentPdfUrl && !pdfFrame.src.endsWith(currentPdfUrl)) {
                pdfFrame.src = currentPdfUrl;
            }
        }
    }

    function updatePdfModeUI() {
        if (isSlideMode) {
            if (pdfSlideStage) pdfSlideStage.style.display = 'flex';
            if (pdfSlidesReelWrapper) pdfSlidesReelWrapper.style.display = 'block';
            if (pdfDocContainer) pdfDocContainer.style.display = 'none';
            if (pdfBtnPrevSlide) pdfBtnPrevSlide.style.display = 'inline-flex';
            if (pdfBtnNextSlide) pdfBtnNextSlide.style.display = 'inline-flex';
            if (pdfBtnAutoplay) pdfBtnAutoplay.style.display = 'inline-flex';
            if (pdfModeLabel) pdfModeLabel.textContent = "Hujjat ko'rinishi";
            if (pdfHeaderModeText) pdfHeaderModeText.textContent = "Slayd";
            if (pdfBadgeGlow) pdfBadgeGlow.classList.remove('doc-mode');
        } else {
            if (pdfSlideStage) pdfSlideStage.style.display = 'none';
            if (pdfSlidesReelWrapper) pdfSlidesReelWrapper.style.display = 'none';
            if (pdfDocContainer) pdfDocContainer.style.display = 'block';
            if (pdfBtnPrevSlide) pdfBtnPrevSlide.style.display = 'none';
            if (pdfBtnNextSlide) pdfBtnNextSlide.style.display = 'none';
            if (pdfBtnAutoplay) pdfBtnAutoplay.style.display = 'none';
            if (pdfModeLabel) pdfModeLabel.textContent = "Slayd ko'rinishi";
            if (pdfHeaderModeText) pdfHeaderModeText.textContent = "Hujjat";
            if (pdfBadgeGlow) pdfBadgeGlow.classList.add('doc-mode');
        }
    }

    function fallbackToDocMode(url) {
        isSlideMode = false;
        updatePdfModeUI();
        if (pdfFrame) pdfFrame.src = url;
        if (pdfSlideLoadingOverlay) pdfSlideLoadingOverlay.style.display = 'none';
    }

    function renderSlideThumbs(numPages) {
        if (!pdfSlidesStrip) return;
        pdfSlidesStrip.innerHTML = '';

        for (let i = 1; i <= numPages; i++) {
            const thumb = document.createElement('div');
            thumb.className = `pdf-slide-thumb ${i === currentSlidePage ? 'active' : ''}`;
            thumb.dataset.page = i;
            thumb.innerHTML = `
                <div class="pdf-thumb-card">
                    <div class="pdf-thumb-preview">
                        <span class="pdf-thumb-icon">📄</span>
                        <span class="pdf-thumb-badge">Slayd ${i}</span>
                    </div>
                    <div class="pdf-thumb-info">
                        <span class="pdf-thumb-number">${i}</span>
                    </div>
                </div>
            `;
            thumb.addEventListener('click', function () {
                const targetPage = parseInt(this.dataset.page, 10);
                if (targetPage !== currentSlidePage) {
                    renderSlidePage(targetPage, targetPage > currentSlidePage ? 'next' : 'prev');
                }
            });
            pdfSlidesStrip.appendChild(thumb);
        }
    }

    function updateActiveThumbnail(pageNum) {
        if (!pdfSlidesStrip) return;
        const thumbs = pdfSlidesStrip.querySelectorAll('.pdf-slide-thumb');
        thumbs.forEach(t => {
            const p = parseInt(t.dataset.page, 10);
            if (p === pageNum) {
                t.classList.add('active');
                // Scroll thumbnail into view
                t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                t.classList.remove('active');
            }
        });
    }

    function closePdfModal() {
        stopAutoPlay();
        if (pdfModal) pdfModal.style.display = 'none';
        if (pdfModalWindow) pdfModalWindow.classList.remove('fullscreen-mode');
    }

    // ==========================================
    // DALA TADQIQOTI FOTOGALEREYASI LIGHTBOX
    // ==========================================
    function setupGalleryModal() {
        galleryModal = document.getElementById('loyiha-gallery-modal');
        galleryPhotoTitle = document.getElementById('gallery-photo-title');
        galleryCategoryBadge = document.getElementById('gallery-category-badge');
        galleryCounter = document.getElementById('gallery-counter');
        closeGalleryModalBtn = document.getElementById('close-gallery-modal');
        galleryCurrentImage = document.getElementById('gallery-current-image');
        galleryAddress = document.getElementById('gallery-address');
        galleryDate = document.getElementById('gallery-date');
        galleryCaption = document.getElementById('gallery-caption');
        galleryThumbsRow = document.getElementById('gallery-thumbs-row');
        galleryPrevBtn = document.getElementById('gallery-prev-btn');
        galleryNextBtn = document.getElementById('gallery-next-btn');

        if (closeGalleryModalBtn) closeGalleryModalBtn.addEventListener('click', closeGalleryModal);
        if (galleryModal) {
            galleryModal.addEventListener('click', function (e) {
                if (e.target === galleryModal) closeGalleryModal();
            });
        }
        if (galleryPrevBtn) {
            galleryPrevBtn.addEventListener('click', function () {
                navigateGallery(-1);
            });
        }
        if (galleryNextBtn) {
            galleryNextBtn.addEventListener('click', function () {
                navigateGallery(1);
            });
        }
    }

    function openGalleryModal(locations, startIndex) {
        if (!galleryModal || !locations || locations.length === 0) return;
        currentGalleryLocations = locations;
        currentGalleryIndex = (startIndex >= 0 && startIndex < locations.length) ? startIndex : 0;

        renderGalleryThumbs();
        showGalleryPhoto(currentGalleryIndex);

        galleryModal.style.display = 'flex';
    }

    function renderGalleryThumbs() {
        if (!galleryThumbsRow) return;
        galleryThumbsRow.innerHTML = currentGalleryLocations.map((loc, idx) => `
            <div class="gallery-thumb-item ${idx === currentGalleryIndex ? 'active' : ''}" data-idx="${idx}">
                <img src="${loc.image}" alt="${loc.title}">
            </div>
        `).join('');

        galleryThumbsRow.querySelectorAll('.gallery-thumb-item').forEach(thumb => {
            thumb.addEventListener('click', function () {
                const idx = parseInt(thumb.dataset.idx, 10);
                showGalleryPhoto(idx);
            });
        });
    }

    function showGalleryPhoto(index) {
        if (!currentGalleryLocations || currentGalleryLocations.length === 0) return;
        if (index < 0) index = currentGalleryLocations.length - 1;
        if (index >= currentGalleryLocations.length) index = 0;
        currentGalleryIndex = index;

        const loc = currentGalleryLocations[index];

        if (galleryCurrentImage) {
            galleryCurrentImage.style.opacity = '0';
            setTimeout(() => {
                galleryCurrentImage.src = loc.image;
                galleryCurrentImage.style.opacity = '1';
            }, 80);
        }
        if (galleryPhotoTitle) galleryPhotoTitle.textContent = loc.title;
        if (galleryCategoryBadge) {
            galleryCategoryBadge.textContent = loc.category;
            galleryCategoryBadge.style.color = loc.category_badge || '#38BDF8';
            galleryCategoryBadge.style.borderColor = (loc.category_badge || '#38BDF8') + '60';
        }
        if (galleryCounter) {
            galleryCounter.textContent = `${index + 1} / ${currentGalleryLocations.length}`;
        }
        if (galleryAddress) galleryAddress.textContent = loc.address;
        if (galleryDate) galleryDate.textContent = loc.date;
        if (galleryCaption) galleryCaption.textContent = loc.caption;

        if (galleryThumbsRow) {
            galleryThumbsRow.querySelectorAll('.gallery-thumb-item').forEach((thumb, i) => {
                if (i === index) thumb.classList.add('active');
                else thumb.classList.remove('active');
            });
        }
    }

    function navigateGallery(step) {
        showGalleryPhoto(currentGalleryIndex + step);
    }

    function closeGalleryModal() {
        if (galleryModal) galleryModal.style.display = 'none';
    }

    // ==========================================
    // NAVOIY ILMIY TAQDIMOT SLAYDLARI MODALI (1.jpg, 2.jpg, 3.jpg)
    // ==========================================
    const navoiSlidesData = [
        {
            img: '/img/1.jpg',
            tag: '1-Slayd',
            title: 'Республика бўйича жиноятлар турлари (2025 йилда қайд этилган жиноятлар — Навоий вилояти таҳлили)'
        },
        {
            img: '/img/2.jpg',
            tag: '2-Slayd',
            title: 'Навоий вилояти жиноятчилиги омиллари (Криминоген омиллар ва устувор йўналишлар)'
        },
        {
            img: '/img/3.jpg',
            tag: '3-Slayd',
            title: 'Таклифлар (Жиноятчилик профилактикасини кучайтириш бўйича 11 та асосий таклиф ва кутилган натижа)'
        }
    ];

    let navoiReportCoverBadge = null;
    let navoiSlidesModal = null;
    let navoiSlidesWindow = null;
    let navoiActiveSlideImg = null;
    let navoiCaptionTag = null;
    let navoiCaptionText = null;
    let navoiSlideProgress = null;
    let navoiCurrentSlideIdx = null;
    let navoiTotalSlides = null;
    let navoiBtnPrev = null;
    let navoiBtnNext = null;
    let navoiFloatPrev = null;
    let navoiFloatNext = null;
    let navoiBtnAutoplay = null;
    let navoiBtnFullscreen = null;
    let closeNavoiSlidesModalBtn = null;
    let navoiThumbsReel = null;
    let currentNavoiSlide = 0;
    let isNavoiAutoplay = false;
    let navoiAutoplayTimer = null;

    function setupNavoiSlidesModal() {
        navoiReportCoverBadge = document.getElementById('navoi-report-cover-badge');
        navoiSlidesModal = document.getElementById('navoi-slides-modal');
        navoiSlidesWindow = document.getElementById('navoi-slides-window');
        navoiActiveSlideImg = document.getElementById('navoi-active-slide-img');
        navoiCaptionTag = document.getElementById('navoi-caption-tag');
        navoiCaptionText = document.getElementById('navoi-caption-text');
        navoiSlideProgress = document.getElementById('navoi-slide-progress');
        navoiCurrentSlideIdx = document.getElementById('navoi-current-slide-idx');
        navoiTotalSlides = document.getElementById('navoi-total-slides');

        navoiBtnPrev = document.getElementById('navoi-btn-prev');
        navoiBtnNext = document.getElementById('navoi-btn-next');
        navoiFloatPrev = document.getElementById('navoi-float-prev');
        navoiFloatNext = document.getElementById('navoi-float-next');
        navoiBtnAutoplay = document.getElementById('navoi-btn-autoplay');
        navoiBtnFullscreen = document.getElementById('navoi-btn-fullscreen');
        closeNavoiSlidesModalBtn = document.getElementById('close-navoi-slides-modal');
        navoiThumbsReel = document.getElementById('navoi-thumbs-reel');

        window.openNavoiSlidesModal = openNavoiSlidesModal;

        // Click on top-left Navoiy cover badge opens modal
        if (navoiReportCoverBadge) {
            navoiReportCoverBadge.addEventListener('click', function (e) {
                e.stopPropagation();
                openNavoiSlidesModal(0);
            });
            const innerImg = navoiReportCoverBadge.querySelector('img');
            if (innerImg) {
                innerImg.addEventListener('click', function (e) {
                    e.stopPropagation();
                    openNavoiSlidesModal(0);
                });
            }
        }

        // Close handlers
        if (closeNavoiSlidesModalBtn) {
            closeNavoiSlidesModalBtn.addEventListener('click', closeNavoiSlidesModal);
        }
        if (navoiSlidesModal) {
            navoiSlidesModal.addEventListener('click', function (e) {
                if (e.target === navoiSlidesModal) closeNavoiSlidesModal();
            });
        }

        // Prev & Next handlers
        if (navoiBtnPrev) navoiBtnPrev.addEventListener('click', navoiPrevSlide);
        if (navoiFloatPrev) navoiFloatPrev.addEventListener('click', navoiPrevSlide);
        if (navoiBtnNext) navoiBtnNext.addEventListener('click', navoiNextSlide);
        if (navoiFloatNext) navoiFloatNext.addEventListener('click', navoiNextSlide);

        // Autoplay toggle
        if (navoiBtnAutoplay) navoiBtnAutoplay.addEventListener('click', toggleNavoiAutoplay);

        // Fullscreen toggle
        if (navoiBtnFullscreen && navoiSlidesWindow) {
            navoiBtnFullscreen.addEventListener('click', function () {
                navoiSlidesWindow.classList.toggle('fullscreen-mode');
            });
        }

        // Thumbnail reel clicks
        if (navoiThumbsReel) {
            const thumbs = navoiThumbsReel.querySelectorAll('.navoi-thumb-item');
            thumbs.forEach(t => {
                t.addEventListener('click', function () {
                    const idx = parseInt(this.dataset.index, 10);
                    if (!isNaN(idx) && idx !== currentNavoiSlide) {
                        showNavoiSlide(idx, idx > currentNavoiSlide ? 'next' : 'prev');
                    }
                });
            });
        }

        // Touch swipe gestures
        setupNavoiSwipeGestures();
    }

    function setupNavoiSwipeGestures() {
        const stage = document.getElementById('navoi-slide-stage');
        if (!stage) return;
        let startX = 0;
        let startY = 0;

        stage.addEventListener('touchstart', function (e) {
            if (e.changedTouches && e.changedTouches[0]) {
                startX = e.changedTouches[0].clientX;
                startY = e.changedTouches[0].clientY;
            }
        }, { passive: true });

        stage.addEventListener('touchend', function (e) {
            if (e.changedTouches && e.changedTouches[0]) {
                const diffX = e.changedTouches[0].clientX - startX;
                const diffY = e.changedTouches[0].clientY - startY;
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX < 0) navoiNextSlide();
                    else navoiPrevSlide();
                }
            }
        }, { passive: true });
    }

    function openNavoiSlidesModal(startIndex) {
        if (!navoiSlidesModal) {
            navoiSlidesModal = document.getElementById('navoi-slides-modal');
        }
        if (!navoiSlidesWindow) {
            navoiSlidesWindow = document.getElementById('navoi-slides-window');
        }
        if (!navoiActiveSlideImg) {
            navoiActiveSlideImg = document.getElementById('navoi-active-slide-img');
        }
        if (!navoiSlidesModal) return;
        currentNavoiSlide = (startIndex >= 0 && startIndex < navoiSlidesData.length) ? startIndex : 0;
        stopNavoiAutoplay();
        showNavoiSlide(currentNavoiSlide);
        navoiSlidesModal.style.display = 'flex';
    }

    window.openNavoiSlidesModal = openNavoiSlidesModal;
    window.closeNavoiSlidesModal = closeNavoiSlidesModal;

    function closeNavoiSlidesModal() {
        stopNavoiAutoplay();
        if (navoiSlidesModal) navoiSlidesModal.style.display = 'none';
        if (navoiSlidesWindow) navoiSlidesWindow.classList.remove('fullscreen-mode');
    }

    function showNavoiSlide(index, direction) {
        if (index < 0 || index >= navoiSlidesData.length) return;
        currentNavoiSlide = index;
        const slide = navoiSlidesData[index];

        const slideFrame = document.getElementById('navoi-slide-frame');
        if (slideFrame && direction) {
            slideFrame.classList.remove('anim-next', 'anim-prev');
            void slideFrame.offsetWidth;
            slideFrame.classList.add(direction === 'next' ? 'anim-next' : 'anim-prev');
        }

        if (navoiActiveSlideImg) {
            navoiActiveSlideImg.src = slide.img;
            navoiActiveSlideImg.alt = slide.title;
        }
        if (navoiCaptionTag) navoiCaptionTag.textContent = slide.tag;
        if (navoiCaptionText) navoiCaptionText.textContent = slide.title;
        if (navoiCurrentSlideIdx) navoiCurrentSlideIdx.textContent = index + 1;
        if (navoiTotalSlides) navoiTotalSlides.textContent = navoiSlidesData.length;

        if (navoiSlideProgress) {
            const pct = ((index + 1) / navoiSlidesData.length) * 100;
            navoiSlideProgress.style.width = `${pct}%`;
        }

        // Update nav buttons disabled state
        if (navoiBtnPrev) navoiBtnPrev.disabled = index === 0;
        if (navoiFloatPrev) navoiFloatPrev.disabled = index === 0;
        if (navoiBtnNext) navoiBtnNext.disabled = index === navoiSlidesData.length - 1;
        if (navoiFloatNext) navoiFloatNext.disabled = index === navoiSlidesData.length - 1;

        // Update thumbnails
        if (navoiThumbsReel) {
            const thumbs = navoiThumbsReel.querySelectorAll('.navoi-thumb-item');
            thumbs.forEach((t, i) => {
                if (i === index) {
                    t.classList.add('active');
                    t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    t.classList.remove('active');
                }
            });
        }
    }

    function navoiPrevSlide() {
        if (currentNavoiSlide > 0) {
            showNavoiSlide(currentNavoiSlide - 1, 'prev');
        }
    }

    function navoiNextSlide() {
        if (currentNavoiSlide < navoiSlidesData.length - 1) {
            showNavoiSlide(currentNavoiSlide + 1, 'next');
        } else if (isNavoiAutoplay) {
            showNavoiSlide(0, 'next');
        }
    }

    function toggleNavoiAutoplay() {
        if (isNavoiAutoplay) {
            stopNavoiAutoplay();
        } else {
            startNavoiAutoplay();
        }
    }

    function startNavoiAutoplay() {
        isNavoiAutoplay = true;
        if (navoiBtnAutoplay) {
            navoiBtnAutoplay.classList.add('playing');
            const playIcon = navoiBtnAutoplay.querySelector('.icon-play');
            const pauseIcon = navoiBtnAutoplay.querySelector('.icon-pause');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'inline-block';
        }
        if (navoiAutoplayTimer) clearInterval(navoiAutoplayTimer);
        navoiAutoplayTimer = setInterval(() => {
            navoiNextSlide();
        }, 5000);
    }

    function stopNavoiAutoplay() {
        isNavoiAutoplay = false;
        if (navoiAutoplayTimer) {
            clearInterval(navoiAutoplayTimer);
            navoiAutoplayTimer = null;
        }
        if (navoiBtnAutoplay) {
            navoiBtnAutoplay.classList.remove('playing');
            const playIcon = navoiBtnAutoplay.querySelector('.icon-play');
            const pauseIcon = navoiBtnAutoplay.querySelector('.icon-pause');
            if (playIcon) playIcon.style.display = 'inline-block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    }

    // ==========================================
    // HEADER CONTROLS (Fullscreen, Drawer, Font)
    // ==========================================
    function setupHeaderControls() {
        // Drawer toggle (stats-toggle-btn)
        if (toggleStatsBtn) {
            toggleStatsBtn.addEventListener('click', function () {
                if (countryPanel) countryPanel.classList.toggle('drawer-open');
            });
        }
        if (closeCountryPanel) {
            closeCountryPanel.addEventListener('click', function () {
                if (countryPanel) countryPanel.classList.remove('drawer-open');
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function () {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
            document.addEventListener('fullscreenchange', function () {
                const isFs = !!document.fullscreenElement;
                const exp = fullscreenBtn.querySelector('.icon-expand');
                const comp = fullscreenBtn.querySelector('.icon-compress');
                if (exp) exp.style.display = isFs ? 'none' : 'block';
                if (comp) comp.style.display = isFs ? 'block' : 'none';
            });
        }

        // Font size control
        setupFontSizeControls();
    }

    function setupFontSizeControls() {
        const decreaseBtn = document.getElementById('font-decrease-btn');
        const increaseBtn = document.getElementById('font-increase-btn');
        const resetBtn = document.getElementById('font-reset-btn');
        const indicator = document.getElementById('font-size-val');

        let currentScale = 100;
        const minScale = 85;
        const maxScale = 135;
        const step = 5;

        const saved = localStorage.getItem('kriminologiya_font_scale');
        if (saved) {
            currentScale = parseInt(saved, 10);
            applyFontScale(currentScale);
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', function () {
                if (currentScale > minScale) {
                    currentScale -= step;
                    applyFontScale(currentScale);
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', function () {
                if (currentScale < maxScale) {
                    currentScale += step;
                    applyFontScale(currentScale);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                currentScale = 100;
                applyFontScale(currentScale);
            });
        }

        function applyFontScale(scale) {
            document.documentElement.style.setProperty('--font-scale', `${scale}%`);
            if (indicator) indicator.textContent = `${scale}%`;
            localStorage.setItem('kriminologiya_font_scale', scale);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function handleResize() {
        if (window.innerWidth <= 1024) {
            if (countryPanel) countryPanel.classList.remove('drawer-open');
        }
    }

})();

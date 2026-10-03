/**
 * Kriminologiya Tadqiqot Instituti
 * Jinoyatchilik Statistikasi - Interaktiv Xarita
 * 2026-yil Rasmiy Statistik Ma'lumotlar Asosida (Lotin alifbosi)
 * Viloyatlar va Tumanlar Kesimidagi 3D Interaktiv Xarita
 */

(function () {
    'use strict';

    // State
    let currentRegion = null;
    let currentDistrict = null;
    let isAnimating = false;
    let regionsData = {};
    let districtsSvgData = {};
    let originalViewBox = { x: 0, y: 0, width: 792.49, height: 516.88 };

    // Pan / Drag State
    let isDragging = false;
    let hasMoved = false;
    let dragStart = { x: 0, y: 0 };
    let vbStart = { x: 0, y: 0 };

    // DOM Elements
    let mapContainer, svgMap, infoPanel, backButton, mapTitle, mapPrompt, countryPanel;
    let toggleStatsBtn, closeCountryPanel, panelBackdrop, fullscreenBtn;
    let ctrlZoomIn, ctrlZoomOut, ctrlReset;
    let districtMapContainer, districtSvgStage, districtMapRegionName, districtMapCountBadge, btnBackToCountry;

    function init() {
        mapContainer = document.getElementById('map-container');
        svgMap = document.getElementById('uzbekistan-map');
        infoPanel = document.getElementById('region-info-panel');
        backButton = document.getElementById('back-button');
        mapTitle = document.getElementById('map-title');
        mapPrompt = document.getElementById('map-prompt');
        countryPanel = document.getElementById('country-stats-panel');
        toggleStatsBtn = document.getElementById('toggle-stats-btn');
        closeCountryPanel = document.getElementById('close-country-panel');
        panelBackdrop = document.getElementById('panel-backdrop');
        fullscreenBtn = document.getElementById('fullscreen-btn');
        ctrlZoomIn = document.getElementById('ctrl-zoom-in');
        ctrlZoomOut = document.getElementById('ctrl-zoom-out');
        ctrlReset = document.getElementById('ctrl-reset');

        districtMapContainer = document.getElementById('district-map-container');
        districtSvgStage = document.getElementById('district-svg-stage');
        districtMapRegionName = document.getElementById('district-map-region-name');
        districtMapCountBadge = document.getElementById('district-map-count-badge');
        btnBackToCountry = document.getElementById('btn-back-to-country');

        if (!svgMap) return;

        // Store original viewBox
        if (svgMap.dataset.originalViewbox) {
            const parts = svgMap.dataset.originalViewbox.split(/[\s,]+/).map(Number);
            originalViewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
        } else {
            const vb = svgMap.viewBox.baseVal;
            originalViewBox = { x: vb.x, y: vb.y, width: vb.width, height: vb.height };
            svgMap.dataset.originalViewbox = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
        }

        // Attach region interactions
        const regions = svgMap.querySelectorAll('[data-region]');
        regions.forEach(function (region) {
            region.addEventListener('click', handleRegionClick);
            region.addEventListener('touchend', handleRegionTouch, { passive: false });
            region.addEventListener('mouseenter', handleRegionHover);
            region.addEventListener('mouseleave', handleRegionLeave);
        });

        // Controls
        if (backButton) {
            backButton.addEventListener('click', resetMap);
        }
        if (btnBackToCountry) {
            btnBackToCountry.addEventListener('click', resetMap);
        }

        if (ctrlZoomIn) {
            ctrlZoomIn.addEventListener('click', function (e) { e.stopPropagation(); zoomBy(0.75); });
        }
        if (ctrlZoomOut) {
            ctrlZoomOut.addEventListener('click', function (e) { e.stopPropagation(); zoomBy(1.33); });
        }
        if (ctrlReset) {
            ctrlReset.addEventListener('click', function (e) { e.stopPropagation(); resetMap(); });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
            document.addEventListener('fullscreenchange', updateFullscreenIcon);
            document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
        }

        // Font size control setup
        setupFontSizeControls();

        // Stats panel toggle for mobile/tablet
        if (toggleStatsBtn) {
            toggleStatsBtn.addEventListener('click', toggleCountryDrawer);
        }
        if (closeCountryPanel) {
            closeCountryPanel.addEventListener('click', closeCountryDrawer);
        }
        if (panelBackdrop) {
            panelBackdrop.addEventListener('click', function () {
                closeCountryDrawer();
            });
        }

        // Country tabs setup
        setupTabListeners(document.getElementById('country-tabs'));

        // Drag / Pan interaction when zoomed in
        setupPanListeners();

        // Load pre-rendered regions data
        const dataEl = document.getElementById('regions-data');
        if (dataEl) {
            try {
                const parsed = JSON.parse(dataEl.textContent);
                if (Array.isArray(parsed)) {
                    parsed.forEach(function (r) { regionsData[r.slug] = r; });
                } else {
                    regionsData = parsed;
                }
            } catch (e) {
                console.warn('Could not parse regions data');
            }
        }

        // Pre-load all regions districts SVG maps
        fetch('/assets/maps/all_regions_districts_svg.json')
            .then(function (res) { return res.json(); })
            .then(function (json) {
                districtsSvgData = json;
            })
            .catch(function (err) {
                console.warn('Could not load districts SVG maps:', err);
            });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (currentRegion) resetMap();
                else closeCountryDrawer();
            }
        });

        // Window resize / orientation change listener
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 150);
        });
        window.addEventListener('orientationchange', function () {
            setTimeout(handleResize, 200);
        });
    }

    // Tab Switching Helper
    function setupTabListeners(tabsContainer) {
        if (!tabsContainer) return;
        const btns = tabsContainer.querySelectorAll('.panel-tab-btn');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const targetId = btn.dataset.target;
                if (!targetId) return;

                btns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                const parent = tabsContainer.closest('.country-stats-panel') || tabsContainer.closest('#region-info-panel');
                if (parent) {
                    const panes = parent.querySelectorAll('.tab-pane');
                    panes.forEach(function (p) { p.classList.remove('active'); });
                    const activePane = parent.querySelector('#' + targetId);
                    if (activePane) {
                        activePane.classList.add('active');
                        animatePaneBars(activePane);
                    }
                }
            });
        });
    }

    function animatePaneBars(pane) {
        if (!pane) return;
        const bars = pane.querySelectorAll('.bar-fill[data-target]');
        bars.forEach(function (bar, i) {
            setTimeout(function () {
                bar.style.width = bar.dataset.target;
            }, 40 + i * 30);
        });
    }

    // Fullscreen support
    function toggleFullscreen() {
        const doc = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (doc.requestFullscreen) {
                doc.requestFullscreen().catch(function () {});
            } else if (doc.webkitRequestFullscreen) {
                doc.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(function () {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    function updateFullscreenIcon() {
        if (!fullscreenBtn) return;
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
        const iconExpand = fullscreenBtn.querySelector('.icon-expand');
        const iconCompress = fullscreenBtn.querySelector('.icon-compress');
        if (iconExpand && iconCompress) {
            iconExpand.style.display = isFS ? 'none' : 'block';
            iconCompress.style.display = isFS ? 'block' : 'none';
        }
    }

    // Font Size Controls with LocalStorage persistence
    function setupFontSizeControls() {
        const decreaseBtn = document.getElementById('font-decrease-btn');
        const increaseBtn = document.getElementById('font-increase-btn');
        const resetBtn = document.getElementById('font-reset-btn');
        const indicator = document.getElementById('font-size-val');

        if (!decreaseBtn && !increaseBtn && !resetBtn) return;

        const MIN_SCALE = 0.80;
        const MAX_SCALE = 1.45;
        const STEP = 0.10;

        let currentScale = 1.0;
        try {
            const saved = localStorage.getItem('preferred_font_scale');
            if (saved) {
                const parsed = parseFloat(saved);
                if (!isNaN(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
                    currentScale = parsed;
                }
            }
        } catch (e) {}

        function applyScale(scale) {
            scale = Math.round(scale * 100) / 100;
            currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

            document.documentElement.style.setProperty('--font-scale', currentScale);

            if (indicator) {
                indicator.textContent = Math.round(currentScale * 100) + '%';
            }

            if (decreaseBtn) {
                decreaseBtn.disabled = (currentScale <= MIN_SCALE + 0.01);
            }
            if (increaseBtn) {
                increaseBtn.disabled = (currentScale >= MAX_SCALE - 0.01);
            }

            try {
                localStorage.setItem('preferred_font_scale', currentScale);
            } catch (e) {}
        }

        applyScale(currentScale);

        decreaseBtn.addEventListener('click', function () {
            applyScale(currentScale - STEP);
        });

        increaseBtn.addEventListener('click', function () {
            applyScale(currentScale + STEP);
        });

        resetBtn.addEventListener('click', function () {
            applyScale(1.0);
        });
    }

    // Drawer management (Mobile / Tablet)
    function toggleCountryDrawer() {
        if (!countryPanel) return;
        if (countryPanel.classList.contains('drawer-open')) {
            closeCountryDrawer();
        } else {
            countryPanel.classList.add('drawer-open');
            if (panelBackdrop) panelBackdrop.classList.add('active');
        }
    }

    function closeCountryDrawer() {
        if (countryPanel) countryPanel.classList.remove('drawer-open');
        if (panelBackdrop) panelBackdrop.classList.remove('active');
    }

    // Touch & Click handlers
    function handleRegionTouch(e) {
        if (hasMoved) return;
        const slug = e.currentTarget.dataset.region;
        if (slug && !isAnimating) {
            e.preventDefault();
            openRegion(slug, e.currentTarget);
        }
    }

    function handleRegionClick(e) {
        if (hasMoved || isAnimating) return;
        const slug = e.currentTarget.dataset.region;
        if (slug) {
            openRegion(slug, e.currentTarget);
        }
    }

    function handleRegionHover(e) {
        if (currentRegion || isAnimating || isDragging) return;
        e.currentTarget.classList.add('region-hover');
        const name = e.currentTarget.dataset.name;
        if (name) showTooltip(name, e);
    }

    function handleRegionLeave(e) {
        e.currentTarget.classList.remove('region-hover');
        hideTooltip();
    }

    function showTooltip(name, e, extraText) {
        let tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'map-tooltip';
            tooltip.className = 'map-tooltip';
            mapContainer.appendChild(tooltip);
        }
        if (extraText) {
            tooltip.innerHTML = `<div class="tooltip-name" style="font-weight:700;margin-bottom:3px;color:var(--text-white);">${name}</div><div class="tooltip-desc" style="font-size:11px;color:var(--text-muted);line-height:1.4;">${extraText}</div>`;
        } else {
            tooltip.textContent = name;
        }
        tooltip.style.display = 'block';
        positionTooltip(e, tooltip);
        mapContainer.addEventListener('mousemove', moveTooltip);
    }

    function moveTooltip(e) {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip && tooltip.style.display !== 'none') {
            positionTooltip(e, tooltip);
        }
    }

    function positionTooltip(e, tooltip) {
        const rect = mapContainer.getBoundingClientRect();
        let left = e.clientX - rect.left + 16;
        let top = e.clientY - rect.top - 12;

        const ttWidth = tooltip.offsetWidth || 140;
        if (left + ttWidth > rect.width - 10) {
            left = e.clientX - rect.left - ttWidth - 16;
        }
        if (top < 10) top = 10;

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) tooltip.style.display = 'none';
        if (mapContainer) mapContainer.removeEventListener('mousemove', moveTooltip);
    }

    // Dynamic visible map aspect ratio calculation
    function getVisibleMapAspect(willPanelOpen) {
        const rect = mapContainer.getBoundingClientRect();
        const isTabletOrPortrait = window.innerWidth <= 992 || window.matchMedia('(orientation: portrait)').matches;

        let visibleW = rect.width;
        let visibleH = rect.height;

        if (willPanelOpen) {
            if (!isTabletOrPortrait) {
                let panelW = 420;
                if (window.innerWidth >= 1440) panelW = 440;
                else if (window.innerWidth <= 1280) panelW = 370;
                visibleW = Math.max(visibleW - panelW, 280);
            } else {
                visibleH = Math.max(visibleH * 0.48, 200);
            }
        }

        return Math.max(visibleW / (visibleH || 1), 0.5);
    }

    // Calculate optimal viewBox for a region
    function calculateTargetViewBox(regionElement) {
        const bbox = regionElement.getBBox();
        const origW = originalViewBox.width;
        const origH = originalViewBox.height;

        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        const padding = 1.35;
        const zoomWidth = bbox.width * padding;
        const zoomHeight = bbox.height * padding;

        const targetAspect = getVisibleMapAspect(true);
        let finalWidth, finalHeight;

        if (zoomWidth / zoomHeight > targetAspect) {
            finalWidth = zoomWidth;
            finalHeight = zoomWidth / targetAspect;
        } else {
            finalHeight = zoomHeight;
            finalWidth = zoomHeight * targetAspect;
        }

        const minSize = Math.min(origW, origH) * 0.22;
        if (finalWidth < minSize) {
            const scale = minSize / finalWidth;
            finalWidth = minSize;
            finalHeight *= scale;
        }

        return {
            x: centerX - finalWidth / 2,
            y: centerY - finalHeight / 2,
            width: finalWidth,
            height: finalHeight
        };
    }

    // Normalize district name for comparison
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
            const cDb = cleanDistrictName(d.district_name);
            if (cSvg === cDb || cSvg.includes(cDb) || cDb.includes(cSvg)) {
                return d;
            }
        }
        return null;
    }

    // ==========================================
    // OPEN REGION (Viloyat asosiyga chiqadi)
    // ==========================================
    function openRegion(slug, regionElement) {
        if (isAnimating || currentRegion === slug) return;
        isAnimating = true;
        currentRegion = slug;
        currentDistrict = null;
        hideTooltip();
        closeCountryDrawer();

        const newViewBox = calculateTargetViewBox(regionElement);

        // Highlight national map region with 3D raised dark styling (no red borders!)
        svgMap.querySelectorAll('[data-region]').forEach(function (r) {
            if (r.dataset.region === slug) {
                r.classList.add('region-active');
                r.classList.remove('region-inactive');
            } else {
                r.classList.add('region-inactive');
                r.classList.remove('region-active');
            }
            r.classList.remove('region-hover');
        });

        if (backButton) backButton.classList.add('visible');
        if (mapPrompt) mapPrompt.classList.add('hidden');
        if (countryPanel) countryPanel.classList.add('hidden');
        if (mapContainer) mapContainer.classList.add('panel-open');

        if (mapTitle) {
            mapTitle.textContent = regionElement.dataset.name || slug;
            mapTitle.classList.add('region-selected');
        }

        // Load and show region details in right panel
        showInfoPanel(slug);

        // Zoom animation into the region
        animateViewBox(svgMap, newViewBox, 500, function () {
            isAnimating = false;
            // Reveal and render the region's district SVG breakdown map!
            renderDistrictMap(slug);
        });
    }

    // ==========================================
    // RENDER DISTRICT BREAKDOWN MAP
    // ==========================================
    function renderDistrictMap(slug) {
        if (!districtMapContainer || !districtSvgStage) return;

        const regionData = regionsData[slug];
        const svgInfo = districtsSvgData ? districtsSvgData[slug] : null;

        if (!svgInfo) {
            // If districts SVG is not loaded yet, fetch and retry
            fetch('/assets/maps/all_regions_districts_svg.json')
                .then(r => r.json())
                .then(json => {
                    districtsSvgData = json;
                    renderDistrictMap(slug);
                })
                .catch(() => {});
            return;
        }

        const regionName = (regionData && regionData.name) ? regionData.name : svgInfo.name;
        const dbDistricts = (regionData && regionData.districts) ? regionData.districts : [];

        if (districtMapRegionName) {
            districtMapRegionName.textContent = regionName;
        }
        if (districtMapCountBadge) {
            districtMapCountBadge.textContent = `${dbDistricts.length || svgInfo.districts.length} ta tuman va shahar`;
        }

        // Build SVG with 3D raise filter and interactive paths
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
            const matchedDb = matchDistrict(d.name, dbDistricts);
            const total = matchedDb ? matchedDb.total_crimes : 0;
            const rate = matchedDb ? matchedDb.crime_rate_per_100k : 0;

            svgHtml += `<path class="district-path" data-district-name="${d.name}" data-total="${total}" data-rate="${rate}" d="${d.path}" />`;
        });

        svgHtml += `</g>`;
        svgHtml += `<g id="district-labels-group"></g>`;
        svgHtml += `</svg>`;

        districtSvgStage.innerHTML = svgHtml;

        // Attach events to district paths
        const paths = districtSvgStage.querySelectorAll('.district-path');
        const labelsGroup = districtSvgStage.querySelector('#district-labels-group');

        paths.forEach(p => {
            const distName = p.dataset.districtName;
            const matchedDb = matchDistrict(distName, dbDistricts);

            // Hover tooltip
            p.addEventListener('mouseenter', function (e) {
                if (currentDistrict === distName) return;
                let extra = '';
                if (matchedDb) {
                    extra = `Jami jinoyatlar: <b>${formatNumber(matchedDb.total_crimes)} ta</b><br>100 ming aholiga: <b>${matchedDb.crime_rate_per_100k || '—'}</b><br>Ochilganlik: <b>${matchedDb.solved_rate ? matchedDb.solved_rate + '%' : '—'}</b>`;
                }
                showTooltip(distName, e, extra);
            });

            p.addEventListener('mousemove', function (e) {
                const tt = document.getElementById('map-tooltip');
                if (tt && tt.style.display !== 'none') {
                    positionTooltip(e, tt);
                }
            });

            p.addEventListener('mouseleave', function () {
                hideTooltip();
            });

            // Click: select district & show district statistics!
            p.addEventListener('click', function (e) {
                e.stopPropagation();
                hideTooltip();
                selectDistrict(matchedDb, distName, regionData);
            });

            p.addEventListener('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();
                hideTooltip();
                selectDistrict(matchedDb, distName, regionData);
            });

            // Add text label if area permits
            try {
                const bbox = p.getBBox();
                if (bbox.width > 26 && bbox.height > 16 && labelsGroup) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', bbox.x + bbox.width / 2);
                    text.setAttribute('y', bbox.y + bbox.height / 2 + 3);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('class', 'district-svg-label');
                    text.textContent = distName.replace(/(tumani|shahri|shahar)$/i, '').trim();
                    labelsGroup.appendChild(text);
                }
            } catch (err) {}
        });

        districtMapContainer.style.display = 'flex';
    }

    // ==========================================
    // SELECT DISTRICT (Tumanga tegishli ma'lumotlar)
    // ==========================================
    function selectDistrict(dStats, districtName, regionData) {
        currentDistrict = districtName;

        // Highlight district path in 3D raised dark style (no red!)
        const paths = districtSvgStage ? districtSvgStage.querySelectorAll('.district-path') : [];
        paths.forEach(p => {
            const pName = p.dataset.districtName;
            if (cleanDistrictName(pName) === cleanDistrictName(districtName)) {
                p.classList.add('district-active');
            } else {
                p.classList.remove('district-active');
            }
        });

        // Fallback stats if DB item not found directly
        const stats = dStats || {
            district_name: districtName,
            total_crimes: 0,
            crime_rate_per_100k: 0,
            solved_rate: 0,
            crimes_light: 0,
            crimes_serious: 0,
            crimes_very_serious: 0,
            preventable_total: 0,
            detected_total: 0,
            cybercrime: 0
        };

        // Render dedicated district view in right panel
        renderDistrictFocusView(stats, regionData);
    }

    // Render district statistics view in the right panel
    function renderDistrictFocusView(dStats, regionData) {
        if (!infoPanel) return;

        const regName = (regionData && regionData.name) ? regionData.name : 'Viloyat';
        const total = dStats.total_crimes || 0;
        const rate = dStats.crime_rate_per_100k ? Number(dStats.crime_rate_per_100k).toFixed(1) : '—';
        const solved = dStats.solved_rate ? Number(dStats.solved_rate).toFixed(1) + '%' : '—';
        const cyber = dStats.cybercrime || 0;

        const serious = dStats.crimes_serious || 0;
        const vSerious = dStats.crimes_very_serious || 0;
        const light = dStats.crimes_light || 0;
        const prev = dStats.preventable_total || 0;
        const det = dStats.detected_total || 0;

        const maxVal = Math.max(total, 1);

        let html = '';

        // Breadcrumbs & Header
        html += '<div class="district-focus-card">';
        html += '<div class="district-breadcrumbs">';
        html += `<button type="button" class="crumb-btn" id="crumb-to-region">${regName}</button>`;
        html += '<span class="crumb-sep">/</span>';
        html += `<span class="crumb-current">${dStats.district_name}</span>`;
        html += '</div>';

        html += '<div class="district-focus-header">';
        html += '<div>';
        html += `<h2 class="district-focus-title">${dStats.district_name}</h2>`;
        html += `<span class="district-focus-region">${regName} tarkibidagi tuman • 2026-yil</span>`;
        html += '</div>';
        html += `<button type="button" class="btn btn-secondary" id="btn-back-to-region-summary" style="padding:6px 12px;font-size:11.5px;border-radius:6px;background:var(--bg-card-hover);color:var(--text-light);border:1px solid var(--border-light);cursor:pointer;">← Viloyat</button>`;
        html += '</div>';

        // 4 Key Stat Cards
        html += '<div class="district-stats-grid">';
        html += '<div class="district-stat-box" style="border-color:rgba(96,165,250,0.3);background:rgba(30,58,138,0.2);">';
        html += `<div class="district-stat-val" style="color:#60A5FA;">${formatNumber(total)}</div>`;
        html += '<div class="district-stat-lbl">Jami jinoyatlar</div>';
        html += '</div>';

        html += '<div class="district-stat-box">';
        html += `<div class="district-stat-val" style="color:var(--text-white);">${rate}</div>`;
        html += '<div class="district-stat-lbl">100 ming aholiga</div>';
        html += '</div>';

        html += '<div class="district-stat-box">';
        html += `<div class="district-stat-val" style="color:#10B981;">${solved}</div>`;
        html += '<div class="district-stat-lbl">Ochilganlik darajasi</div>';
        html += '</div>';

        html += '<div class="district-stat-box">';
        html += `<div class="district-stat-val" style="color:#06B6D4;">${formatNumber(cyber)}</div>`;
        html += '<div class="district-stat-lbl">Kiberjinoyat (AT)</div>';
        html += '</div>';
        html += '</div>';

        // Breakdown Section
        html += '<div class="district-bars-section">';
        html += '<div class="summary-section-title"><span>Tuman bo\'yicha og\'irlik toifalari</span></div>';

        // Og'ir
        html += '<div class="district-bar-item">';
        html += `<div class="district-bar-label-row"><span>Og'ir jinoyatlar</span><strong style="color:#F59E0B;">${formatNumber(serious)} ta</strong></div>`;
        html += `<div class="district-bar-bg"><div class="district-bar-fill" style="width:${(serious / maxVal * 100).toFixed(1)}%;background:#F59E0B;"></div></div>`;
        html += '</div>';

        // O'ta og'ir
        html += '<div class="district-bar-item">';
        html += `<div class="district-bar-label-row"><span>O'ta og'ir jinoyatlar</span><strong style="color:#EA580C;">${formatNumber(vSerious)} ta</strong></div>`;
        html += `<div class="district-bar-bg"><div class="district-bar-fill" style="width:${(vSerious / maxVal * 100).toFixed(1)}%;background:#EA580C;"></div></div>`;
        html += '</div>';

        // Uncha og'ir bo'lmagan
        html += '<div class="district-bar-item">';
        html += `<div class="district-bar-label-row"><span>Uncha og'ir bo'lmagan</span><strong style="color:#F59E0B;">${formatNumber(light)} ta</strong></div>`;
        html += `<div class="district-bar-bg"><div class="district-bar-fill" style="width:${(light / maxVal * 100).toFixed(1)}%;background:#F59E0B;"></div></div>`;
        html += '</div>';

        // Profilaktika va aniqlanadigan
        html += '<div class="summary-section-title" style="margin-top:14px;"><span>Profilaktik ko\'rsatkichlar</span></div>';

        html += '<div class="district-bar-item">';
        html += `<div class="district-bar-label-row"><span>Oldini olish mumkin bo'lgan</span><strong style="color:#F59E0B;">${formatNumber(prev)} ta</strong></div>`;
        html += `<div class="district-bar-bg"><div class="district-bar-fill" style="width:${(prev / maxVal * 100).toFixed(1)}%;background:#F59E0B;"></div></div>`;
        html += '</div>';

        html += '<div class="district-bar-item">';
        html += `<div class="district-bar-label-row"><span>Aniqlanadigan jinoyatlar</span><strong style="color:#10B981;">${formatNumber(det)} ta</strong></div>`;
        html += `<div class="district-bar-bg"><div class="district-bar-fill" style="width:${(det / maxVal * 100).toFixed(1)}%;background:#10B981;"></div></div>`;
        html += '</div>';

        html += '</div>'; // End bars section
        html += '</div>'; // End card

        // Quick list of all other districts
        if (regionData && regionData.districts && regionData.districts.length > 0) {
            html += '<div class="district-table" style="margin-top:12px;">';
            html += '<div style="margin-bottom:8px;font-size:12px;font-weight:700;color:var(--text-light);">';
            html += `${regName} boshqa tumanlari (${regionData.districts.length} ta):`;
            html += '</div>';

            regionData.districts.forEach(function (d) {
                const isActive = cleanDistrictName(d.district_name) === cleanDistrictName(dStats.district_name);
                html += `<div class="district-row ${isActive ? 'active-dist' : ''}" data-dist-name="${d.district_name}" style="cursor:pointer;${isActive ? 'background:rgba(96,165,250,0.18);border:1px solid rgba(96,165,250,0.4);' : ''}">`;
                html += `<span class="district-name" style="${isActive ? 'color:#93C5FD;font-weight:700;' : ''}">${d.district_name}</span>`;
                html += `<span class="district-value highlight">${formatNumber(d.total_crimes)}</span>`;
                html += `<span class="district-value">${d.crime_rate_per_100k ? Number(d.crime_rate_per_100k).toFixed(1) : '—'}</span>`;
                html += `<span class="district-value">${d.solved_rate ? Number(d.solved_rate).toFixed(1) + '%' : '—'}</span>`;
                html += '</div>';
            });
            html += '</div>';
        }

        infoPanel.innerHTML = html;
        infoPanel.classList.add('visible');

        // Back to region listeners
        const crumbBtn = infoPanel.querySelector('#crumb-to-region');
        const backBtnSummary = infoPanel.querySelector('#btn-back-to-region-summary');
        if (crumbBtn) {
            crumbBtn.addEventListener('click', function () {
                restoreRegionOverview(regionData);
            });
        }
        if (backBtnSummary) {
            backBtnSummary.addEventListener('click', function () {
                restoreRegionOverview(regionData);
            });
        }

        // Row clicks on other districts
        const rows = infoPanel.querySelectorAll('.district-row[data-dist-name]');
        rows.forEach(r => {
            r.addEventListener('click', function () {
                const dName = r.dataset.distName;
                const dObj = matchDistrict(dName, regionData.districts);
                selectDistrict(dObj, dName, regionData);
            });
        });
    }

    function restoreRegionOverview(regionData) {
        currentDistrict = null;

        // Clear active district path on map
        if (districtSvgStage) {
            districtSvgStage.querySelectorAll('.district-path').forEach(p => p.classList.remove('district-active'));
        }

        renderInfoPanel(regionData);
    }

    // ==========================================
    // RESET MAP HANDLER (O'zbekiston xaritasiga qaytish)
    // ==========================================
    function resetMap() {
        if (isAnimating) return;
        isAnimating = true;

        // Hide district map stage
        if (districtMapContainer) {
            districtMapContainer.style.display = 'none';
        }
        if (districtSvgStage) {
            districtSvgStage.innerHTML = '';
        }

        currentDistrict = null;

        svgMap.querySelectorAll('[data-region]').forEach(function (r) {
            r.classList.remove('region-active', 'region-inactive', 'region-hover');
        });

        if (svgMap) svgMap.classList.remove('is-draggable', 'is-dragging');

        animateViewBox(svgMap, originalViewBox, 500, function () {
            currentRegion = null;
            isAnimating = false;
        });

        if (infoPanel) infoPanel.classList.remove('visible');
        if (backButton) backButton.classList.remove('visible');
        if (mapPrompt) mapPrompt.classList.remove('hidden');
        if (countryPanel) countryPanel.classList.remove('hidden');
        if (mapContainer) mapContainer.classList.remove('panel-open');

        if (mapTitle) {
            mapTitle.textContent = 'Kriminologiya tadqiqot instituti';
            mapTitle.classList.remove('region-selected');
        }
    }

    // Manual Zoom
    function zoomBy(factor) {
        if (isAnimating) return;
        const vb = svgMap.viewBox.baseVal;
        const curW = vb.width;
        const curH = vb.height;
        const curX = vb.x;
        const curY = vb.y;

        const newW = curW * factor;
        const newH = curH * factor;

        const maxW = originalViewBox.width * 1.6;
        const minW = originalViewBox.width * 0.08;

        if (newW > maxW || newW < minW) return;

        const newX = curX + (curW - newW) / 2;
        const newY = curY + (curH - newH) / 2;

        animateViewBox(svgMap, { x: newX, y: newY, width: newW, height: newH }, 280);

        if (newW < originalViewBox.width * 0.95) {
            svgMap.classList.add('is-draggable');
            if (backButton) backButton.classList.add('visible');
        } else if (!currentRegion) {
            svgMap.classList.remove('is-draggable');
            if (backButton) backButton.classList.remove('visible');
        }
    }

    // Pan / Drag listener setup
    function setupPanListeners() {
        if (!mapContainer || !svgMap) return;

        function startPan(clientX, clientY) {
            const vb = svgMap.viewBox.baseVal;
            if (vb.width >= originalViewBox.width * 0.98 && !currentRegion) return false;

            isDragging = true;
            hasMoved = false;
            dragStart.x = clientX;
            dragStart.y = clientY;
            vbStart.x = vb.x;
            vbStart.y = vb.y;
            svgMap.classList.add('is-dragging');
            return true;
        }

        function movePan(clientX, clientY) {
            if (!isDragging) return;
            const dx = clientX - dragStart.x;
            const dy = clientY - dragStart.y;

            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                hasMoved = true;
            }

            const vb = svgMap.viewBox.baseVal;
            const rect = svgMap.getBoundingClientRect();
            const scaleX = vb.width / rect.width;
            const scaleY = vb.height / rect.height;

            const newX = vbStart.x - dx * scaleX;
            const newY = vbStart.y - dy * scaleY;

            const margin = originalViewBox.width * 0.4;
            if (newX > -margin && newX + vb.width < originalViewBox.width + margin) {
                vb.x = newX;
            }
            if (newY > -margin && newY + vb.height < originalViewBox.height + margin) {
                vb.y = newY;
            }
        }

        function endPan() {
            if (!isDragging) return;
            isDragging = false;
            svgMap.classList.remove('is-dragging');
        }

        svgMap.addEventListener('mousedown', function (e) {
            if (e.button === 0 && startPan(e.clientX, e.clientY)) {
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', function (e) {
            movePan(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', function () {
            endPan();
        });

        svgMap.addEventListener('wheel', function (e) {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 0.85 : 1.18;
            zoomBy(factor);
        }, { passive: false });
    }

    // ViewBox Animation
    function animateViewBox(svg, target, duration, callback) {
        const vb = svg.viewBox.baseVal;
        const start = { x: vb.x, y: vb.y, width: vb.width, height: vb.height };
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            vb.x = start.x + (target.x - start.x) * eased;
            vb.y = start.y + (target.y - start.y) * eased;
            vb.width = start.width + (target.width - start.width) * eased;
            vb.height = start.height + (target.height - start.height) * eased;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (callback) callback();
            }
        }
        requestAnimationFrame(step);
    }

    // Handle screen resize / orientation change
    function handleResize() {
        if (!svgMap) return;
        if (currentRegion) {
            const el = svgMap.querySelector(`[data-region="${currentRegion}"]`);
            if (el) {
                const targetVB = calculateTargetViewBox(el);
                animateViewBox(svgMap, targetVB, 250);
            }
        }
    }

    // Number formatter
    function formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return '0';
        return Number(num).toLocaleString('uz-UZ').replace(/\s/g, ' ');
    }

    // Show Region Information Panel
    function showInfoPanel(slug) {
        if (!infoPanel) return;
        const data = regionsData[slug];
        if (data) {
            renderInfoPanel(data);
            if (districtsSvgData && districtsSvgData[slug]) {
                renderDistrictMap(slug);
            }
        } else {
            fetch('/api/region/' + slug)
                .then(function (res) { return res.json(); })
                .then(function (resp) {
                    if (resp.success) {
                        regionsData[slug] = resp.data;
                        renderInfoPanel(resp.data);
                        renderDistrictMap(slug);
                    }
                })
                .catch(function (err) { console.error('Failed to load region:', err); });
        }
    }

    function renderInfoPanel(data) {
        if (!infoPanel) return;

        const stats = data.crime_stats || {};
        const details = data.details || {};
        const districts = (data.districts || []).slice();
        const totalCrimes = stats.total_crimes || 0;

        districts.sort(function (a, b) { return (b.total_crimes || 0) - (a.total_crimes || 0); });

        let html = '';

        // Header
        html += '<div class="info-panel-header">';
        html += '<div class="info-panel-color" style="background: ' + (data.color || '#3B82F6') + '"></div>';
        html += '<h2 class="info-panel-title">' + (data.name || '') + '</h2>';
        html += '<p class="info-panel-capital">Markaz: ' + (data.capital || '') + ' • Aholisi: ' + formatNumber(data.population) + ' kishi</p>';
        html += '</div>';

        // Stat cards
        html += '<div class="info-panel-stats">';
        html += '<div class="stat-card">';
        html += '<div class="stat-value" style="color:#60A5FA">' + formatNumber(totalCrimes) + '</div>';
        html += '<div class="stat-label">Jami jinoyatlar</div>';
        html += '</div>';
        html += '<div class="stat-card">';
        html += '<div class="stat-value">' + (stats.crime_rate_per_100k ? Number(stats.crime_rate_per_100k).toFixed(1) : '—') + '</div>';
        html += '<div class="stat-label">100 ming aholiga</div>';
        html += '</div>';
        html += '<div class="stat-card">';
        html += '<div class="stat-value" style="color:#06B6D4">' + formatNumber(stats.cybercrime || 0) + '</div>';
        html += '<div class="stat-label">Kiberjinoyat (AT)</div>';
        html += '</div>';
        html += '</div>';

        // Category Tabs for the region
        html += '<div class="panel-tabs" id="region-tabs">';
        html += '<button type="button" class="panel-tab-btn active" data-target="r-tab-oldini">Oldini olish</button>';
        html += '<button type="button" class="panel-tab-btn" data-target="r-tab-aniql">Aniqlanadigan</button>';
        html += '<button type="button" class="panel-tab-btn" data-target="r-tab-shaxs">Shaxslar</button>';
        html += '<button type="button" class="panel-tab-btn" data-target="r-tab-ogirlik">Og\'irlik</button>';
        html += '</div>';

        // 1. Tab: Oldini olish mumkin bo'lgan
        html += '<div class="tab-pane active" id="r-tab-oldini">';
        html += '<div class="crime-types-summary">';
        html += '<div class="summary-section-title"><span>Oldini olish mumkin bo\'lgan</span><span class="badge">' + formatNumber(stats.preventable_total || 0) + ' ta</span></div>';

        const oldiniData = details.oldini_olish || {};
        const oldiniKeys = Object.keys(oldiniData);
        let maxOldini = 1;
        oldiniKeys.forEach(function (k) { if (oldiniData[k].count > maxOldini) maxOldini = oldiniData[k].count; });

        oldiniKeys.forEach(function (k) {
            const item = oldiniData[k];
            const pct = (item.count / maxOldini * 100).toFixed(1);
            html += '<div class="crime-type-row" title="' + item.label + ': ' + formatNumber(item.count) + ' ta (100k ga: ' + item.rate + ')">';
            html += '<span class="crime-type-label">' + item.label + '</span>';
            html += '<div class="crime-type-bar"><div class="bar-fill" style="width:0%;background:' + item.color + '" data-target="' + pct + '%"></div></div>';
            html += '<span class="crime-type-value">' + formatNumber(item.count) + '</span>';
            html += '</div>';
        });
        html += '</div></div>';

        // 2. Tab: Aniqlanadigan jinoyatlar
        html += '<div class="tab-pane" id="r-tab-aniql">';
        html += '<div class="crime-types-summary">';
        html += '<div class="summary-section-title"><span>Aniqlanadigan jinoyatlar</span><span class="badge">' + formatNumber(stats.detected_total || 0) + ' ta</span></div>';

        const aniqlData = details.aniqlanadigan || {};
        const aniqlKeys = Object.keys(aniqlData);
        let maxAniql = 1;
        aniqlKeys.forEach(function (k) { if (aniqlData[k].count > maxAniql) maxAniql = aniqlData[k].count; });

        aniqlKeys.forEach(function (k) {
            const item = aniqlData[k];
            const pct = (item.count / maxAniql * 100).toFixed(1);
            html += '<div class="crime-type-row" title="' + item.label + ': ' + formatNumber(item.count) + ' ta (Salmog\'i: ' + item.pct.toFixed(1) + '%)">';
            html += '<span class="crime-type-label">' + item.label + '</span>';
            html += '<div class="crime-type-bar"><div class="bar-fill" style="width:0%;background:' + item.color + '" data-target="' + pct + '%"></div></div>';
            html += '<span class="crime-type-value">' + formatNumber(item.count) + '</span>';
            html += '</div>';
        });
        html += '</div></div>';

        // 3. Tab: Alohida toifadagi shaxslar
        html += '<div class="tab-pane" id="r-tab-shaxs">';
        html += '<div class="crime-types-summary">';
        html += '<div class="summary-section-title"><span>Alohida toifadagi shaxslar</span><span class="badge">Salmog\'i</span></div>';

        const shaxsData = details.shaxs || {};
        const shaxsKeys = Object.keys(shaxsData);
        let maxShaxs = 1;
        shaxsKeys.forEach(function (k) { if (shaxsData[k].count > maxShaxs) maxShaxs = shaxsData[k].count; });

        shaxsKeys.forEach(function (k) {
            const item = shaxsData[k];
            const pct = (item.count / maxShaxs * 100).toFixed(1);
            html += '<div class="crime-type-row" title="' + item.label + ': ' + formatNumber(item.count) + ' ta (' + item.pct.toFixed(1) + '%)">';
            html += '<span class="crime-type-label">' + item.label + '</span>';
            html += '<div class="crime-type-bar"><div class="bar-fill" style="width:0%;background:' + item.color + '" data-target="' + pct + '%"></div></div>';
            html += '<span class="crime-type-value">' + formatNumber(item.count) + '</span>';
            html += '</div>';
        });
        html += '</div></div>';

        // 4. Tab: Og'irlik darajalari
        html += '<div class="tab-pane" id="r-tab-ogirlik">';
        html += '<div class="crime-types-summary">';
        html += '<div class="summary-section-title"><span>Og\'irlik toifalari</span><span class="badge">' + formatNumber(totalCrimes) + ' ta</span></div>';

        const jamiD = details.jami || {};
        const ogItems = [
            { label: "Og'ir jinoyatlar", count: jamiD.crimes_serious || stats.crimes_serious || 0, pct: jamiD.crimes_serious_pct || 0, color: '#F59E0B' },
            { label: "Uncha og'ir bo'lmagan", count: jamiD.crimes_light || stats.crimes_light || 0, pct: jamiD.crimes_light_pct || 0, color: '#38BDF8' },
            { label: "O'ta og'ir jinoyatlar", count: jamiD.crimes_very_serious || stats.crimes_very_serious || 0, pct: jamiD.crimes_very_serious_pct || 0, color: '#EA580C' },
            { label: "Kiberjinoyat (AT)", count: jamiD.cybercrime || stats.cybercrime || 0, pct: 0, color: '#06B6D4' }
        ];

        let maxOg = 1;
        ogItems.forEach(function (item) { if (item.count > maxOg) maxOg = item.count; });

        ogItems.forEach(function (item) {
            const barW = (item.count / maxOg * 100).toFixed(1);
            html += '<div class="crime-type-row" title="' + item.label + ': ' + formatNumber(item.count) + ' ta">';
            html += '<span class="crime-type-label">' + item.label + '</span>';
            html += '<div class="crime-type-bar"><div class="bar-fill" style="width:0%;background:' + item.color + '" data-target="' + barW + '%"></div></div>';
            html += '<span class="crime-type-value">' + formatNumber(item.count) + '</span>';
            html += '</div>';
        });
        html += '</div></div>';

        // District table
        if (districts.length > 0) {
            html += '<div class="district-table" style="margin-top: 18px;">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border-color);">';
            html += '<h3 style="margin-bottom:0;border-bottom:none;padding-bottom:0;">Tumanlar kesimida (' + districts.length + ' ta)</h3>';
            html += '<span style="font-size:10px;color:var(--text-muted);font-weight:500;">Xaritada ko\'rish uchun bosing</span>';
            html += '</div>';
            html += '<div class="district-header">';
            html += '<span>Tuman</span><span>Jinoyatlar</span><span>100 ming</span><span>Ochilganlik</span>';
            html += '</div>';

            districts.forEach(function (d, idx) {
                html += '<div class="district-row" data-dist-name="' + (d.district_name || '') + '" title="' + (d.district_name || '') + ' - xaritada va batafsil ko\'rish">';
                html += '<span class="district-name"><span class="district-arrow">▶</span>' + (d.district_name || '') + '</span>';
                html += '<span class="district-value highlight">' + formatNumber(d.total_crimes) + '</span>';
                html += '<span class="district-value">' + (d.crime_rate_per_100k ? Number(d.crime_rate_per_100k).toFixed(1) : '—') + '</span>';
                html += '<span class="district-value">' + (d.solved_rate ? Number(d.solved_rate).toFixed(1) + '%' : '—') + '</span>';
                html += '</div>';
            });

            html += '</div>';
        }

        infoPanel.innerHTML = html;
        infoPanel.classList.add('visible');

        // Setup region tabs
        setupTabListeners(infoPanel.querySelector('#region-tabs'));

        // Setup district row click interaction
        const dRows = infoPanel.querySelectorAll('.district-row');
        dRows.forEach(function (row) {
            row.addEventListener('click', function (e) {
                e.stopPropagation();
                const distName = row.dataset.distName;
                if (!distName) return;
                const dObj = matchDistrict(distName, districts);
                selectDistrict(dObj, distName, data);
            });
        });

        // Animate initial active tab bars
        setTimeout(function () {
            const activePane = infoPanel.querySelector('.tab-pane.active');
            if (activePane) animatePaneBars(activePane);
        }, 150);
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

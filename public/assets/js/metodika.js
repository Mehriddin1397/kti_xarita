/**
 * Kriminologiya Tadqiqot Instituti
 * Hududlar bo'yicha Metodik Qo'llanmalar - Interaktiv Xarita
 * 2026-yil
 */

(function() {
    'use strict';

    // State
    let currentRegion = null;
    let isAnimating = false;
    let regionsMetodika = {};
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
    let docModal, modalTitle, modalContent, closeDocModal, footerCloseBtn;

    function init() {
        mapContainer     = document.getElementById('map-container');
        svgMap           = document.getElementById('uzbekistan-map');
        infoPanel        = document.getElementById('region-info-panel');
        backButton       = document.getElementById('back-button');
        mapTitle         = document.getElementById('map-title');
        mapPrompt        = document.getElementById('map-prompt');
        countryPanel     = document.getElementById('country-stats-panel');
        toggleStatsBtn   = document.getElementById('toggle-stats-btn');
        closeCountryPanel= document.getElementById('close-country-panel');
        panelBackdrop    = document.getElementById('panel-backdrop');
        fullscreenBtn    = document.getElementById('fullscreen-btn');
        ctrlZoomIn       = document.getElementById('ctrl-zoom-in');
        ctrlZoomOut      = document.getElementById('ctrl-zoom-out');
        ctrlReset        = document.getElementById('ctrl-reset');

        // Modal elements
        docModal         = document.getElementById('metodika-modal');
        modalTitle       = document.getElementById('modal-doc-title');
        modalContent     = document.getElementById('modal-doc-content');
        closeDocModal    = document.getElementById('close-metodika-modal');
        footerCloseBtn   = document.getElementById('modal-close-btn-footer');

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

        // Load pre-rendered regions metodika data
        const dataEl = document.getElementById('metodika-data');
        if (dataEl) {
            try {
                regionsMetodika = JSON.parse(dataEl.textContent);
            } catch(e) {
                console.warn('Could not parse metodika data');
            }
        }

        // Attach region interactions
        const regions = svgMap.querySelectorAll('[data-region]');
        regions.forEach(function(region) {
            region.addEventListener('click', handleRegionClick);
            region.addEventListener('touchend', handleRegionTouch, { passive: false });
            region.addEventListener('mouseenter', handleRegionHover);
            region.addEventListener('mouseleave', handleRegionLeave);
        });

        // Quick select cards in left panel
        const quickCards = document.querySelectorAll('.region-quick-select');
        quickCards.forEach(function(card) {
            card.addEventListener('click', function() {
                const slug = card.dataset.slug;
                const pathEl = svgMap.querySelector(`[data-region="${slug}"]`);
                if (pathEl) {
                    openRegion(slug, pathEl);
                }
            });
        });

        // Controls
        if (backButton) {
            backButton.addEventListener('click', resetMap);
        }

        if (ctrlZoomIn) {
            ctrlZoomIn.addEventListener('click', function(e) { e.stopPropagation(); zoomBy(0.75); });
        }
        if (ctrlZoomOut) {
            ctrlZoomOut.addEventListener('click', function(e) { e.stopPropagation(); zoomBy(1.33); });
        }
        if (ctrlReset) {
            ctrlReset.addEventListener('click', function(e) { e.stopPropagation(); resetMap(); });
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
            panelBackdrop.addEventListener('click', function() {
                closeCountryDrawer();
            });
        }

        // Modal listeners
        if (closeDocModal) {
            closeDocModal.addEventListener('click', closeModal);
        }
        if (footerCloseBtn) {
            footerCloseBtn.addEventListener('click', closeModal);
        }
        if (docModal) {
            docModal.addEventListener('click', function(e) {
                if (e.target === docModal) closeModal();
            });
        }

        // Drag / Pan interaction when zoomed in
        setupPanListeners();

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (docModal && docModal.style.display !== 'none') {
                    closeModal();
                } else if (currentRegion) {
                    resetMap();
                } else {
                    closeCountryDrawer();
                }
            }
        });

        // Window resize / orientation change listener
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 150);
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(handleResize, 200);
        });
    }

    // Font Size Controls with LocalStorage persistence
    function setupFontSizeControls() {
        const decreaseBtn = document.getElementById('font-decrease-btn');
        const increaseBtn = document.getElementById('font-increase-btn');
        const resetBtn    = document.getElementById('font-reset-btn');
        const indicator   = document.getElementById('font-size-val');

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
                localStorage.setItem('preferred_font_scale', currentScale.toString());
            } catch (e) {}
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                applyScale(currentScale - STEP);
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                applyScale(currentScale + STEP);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                applyScale(1.0);
            });
        }

        applyScale(currentScale);
    }

    // Fullscreen support
    function toggleFullscreen() {
        const doc = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (doc.requestFullscreen) {
                doc.requestFullscreen().catch(function() {});
            } else if (doc.webkitRequestFullscreen) {
                doc.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(function() {});
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
        if (hasMoved) return;
        const slug = e.currentTarget.dataset.region;
        if (slug && !isAnimating) {
            openRegion(slug, e.currentTarget);
        }
    }

    function handleRegionHover(e) {
        if (currentRegion) return;
        const el = e.currentTarget;
        el.classList.add('region-hover');
    }

    function handleRegionLeave(e) {
        if (currentRegion) return;
        const el = e.currentTarget;
        el.classList.remove('region-hover');
    }

    // Open and focus a region
    function openRegion(slug, element) {
        if (currentRegion === slug && infoPanel && infoPanel.classList.contains('visible')) return;

        isAnimating = true;
        currentRegion = slug;

        // Visual states on map paths
        const allRegions = svgMap.querySelectorAll('[data-region]');
        allRegions.forEach(function(r) {
            r.classList.remove('region-active', 'region-hover', 'region-inactive');
            if (r.dataset.region === slug) {
                r.classList.add('region-active');
            } else {
                r.classList.add('region-inactive');
            }
        });

        // Hide prompt, show back button
        if (mapPrompt) mapPrompt.classList.add('hidden');
        if (backButton) backButton.classList.add('visible');

        // Adjust map container padding for right panel
        if (mapContainer) mapContainer.classList.add('panel-open');
        svgMap.classList.add('is-draggable');

        // Zoom animation to region
        const targetVB = calculateTargetViewBox(element);
        animateViewBox(svgMap, targetVB, 450, function() {
            isAnimating = false;
        });

        // Show region metodika info panel
        showRegionMetodika(slug);

        // Close left drawer on mobile if open
        closeCountryDrawer();
    }

    // Reset to whole Uzbekistan view
    function resetMap() {
        if (isAnimating) return;
        isAnimating = true;
        currentRegion = null;

        // Reset map paths classes
        const allRegions = svgMap.querySelectorAll('[data-region]');
        allRegions.forEach(function(r) {
            r.classList.remove('region-active', 'region-hover', 'region-inactive');
        });

        // Hide back button, show prompt
        if (backButton) backButton.classList.remove('visible');
        if (mapPrompt) mapPrompt.classList.remove('hidden');

        // Hide right panel
        if (infoPanel) infoPanel.classList.remove('visible');
        if (mapContainer) mapContainer.classList.remove('panel-open');
        svgMap.classList.remove('is-draggable', 'is-dragging');

        // Restore title
        if (mapTitle) {
            mapTitle.textContent = 'Kriminologiya tadqiqot instituti';
            mapTitle.classList.remove('region-selected');
        }

        // Animate viewBox back to original
        animateViewBox(svgMap, originalViewBox, 450, function() {
            isAnimating = false;
        });
    }

    // Calculate target ViewBox with safe margins
    function calculateTargetViewBox(element) {
        const bbox = element.getBBox();
        const padX = Math.max(bbox.width * 0.28, 25);
        const padY = Math.max(bbox.height * 0.28, 20);

        let targetX = bbox.x - padX;
        let targetY = bbox.y - padY;
        let targetW = bbox.width + padX * 2;
        let targetH = bbox.height + padY * 2;

        const isLandscape = window.innerWidth > 992 && window.innerHeight < window.innerWidth;
        if (isLandscape) {
            targetX -= targetW * 0.08;
            targetW *= 1.16;
        }

        // Aspect ratio lock
        const aspect = originalViewBox.width / originalViewBox.height;
        if (targetW / targetH > aspect) {
            const newH = targetW / aspect;
            targetY -= (newH - targetH) / 2;
            targetH = newH;
        } else {
            const newW = targetH * aspect;
            targetX -= (newW - targetW) / 2;
            targetW = newW;
        }

        return { x: targetX, y: targetY, width: targetW, height: targetH };
    }

    // Manual Zoom
    function zoomBy(factor) {
        if (!svgMap) return;
        const vb = svgMap.viewBox.baseVal;
        const currentCenter = { x: vb.x + vb.width / 2, y: vb.y + vb.height / 2 };

        let newW = vb.width * factor;
        let newH = vb.height * factor;

        // Limits
        if (newW < originalViewBox.width * 0.15) return;
        if (newW > originalViewBox.width * 1.5) {
            resetMap();
            return;
        }

        const newX = currentCenter.x - newW / 2;
        const newY = currentCenter.y - newH / 2;

        animateViewBox(svgMap, { x: newX, y: newY, width: newW, height: newH }, 220);
    }

    // Pan / Dragging
    function setupPanListeners() {
        if (!mapContainer) return;

        function startPan(clientX, clientY) {
            if (!currentRegion) return;
            isDragging = true;
            hasMoved = false;
            dragStart = { x: clientX, y: clientY };
            const vb = svgMap.viewBox.baseVal;
            vbStart = { x: vb.x, y: vb.y, width: vb.width, height: vb.height };
            svgMap.classList.add('is-dragging');
        }

        function movePan(clientX, clientY) {
            if (!isDragging) return;
            const dx = clientX - dragStart.x;
            const dy = clientY - dragStart.y;

            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                hasMoved = true;
            }

            const rect = svgMap.getBoundingClientRect();
            const scaleX = vbStart.width / rect.width;
            const scaleY = vbStart.height / rect.height;

            const vb = svgMap.viewBox.baseVal;
            vb.x = vbStart.x - dx * scaleX;
            vb.y = vbStart.y - dy * scaleY;
        }

        function endPan() {
            isDragging = false;
            if (svgMap) svgMap.classList.remove('is-dragging');
            setTimeout(function() { hasMoved = false; }, 50);
        }

        // Mouse events
        mapContainer.addEventListener('mousedown', function(e) {
            if (currentRegion && e.button === 0) {
                startPan(e.clientX, e.clientY);
                e.preventDefault();
            }
        });
        window.addEventListener('mousemove', function(e) {
            if (isDragging) movePan(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', endPan);

        // Touch events
        mapContainer.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1 && currentRegion) {
                startPan(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        mapContainer.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length === 1) {
                movePan(e.touches[0].clientX, e.touches[0].clientY);
                if (hasMoved) e.preventDefault();
            }
        }, { passive: false });

        mapContainer.addEventListener('touchend', endPan);
        mapContainer.addEventListener('touchcancel', endPan);
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

    function formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return '0';
        return Number(num).toLocaleString('uz-UZ').replace(/\s/g, ' ');
    }

    // Display Region Metodika Panel
    function showRegionMetodika(slug) {
        if (!infoPanel) return;
        const data = regionsMetodika[slug];
        if (data) {
            renderMetodikaPanel(data);
        } else {
            fetch('/api/metodika/' + slug)
                .then(function(res) { return res.json(); })
                .then(function(resp) {
                    if (resp.success) {
                        regionsMetodika[slug] = resp.data;
                        renderMetodikaPanel(resp.data);
                    }
                })
                .catch(function(err) { console.error('Failed to load metodika:', err); });
        }
    }

    function renderMetodikaPanel(data) {
        if (!infoPanel) return;

        const isApproved = data.is_approved;
        const manuals = data.manuals || [];

        let html = '';

        // Header
        html += '<div class="info-panel-header">';
        html += '<div class="info-panel-color" style="background: ' + (isApproved ? '#10B981' : '#3B82F6') + '"></div>';
        html += '<h2 class="info-panel-title">' + (data.name || '') + '</h2>';
        html += '<p class="info-panel-capital">Markaz: ' + (data.capital || '') + ' • Aholisi: ' + formatNumber(data.population) + ' kishi</p>';

        // Status Badge
        if (isApproved) {
            html += '<div style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.4); border-radius: 20px; color: #34D399; font-size: calc(11px * var(--font-scale, 1)); font-weight: 700;">';
            html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            html += '<span>Metodik qo\'llanmalar to\'liq tasdiqlangan va amaliyotga joriy etilgan</span>';
            html += '</div>';
        } else {
            html += '<div style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(59,130,246,0.14); border: 1px solid rgba(59,130,246,0.35); border-radius: 20px; color: #60A5FA; font-size: calc(11px * var(--font-scale, 1)); font-weight: 600;">';
            html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
            html += '<span>Kriminologik tahlil va metodik ishlab chiqish jarayonida</span>';
            html += '</div>';
        }

        html += '</div>';

        // Stats grid
        html += '<div class="info-panel-stats">';
        html += '<div class="stat-card">';
        html += '<div class="stat-value" style="color:' + (isApproved ? '#34D399' : '#60A5FA') + '">' + manuals.length + ' ta</div>';
        html += '<div class="stat-label">Qo\'llanmalar</div>';
        html += '</div>';
        html += '<div class="stat-card">';
        html += '<div class="stat-value" style="color:#F59E0B">' + (isApproved ? 'Tasdiqlangan' : 'Loyiha') + '</div>';
        html += '<div class="stat-label">Holati</div>';
        html += '</div>';
        html += '<div class="stat-card">';
        html += '<div class="stat-value">2026-yil</div>';
        html += '<div class="stat-label">Muddati</div>';
        html += '</div>';
        html += '</div>';

        // Manuals List Title
        html += '<div class="summary-section-title" style="margin-top: 18px;">';
        html += '<span>Ushbu hudud bo\'yicha metodik qo\'llanmalar (' + manuals.length + ' ta)</span>';
        html += '<span class="badge" style="background:' + (isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)') + '; color:' + (isApproved ? '#34D399' : '#60A5FA') + ';">' + (isApproved ? 'Joriy etilgan' : 'Loyiha') + '</span>';
        html += '</div>';

        // Render each manual as an expandable rich card
        html += '<div class="metodika-manuals-container" style="display: flex; flex-direction: column; gap: 12px;">';

        manuals.forEach(function(m, idx) {
            html += '<div class="metodika-card" id="card-' + m.id + '" style="background: var(--bg-card); border: 1px solid ' + (isApproved ? 'rgba(16,185,129,0.3)' : 'var(--border-color)') + '; border-radius: var(--radius-md); padding: 14px 16px; transition: all var(--transition-fast); box-shadow: var(--shadow-sm);">';
            
            // Title & Year
            html += '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px;">';
            html += '<h3 style="font-size: calc(13px * var(--font-scale, 1)); font-weight: 700; color: var(--text-white); line-height: 1.35;">' + m.title + '</h3>';
            html += '<span style="font-size: calc(10px * var(--font-scale, 1)); background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 6px; color: var(--text-muted); font-weight: 600; white-space: nowrap;">' + m.year + '</span>';
            html += '</div>';

            // Meta tags
            html += '<div style="font-size: calc(10.5px * var(--font-scale, 1)); color: var(--text-dim); margin-bottom: 8px; line-height: 1.4;">';
            html += '🏛️ <strong>Mas\'ul:</strong> ' + (m.department || data.responsible || 'Institut ilmiy xodimlari') + '<br>';
            if (m.approval_date) {
                html += '📜 <strong>Hujjat:</strong> ' + m.approval_date;
            }
            html += '</div>';

            // Summary
            html += '<p style="font-size: calc(11.5px * var(--font-scale, 1)); color: var(--text-light); line-height: 1.45; margin-bottom: 12px; background: rgba(0,0,0,0.25); padding: 8px 10px; border-radius: 6px; border-left: 3px solid ' + (isApproved ? '#10B981' : '#3B82F6') + ';">';
            html += m.summary;
            html += '</p>';

            // Chapters list
            if (m.chapters && m.chapters.length > 0) {
                html += '<div style="margin-bottom: 12px;">';
                html += '<span style="font-size: calc(10px * var(--font-scale, 1)); font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px;">Qo\'llanma boblari va yo\'nalishlari:</span>';
                html += '<ul style="list-style: none; margin-top: 6px; padding-left: 0; display: flex; flex-direction: column; gap: 5px;">';
                m.chapters.forEach(function(ch) {
                    html += '<li style="font-size: calc(11px * var(--font-scale, 1)); color: var(--text-light); display: flex; align-items: flex-start; gap: 6px; line-height: 1.35;">';
                    html += '<span style="color:' + (isApproved ? '#10B981' : '#60A5FA') + '; font-size: 10px; margin-top: 2px;">🔹</span>';
                    html += '<span>' + ch + '</span>';
                    html += '</li>';
                });
                html += '</ul>';
                html += '</div>';
            }

            // Practical steps
            if (m.practical_steps && m.practical_steps.length > 0) {
                html += '<div style="margin-bottom: 12px; background: rgba(16,185,129,0.06); border: 1px dashed rgba(16,185,129,0.25); border-radius: 6px; padding: 8px 10px;">';
                html += '<span style="font-size: calc(10px * var(--font-scale, 1)); font-weight: 700; color: #34D399; text-transform: uppercase;">Amaliy profilaktik choralar:</span>';
                html += '<ul style="list-style: none; margin-top: 5px; padding-left: 0; display: flex; flex-direction: column; gap: 4px;">';
                m.practical_steps.forEach(function(ps) {
                    html += '<li style="font-size: calc(10.5px * var(--font-scale, 1)); color: var(--text-light); display: flex; align-items: flex-start; gap: 5px;">';
                    html += '<span style="color:#34D399;">✓</span>';
                    html += '<span>' + ps + '</span>';
                    html += '</li>';
                });
                html += '</ul>';
                html += '</div>';
            }

            // Action button to open full modal reader
            html += '<div style="display: flex; justify-content: flex-end; margin-top: 8px;">';
            html += '<button type="button" class="view-doc-btn" data-doc-id="' + m.id + '" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: ' + (isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.18)') + '; color: ' + (isApproved ? '#34D399' : '#60A5FA') + '; border: 1px solid ' + (isApproved ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.35)') + '; border-radius: var(--radius-sm); font-size: calc(11px * var(--font-scale, 1)); font-weight: 600; cursor: pointer; transition: all 0.2s;">';
            html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
            html += '<span>To\'liq matnni o\'qish / Ko\'rish</span>';
            html += '</button>';
            html += '</div>';

            html += '</div>';
        });

        html += '</div>';

        infoPanel.innerHTML = html;
        infoPanel.classList.add('visible');

        // Wire modal open buttons
        const viewBtns = infoPanel.querySelectorAll('.view-doc-btn');
        viewBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const docId = btn.dataset.docId;
                openDocModal(data, docId);
            });
        });
    }

    // Modal Document Reader
    function openDocModal(regionData, docId) {
        if (!docModal) return;
        const manuals = regionData.manuals || [];
        const manual = manuals.find(function(m) { return m.id === docId; });
        if (!manual) return;

        if (modalTitle) {
            modalTitle.textContent = manual.title;
        }

        let bodyHtml = '';
        bodyHtml += '<div class="doc-official-header" style="text-align: center; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">';
        bodyHtml += '<span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600;">O\'zbekiston Respublikasi Kriminologiya tadqiqot instituti</span>';
        bodyHtml += '<h2 style="font-size: calc(16px * var(--font-scale, 1)); color: var(--text-white); font-weight: 800; margin: 8px 0; line-height: 1.4;">' + manual.title + '</h2>';
        bodyHtml += '<p style="font-size: 12px; color: #34D399; font-weight: 600;">' + (manual.approval_date || '2026-yil rasmiy qo\'llanmasi') + '</p>';
        bodyHtml += '</div>';

        bodyHtml += '<div style="margin-bottom: 18px;">';
        bodyHtml += '<h4 style="font-size: 13px; color: var(--accent-blue-light); margin-bottom: 6px;">I. Umumiy tavsif va dolzarbligi</h4>';
        bodyHtml += '<p style="font-size: 12.5px; color: var(--text-light); line-height: 1.6;">' + manual.summary + '</p>';
        bodyHtml += '</div>';

        if (manual.chapters && manual.chapters.length > 0) {
            bodyHtml += '<div style="margin-bottom: 18px;">';
            bodyHtml += '<h4 style="font-size: 13px; color: var(--accent-blue-light); margin-bottom: 8px;">II. Qo\'llanmaning tarkibiy boblari</h4>';
            bodyHtml += '<div style="display: flex; flex-direction: column; gap: 8px;">';
            manual.chapters.forEach(function(ch, i) {
                bodyHtml += '<div style="padding: 10px 12px; background: rgba(255,255,255,0.04); border-left: 3px solid #10B981; border-radius: 4px; font-size: 12px; color: var(--text-white); line-height: 1.45;">';
                bodyHtml += ch;
                bodyHtml += '</div>';
            });
            bodyHtml += '</div>';
            bodyHtml += '</div>';
        }

        if (manual.practical_steps && manual.practical_steps.length > 0) {
            bodyHtml += '<div style="margin-bottom: 18px;">';
            bodyHtml += '<h4 style="font-size: 13px; color: #34D399; margin-bottom: 8px;">III. Hududiy amaliyotga joriy etish algoritmi</h4>';
            bodyHtml += '<div style="padding: 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 6px;">';
            manual.practical_steps.forEach(function(ps, i) {
                bodyHtml += '<p style="font-size: 12px; color: var(--text-light); margin-bottom: 6px; display: flex; gap: 6px;">';
                bodyHtml += '<strong style="color: #34D399;">' + (i + 1) + '.</strong> ' + ps;
                bodyHtml += '</p>';
            });
            bodyHtml += '</div>';
            bodyHtml += '</div>';
        }

        if (manual.responsible_orgs) {
            bodyHtml += '<div style="padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-size: 11.5px; color: var(--text-muted);">';
            bodyHtml += '📌 <strong>Mas\'ul ijrochi organlar:</strong> ' + manual.responsible_orgs;
            bodyHtml += '</div>';
        }

        if (modalContent) {
            modalContent.innerHTML = bodyHtml;
        }

        docModal.style.display = 'flex';
    }

    function closeModal() {
        if (docModal) docModal.style.display = 'none';
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

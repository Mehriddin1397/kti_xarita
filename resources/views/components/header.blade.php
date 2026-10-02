<header class="app-header">
    <div class="header-left">
        <div class="header-emblem">
            <img src="/logo/photo_2025-09-03_15-19-21.jpg" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
        </div>
        <div class="header-title">
            <h1 id="map-title">Kriminologiya tadqiqot instituti</h1>
            <span>{{ request()->routeIs('loyiha.*') ? 'Hududiy ilmiy-amaliy loyihalar axborot tizimi' : 'Jinoyatchilik statistikasi ma\'lumot tizimi' }}</span>
        </div>
    </div>
    <nav class="header-nav" aria-label="Asosiy sahifalar">
        <a href="{{ route('map.index') }}" class="header-nav-btn {{ request()->routeIs('map.*') ? 'active' : '' }}" title="Tahlil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/>
                <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <span>Tahlil</span>
        </a>
        <a href="{{ route('loyiha.index') }}" class="header-nav-btn {{ request()->routeIs('loyiha.*') ? 'active' : '' }}" title="Tadqiqot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Tadqiqot</span>
        </a>
    </nav>
    <div class="header-right">
        <button type="button" class="header-action-btn stats-toggle-btn" id="toggle-stats-btn" title="Statistika paneli" aria-label="Statistika paneli">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span class="btn-text">Statistika</span>
        </button>
        {{-- Font size control --}}
        <div class="header-font-control" title="Shrift o'lchamini o'zgartirish">
            <button type="button" class="font-ctrl-btn" id="font-decrease-btn" title="Shriftni kichiklashtirish (A-)" aria-label="Shriftni kichiklashtirish">
                <span>A-</span>
            </button>
            <span class="font-size-indicator" id="font-size-val">100%</span>
            <button type="button" class="font-ctrl-btn" id="font-increase-btn" title="Shriftni kattalashtirish (A+)" aria-label="Shriftni kattalashtirish">
                <span>A+</span>
            </button>
            <button type="button" class="font-ctrl-btn font-reset-btn" id="font-reset-btn" title="Dastlabki shrift o'lchami" aria-label="Dastlabki shrift">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
        </div>
        <span class="header-date">{{ now()->format('d.m.Y') }}</span>
        <button type="button" class="header-action-btn fullscreen-btn" id="fullscreen-btn" title="To'liq ekran rejimiga o'tish" aria-label="To'liq ekran">
            <svg class="icon-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <svg class="icon-compress" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
        </button>
    </div>
</header>

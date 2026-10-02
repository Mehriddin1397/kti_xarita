@extends('layouts.app')

@section('title', 'Kriminologiya tadqiqot instituti — Jinoyatchilik statistikasi (2026-yil)')

@section('content')
<div class="presentation-screen">

    <div class="map-bg-pattern"></div>

    @include('components.header')

    <div class="map-wrapper">

        {{-- Country stats panel (left side) --}}
        <div class="country-stats-panel" id="country-stats-panel">
            <div class="country-stats-header">
                <div class="stats-header-titles">
                    <h2>O'zbekiston Respublikasi</h2>
                    <p>Jinoyatchilik statistikasi — {{ $countryStats['period'] ?? '2026-yil 6 oylik hisoboti' }}</p>
                </div>
                <button type="button" class="panel-close-btn" id="close-country-panel" aria-label="Yopish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="total-crimes-big">
                <span class="total-number">{{ number_format($countryStats['total_crimes'] ?? 75563, 0, '', ' ') }}</span>
                <span class="total-label">Jami qayd etilgan jinoyatlar</span>
            </div>

            <div class="country-stat-cards">
                <div class="stat-card-dark">
                    <div class="stat-value">{{ number_format($countryStats['crime_rate_per_100k'] ?? 197.6, 1) }}</div>
                    <div class="stat-label">100 ming aholiga</div>
                </div>
                <div class="stat-card-dark">
                    <div class="stat-value">{{ number_format(($countryStats['population'] ?? 38236704) / 1000000, 1) }} mln</div>
                    <div class="stat-label">Aholi soni</div>
                </div>
                <div class="stat-card-dark">
                    <div class="stat-value" style="color: #06B6D4;">{{ number_format($countryStats['cybercrime'] ?? 41466, 0, '', ' ') }}</div>
                    <div class="stat-label">Kiberjinoyat (AT)</div>
                </div>
            </div>

            {{-- Category Tabs --}}
            <div class="panel-tabs" id="country-tabs">
                <button type="button" class="panel-tab-btn active" data-target="c-tab-oldini">Oldini olish</button>
                <button type="button" class="panel-tab-btn" data-target="c-tab-aniql">Aniqlanadigan</button>
                <button type="button" class="panel-tab-btn" data-target="c-tab-shaxs">Shaxslar</button>
                <button type="button" class="panel-tab-btn" data-target="c-tab-ogirlik">Og'irlik</button>
            </div>

            {{-- 1. Tab: Oldini olish mumkin bo'lgan jinoyatlar --}}
            <div class="tab-pane active" id="c-tab-oldini">
                <div class="crime-types-summary">
                    <div class="summary-section-title">
                        <span>Oldini olish mumkin bo'lgan jinoyatlar</span>
                        <span class="badge">{{ number_format($countryStats['preventable_total'] ?? 14342, 0, '', ' ') }} ta</span>
                    </div>
                    @php
                        $maxOldini = max(collect($countryStats['oldini_olish'] ?? [])->max('count'), 1);
                    @endphp
                    @foreach($countryStats['oldini_olish'] as $item)
                    <div class="crime-type-row" title="{{ $item['label'] }}: {{ number_format($item['count'], 0, '', ' ') }} ta (100k ga: {{ $item['rate'] }})">
                        <span class="crime-type-label">{{ $item['label'] }}</span>
                        <div class="crime-type-bar">
                            <div class="bar-fill" style="width: {{ ($item['count'] / $maxOldini) * 100 }}%; background: {{ $item['color'] }};"></div>
                        </div>
                        <span class="crime-type-value">{{ number_format($item['count'], 0, '', ' ') }}</span>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- 2. Tab: Aniqlanadigan jinoyatlar --}}
            <div class="tab-pane" id="c-tab-aniql">
                <div class="crime-types-summary">
                    <div class="summary-section-title">
                        <span>Aniqlanadigan jinoyatlar</span>
                        <span class="badge">{{ number_format($countryStats['detected_total'] ?? 19755, 0, '', ' ') }} ta</span>
                    </div>
                    @php
                        $maxAniql = max(collect($countryStats['aniqlanadigan'] ?? [])->max('count'), 1);
                    @endphp
                    @foreach($countryStats['aniqlanadigan'] as $item)
                    <div class="crime-type-row" title="{{ $item['label'] }}: {{ number_format($item['count'], 0, '', ' ') }} ta (Salmog'i: {{ $item['pct'] }}%)">
                        <span class="crime-type-label">{{ $item['label'] }}</span>
                        <div class="crime-type-bar">
                            <div class="bar-fill" style="width: {{ ($item['count'] / $maxAniql) * 100 }}%; background: {{ $item['color'] }};"></div>
                        </div>
                        <span class="crime-type-value">{{ number_format($item['count'], 0, '', ' ') }}</span>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- 3. Tab: Alohida toifadagi shaxslar --}}
            <div class="tab-pane" id="c-tab-shaxs">
                <div class="crime-types-summary">
                    <div class="summary-section-title">
                        <span>Alohida toifadagi shaxslar</span>
                        <span class="badge">Salmog'i</span>
                    </div>
                    @php
                        $maxShaxs = max(collect($countryStats['shaxs'] ?? [])->max('count'), 1);
                    @endphp
                    @foreach($countryStats['shaxs'] as $item)
                    <div class="crime-type-row" title="{{ $item['label'] }}: {{ number_format($item['count'], 0, '', ' ') }} ta ({{ $item['pct'] }}%)">
                        <span class="crime-type-label">{{ $item['label'] }}</span>
                        <div class="crime-type-bar">
                            <div class="bar-fill" style="width: {{ ($item['count'] / $maxShaxs) * 100 }}%; background: {{ $item['color'] }};"></div>
                        </div>
                        <span class="crime-type-value">{{ number_format($item['count'], 0, '', ' ') }}</span>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- 4. Tab: Og'irlik darajalari --}}
            <div class="tab-pane" id="c-tab-ogirlik">
                <div class="crime-types-summary">
                    <div class="summary-section-title">
                        <span>Og'irlik toifalari kesimida</span>
                        <span class="badge">75 563 ta</span>
                    </div>
                    @php
                        $maxOg = max(collect($countryStats['ogirlik'] ?? [])->max('count'), 1);
                    @endphp
                    @foreach($countryStats['ogirlik'] as $item)
                    <div class="crime-type-row" title="{{ $item['label'] }}: {{ number_format($item['count'], 0, '', ' ') }} ta ({{ $item['pct'] }}%)">
                        <span class="crime-type-label">{{ $item['label'] }}</span>
                        <div class="crime-type-bar">
                            <div class="bar-fill" style="width: {{ ($item['count'] / $maxOg) * 100 }}%; background: {{ $item['color'] }};"></div>
                        </div>
                        <span class="crime-type-value">{{ number_format($item['count'], 0, '', ' ') }}</span>
                    </div>
                    @endforeach

                    <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                        <div class="crime-type-row">
                            <span class="crime-type-label" style="color: #06B6D4;">Kiberjinoyat (AT)</span>
                            <div class="crime-type-bar"><div class="bar-fill" style="width: 55%; background: #06B6D4;"></div></div>
                            <span class="crime-type-value" style="color: #06B6D4;">{{ number_format($countryStats['cybercrime'] ?? 41466, 0, '', ' ') }}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {{-- Map container --}}
        <div id="map-container">
            {{-- Katta kriminologik xarita sarlavhasi --}}
            <div class="map-top-banner">
                <h2 class="map-banner-title">Oʻzbekiston Respublikasining Kriminologik xaritasi</h2>
                @include('components.pipeline-flow')
            </div>

            @include('components.map')

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
                        <span class="district-map-subtitle">Tumanlar va shaharlar kriminologik xaritasi</span>
                    </div>
                    <div class="district-map-badge" id="district-map-count-badge">
                        Tumanlar
                    </div>
                </div>

                <div class="district-svg-stage" id="district-svg-stage">
                    {{-- Dinamik tumanlar SVG xaritasi --}}
                </div>

                <div class="district-map-hint">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Tumanni bosib, unga tegishli batafsil statistika bilan tanishing</span>
                </div>
            </div>

            <div class="map-prompt" id="map-prompt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                Viloyatni tanlang
            </div>

            {{-- Floating Map Controls --}}
            <div class="map-controls" id="map-controls">
                <button type="button" class="map-ctrl-btn" id="ctrl-zoom-in" title="Kattalashtirish (+)" aria-label="Kattalashtirish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button type="button" class="map-ctrl-btn" id="ctrl-zoom-out" title="Kichiklashtirish (-)" aria-label="Kichiklashtirish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button type="button" class="map-ctrl-btn" id="ctrl-reset" title="Dastlabki ko'rinish (⟲)" aria-label="Dastlabki ko'rinish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                </button>
            </div>
        </div>

        {{-- Region info panel --}}
        <div id="region-info-panel"></div>

        @include('components.back-button')

        {{-- Backdrop for mobile/tablet panel overlay --}}
        <div class="panel-backdrop" id="panel-backdrop"></div>

    </div>

</div>

<script type="application/json" id="regions-data">
    {!! json_encode($regionsData, JSON_UNESCAPED_UNICODE) !!}
</script>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/map.js') }}"></script>
@endpush

@extends('layouts.app')

@section('title', 'Kriminologiya tadqiqot instituti — Metodik qo\'llanmalar xaritasi (2026-yil)')

@section('content')
<div class="presentation-screen">

    <div class="map-bg-pattern"></div>

    @include('components.header')

    <div class="map-wrapper">

        {{-- Metodika umumiy paneli (chap tomon) --}}
        <div class="country-stats-panel" id="country-stats-panel">
            <div class="country-stats-header">
                <div class="stats-header-titles">
                    <h2>O'zbekiston Respublikasi</h2>
                    <p>Metodik ta'minot va profilaktika qo'llanmalari — {{ $overall['year'] ?? 2026 }}-yil</p>
                </div>
                <button type="button" class="panel-close-btn" id="close-country-panel" aria-label="Yopish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {{-- Big count --}}
            <div class="total-crimes-big" style="background: linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 100%); border-color: rgba(16,185,129,0.3);">
                <span class="total-number" style="color: #34D399;">{{ $overall['total_manuals'] ?? 38 }} ta</span>
                <span class="total-label" style="color: var(--text-light);">Institut tomonidan ishlab chiqilgan metodik qo'llanmalar</span>
            </div>

            <div class="country-stat-cards">
                <div class="stat-card-dark" style="border-color: rgba(16,185,129,0.35);">
                    <div class="stat-value" style="color: #10B981;">{{ $overall['approved_regions_count'] ?? 2 }} ta</div>
                    <div class="stat-label">Joriy etilgan</div>
                </div>
                <div class="stat-card-dark">
                    <div class="stat-value">{{ $overall['in_progress_regions_count'] ?? 12 }} ta</div>
                    <div class="stat-label">Tahlil jarayonida</div>
                </div>
                <div class="stat-card-dark">
                    <div class="stat-value" style="color: #06B6D4;">{{ $overall['total_algorithms'] ?? 24 }} ta</div>
                    <div class="stat-label">Profilaktik algoritm</div>
                </div>
            </div>

            {{-- Metodika yo'nalishlari bo'limi --}}
            <div class="summary-section-title" style="margin-top: 14px;">
                <span>Asosiy profilaktika yo'nalishlari</span>
                <span class="badge" style="background: rgba(16,185,129,0.18); color: #34D399; border-color: rgba(16,185,129,0.35);">5 yo'nalish</span>
            </div>

            <div class="crime-types-summary" style="margin-bottom: 18px;">
                @foreach($overall['directions'] as $dir)
                <div class="crime-type-row" title="{{ $dir['name'] }}: {{ $dir['count'] }} ta qo'llanma">
                    <span class="crime-type-label" style="width: 135px;">{{ $dir['name'] }}</span>
                    <div class="crime-type-bar">
                        <div class="bar-fill" style="width: {{ ($dir['count'] / 10) * 100 }}%; background: {{ $dir['color'] }};"></div>
                    </div>
                    <span class="crime-type-value">{{ $dir['count'] }} ta</span>
                </div>
                @endforeach
            </div>

            {{-- Maxsus joriy etilgan hududlar bloki --}}
            <div class="summary-section-title">
                <span>Amaliyotga to'liq joriy etilgan hududlar</span>
                <span class="badge" style="background: rgba(16,185,129,0.2); color: #10B981; border-color: rgba(16,185,129,0.4);">2026-yil</span>
            </div>

            <div class="approved-regions-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
                <div class="approved-card region-quick-select" data-slug="karakalpakstan" style="cursor: pointer; padding: 10px 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-sm); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-weight: 700; color: #34D399; font-size: calc(12px * var(--font-scale, 1));">🟢 Qoraqalpog'iston Respublikasi</span>
                        <span style="font-size: calc(10px * var(--font-scale, 1)); background: #10B981; color: white; padding: 2px 7px; border-radius: 10px; font-weight: 700;">3 ta qo'llanma</span>
                    </div>
                    <p style="font-size: calc(10.5px * var(--font-scale, 1)); color: var(--text-muted); margin-top: 4px;">Mulkiy jinoyatlar, yoshlar profilaktikasi va "Xavfsiz ovul" dasturi</p>
                </div>

                <div class="approved-card region-quick-select" data-slug="namangan" style="cursor: pointer; padding: 10px 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-sm); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-weight: 700; color: #34D399; font-size: calc(12px * var(--font-scale, 1));">🟢 Namangan viloyati</span>
                        <span style="font-size: calc(10px * var(--font-scale, 1)); background: #10B981; color: white; padding: 2px 7px; border-radius: 10px; font-weight: 700;">3 ta qo'llanma</span>
                    </div>
                    <p style="font-size: calc(10.5px * var(--font-scale, 1)); color: var(--text-muted); margin-top: 4px;">Oila-turmush nizolari, kiberjinoyat va gavjum hududlar xavfsizligi</p>
                </div>
            </div>

            <div style="padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: calc(11px * var(--font-scale, 1)); color: var(--text-muted); line-height: 1.4;">
                💡 <strong style="color: var(--text-light);">Eslatma:</strong> Xaritadagi hududlar ustiga bosib, o'sha hudud bo'yicha ishlab chiqilgan rasmiy metodik qo'llanmalar va kriminologik tavsiyalarni o'qishingiz mumkin.
            </div>

        </div>

        {{-- Map container --}}
        <div id="map-container">
            {{-- Katta sarlavha --}}
            <div class="map-top-banner">
                <h2 class="map-banner-title">Oʻzbekiston Respublikasi boʻyicha metodik qoʻllanmalar xaritasi</h2>
                @include('components.pipeline-flow')
            </div>

            @include('components.map-metodika')

            <div class="map-prompt" id="map-prompt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                Hududni tanlang (qo'llanmani ko'rish uchun)
            </div>

            {{-- Map Legend (Xarita tagidagi tushuntirish) --}}
            <div class="metodika-legend" id="metodika-legend">
                <div class="legend-item">
                    <span class="legend-dot green"></span>
                    <span class="legend-text"><strong>Yashil hududlar:</strong> Metodik qo'llanmalar to'liq tasdiqlangan va amaliyotga joriy etilgan <em>(Qoraqalpog'iston, Namangan)</em></span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot blue"></span>
                    <span class="legend-text"><strong>Moviy hududlar:</strong> Kriminologik tahlil va metodik ishlab chiqish jarayonidagi hududlar</span>
                </div>
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

        {{-- Region metodika info panel (o'ng tomon) --}}
        <div id="region-info-panel" class="metodika-panel"></div>

        @include('components.back-button')

        {{-- Backdrop for mobile/tablet panel overlay --}}
        <div class="panel-backdrop" id="panel-backdrop"></div>

    </div>

</div>

{{-- Metodik qo'llanmani to'liq o'qish modal oynasi --}}
<div class="metodika-modal-overlay" id="metodika-modal" style="display: none;">
    <div class="metodika-modal-container">
        <div class="metodika-modal-header">
            <div class="modal-header-left">
                <img src="/logo/photo_2025-09-03_15-19-21.jpg" alt="Logo" style="width:34px;height:34px;border-radius:6px;">
                <div>
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent-blue-light); font-weight: 700;">Kriminologiya tadqiqot instituti</span>
                    <h3 id="modal-doc-title" style="font-size: 15px; color: var(--text-white); font-weight: 700; margin-top: 2px;">Metodik qo'llanma</h3>
                </div>
            </div>
            <button type="button" class="modal-close-btn" id="close-metodika-modal" aria-label="Yopish">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="metodika-modal-body" id="modal-doc-content"></div>
        <div class="metodika-modal-footer">
            <button type="button" class="modal-action-btn" onclick="window.print();">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <span>Chop etish (Print)</span>
            </button>
            <button type="button" class="modal-action-btn primary" id="modal-close-btn-footer">
                <span>Yopish</span>
            </button>
        </div>
    </div>
</div>

<script type="application/json" id="metodika-data">
    {!! json_encode($regionsMetodika, JSON_UNESCAPED_UNICODE) !!}
</script>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/metodika.js') }}"></script>
@endpush

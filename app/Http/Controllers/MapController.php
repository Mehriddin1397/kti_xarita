<?php

namespace App\Http\Controllers;

use App\Models\Region;
use App\Models\CrimeStatistic;

class MapController extends Controller
{
    public function index()
    {
        $regions = Region::where('is_active', true)
            ->with(['districtCrimes'])
            ->get();

        // 2026-yil 6 oylik rasmiy statistik ma'lumotlar (public/malumot.xlsx asosida)
        $countryStats = [
            'year' => 2026,
            'period' => '2026-yil 6 oylik hisoboti',
            'total_crimes' => 75563,
            'crime_rate_per_100k' => 197.6,
            'population' => 38236704,
            'cybercrime' => 41466,
            'crimes_light' => 11088,
            'crimes_light_pct' => 14.7,
            'crimes_serious' => 45997,
            'crimes_serious_pct' => 60.9,
            'crimes_very_serious' => 3496,
            'crimes_very_serious_pct' => 4.6,
            'preventable_total' => 14342,
            'preventable_rate_100k' => 37.5,
            'detected_total' => 19755,
            'detected_rate_100k' => 51.7,
            'solved_rate' => 78.5,
            'regions_count' => 14,

            // 1. Oldini olish mumkin bo'lgan 12 ta asosiy jinoyat turi
            'oldini_olish' => [
                ['key' => 'theft', 'label' => "O'g'rilik", 'count' => 4745, 'rate' => 12.4, 'color' => '#DC2626'],
                ['key' => 'fraud', 'label' => 'Firibgarlik', 'count' => 2023, 'rate' => 5.3, 'color' => '#F59E0B'],
                ['key' => 'hooliganism', 'label' => 'Bezorilik', 'count' => 891, 'rate' => 2.3, 'color' => '#3B82F6'],
                ['key' => 'light_harm', 'label' => 'Badanga yengil shikast', 'count' => 709, 'rate' => 1.9, 'color' => '#10B981'],
                ['key' => 'moderate_harm', 'label' => "Badanga o'rtacha shikast", 'count' => 696, 'rate' => 1.8, 'color' => '#6366F1'],
                ['key' => 'domestic_violence', 'label' => "Oilaviy zo'ravonlik", 'count' => 390, 'rate' => 1.0, 'color' => '#EC4899'],
                ['key' => 'grievous_harm', 'label' => "Badanga og'ir shikast", 'count' => 359, 'rate' => 0.9, 'color' => '#EF4444'],
                ['key' => 'rape', 'label' => 'Nomusga tegish', 'count' => 279, 'rate' => 0.7, 'color' => '#A855F7'],
                ['key' => 'robbery', 'label' => 'Talonchilik', 'count' => 194, 'rate' => 0.5, 'color' => '#F97316'],
                ['key' => 'murder', 'label' => "Qasddan odam o'ldirish", 'count' => 163, 'rate' => 0.4, 'color' => '#B91C1C'],
                ['key' => 'carjacking', 'label' => 'Transport olib qochish', 'count' => 96, 'rate' => 0.3, 'color' => '#14B8A6'],
                ['key' => 'brigandage', 'label' => 'Bosqinchilik', 'count' => 53, 'rate' => 0.1, 'color' => '#E11D48'],
            ],

            // 2. Aniqlanadigan 10 ta jinoyat turi
            'aniqlanadigan' => [
                ['key' => 'drugs', 'label' => 'Giyohvandlik vositalari', 'count' => 8653, 'pct' => 43.8, 'color' => '#8B5CF6'],
                ['key' => 'prostitution', 'label' => "Qo'shmachilik / fohishaxona", 'count' => 1747, 'pct' => 8.8, 'color' => '#EC4899'],
                ['key' => 'bribery', 'label' => "Poraxo'rlik", 'count' => 962, 'pct' => 4.9, 'color' => '#F59E0B'],
                ['key' => 'weapons', 'label' => "Noqonuniy qurol-yarog'", 'count' => 812, 'pct' => 4.1, 'color' => '#EF4444'],
                ['key' => 'extremism', 'label' => "Ekstremizm bilan bog'liq", 'count' => 734, 'pct' => 3.7, 'color' => '#DC2626'],
                ['key' => 'admin_control', 'label' => "Ma'muriy nazoratni buzish", 'count' => 546, 'pct' => 2.8, 'color' => '#6366F1'],
                ['key' => 'embezzlement', 'label' => "O'zlashtirish / rastrata", 'count' => 361, 'pct' => 1.8, 'color' => '#F97316'],
                ['key' => 'currency', 'label' => 'Noqonuniy valyuta muomalasi', 'count' => 302, 'pct' => 1.5, 'color' => '#06B6D4'],
                ['key' => 'counterfeiting', 'label' => 'Qalbaki pul, aksiz markasi', 'count' => 223, 'pct' => 1.1, 'color' => '#14B8A6'],
                ['key' => 'trafficking', 'label' => 'Odam savdosi', 'count' => 111, 'pct' => 0.6, 'color' => '#E11D48'],
            ],

            // 3. Alohida toifadagi shaxslar tomonidan sodir etilgan
            'shaxs' => [
                ['key' => 'youth', 'label' => 'Yoshlar tomonidan', 'count' => 2887, 'pct' => 20.1, 'color' => '#3B82F6'],
                ['key' => 'recidivists', 'label' => 'Muqaddam sudlanganlar', 'count' => 1207, 'pct' => 8.4, 'color' => '#DC2626'],
                ['key' => 'groups', 'label' => 'Guruhlar tomonidan', 'count' => 1105, 'pct' => 7.7, 'color' => '#8B5CF6'],
                ['key' => 'juveniles', 'label' => 'Voyaga yetmaganlar', 'count' => 767, 'pct' => 5.3, 'color' => '#06B6D4'],
                ['key' => 'women', 'label' => 'Ayollar tomonidan', 'count' => 717, 'pct' => 5.0, 'color' => '#EC4899'],
                ['key' => 'unemployed', 'label' => "Ishlamaydigan, o'qimaydiganlar", 'count' => 666, 'pct' => 4.6, 'color' => '#F59E0B'],
                ['key' => 'drunken', 'label' => 'Mast holatda', 'count' => 464, 'pct' => 3.2, 'color' => '#EF4444'],
            ],

            // 4. Og'irlik darajalari
            'ogirlik' => [
                ['label' => "Og'ir jinoyatlar", 'count' => 45997, 'pct' => 60.9, 'color' => '#EF4444'],
                ['label' => "Uncha og'ir bo'lmagan", 'count' => 11088, 'pct' => 14.7, 'color' => '#F59E0B'],
                ['label' => "O'ta og'ir jinoyatlar", 'count' => 3496, 'pct' => 4.6, 'color' => '#B91C1C'],
            ],
        ];

        $regionsData = $regions->map(function ($r) {
            $stat = $r->crimeStatistics()->where('year', 2026)->first() 
                ?? $r->crimeStatistics()->latest('year')->first();

            return [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'capital' => $r->capital,
                'population' => $r->population,
                'area' => $r->area,
                'districts_count' => $r->districts_count,
                'description' => $r->description,
                'color' => $r->color,
                'crime_stats' => $stat,
                'details' => $stat?->details,
                'districts' => $r->districtCrimes,
            ];
        })->keyBy('slug');

        return view('map.index', compact('regions', 'countryStats', 'regionsData'));
    }
}

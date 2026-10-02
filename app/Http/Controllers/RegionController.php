<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\JsonResponse;

class RegionController extends Controller
{
    public function show(Region $region): JsonResponse
    {
        $stat = $region->crimeStatistics()->where('year', 2026)->first()
            ?? $region->crimeStatistics()->latest('year')->first();

        $region->load(['districtCrimes']);

        $data = [
            'id' => $region->id,
            'name' => $region->name,
            'slug' => $region->slug,
            'capital' => $region->capital,
            'population' => $region->population,
            'area' => $region->area,
            'districts_count' => $region->districts_count,
            'description' => $region->description,
            'color' => $region->color,
            'crime_stats' => $stat,
            'details' => $stat?->details,
            'districts' => $region->districtCrimes,
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}

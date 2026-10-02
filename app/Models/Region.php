<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'capital',
        'population',
        'area',
        'districts_count',
        'description',
        'image',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'districts_count' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function crimeStatistics(): HasMany
    {
        return $this->hasMany(CrimeStatistic::class);
    }

    public function districtCrimes(): HasMany
    {
        return $this->hasMany(DistrictCrime::class);
    }
}

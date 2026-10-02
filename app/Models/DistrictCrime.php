<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistrictCrime extends Model
{
    protected $fillable = [
        'region_id',
        'district_name',
        'total_crimes',
        'crime_rate_per_100k',
        'crimes_light',
        'crimes_serious',
        'crimes_very_serious',
        'preventable_total',
        'detected_total',
        'cybercrime',
        'solved_rate',
        'year',
    ];

    protected $casts = [
        'total_crimes' => 'integer',
        'crime_rate_per_100k' => 'float',
        'crimes_light' => 'integer',
        'crimes_serious' => 'integer',
        'crimes_very_serious' => 'integer',
        'preventable_total' => 'integer',
        'detected_total' => 'integer',
        'cybercrime' => 'integer',
        'solved_rate' => 'float',
        'year' => 'integer',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}

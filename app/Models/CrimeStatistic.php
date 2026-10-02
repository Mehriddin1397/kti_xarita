<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrimeStatistic extends Model
{
    protected $fillable = [
        'region_id',
        'year',
        'total_crimes',
        'crimes_light',
        'crimes_serious',
        'crimes_very_serious',
        'preventable_total',
        'detected_total',
        'murders',
        'robberies',
        'fraud',
        'drug_crimes',
        'hooliganism',
        'domestic_violence',
        'cybercrime',
        'corruption',
        'traffic_crimes',
        'juveniles_crimes',
        'recidivism_rate',
        'crime_rate_per_100k',
        'solved_rate',
        'details',
    ];

    protected $casts = [
        'total_crimes' => 'integer',
        'crimes_light' => 'integer',
        'crimes_serious' => 'integer',
        'crimes_very_serious' => 'integer',
        'preventable_total' => 'integer',
        'detected_total' => 'integer',
        'murders' => 'integer',
        'robberies' => 'integer',
        'fraud' => 'integer',
        'drug_crimes' => 'integer',
        'hooliganism' => 'integer',
        'domestic_violence' => 'integer',
        'cybercrime' => 'integer',
        'corruption' => 'integer',
        'traffic_crimes' => 'integer',
        'juveniles_crimes' => 'integer',
        'recidivism_rate' => 'float',
        'crime_rate_per_100k' => 'float',
        'solved_rate' => 'float',
        'details' => 'array',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}

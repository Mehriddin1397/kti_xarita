<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('district_crimes', function (Blueprint $table) {
            $table->integer('crimes_light')->default(0)->after('crime_rate_per_100k');
            $table->integer('crimes_serious')->default(0)->after('crimes_light');
            $table->integer('crimes_very_serious')->default(0)->after('crimes_serious');
            $table->integer('preventable_total')->default(0)->after('crimes_very_serious');
            $table->integer('detected_total')->default(0)->after('preventable_total');
            $table->integer('cybercrime')->default(0)->after('detected_total');
        });
    }

    public function down(): void
    {
        Schema::table('district_crimes', function (Blueprint $table) {
            $table->dropColumn([
                'crimes_light',
                'crimes_serious',
                'crimes_very_serious',
                'preventable_total',
                'detected_total',
                'cybercrime',
            ]);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crime_statistics', function (Blueprint $table) {
            $table->integer('crimes_light')->default(0)->after('total_crimes');
            $table->integer('crimes_serious')->default(0)->after('crimes_light');
            $table->integer('crimes_very_serious')->default(0)->after('crimes_serious');
            $table->integer('preventable_total')->default(0)->after('crimes_very_serious');
            $table->integer('detected_total')->default(0)->after('preventable_total');
            $table->json('details')->nullable()->after('solved_rate');
        });
    }

    public function down(): void
    {
        Schema::table('crime_statistics', function (Blueprint $table) {
            $table->dropColumn([
                'crimes_light',
                'crimes_serious',
                'crimes_very_serious',
                'preventable_total',
                'detected_total',
                'details',
            ]);
        });
    }
};

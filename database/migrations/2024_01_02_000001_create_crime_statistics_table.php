<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crime_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->integer('year')->default(2024);
            $table->integer('total_crimes')->default(0);
            $table->integer('murders')->default(0);
            $table->integer('robberies')->default(0);
            $table->integer('fraud')->default(0);
            $table->integer('drug_crimes')->default(0);
            $table->integer('hooliganism')->default(0);
            $table->integer('domestic_violence')->default(0);
            $table->integer('cybercrime')->default(0);
            $table->integer('corruption')->default(0);
            $table->integer('traffic_crimes')->default(0);
            $table->integer('juveniles_crimes')->default(0);
            $table->float('recidivism_rate')->default(0);
            $table->float('crime_rate_per_100k')->default(0);
            $table->float('solved_rate')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crime_statistics');
    }
};

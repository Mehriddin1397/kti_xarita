<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('district_crimes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->string('district_name');
            $table->integer('total_crimes')->default(0);
            $table->float('crime_rate_per_100k')->default(0);
            $table->float('solved_rate')->default(0);
            $table->integer('year')->default(2024);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('district_crimes');
    }
};

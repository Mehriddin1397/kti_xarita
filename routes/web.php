<?php

use App\Http\Controllers\LoyihaController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MetodikaController;
use App\Http\Controllers\RegionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MapController::class, 'index'])->name('map.index');
Route::get('/loyihalar', [LoyihaController::class, 'index'])->name('loyiha.index');
Route::get('/metodik-qullanmalar', function () {
    return redirect()->route('loyiha.index');
})->name('metodika.index');

Route::get('/api/region/{region}', [RegionController::class, 'show'])->name('region.show');
Route::get('/api/loyiha/{region}', [LoyihaController::class, 'show'])->name('loyiha.show');
Route::get('/api/metodika/{region}', [LoyihaController::class, 'show'])->name('metodika.show');

Route::get('/loyiha/hujjat/pdf', [LoyihaController::class, 'viewPdf'])->name('loyiha.pdf.view');
Route::get('/loyiha/hujjat/pdf/download', [LoyihaController::class, 'downloadPdf'])->name('loyiha.pdf.download');


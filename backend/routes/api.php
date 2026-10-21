<?php

use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\ResearchController;
use App\Http\Controllers\Api\SectorController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('sectors', SectorController::class);
    Route::apiResource('researches', ResearchController::class);
    Route::apiResource('publications', PublicationController::class);
});
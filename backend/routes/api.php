<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\ResearchController;
use App\Http\Controllers\Api\SectorController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('sectors', SectorController::class);
    Route::apiResource('researches', ResearchController::class);
    Route::apiResource('publications', PublicationController::class);
});
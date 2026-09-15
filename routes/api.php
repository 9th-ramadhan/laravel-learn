<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route Public Autentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route Protected (Harus menyertakan Bearer Token yang valid)
Route::middleware('auth:sanctum')->group(function () {
    // Menyediakan seluruh route CRUD otomatis (index, store, show, update, destroy)
    Route::apiResource('kontak', ContactController::class);
});

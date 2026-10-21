<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sector\StoreSectorRequest;
use App\Http\Requests\Sector\UpdateSectorRequest;
use App\Models\Sector;
use Illuminate\Http\JsonResponse;

class SectorController extends Controller
{
    public function index(): JsonResponse
    {
        $sectors = Sector::query()
            ->withCount(['researches', 'publications'])
            ->orderBy('name')
            ->get();

        return response()->json($sectors);
    }

    public function store(StoreSectorRequest $request): JsonResponse
    {
        $sector = Sector::create($request->validated());

        return response()->json($sector, 201);
    }

    public function show(Sector $sector): JsonResponse
    {
        $sector->loadCount(['researches', 'publications']);

        return response()->json($sector);
    }

    public function update(UpdateSectorRequest $request, Sector $sector): JsonResponse
    {
        $sector->update($request->validated());

        return response()->json($sector);
    }

    public function destroy(Sector $sector): JsonResponse
    {
        $sector->delete();

        return response()->json(null, 204);
    }
}
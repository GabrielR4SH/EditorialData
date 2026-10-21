<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Research\StoreResearchRequest;
use App\Http\Requests\Research\UpdateResearchRequest;
use App\Models\Research;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $researches = Research::query()
            ->with(['sector:id,name', 'user:id,name'])
            ->when($request->sector_id, fn ($q) => $q->where('sector_id', $request->sector_id))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        return response()->json($researches);
    }

    public function store(StoreResearchRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $research = Research::create($data);
        $research->load(['sector:id,name', 'user:id,name']);

        return response()->json($research, 201);
    }

    public function show(Research $research): JsonResponse
    {
        $research->load(['sector:id,name', 'user:id,name']);

        return response()->json($research);
    }

    public function update(UpdateResearchRequest $request, Research $research): JsonResponse
    {
        $research->update($request->validated());
        $research->load(['sector:id,name', 'user:id,name']);

        return response()->json($research);
    }

    public function destroy(Research $research): JsonResponse
    {
        $research->delete();

        return response()->json(null, 204);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Publication\StorePublicationRequest;
use App\Http\Requests\Publication\UpdatePublicationRequest;
use App\Models\Publication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $publications = Publication::query()
            ->with('sector:id,name')
            ->when($request->sector_id, fn ($q) => $q->where('sector_id', $request->sector_id))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->latest()
            ->get();

        return response()->json($publications);
    }

    public function store(StorePublicationRequest $request): JsonResponse
    {
        $publication = Publication::create($request->validated());
        $publication->load('sector:id,name');

        return response()->json($publication, 201);
    }

    public function show(Publication $publication): JsonResponse
    {
        $publication->load('sector:id,name');

        return response()->json($publication);
    }

    public function update(UpdatePublicationRequest $request, Publication $publication): JsonResponse
    {
        $publication->update($request->validated());
        $publication->load('sector:id,name');

        return response()->json($publication);
    }

    public function destroy(Publication $publication): JsonResponse
    {
        $publication->delete();

        return response()->json(null, 204);
    }
}
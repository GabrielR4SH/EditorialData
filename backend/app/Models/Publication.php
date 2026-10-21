<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publication extends Model
{
    protected $table = 'publications';

    protected $fillable = [
        'sector_id',
        'title',
        'slug',
        'type',
        'year',
        'summary',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'date',
        'year' => 'integer',
    ];

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }
}

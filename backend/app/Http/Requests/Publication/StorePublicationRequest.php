<?php

namespace App\Http\Requests\Publication;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StorePublicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sector_id'    => ['required', 'integer', 'exists:sectors,id'],
            'title'        => ['required', 'string', 'max:255'],
            'slug'         => ['nullable', 'string', 'max:255', 'unique:publications,slug'],
            'type'         => ['sometimes', 'string', 'in:yearbook,article,report,bulletin'],
            'year'         => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'summary'      => ['nullable', 'string'],
            'status'       => ['sometimes', 'string', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function prepareForValidation(): void
    {
        if ($this->has('title') && !$this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('title')),
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'sector_id.required'  => 'O setor é obrigatório.',
            'sector_id.exists'    => 'O setor informado não existe.',
            'title.required'      => 'O título da publicação é obrigatório.',
            'title.max'           => 'O título deve ter no máximo 255 caracteres.',
            'slug.unique'         => 'O slug informado já está em uso.',
            'type.in'             => 'O tipo deve ser: yearbook, article, report ou bulletin.',
            'year.min'            => 'O ano deve ser maior que 1900.',
            'year.max'            => 'O ano deve ser menor que 2100.',
            'status.in'           => 'O status deve ser: draft, published ou archived.',
        ];
    }
}

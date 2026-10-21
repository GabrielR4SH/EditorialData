<?php

namespace App\Http\Requests\Sector;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreSectorRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:sectors,slug'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function prepareForValidation(): void
    {
        if ($this->has('name') && !$this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('name')),
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do setor é obrigatório.',
            'name.max' => 'O nome do setor deve ter no máximo 255 caracteres.',
            'slug.required' => 'O slug do setor é obrigatório.',
            'slug.max' => 'O slug do setor deve ter no máximo 255 caracteres.',
            'slug.unique' => 'O slug do setor já existe.',
            'description.required' => 'A descrição do setor é obrigatória.',
            'is_active.required' => 'O status do setor é obrigatório.',
        ];
    }
   
}

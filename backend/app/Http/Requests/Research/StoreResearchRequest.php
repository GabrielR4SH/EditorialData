<?php

namespace App\Http\Requests\Research;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreResearchRequest extends FormRequest
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
            'sector_id'   => ['required', 'integer', 'exists:sectors,id'],
            'user_id'     => ['required', 'integer', 'exists:users,id'],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'string', 'in:draft,in_progress,completed,cancelled'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'sector_id.required'   => 'O setor é obrigatório.',
            'sector_id.exists'     => 'O setor informado não existe.',
            'user_id.required'     => 'O responsável é obrigatório.',
            'user_id.exists'       => 'O usuário informado não existe.',
            'title.required'       => 'O título da pesquisa é obrigatório.',
            'title.max'            => 'O título deve ter no máximo 255 caracteres.',
            'status.in'            => 'O status deve ser: draft, in_progress, completed ou cancelled.',
            'end_date.after_or_equal' => 'A data de término deve ser igual ou posterior à data de início.',
        ];
    }
}

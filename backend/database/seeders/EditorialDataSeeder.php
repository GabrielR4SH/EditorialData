<?php

namespace Database\Seeders;

use App\Models\Publication;
use App\Models\Research;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EditorialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Usuário principal (caso ainda não exista)
        $user = User::firstOrCreate(
            ['email' => 'gabriel@teste.com'],
            [
                'name' => 'Gabriel Santana',
                'password' => bcrypt('password'),
            ]
        );

        // Setores econômicos
        $sectorsData = [
            [
                'name' => 'Agronegócio',
                'description' => 'Análises e inventários sobre produção agrícola, pecuária e exportações do agronegócio brasileiro.',
            ],
            [
                'name' => 'Energia',
                'description' => 'Dados e estudos sobre geração, distribuição e transição energética no Brasil.',
            ],
            [
                'name' => 'Saúde',
                'description' => 'Pesquisas sobre o sistema de saúde, indústria farmacêutica e inovação em saúde.',
            ],
            [
                'name' => 'Tecnologia',
                'description' => 'Mapeamento do ecossistema de tecnologia, startups e transformação digital.',
            ],
            [
                'name' => 'Infraestrutura',
                'description' => 'Inventários sobre logística, transportes, saneamento e obras de infraestrutura.',
            ],
        ];

        $sectors = [];

        foreach ($sectorsData as $data) {
            $sectors[] = Sector::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'is_active' => true,
            ]);
        }

        // Pesquisas / Inventários
        $researchesData = [
            [
                'sector' => 'Agronegócio',
                'title' => 'Inventário da Produção de Grãos 2025',
                'description' => 'Levantamento completo da produção de soja, milho e trigo nas principais regiões produtoras.',
                'status' => 'completed',
            ],
            [
                'sector' => 'Energia',
                'title' => 'Transição Energética no Brasil',
                'description' => 'Análise do avanço das fontes renováveis e impacto na matriz energética nacional.',
                'status' => 'in_progress',
            ],
            [
                'sector' => 'Saúde',
                'title' => 'Panorama da Indústria Farmacêutica',
                'description' => 'Mapeamento das principais empresas, investimentos em P&D e lançamentos de medicamentos.',
                'status' => 'draft',
            ],
            [
                'sector' => 'Tecnologia',
                'title' => 'Ecossistema de Startups Brasileiras',
                'description' => 'Inventário das startups em estágio de crescimento e principais hubs de inovação.',
                'status' => 'in_progress',
            ],
            [
                'sector' => 'Infraestrutura',
                'title' => 'Logística e Portos do Brasil',
                'description' => 'Estudo sobre capacidade portuária, gargalos logísticos e investimentos previstos.',
                'status' => 'completed',
            ],
        ];

        foreach ($researchesData as $data) {
            $sector = collect($sectors)->firstWhere('name', $data['sector']);

            Research::create([
                'sector_id' => $sector->id,
                'user_id' => $user->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'status' => $data['status'],
                'start_date' => now()->subMonths(rand(1, 8)),
                'end_date' => $data['status'] === 'completed' ? now()->subDays(rand(5, 40)) : null,
            ]);
        }

        // Publicações
        $publicationsData = [
            [
                'sector' => 'Agronegócio',
                'title' => 'Anuário do Agronegócio 2025',
                'type' => 'yearbook',
                'year' => 2025,
                'status' => 'published',
            ],
            [
                'sector' => 'Energia',
                'title' => 'Especial Transição Energética',
                'type' => 'special_edition',
                'year' => 2025,
                'status' => 'published',
            ],
            [
                'sector' => 'Tecnologia',
                'title' => 'Anuário de Tecnologia e Inovação',
                'type' => 'yearbook',
                'year' => 2025,
                'status' => 'draft',
            ],
            [
                'sector' => 'Saúde',
                'title' => 'Panorama da Saúde no Brasil',
                'type' => 'special_edition',
                'year' => 2024,
                'status' => 'archived',
            ],
        ];

        foreach ($publicationsData as $data) {
            $sector = collect($sectors)->firstWhere('name', $data['sector']);

            Publication::create([
                'sector_id' => $sector->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'type' => $data['type'],
                'year' => $data['year'],
                'summary' => 'Publicação especializada com dados primários e análises objetivas do setor.',
                'status' => $data['status'],
                'published_at' => $data['status'] === 'published' ? now()->subMonths(rand(1, 6)) : null,
            ]);
        }
    }
}
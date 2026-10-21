# EditorialData

<p align="center">
  <img src="logo.svg" alt="EditorialData Logo" width="220">
</p>

<p align="center">
  <strong>Plataforma interna de gestão de dados, pesquisas e publicações especializadas</strong><br>
  Inspirada na Análise Editorial
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
</p>

---

## Sobre o projeto

O **EditorialData** é uma plataforma interna desenvolvida para apoiar a produção de publicações especializadas baseadas em pesquisa de dados primários.

O sistema permite à equipe editorial:

- Organizar **setores econômicos**
- Registrar e acompanhar **pesquisas e inventários de dados**
- Gerenciar **publicações e edições especiais**
- Controlar o **mailing de distribuição** por edição
- Visualizar indicadores em um dashboard simples e objetivo

O foco é precisão, organização didática e apoio à tomada de decisão — exatamente o espírito da Análise Editorial.

---

## Stack

| Camada            | Tecnologia                          |
|-------------------|-------------------------------------|
| Backend           | Laravel 13 + Sanctum                |
| Frontend          | React + TypeScript + Tailwind CSS   |
| Banco de dados    | PostgreSQL                          |
| Infraestrutura    | Docker + Docker Compose             |
| Autenticação      | Laravel Sanctum                     |

---

## Funcionalidades previstas (MVP)

- [x] Ambiente Docker completo
- [x] Autenticação (Login / Registro)
- [x] CRUD de Setores Econômicos
- [x] CRUD de Pesquisas / Inventários
- [x] CRUD de Publicações / Edições
- [x] Dashboard com indicadores
- [ ] Controle básico de permissões (Admin / Editor)
- [ ] Padronização de Edição (Layouts/Templates)

---

## Como rodar (em breve)

```bash
git clone https://github.com/SEU_USUARIO/EditorialData.git
cd EditorialData
docker compose up -d --build
```

---

## Estrutura prevista

```text
EditorialData/
├── backend/              # Laravel 13 (API)
├── frontend/             # React + TypeScript + Vite
├── docker/
│   ├── php/
│   └── nginx/
├── docker-compose.yml
├── logo.svg
└── README.md
```

---

## Objetivo

Este projeto foi criado como estudo prático de arquitetura full-stack moderna, com foco em:

- Organização de dados editoriais
- Boas práticas de Laravel
- TypeScript no frontend
- PostgreSQL em ambiente containerizado
- Código limpo e escalável

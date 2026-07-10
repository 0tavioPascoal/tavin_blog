# Otávio Blog

Blog e portfolio tecnico de Otavio Pascoal, construido com Next.js, React, TypeScript e Supabase. O projeto combina paginas publicas para artigos, projetos e contato com uma area administrativa para gerenciar conteudo.

## Stack

- Next.js 16.2.9 com App Router
- React 19 e TypeScript
- Tailwind CSS 4
- Supabase para autenticacao e persistencia
- Zod para validacao
- React Hook Form para formularios
- React Markdown, remark-gfm, rehype-slug, rehype-autolink-headings e rehype-pretty-code para renderizacao de artigos
- lucide-react e react-icons para icones

## Como Rodar

Instale as dependencias:

```bash
corepack pnpm install
```

Inicie o ambiente de desenvolvimento:

```bash
corepack pnpm run dev
```

Acesse:

```text
http://localhost:3000
```

Comandos principais:

```bash
corepack pnpm run dev
corepack pnpm run build
corepack pnpm run start
corepack pnpm run lint
```

## Variaveis de Ambiente

Crie um `.env.local` com as variaveis esperadas pela aplicacao:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contato@example.com
```

Notas:

- `SUPABASE_URL` e `SUPABASE_ANON_KEY` habilitam autenticacao e leitura/escrita no Supabase.
- `NEXT_PUBLIC_SITE_URL` e usado como base para metadados, sitemap e links absolutos.
- `NEXT_PUBLIC_CONTACT_EMAIL` e usado como fallback para contato publico.
- Nao versione valores reais de ambiente.

## Estrutura do Projeto

```text
src/
  app/
    (site)/        Rotas publicas do blog e portfolio
    admin/         Rotas da area administrativa
    robots.ts      Geracao de robots.txt
    sitemap.ts     Geracao de sitemap.xml
  components/
    admin/         UI e formularios do painel admin
    blog/          Cards, filtros e renderizacao markdown
    home/          Secoes da pagina inicial
    layout/        Header, footer e shell publico
    shared/        Componentes compartilhados
    ui/            Componentes base
  features/
    auth/          Login, logout e repositorio de autenticacao
    categories/    Categorias de posts
    certificates/  Certificados
    posts/         Artigos
    projects/      Projetos
    settings/      Configuracoes do site
    tags/          Tags de posts
  lib/
    markdown/      Utilitarios de conteudo markdown
    supabase/      Cliente Supabase server-side
```

## Area Publica

A area publica fica em `src/app/(site)` e inclui:

- Home com hero, artigos em destaque, projetos em destaque e pilares de valor.
- Blog com listagem de artigos.
- Paginas por artigo, categoria e tag.
- Paginas de projetos, sobre e contato.
- Sitemap e robots gerados por codigo.

Os componentes publicos ficam principalmente em `src/components/home`, `src/components/blog`, `src/components/projects` e `src/components/layout`.

## Area Admin

A area administrativa fica em `src/app/admin` e usa Supabase Auth. O fluxo principal inclui:

- Login e logout.
- Dashboard com resumo de posts, publicados, rascunhos e certificados.
- CRUD de posts.
- CRUD de categorias e tags.
- CRUD de projetos.
- CRUD de certificados.
- Edicao de configuracoes do site.

Os formularios usam React Hook Form com schemas Zod. As operacoes passam por Server Actions em `src/features/*/actions` e repositorios em `src/features/*/repositories`.

## Conteudo

Posts usam os principais campos:

- `title`: titulo do artigo.
- `slug`: identificador publico em letras minusculas, numeros e hifens.
- `description`: resumo usado em cards e metadados.
- `contentMarkdown`: corpo do artigo em Markdown.
- `status`: `draft` ou `published`.
- `categoryId`: categoria opcional.
- `tagIds`: tags associadas.
- `readingTimeMinutes`: tempo estimado de leitura.
- `isFeatured`: define se o artigo aparece como destaque.

O conteudo Markdown suporta GitHub Flavored Markdown e recursos de heading/link/code highlighting configurados pelos componentes de blog.

## Qualidade e Manutencao

Antes de publicar ou abrir PR, rode:

```bash
corepack pnpm run build
```

Use `corepack pnpm run lint` para checagens de lint quando estiver ajustando codigo. Para mudancas em formularios, schemas ou actions, valide tambem o fluxo manual no admin.

## Observacoes Sobre Next.js

Este projeto usa Next.js 16.2.9. Antes de alterar convencoes de App Router, metadata, arquivos especiais, Server Components ou Server Actions, consulte a documentacao local em:

```text
node_modules/next/dist/docs/
```

Essa documentacao deve prevalecer sobre conhecimento antigo de versoes anteriores do Next.js.

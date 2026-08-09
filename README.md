# Biishare

**Biishare** e uma plataforma que une entretenimento e aprendizagem numa experiencia moderna, dinamica e envolvente.

O objetivo e tornar o estudo mais leve e acessivel atraves de videos, documentos, imagens e conteudos organizados por disciplina, nivel e ano.

## Funcionalidades

- Conteudos organizados por disciplinas, niveis e anos
- Suporte a videos educativos
- Documentos e materiais de apoio
- Conteudos visuais e interativos
- Filtros para navegacao rapida
- Interface moderna e responsiva
- Listagem com carregamento progressivo

## Tecnologias

- Next.js
- React
- TypeScript
- Material UI
- Tailwind CSS
- TanStack React Query
- Axios

## Requisitos

- Node.js 18 ou superior
- npm
- API externa configurada e acessivel

## Variaveis de ambiente

Crie um ficheiro `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Variavel disponivel:

- `NEXT_PUBLIC_API_BASE_URL`: URL base da API utilizada pela aplicacao
- `NEXT_PUBLIC_GOOGLE_AUTH_URL` (opcional): URL completa do endpoint OAuth Google. Se nao for definida, a aplicacao usa `NEXT_PUBLIC_API_BASE_URL/auth/google`.
- `NEXT_PUBLIC_FACEBOOK_AUTH_URL` (opcional): URL completa do endpoint OAuth Facebook. Se nao for definida, a aplicacao usa `NEXT_PUBLIC_API_BASE_URL/auth/facebook`.

Nunca envie ficheiros `.env.local` ou `.env` com credenciais reais para o repositorio.

## Instalacao

```bash
git clone https://github.com/biishare/biishare.git
cd biishare
npm install
cp .env.example .env.local
npm run dev
```

Depois, acesse:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a versao de producao.

```bash
npm run start
```

Inicia a aplicacao em modo de producao depois do build.

```bash
npm run lint
```

Executa a validacao de lint do projeto.

## Estrutura do projeto

```txt
src/
  app/             Rotas e paginas do Next.js App Router
  components/      Componentes reutilizaveis da interface
  MetaData/        Metadados das paginas
  fonts/           Configuracao de fontes

services/          Comunicacao com a API externa
hooks/             Hooks personalizados
utils/             Funcoes auxiliares
constants/         Constantes e mapas de labels
types/             Tipagens TypeScript
lib/               Configuracoes compartilhadas
public/            Assets publicos da aplicacao
```

## Sessao em producao

A sessao real usa cookie HTTP-only emitido pela API. O menu valida /auth/me antes de mostrar o perfil e nao usa localStorage como fonte de verdade.

Para o perfil renderizado no servidor funcionar, o cookie precisa chegar ao dominio do frontend. O recomendado e publicar frontend e API no mesmo site, por exemplo app.example.com e api.example.com, e configurar a API com AUTH_COOKIE_DOMAIN=.example.com.

Se frontend e API ficarem em sites diferentes, sera necessario AUTH_COOKIE_SAME_SITE=none e AUTH_COOKIE_SECURE=true, mas essa arquitetura e mais fragil porque depende de cookies de terceiros em navegadores modernos.

## Deploy

Para producao, configure `NEXT_PUBLIC_API_BASE_URL` na plataforma de deploy, como Vercel, Netlify ou outro provedor compativel com Next.js.

Antes de publicar, execute:

```bash
npm run lint
npm run build
```

## Licenca

Este projeto esta sob a licenca MIT.

## Visao

A Biishare procura transformar o acesso ao conhecimento, tornando-o mais simples, interativo e alinhado com a forma como os estudantes consomem conteudo hoje.

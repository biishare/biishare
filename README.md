# 🚀 Biishare

**Biishare** é uma plataforma que une entretenimento e aprendizado em uma experiência moderna, dinâmica e envolvente.

Aqui, o conhecimento ganha vida através de vídeos, imagens, documentos e conteúdos interactivos — tornando o estudo mais leve, acessível e interessante para estudantes e curiosos que querem aprender de forma diferente.

---

## ✨ Funcionalidades

* 📚 Conteúdos organizados por disciplinas e níveis
* 🎥 Suporte a vídeos educativos
* 📄 Documentos e materiais de apoio
* 🖼️ Conteúdos visuais interativos
* 🔎 Filtros inteligentes para navegação rápida
* ⚡ Interface moderna e fluida
* 📱 Design totalmente responsivo

---

## 🛠️ Tecnologias

* Next.js
* React
* TypeScript
* Material UI
* Framer Motion
* Axios

---

## 🔐 Variáveis de Ambiente

Este projecto depende de uma API externa.
Crie um arquivo `.env.local` na raiz do projeto:

```bash id="1y6zt6"
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 📌 Descrição

* `NEXT_PUBLIC_API_URL` → URL base da API utilizada pela aplicação

> ⚠️ Nunca suba o arquivo `.env.local` para o repositório.

---

## ⚙️ Instalação e execução

```bash id="n3svhq"
# Clone o repositório
git clone https://github.com/seu-usuario/biishare.git

# Acesse a pasta do projeto
cd biishare

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

Acesse no navegador:
👉 http://localhost:3000

---

## 📁 Estrutura do projeto

```bash
src/
 ├── app/                # Rotas e páginas (Next.js App Router)
 ├── components/         # Componentes reutilizáveis (UI)
 ├── services/           # Comunicação com APIs
 │    ├── api.ts         # Configuração do Axios
 │    └── endpoints/     # Funções por domínio (posts, users, etc)
 ├── hooks/              # Hooks personalizados
 ├── utils/              # Funções auxiliares
 ├── constants/          # Constantes globais
 ├── types/              # Tipagens TypeScript
 ├── styles/             # Estilos e temas
 └── lib/                # Configurações externas

public/
 └── images/             # Imagens estáticas da aplicação

.env.example             # Exemplo de variáveis de ambiente
```



---

## 🌐 Deploy

Para produção, configure corretamente as variáveis de ambiente na plataforma de deploy (ex: Vercel).

---


---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 💡 Visão

A Biishare tem como objectivo transformar o acesso ao conhecimento, tornando-o mais acessível, interativo e alinhado com a forma como as novas gerações consomem conteúdo.

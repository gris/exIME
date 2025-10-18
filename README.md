# IME Alumni Directory

Diretório de ex-alunos do Instituto Militar de Engenharia (IME) - Uma plataforma privada para ex-alunos se conectarem e compartilharem suas informações profissionais.

## 🚀 Tecnologias

- **Nuxt 3** - Framework Vue.js para aplicações web modernas
- **TypeScript** - Tipagem estática para JavaScript
- **Nuxt UI** - Biblioteca de componentes UI baseada em Tailwind CSS
- **Clerk** - Autenticação (modo apenas por convite)
- **Supabase** - Banco de dados PostgreSQL e backend
- **TailwindCSS** - Framework CSS utilitário

## 📋 Funcionalidades

- ✅ Autenticação segura apenas por convite (Clerk)
- ✅ Perfis de ex-alunos com informações profissionais
- ✅ Busca e filtros por nome, empresa, tecnologias e áreas de especialização
- ✅ Criação e edição de perfil próprio
- ✅ Visualização de perfis de outros ex-alunos
- ✅ Tags para tecnologias e áreas de especialização
- ✅ Interface totalmente em português brasileiro
- ✅ Design moderno e responsivo

## 🛠️ Configuração do Projeto

### Pré-requisitos

- Node.js 20.x ou superior
- Conta no [Clerk](https://clerk.com)
- Conta no [Supabase](https://supabase.com)

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd exIME
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Clerk

1. Crie uma conta no [Clerk](https://clerk.com)
2. Crie uma nova aplicação
3. **Configure modo apenas por convite:**
   - Vá em **Settings → Authentication**
   - Desabilite "Allow public sign-ups"
   - Habilite "Invite-only mode"
4. Copie suas chaves (Publishable Key e Secret Key)

### 4. Configure o Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para o **SQL Editor**
4. Execute o script `supabase-setup.sql` para criar a tabela e políticas de segurança
5. Copie a URL do projeto e a chave anônima:
   - Vá em **Settings → API**
   - Copie "Project URL" e "anon public"

### 5. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (use `env.example` como referência):

```env
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NUXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 6. Execute o projeto

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

O projeto estará disponível em `http://localhost:3000`

## 📦 Estrutura do Projeto

```
exIME/
├── app.vue                      # Componente raiz da aplicação
├── nuxt.config.ts              # Configuração do Nuxt
├── composables/
│   └── useSupabase.ts          # Composable do cliente Supabase
├── middleware/
│   └── auth.global.ts          # Middleware de autenticação global
├── pages/
│   ├── index.vue               # Redireciona para /diretorio
│   ├── login.vue               # Página de login
│   ├── cadastro.vue            # Página de cadastro (apenas por convite)
│   ├── diretorio.vue           # Lista de ex-alunos com busca/filtros
│   └── perfil/
│       ├── index.vue           # Visualizar perfil próprio
│       ├── editar.vue          # Criar/editar perfil próprio
│       └── [id].vue            # Visualizar perfil de outro ex-aluno
├── plugins/
│   └── clerk.client.ts         # Plugin do Clerk
├── types/
│   └── alumni.ts               # Tipos TypeScript
└── supabase-setup.sql          # Script de configuração do banco
```

## 🔒 Segurança

### Clerk (Autenticação)
- Modo apenas por convite habilitado
- Proteção de todas as rotas (exceto login/cadastro)
- Gerenciamento seguro de sessões

### Supabase (Banco de Dados)
- Row Level Security (RLS) habilitado
- Políticas configuradas:
  - Usuários autenticados podem ler todos os perfis
  - Usuários só podem editar seus próprios perfis
  - Validação no nível do banco de dados

## 📝 Como Usar

### Para Administradores

1. **Convidar novos ex-alunos:**
   - Acesse o dashboard do Clerk
   - Vá em "Users" → "Invite User"
   - Envie convites por email

### Para Ex-Alunos

1. **Criar conta (apenas com convite):**
   - Receba o email de convite
   - Clique no link e complete o cadastro
   - Faça login na plataforma

2. **Criar perfil:**
   - Após o login, clique em "Criar Perfil"
   - Preencha suas informações:
     - Nome, email, telefone
     - LinkedIn
     - Cargo e empresa atual
     - Tecnologias (adicione múltiplas)
     - Áreas de especialização
   - Clique em "Criar Perfil"

3. **Buscar ex-alunos:**
   - Use a barra de busca para encontrar por nome, empresa ou tecnologia
   - Filtre por tecnologias específicas clicando nos badges
   - Clique em um perfil para ver detalhes completos

4. **Editar perfil:**
   - Clique em "Meu Perfil"
   - Clique em "Editar"
   - Atualize suas informações
   - Clique em "Salvar Alterações"

## 🎨 Personalização

### Cores
O projeto usa o esquema de cores verde (representando o IME). Para alterar:
- Edite `nuxt.config.ts` ou `tailwind.config.ts` (se criado)
- Substitua `color="green"` nos componentes

### Logo
Adicione o logo do IME em `public/logo.png` e atualize os componentes de cabeçalho

## 🚀 Deploy

### Vercel (Recomendado para Nuxt)

1. Faça push do código para GitHub/GitLab
2. Conecte seu repositório ao Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Node.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🐛 Solução de Problemas

### Erro de autenticação
- Verifique se as chaves do Clerk estão corretas
- Confirme que o modo apenas por convite está ativado

### Erro ao salvar perfil
- Verifique se executou o script `supabase-setup.sql`
- Confirme que as políticas RLS estão ativas
- Verifique as credenciais do Supabase

### Erro de build
- Use Node.js 20.x ou superior
- Limpe e reinstale: `rm -rf node_modules package-lock.json && npm install`

## 📄 Licença

Este projeto é privado e destinado apenas para uso interno do IME Alumni.

## 🤝 Contribuindo

Para contribuir com o projeto:
1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente
4. Submeta um Pull Request

---

Desenvolvido com ❤️ para os ex-alunos do IME

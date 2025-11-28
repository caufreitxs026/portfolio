# Portfólio Profissional | Cauã Freitas

Bem-vindo ao repositório do meu portfólio profissional. Este projeto foi desenvolvido para demonstrar minhas habilidades como Desenvolvedor Full Stack, utilizando uma arquitetura moderna, escalável e focada em performance.

O sistema não é apenas uma vitrine estática; é uma aplicação completa com backend real, banco de dados na nuvem e um frontend interativo.

---

## Tecnologias Utilizadas

O projeto foi dividido em duas grandes partes (Frontend e Backend) para garantir a separação de responsabilidades.

### Frontend (A Interface)

* **React.js (Next.js 14)**: Framework para criar interfaces rápidas e otimizadas para SEO.
* **TypeScript**: Para garantir tipagem segura e código robusto.
* **Tailwind CSS**: Estilização moderna, responsiva e com tema Dark Mode.
* **Framer Motion**: Animações suaves e interações elegantes.
* **Lucide React**: Biblioteca de ícones leves.

### Backend (A Inteligência)

* **Python (FastAPI)**: API de alta performance para gerenciar dados e requisições.
* **Supabase (PostgreSQL)**: Banco de dados relacional na nuvem para Projetos, Experiências e Mensagens.
* **Resend API**: Envio de e-mails transacionais do formulário de contato.
* **Pydantic**: Validação rigorosa dos dados.

---

## Infraestrutura e Deploy

* **Vercel**: Hospedagem do frontend.
* **Render**: Hospedagem do backend.
* **GitHub**: Versionamento de código e CI/CD.

---

## Funcionalidades

### Vitrine de Projetos

* Carrossel interativo com projetos em destaque.
* Dados carregados dinamicamente do banco de dados.
* Links diretos para repositórios e demos.

### Linha do Tempo Profissional

* Histórico de experiências carregado via API.
* Design limpo e organizado cronologicamente.

### Formulário de Contato Inteligente

* Validação no frontend e backend.
* Envio real de e-mail utilizando a API do Resend.
* Armazenamento de todas as mensagens no banco de dados.

### UX/UI Premium

* Skeleton loading para carregamento suave.
* Design responsivo para diferentes dispositivos.
* Tema escuro moderno e tecnológico.

---

## Como Rodar o Projeto Localmente

Se quiser testar ou modificar este projeto na sua máquina, siga os passos abaixo.

---

## Pré-requisitos

* Node.js instalado
* Python instalado
* Conta no Supabase
* Conta no Resend

---

## 1. Configurando o Backend (API)

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/portfolio.git
cd portfolio/backend-api

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente (Windows)
.\venv\Scripts\activate
# Ou (Linux/Mac)
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
```

Crie o arquivo `.env` na pasta `backend-api` com:

```
SUPABASE_URL=...
SUPABASE_KEY=...
RESEND_API_KEY=...
EMAIL_TO=...
```

Execute o servidor:

```bash
uvicorn main:app --reload
```

---

## 2. Configurando o Frontend (Site)

```bash
cd frontend-web/src

# Instale as dependências
npm install
```

Crie o arquivo `.env.local` dentro da pasta `src`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Execute o site:

```bash
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## Estrutura de Pastas

```
portfolio/
├── backend-api/          # API em Python (FastAPI)
│   ├── main.py           # Código principal do servidor
│   ├── requirements.txt  # Dependências Python
│   └── .env              # Variáveis de ambiente (não comitadas)
│
└── frontend-web/         # Site em React (Next.js)
    └── src/
        ├── app/          # Páginas e layouts
        ├── components/   # Componentes reutilizáveis
        └── public/       # Arquivos estáticos
```

---

## Contato

Gostou do projeto? Deseja conversar sobre oportunidades?

* LinkedIn: **linkedin.com/in/cauafreitas**
* GitHub: **github.com/caufreitxs026**
* E-mail: **[cauafreitas026@gmail.com](mailto:cauafreitas026@gmail.com)**

---

© 2025 Cauã Freitas. Desenvolvido com coragem e muito café.

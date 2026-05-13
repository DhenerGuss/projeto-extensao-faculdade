# Projeto Artipica

Aplicacao web em React, TypeScript e Vite para vitrine e administracao de produtos artesanais da marca Artipica. O projeto usa Supabase para autenticacao, banco de dados, regras de seguranca e armazenamento das imagens dos produtos.

## Objetivo do Sistema

O sistema foi organizado para atender dois publicos:

- Clientes: navegam pela loja, filtram produtos, visualizam fotos, detalhes, estoque, encomendas e entram em contato pelo WhatsApp.
- Administradora: acessa um painel restrito para cadastrar, editar, excluir, ordenar produtos, trocar senha e gerenciar imagens.

O acesso administrativo fica oculto para clientes e aparece somente apos login valido via Supabase Auth.

## Stack Tecnica

- React 19
- TypeScript
- Vite
- Supabase Auth
- Supabase Database
- Supabase Storage
- ESLint

## Estrutura do Projeto

```text
src/
  app/
    App.tsx          Componente principal, estado global da tela e integracao com Supabase
    styles.css       Estilos globais, responsividade, componentes visuais e cursores

  assets/
    brand/           Logo e imagens da marca usadas pela aplicacao

  components/
    feedback/        Toasts e mensagens de retorno ao usuario
    icons/           Icones reutilizaveis
    layout/          Header, slogan, decoracoes e elementos de layout
    privacy/         Banner de cookies e modal de privacidade/LGPD

  constants/
    app.ts           Constantes, formulario vazio, tabelas, bucket e dados iniciais

  features/
    admin/           Painel administrativo e formulario de produtos
    products/        Componentes de produto, upload e carrossel de imagens
    store/           Pagina publica da loja

  services/
    supabaseClient.ts      Cliente Supabase
    productImageUpload.ts  Upload de imagens para o Storage

  styles/
    labelStyle.ts    Estilo compartilhado de labels

  types/
    product.ts       Tipos do dominio de produtos, formularios e UI

  utils/
    formatters.ts        Formatadores puros
    productMappers.ts    Conversao entre linhas do Supabase e modelo da aplicacao
    consoleNoise.ts      Tratamento de ruidos conhecidos no console
```

`src/App.tsx` foi mantido apenas como re-export para compatibilidade. A implementacao principal fica em `src/app/App.tsx`.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Uso recomendado:

- `npm run dev`: executa o projeto localmente com Vite.
- `npm run lint`: valida padroes de codigo.
- `npm run build`: executa TypeScript e gera a versao de producao.
- `npm run preview`: serve o build gerado em `dist/`.

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
VITE_ADMIN_EMAIL=seu-email-admin@exemplo.com
```

Observacoes:

- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` sao obrigatorias para conectar ao Supabase.
- `VITE_ADMIN_EMAIL` e opcional. Quando informada, o painel pede apenas a senha; quando ausente, o campo de e-mail tambem aparece.
- Nunca coloque service role key no frontend.

## Supabase

### Tabela de Produtos

O projeto espera uma tabela publica de produtos. Os campos usados pela aplicacao sao:

```text
id
name
description
price
stock
is_preorder
preorder_days
contact
images
image
image_fit
image_position
category
emoji
display_order
created_at
```

`images` armazena a lista de URLs das fotos. A primeira imagem e usada como capa.

### Ordenacao de Produtos

Para habilitar a ordenacao manual dos produtos, execute:

```sql
database/add-product-display-order.sql
```

Esse script:

- adiciona a coluna `display_order`;
- cria indice para ordenacao;
- preenche produtos antigos com uma ordem inicial baseada em `created_at desc`.

O painel administrativo permite reordenar produtos de duas formas:

- arrastando e soltando na lista;
- usando os botoes `Subir` e `Descer`.

A persistencia da ordem deve ser feita por uma rotina protegida no banco, definida no arquivo SQL de seguranca do projeto.

### Seguranca Administrativa

Execute:

```sql
database/admin-security-policies.sql
```

Esse script configura:

- tabela de usuarios administrativos autorizados;
- funcao interna para validar permissao administrativa;
- politicas RLS para leitura publica de produtos;
- politicas RLS para insert, update e delete somente por admins autenticados;
- rotina protegida para reordenacao;
- politicas de Storage para o bucket de imagens dos produtos.

Depois de criar o usuario em `Authentication > Users`, copie o UUID dele e cadastre esse identificador na tabela de autorizacao administrativa indicada no arquivo SQL do projeto.

### Storage de Imagens

O bucket esperado e:

```text
produtos
```

As novas imagens cadastradas no admin sao enviadas para uma pasta reservada dentro do bucket de produtos.

O frontend valida:

- se o arquivo e imagem;
- se cada imagem tem ate 12MB;
- se o upload retornou URL publica.

A compactacao das novas imagens ficou sob responsabilidade do backend. O frontend apenas envia a imagem original para o Supabase Storage.

## Fluxos Principais

### Loja Publica

Funcionalidades disponiveis para clientes:

- listagem de produtos;
- busca por nome e descricao;
- filtro por categoria;
- visualizacao de detalhes em modal;
- carrossel de imagens;
- status de estoque ou encomenda;
- chamada para WhatsApp com mensagem pronta;
- banner de consentimento LGPD e politica de privacidade.

No mobile, o cliente pode:

- arrastar as imagens do card para ver fotos do produto sem abrir o modal;
- tocar no card para abrir os detalhes;
- no modal, arrastar fora das imagens para navegar para o produto anterior ou proximo;
- rolar a pagina normalmente quando o gesto vertical comecar sobre a imagem.

### Painel Administrativo

O painel fica oculto da navegacao publica.

O painel administrativo e acessado por rota ou parametro reservado e exige autenticacao via Supabase Auth.

Apos login valido:

- o botao `Admin` aparece no menu;
- o botao `Sair` aparece no menu;
- a sessao permanece ativa conforme o Supabase Auth;
- ao sair, o botao `Admin` some novamente.

Funcionalidades do admin:

- cadastrar produto;
- editar produto;
- excluir produto;
- cadastrar multiplas imagens;
- reorganizar imagens do produto;
- definir enquadramento da imagem;
- definir posicao da imagem;
- marcar produto como sob encomenda;
- informar prazo de envio para encomendas;
- ordenar produtos manualmente;
- trocar senha da conta administrativa.

## Atualizacoes Implementadas

### Organizacao de Projeto React com TSX

- Separacao por dominio em `features`.
- Componentes compartilhados em `components`.
- Tipos centralizados em `types`.
- Servicos externos isolados em `services`.
- Funcoes puras em `utils`.
- Constantes centralizadas em `constants`.
- Compatibilidade mantida com re-export de `src/App.tsx`.

### Admin Oculto e Seguro

- O acesso administrativo deixou de aparecer para clientes.
- Entrada administrativa por rota ou parametro reservado.
- Login migrado para Supabase Auth.
- Autorizacao baseada em uma lista de usuarios administrativos permitidos no banco.
- Logout remove a visibilidade do painel.
- Funcoes de escrita exigem sessao admin.

### Reordenacao de Produtos

- Inclusao de `display_order`.
- Fallback para projetos que ainda nao executaram a migracao.
- Reordenacao por drag and drop.
- Reordenacao por botoes.
- Salvamento otimista com rollback em caso de erro.

### Imagens

- Suporte a multiplas imagens por produto.
- Primeira imagem usada como capa.
- Reordenacao de imagens dentro do produto.
- Upload para Supabase Storage.
- Remocao da compactacao no frontend, pois a compactacao passou para o backend.
- Imagens antigas ja foram tratadas fora do fluxo atual do frontend.

### Identidade Visual

- Slogan atualizado para: `Aqui a gente e NeurodiverArte`.
- Palavras `gente` e `Arte` usam a mesma cor da paleta.
- Remocao do texto antigo `Amigurumis artesanais`.
- Remocao do complemento `feito com amor e dedicacao` onde nao era mais necessario.
- Logo convertida e configurada como favicon em varios tamanhos.

### Cursores

- Cursor normal configurado com o arquivo `normal.cur`.
- Cursor de clique configurado com o arquivo `love-hand.cur`.
- Rastro visual removido.
- Cursores aplicados globalmente com fallback nativo.

### Experiencia Mobile

- Carrossel de imagem nos cards em dispositivos moveis.
- Navegacao entre produtos por gesto horizontal no modal.
- Gestos verticais preservam o scroll natural da tela.
- Setas do carrossel ficam ocultas em dispositivos touch.

### Privacidade e Feedback

- Banner de cookies/LGPD com aceite ou recusa persistidos em `localStorage`.
- Modal de politica de privacidade.
- Toasts para sucesso, erro e informacao.

## Padroes de Engenharia Aplicados

- Separacao de responsabilidades por camada.
- Tipagem explicita para dominio, formularios e estados de UI.
- Funcoes auxiliares puras para mapeamento e formatacao.
- Integracao com Supabase isolada em servicos.
- Regras de seguranca aplicadas no banco por RLS, nao apenas no frontend.
- Estados de carregamento e salvamento para evitar acoes duplicadas.
- Rollback local quando a persistencia da ordenacao falha.
- Validacoes antes de salvar dados sensiveis.
- Build e lint como criterios minimos de verificacao.

## Criterios de Qualidade

Antes de entregar alteracoes, rode:

```bash
npm run lint
npm run build
```

O projeto deve atender:

- TypeScript sem erros de compilacao.
- ESLint sem erros.
- Fluxo publico sem expor admin.
- Admin funcional apenas para usuario autorizado no Supabase.
- Upload de imagem validado.
- RLS protegendo escrita em produtos e imagens.
- Responsividade preservada em desktop e mobile.

## Deploy

Fluxo recomendado:

1. Configure as variaveis de ambiente no provedor de hospedagem.
2. Execute as migracoes SQL no Supabase.
3. Crie o usuario admin em Supabase Auth.
4. Insira o UUID do admin na tabela de autorizacao administrativa.
5. Garanta que o bucket `produtos` exista.
6. Rode `npm run build`.
7. Publique a pasta `dist/`.

## Manutencao

Ao adicionar novas funcionalidades:

- prefira criar componentes dentro da feature responsavel;
- mantenha integracoes externas em `services`;
- atualize os tipos em `src/types/product.ts` quando o modelo mudar;
- crie ou atualize SQL em `database/` quando houver alteracao de schema;
- valide sempre com `npm run lint` e `npm run build`;
- nao coloque segredos privados no frontend.

## Pontos de Atencao

- A compactacao de imagens novas deve ser mantida no backend.
- O frontend usa apenas a chave anon publica do Supabase.
- As politicas RLS precisam estar aplicadas antes de liberar o admin em producao.
- Alteracoes na estrutura da tabela `products` devem ser refletidas nos mapeadores em `src/utils/productMappers.ts`.

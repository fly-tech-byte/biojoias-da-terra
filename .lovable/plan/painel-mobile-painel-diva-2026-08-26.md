# Painel mobile "/painel-diva"

Novo painel pensado para uso no celular, separado do painel atual em `/admin` (que continua funcionando como está).

## 1. Acesso e login

- Rota `/painel-diva` protegida: sem sessão, mostra a tela de login (e-mail + senha).
- O login usa a autenticação do site. Ela exige um e-mail válido, então o usuário "adm" será criado como **adm@divoubiojoias.com** (você digita só isso no campo de e-mail).
- A senha "12345" é curta demais para o padrão mínimo de segurança do login. Sugestão: **divou12345**. Se preferir manter algo mais curto, me diga e eu reduzo o mínimo exigido — mas não recomendo.
- Só quem tem papel de administradora entra no painel; a conta nova recebe esse papel na criação.

## 2. Estrutura do painel

Layout mobile-first com menu inferior fixo de 3 abas:

```text
┌───────────────────────────┐
│  divou · painel           │
│                           │
│   conteúdo da aba         │
│                           │
├───────────────────────────┤
│  Produtos  Pedidos  Perfil│
└───────────────────────────┘
```

### Aba Produtos
- Lista em cards: foto, nome e preço.
- Botão flutuante "+" para novo produto.
- Formulário simples: foto (câmera ou galeria do celular), nome, categoria, preço de venda, custo de material, estoque.
- Toque no card abre edição; excluir com confirmação.
- Indicador visual de estoque baixo e de produto inativo.

### Aba Pedidos
- Lista com nome do cliente, produto e status.
- Status: Novo, Em produção, Enviado, Entregue.
- Botão para avançar o status em um toque, com histórico de data de atualização.
- Botão "+" para registrar um pedido recebido pelo WhatsApp.

### Aba Perfil
- Nome e e-mail da conta.
- Resumo rápido: total de produtos, produtos sem estoque, pedidos em aberto.
- Atalho para a loja pública e botão Sair.

## 3. Banco de dados

Precisa de duas mudanças, que envio para sua aprovação:

- Novo campo **custo de material** nos produtos, com cálculo de margem exibido no painel.
- Nova tabela de **pedidos**: nome do cliente, contato, produto, quantidade, valor, status e datas. Visível apenas para a administradora.

## 4. Design

- Paleta atual da marca: bege, marrom claro, off-white e argila (já definida no site).
- Títulos na tipografia orgânica usada nas páginas públicas; textos em fonte limpa.
- Ícones minimalistas arredondados, botões grandes (altura confortável para o toque), cantos suaves e bastante espaçamento.
- Sem cores fora dos tokens da marca, garantindo consistência com a loja.

## 5. Detalhes técnicos

- Rotas em `src/routes/_authenticated/painel-diva*` reaproveitando o gate de autenticação existente, com tela de login própria quando não houver sessão.
- Reuso de `src/lib/db.ts` (produtos, categorias, upload de imagem no bucket privado) e criação de `src/lib/orders.ts` para pedidos.
- Componentes novos em `src/components/painel/` (BottomNav, ProductCard mobile, OrderCard, sheet de formulário).
- Upload de foto com `<input type="file" accept="image/*" capture="environment">` para abrir a câmera no celular.
- Novo campo `material_cost` em `products` e tabela `orders` com RLS restrita à administradora e grants adequados.
- Atualização em tempo real via realtime, como já ocorre na loja.

## Antes de começar, confirme

1. Posso criar a conta **adm@divoubiojoias.com** com a senha **divou12345**?
2. O painel atual em `/admin` deve continuar existindo ou prefere que `/painel-diva` seja o único?

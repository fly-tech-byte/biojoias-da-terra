# Adicionar novos produtos sem repetir imagens

## Situação atual (verificada no banco)

- 32 produtos cadastrados
- 32 imagens de produto (1 por produto), todas com endereço diferente
- Você tem 51 imagens na pasta do Drive

Ou seja: se todas as 51 forem realmente diferentes, faltam cerca de 19 imagens novas.

## Sobre o Google Drive

Não consigo abrir pastas do Google Drive (nem por link nem por permissão de acesso). O caminho seguro é você enviar as imagens aqui no chat — o envio aceita até 10 arquivos por mensagem, então serão 5 ou 6 mensagens.

Se preferir, você pode baixar a pasta do Drive como .zip e enviar o arquivo: eu extraio tudo de uma vez.

## Como eu evito imagens repetidas

Comparação automática, sem depender do nome do arquivo:

1. Baixo as 32 imagens já publicadas no site.
2. Para cada imagem enviada, calculo uma "impressão digital visual" (hash perceptual) e comparo com as do site e com as outras enviadas.
3. Classifico cada arquivo em: nova, duplicada de um produto existente (com o nome do produto), ou duplicada dentro do próprio envio.
4. Te mostro a lista antes de cadastrar qualquer coisa. Nada entra no site sem sua confirmação.

Esse método reconhece a mesma foto mesmo com nome diferente, tamanho diferente ou recorte leve.

## Cadastro dos produtos novos

Para cada imagem aprovada como nova, crio o produto com:

- Imagem enviada para o armazenamento do site e vinculada como imagem principal
- Nome, categoria, preço, estoque, descrição, origem, processo e significado
- Produto criado como inativo se faltar preço/nome, para você completar no painel

Para isso preciso de duas informações suas:

- **Dados dos produtos**: você me manda nome, categoria e preço de cada peça (pode ser uma lista simples, na ordem das fotos), ou prefere que eu cadastre com nome provisório e preço zerado para você editar no painel?
- **Categorias**: as existentes são Pulseira, Colar, Brincos e Conjuntos. Se houver peças fora disso, me diga qual categoria criar.

## Detalhes técnicos

- Comparação por hash perceptual (dHash/pHash) das imagens, com limiar conservador; qualquer caso duvidoso vai para sua conferência em vez de ser descartado automaticamente.
- Upload no bucket privado `product-images`, com URL assinada de longa duração, igual ao fluxo já usado pelo painel.
- Inserção em `products` + `product_images` (`is_main = true`, `display_order = 0`), slug gerado a partir do nome.
- A loja e a home atualizam em tempo real, sem necessidade de republicar.

## Ordem de execução

1. Você envia as imagens (chat ou .zip).
2. Eu rodo a comparação e apresento o relatório de novas x repetidas.
3. Você confirma e me passa os dados das peças.
4. Eu cadastro os produtos novos e confirmo o resultado no site.

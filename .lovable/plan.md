# Plano — adicionar novos produtos sem repetir imagens

## Objetivo
Importar as fotos de uma pasta pública do Google Drive, comparar com as imagens já cadastradas na loja e criar produtos somente para as fotos realmente inéditas.

## Etapas
1. **Receber os materiais**
   - Usar o link público da pasta do Google Drive.
   - Receber a planilha ou lista relacionando o nome do arquivo ao nome, categoria, preço e estoque de cada produto.
   - Validar se todas as imagens mencionadas na lista estão disponíveis.

2. **Identificar duplicatas**
   - Reunir as 32 imagens únicas atualmente cadastradas e as novas fotos do Drive.
   - Comparar arquivos idênticos por assinatura digital.
   - Comparar também semelhança visual para detectar a mesma peça com arquivo renomeado, recortado, redimensionado ou levemente editado.
   - Separar o resultado em: inéditas, duplicadas e casos duvidosos.

3. **Revisão antes do cadastro**
   - Apresentar um resumo com as fotos inéditas e as duplicadas encontradas.
   - Não cadastrar casos duvidosos até sua confirmação.
   - Sinalizar dados ausentes ou linhas da lista que não correspondam a nenhuma foto.

4. **Cadastrar os produtos novos**
   - Enviar somente as imagens aprovadas para o armazenamento da loja.
   - Criar cada produto com os dados fornecidos, associar sua categoria e definir a foto como principal.
   - Não alterar nem excluir produtos existentes.

5. **Validação final**
   - Conferir os novos itens na Loja e no painel Gestão.
   - Validar foto, nome, preço, categoria, estoque e ausência de duplicação.
   - Entregar um resumo com quantos produtos foram criados e quais arquivos foram ignorados por repetição.

## Critérios de segurança
- Nenhum produto será criado sem uma correspondência clara entre foto e dados.
- As imagens existentes permanecem intactas.
- Fotos visualmente ambíguas exigem aprovação antes da importação.

## Materiais necessários após a aprovação
- Link público da pasta do Google Drive, configurado como “qualquer pessoa com o link pode visualizar”.
- Planilha ou lista com uma coluna contendo exatamente o nome de cada arquivo de imagem.

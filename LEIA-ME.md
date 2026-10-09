# MemoryBox — controlo simples: saber se dá lucro

App para registar os serviços da MemoryBox, as compras e acompanhar a recuperação do investimento inicial.
Mesma lógica da folha `MemoryBox_FINAL_CORRIGIDO_LOGICA.xlsx`.

## Como funciona
- **Custo/foto** = preço do rolo ÷ fotos por rolo.
- **Lucro do serviço** = Recebido − (nº de fotos × custo/foto).
- **Quero abater** = quanto desse serviço vai para recuperar o investimento inicial.
  O **abate real** é limitado ao que ainda falta recuperar (os serviços são contados por ordem de data).
- **Fica para dividir** = Recebido − Abate real, dividido 50% / 50%.
- **Deslocações**: em cada serviço escreves a localidade e a app calcula os km desde Casal Comba (OpenStreetMap/OSRM, gratuito) e o custo do combustível (km × 2 × nº de deslocações × média do carro × preço do combustível). Esse custo entra no lucro do serviço.
- **Simulador de orçamento** (separador Serviços): localidade, carro, nº de fotos e margem desejada → custo total e preço sugerido.
- **Compras**: novos rolos e outras despesas, com quanto pagou cada uma (botão *A meias*).

## 1. Ativar o GitHub Pages
Repositório → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / pasta `/ (root)` → Save.
Ao fim de 1–2 minutos fica em `https://joana1589-hub.github.io/memorybox/`.

## 2. Instalar no telemóvel
- **Android (Chrome):** abre o link → menu ⋮ → *Instalar aplicação*.
- **iPhone (Safari):** abre o link → Partilhar → **Adicionar ao ecrã principal**.

## 3. Dados partilhados entre a Joana e a Eliana (Firebase)
Sem este passo a app funciona, mas os dados ficam **só no telemóvel** onde são introduzidos
(usa *Configuração → Exportar cópia* para fazer cópias de segurança).

Para partilhar os dados:
1. [console.firebase.google.com](https://console.firebase.google.com) → **Adicionar projeto** → nome `memorybox`.
2. **Authentication → Começar → Google → Ativar**.
3. **Authentication → Settings → Authorized domains → Add domain** → `joana1589-hub.github.io`
4. **Firestore Database → Criar base de dados** (região europe-west) → separador **Regras** → cola o conteúdo de `firestore.rules` → **Publicar**.
5. **Definições do projeto (⚙) → As suas apps → Web (</>)** → regista a app → copia o objeto `firebaseConfig`.
6. No `index.html`, troca `const FIREBASE_CONFIG = null;` pelo objeto copiado:
   `const FIREBASE_CONFIG = { apiKey:"...", authDomain:"...", projectId:"...", ... };`

Emails autorizados (em `index.html` → `EMAILS` e em `firestore.rules`):
`joana1589@gmail.com` (Joana), `elineas_@hotmail.com` e `elianasantosphotography@gmail.com` (Eliana).
O login é feito com conta Google — o email da Eliana tem de estar associado a uma conta Google.

Na primeira vez que alguém entrar, a app cria os rolos, o investimento e o serviço da folha (Junta Casal Comba).

## Atualizações
Sempre que alterares a app, muda `const VERSAO = 'memorybox-v1';` no `sw.js` (v2, v3…)
para os telemóveis apanharem a versão nova.

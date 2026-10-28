# Trevi Mármores & Granitos — site

Site institucional estático (HTML, CSS e JavaScript puro), sem etapa de build.

## Estrutura

- `index.html` — página principal (sobre, serviços, kit lavabo, materiais, projetos, orçamento)
- `kit-lavabo.html` — página do Kit Lavabo (abre em `/kit-lavabo`)
- `assets/css/style.css` — estilos e cores da marca
- `assets/js/main.js` — menu, galeria, formulário e links do WhatsApp
- `assets/img/` — logo, fotos de obras, fotos do kit e texturas dos materiais

## WhatsApp

O número fica em `assets/js/main.js`, na constante `WHATSAPP`.
Qualquer link com o atributo `data-wa="mensagem"` abre o WhatsApp com essa mensagem pronta.

## Rodar localmente

```bash
npx serve .
```

## Publicar na Vercel

Importe o repositório na Vercel com o preset **Other** (sem comando de build, diretório de saída `.`).
O `vercel.json` já ativa URLs limpas (`/kit-lavabo`).

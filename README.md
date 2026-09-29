# Landing de Damián Peinado · Créditos hipotecarios en Miami

Página de una sola pantalla para convertir seguidores de Instagram en contactos calificados:
**calculadora de crédito → precalificación → WhatsApp**.

Hecha con HTML + Tailwind + JavaScript simple. No necesita servidor ni base de datos:
se sube tal cual a Vercel.

---

## Archivos

```
index.html              → la página (estructura y textos fijos)
config.js               → TODOS los datos editables (teléfono, tasas, textos, testimonios, FAQ…)
assets/css/styles.css   → estilos ya compilados (no se toca a mano)
assets/js/main.js       → lógica: calculadora, formulario, animaciones
assets/img/             → fotos, favicon e imagen para compartir por WhatsApp
src/                    → solo para desarrolladores (fuente de Tailwind)
```

---

## 1. Cómo verla en tu computadora

**Opción A (la más fácil):** hacé doble clic en `index.html`. Se abre en tu navegador y funciona todo.

**Opción B (recomendada si vas a editar seguido):**
1. Instalá [Visual Studio Code](https://code.visualstudio.com/).
2. Instalá la extensión **Live Server**.
3. Abrí la carpeta del proyecto, clic derecho en `index.html` → **Open with Live Server**.
   Cada vez que guardes un cambio, la página se recarga sola.

**Para verla en el celular:** subila a Vercel (paso 3) y abrí el link desde el teléfono.

---

## 2. Cómo cambiar los datos (config.js)

Todo lo que cambia seguido está en **`config.js`**, con comentarios en español.

Reglas para no romper nada:
- Cambiá solo lo que está entre comillas `"..."` o los números.
- No borres las comas del final de cada línea.
- Los números van **con punto** para decimales: `7.25` (no `7,25`).
- Si después de editar aparece un **aviso rojo** arriba de la página, hay un error de escritura
  en `config.js` (casi siempre una coma o una comilla). La página sigue funcionando con datos de respaldo.

**Editar sin instalar nada (desde GitHub):**
1. Entrá al repositorio en GitHub y abrí `config.js`.
2. Tocá el ícono del lápiz (✏️ *Edit this file*).
3. Hacé el cambio y tocá **Commit changes**.
4. Si la página ya está en Vercel, se actualiza sola en menos de un minuto.

### Antes de publicar, buscá estas marcas en config.js

| Marca | Qué significa |
|---|---|
| `[COMPLETAR]` | Falta el dato real: WhatsApp, Calendly, fotos, links de reels, empresa. |
| `[EJEMPLO]` | Contenido inventado de muestra: tasas, testimonios, hora de la llamada. **Reemplazar.** |
| `[VALIDAR CON DAMIÁN]` | Textos y números generales (FAQ, % de inicial, gastos, impuestos) que Damián tiene que revisar. |

### WhatsApp: número o link

- **Con `whatsappNumero` completo (recomendado):** el formulario abre WhatsApp con las respuestas
  ya escritas; la persona solo toca *enviar*.
- **Sin número:** se usa `whatsappLink` (el link `wa.me/message/...` de su Instagram). Ese tipo de link
  no permite dejar texto escrito, así que el formulario copia las respuestas y le pide a la persona
  que las pegue en el chat.

Ojo: mientras esté cargado el link real, las pruebas del formulario le llegan a Damián.
Para probar sin molestarlo, poné tu propio número en `whatsappNumero`.

Los testimonios muestran la etiqueta **"Testimonio de ejemplo"** mientras tengan `ejemplo: true`.
Cuando cargues uno real, cambiá a `ejemplo: false`.

### Fotos

1. Prepará la foto vertical (4:5), unos 800 × 1000 px, en `.webp` o `.jpg`, menos de 150 KB
   (podés comprimirla gratis en [squoosh.app](https://squoosh.app)).
2. Subila a `assets/img/` (por ejemplo `assets/img/damian.webp`).
3. En `config.js`, en la parte `fotos`, cambiá la ruta: `hero: "assets/img/damian.webp"`.

---

## 3. Cómo subirla a Vercel (gratis)

1. Entrá a [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**.
2. Tocá **Add New… → Project**.
3. Buscá el repositorio `broker1` y tocá **Import**.
4. En **Project Name** escribí `damian-peinado` (así la dirección queda `damian-peinado.vercel.app`).
5. En **Framework Preset** elegí **Other**. No toques nada más.
6. Tocá **Deploy** y esperá unos segundos. ¡Listo! Te da el link para compartir.

Desde ahí, cada cambio que se guarde en la rama `main` de GitHub se publica solo.

### Vista previa al compartir por WhatsApp

WhatsApp necesita la dirección completa de la página para mostrar la imagen al compartir el link.
Si tu dirección final **no** es `https://damian-peinado.vercel.app`, abrí `index.html` y reemplazá
esa dirección en las 3 líneas marcadas arriba de todo (`canonical`, `og:url` y `og:image`).

### Dominio propio (opcional)

En Vercel: **Project → Settings → Domains → Add** y seguí las instrucciones.
Después cambiá también las 3 líneas de `index.html` mencionadas arriba.

---

## Para desarrolladores: recompilar estilos

Solo hace falta si se cambian **clases de Tailwind** en `index.html` o `assets/js/main.js`
(editar `config.js` no lo requiere).

```bash
cd src
npm install
npm run build:css     # o: npm run watch:css
```

El resultado se guarda en `assets/css/styles.css`, que es el archivo que usa la página.

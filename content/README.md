# Miwuko — Centro de contenido

Aquí tienes las dos zonas para mantener la web:

## Productos → `content/products.csv`

Columnas: `id`, `name`, `category`, `price`, `rating`, `tag`, `image`, `description`, `pros`, `affiliateUrl`, `species`.

Para editar productos sin tocar React, usa Google Sheets con esas mismas columnas y publica la hoja en la web como CSV. Después coloca la URL en Vercel como `VITE_SHEET_CSV_URL`.

Google indica que los cambios del documento original se reflejan en la versión publicada, aunque la actualización puede tardar unos minutos. citeturn1search0

## Guías → `content/guides.csv`

Aquí está la plantilla para nuevas guías. La web actual ya tiene tres artículos completos en `src/data.ts`.

Si quieres que las guías también se gestionen desde Google Sheets, podemos conectar una segunda hoja con `VITE_GUIDES_CSV_URL`.

## Estructura recomendada

**Producto:** problema → producto → criterios → enlace afiliado.

**Guía:** introducción → 2/4 secciones útiles → checklist → productos relacionados.

## Opción más avanzada

Para un CMS real con edición desde un panel y sincronización en tiempo real, la evolución sería Supabase: ofrece Postgres, editor de tablas y Realtime para escuchar cambios en los datos. citeturn0search0turn0search5

Para empezar, Google Sheets es más sencillo de mantener.

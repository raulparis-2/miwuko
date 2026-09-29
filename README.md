# Miwuko 🐾
Web de recomendaciones y comparativas de productos para mascotas.

## Incluye
- Landing visual orientada a descubrimiento y clics.
- Animaciones con Framer Motion inspiradas en patrones de MotionSites: reveals, hover, tarjetas flotantes y microinteracciones.
- Catálogo filtrable y buscable.
- Comparador de hasta 3 productos.
- Publicaciones y guías.
- Fuente de productos preparada para Google Sheets mediante CSV publicado.

## Google Sheets sin programar
Crea una hoja con estas columnas:
`id,name,category,price,rating,tag,image,description,pros,affiliateUrl`

En Google Sheets: **Archivo → Compartir → Publicar en la web → CSV**.
Copia la URL CSV en `.env`:
`VITE_SHEET_CSV_URL=TU_URL_CSV`

Los cambios de productos se reflejarán al cargar la web. Para una edición realmente instantánea sin redeploy, se puede pasar después a una API/BD o CMS.

## Enlaces de afiliado
Los ejemplos usan `#`. Sustitúyelos por tus enlaces reales.

## Ejecutar
`npm install`
`npm run dev`

## Vercel
Sube la carpeta a GitHub e impórtala en Vercel. Vercel detecta Vite automáticamente.

Los cambios enviados a `main` deben generar un nuevo deployment cuando el repositorio esté conectado al proyecto de Vercel.

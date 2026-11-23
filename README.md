# Epifania

![Logotipo de Epifania](assets/epifania-logo.svg)

Sitio web estático para presentar **Epifania**, un sistema guiado de estrategia y planificación de contenidos para profesionales independientes y negocios de servicios que venden por Instagram y WhatsApp. La experiencia incluye una landing de postulación al programa piloto y una muestra gratuita con cinco prompts para crear siete días de contenido.

## Características

- Landing responsive con información del producto, público objetivo, planes y formulario de contacto.
- Landing enfocada en una primera cohorte piloto de cinco negocios.
- Postulación y cotización mediante mensajes de WhatsApp preparados desde el formulario.
- Muestra gratuita con cinco prompts, calendario semanal y checklist de publicación.
- Guía disponible en español e inglés, con persistencia de idioma en el navegador.
- Botones para copiar cada prompt y opción para guardar la guía como PDF.
- Diseño adaptado para móviles y estilos específicos de impresión.
- Agente conversacional de contenido con selector de modelos, historial local, adjuntos de texto y exportación.

## Tecnologías

- HTML5
- CSS3
- JavaScript sin frameworks
- [Google Fonts](https://fonts.google.com/) para las familias Inter y Manrope
- [Iconify](https://iconify.design/) para los iconos de la landing
- Web Crypto y Web Storage para identificar y conservar las conversaciones del agente

No requiere Node.js, un gestor de paquetes, base de datos ni proceso de compilación.

## Ejecutar en local

Aunque es posible abrir `index.html` directamente, se recomienda levantar un servidor local para reproducir mejor el comportamiento de un sitio publicado.

Con Node.js, disponible en este workspace:

```bash
npx --yes serve . --listen 8000
```

La primera ejecución puede tardar unos segundos mientras `npx` obtiene el servidor. Luego abre [http://localhost:8000](http://localhost:8000) en el navegador y detén el proceso con `Ctrl+C` cuando termines.

Si tienes Python instalado, también puedes usar:

```bash
python -m http.server 8000
```

Otra alternativa es utilizar una extensión como Live Server en Visual Studio Code.

## Flujo de la muestra gratuita

1. En la landing, selecciona **Crear 7 días gratis** o **Abrir la muestra gratuita**.
2. El navegador habilita el acceso durante la sesión y abre `muestra-gratuita.html`.
3. Desde la guía puedes copiar los prompts, cambiar el idioma o usar **Guardar como PDF**.

La autorización de acceso usa `sessionStorage`. Por eso, abrir la guía directamente sin pasar por el formulario redirige nuevamente a la sección de contacto.

## Cliente del Agente Epifania

Abre `agente.html` para usar una interfaz de chat inspirada en los asistentes de programación modernos. El agente incluye:

- Selector de modelos desde la cabecera o el campo de mensaje.
- Historial, chats nuevos y persistencia local mediante `localStorage`.
- Adjuntos de texto (`.txt`, `.md`, `.csv`, `.json`) de hasta 100 KB.
- Exportación de conversaciones a Markdown.
- Modo demostración sin credenciales.
- Conexión opcional a un endpoint propio para modelos reales.

Las API keys **no se solicitan ni se guardan en el navegador**. Para conectar modelos reales, configura una URL desde **Configurar conexión**. El endpoint debe aceptar `POST application/json` con esta forma:

```json
{
  "model": "epifania-auto",
  "system": "Instrucciones de estrategia, voz y límites del Agente Epifania",
  "messages": [
    { "role": "user", "content": "Crea una estrategia..." }
  ]
}
```

Y devolver:

```json
{
  "message": "Respuesta del modelo"
}
```

El backend es responsable de validar el origen, autenticar usuarios, aplicar límites, custodiar las credenciales y resolver el `model` contra los proveedores habilitados. El repositorio mantiene por ahora el frontend estático; el endpoint debe desplegarse junto al sitio o en un servidor compatible con CORS.

## Estructura del proyecto

```text
.
├── assets/
│   ├── epifania-logo.svg
│   ├── epifania-mark.svg
│   ├── favicon.svg
│   └── archivos de previsualización
├── index.html                 # Landing principal
├── styles.css                 # Estilos de la landing
├── script.js                  # Acceso a la muestra, formulario y animaciones
├── agente.html                # Cliente conversacional de Epifania
├── agente.css                 # Estilos del agente y selector de modelos
├── agente.js                  # Historial, modelos, adjuntos y conexión API
├── muestra-gratuita.html      # Guía de cinco prompts
├── muestra-gratuita.css       # Estilos web e impresión de la guía
└── muestra-gratuita.js        # Acceso, traducciones, copiado e impresión
```

## Personalización

- **Textos y secciones:** edita `index.html` y `muestra-gratuita.html`.
- **Traducciones de la guía:** modifica los textos de `muestra-gratuita.js`.
- **Oferta y precios:** actualiza las secciones `#piloto` y `#contacto` de `index.html`.
- **Identidad visual:** ajusta las variables CSS declaradas en `:root` y reemplaza los archivos de `assets/`.
- **Contacto:** actualiza `WHATSAPP_NUMBER` en `script.js` y los enlaces `wa.me` presentes en `index.html`.
- **Modelos del agente:** modifica `MODELS` y la resolución del proveedor en tu backend.
- **Endpoint:** configura la URL desde la propia interfaz o cambia el valor inicial en `agente.js`.

## Estado actual y consideraciones

Este repositorio implementa únicamente el frontend. El formulario no almacena datos: valida la información y abre WhatsApp con una solicitud preparada que la persona puede revisar antes de enviar. La muestra gratuita se habilita en el navegador mediante `sessionStorage`. El agente funciona localmente en modo demostración; para respuestas de modelos reales necesita un backend seguro.

El pago se coordina después de confirmar que el programa encaja con el negocio. Antes de escalar conviene integrar un CRM o backend, analítica de conversión, agenda y checkout. También se debe reemplazar el control basado en `sessionStorage` si la guía necesita protección efectiva.

## Despliegue

Al ser un proyecto estático, puede publicarse en GitHub Pages, Netlify, Cloudflare Pages, Vercel o cualquier servidor web. Usa la raíz del repositorio como directorio público; no se necesita comando de compilación.

## Licencia

El repositorio no incluye actualmente un archivo de licencia. Añade uno antes de distribuir o reutilizar el proyecto públicamente.

# Summoner's Portfolio

Este es mi portafolio web, inspirado en la Grieta del Invocador de League of Legends. La idea fue crear una forma diferente de presentar algunos de los proyectos que he realizado durante mi carrera, utilizando un mapa 3D en el que cada zona representa una parte de mi trabajo o de mi perfil.

Al seleccionar los diferentes emblemas del mapa, se abre una sección con información sobre cada proyecto o sobre mí. De esta manera, la navegación funciona como si estuvieras explorando las distintas zonas de la Grieta.

## Distribución de las zonas

Cada carril tiene una sección diferente:

- **TOP:** MiniDBeaver: CRUDCODILE, un proyecto de programación avanzada.
- **JUNGLE:** Hyrule-Dex, una aplicación desarrollada con Flutter sobre los monstruos de The Legend of Zelda: Tears of the Kingdom.
- **MID:** Una sección sobre mí, donde comparto mi presentación, mi GitHub y mi correo electrónico.
- **ADC:** Pokédex HTML, una página web relacionada con Pokémon.
- **SUPPORT:** Plants vs. Zombies Guide, una página web con información y contenido sobre el juego.

## Tecnologías utilizadas

Para desarrollar este portafolio utilicé las siguientes herramientas y tecnologías:

- React y Vite para la estructura y ejecución del proyecto.
- Three.js y React Three Fiber para crear el mapa en 3D.
- React Three Drei para complementar la escena 3D.
- React Three Postprocessing para los efectos visuales.
- Framer Motion para las animaciones.
- Zustand para manejar el estado de la aplicación.

## ¿Cómo ejecutar el proyecto?

Para abrir el portafolio en tu computadora, sigue estos pasos:

1. Descarga y extrae el archivo ZIP del proyecto.
2. Abre la carpeta `summoners-rift-portfolio-v6` en Visual Studio Code.
3. Abre una terminal dentro de esa carpeta.
4. Ejecuta el siguiente comando para instalar las dependencias:

   ```bash
   npm install
   ```

5. Cuando termine la instalación, ejecuta:

   ```bash
   npm run dev
   ```

6. Abre en tu navegador la dirección local que aparecerá en la terminal.

## Sobre mí

Mi nombre es **Laura Lucia Jaramillo Yah** y soy estudiante de Ingeniería en Tecnología de Software.

Si quieres conocer más sobre mi trabajo o ponerte en contacto conmigo, aquí puedes encontrar mis datos:

- **GitHub:** [LucyJY-68636](https://github.com/LucyJY-68636)
- **Correo electrónico:** al068636@uacam.mx

## Organización del código

La información de las zonas y sus respectivos proyectos se encuentra en el arreglo `zones`, dentro del archivo `src/App.jsx`. Desde ahí se pueden modificar los nombres, las descripciones y los enlaces de cada sección.

Los comentarios del código están escritos con explicaciones sencillas para que sea más fácil identificar qué hace cada parte y entender cómo está organizado el proyecto.
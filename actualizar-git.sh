#!/bin/bash
#1. Ir a la carpeta del proyecto
cd /home/patxi/StudioProjects/NouMusic

# 2. Añadir cambios
git add .

# 3. Pedir el mensaje del commit por pantalla
echo "¿Qué cambios has hecho en esta versión?"
read mensaje

# 4. Hacer commit y subir
git commit -m "$mensaje"
git push origin main

echo "--------------------------------------------------"
echo "¡Cambios subidos a GitHub correctamente!"
echo "--------------------------------------------------"

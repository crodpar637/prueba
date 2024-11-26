### Crear proyecto
npm init

### Agregar script start en package.json
 "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

### Instalar nodemon y crear un script para desarrollo
npm install --save-dev nodemon

 "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

### Copiar modelo de index.js

### Instalar librerias
npm install express cors 

[Paquete sequalize-auto](https://www.npmjs.com/package/sequelize-auto)
https://github.com/sequelize/sequelize-auto

Sequelize proporciona una característica llamada "ingeniería inversa" (reverse engineering) que te permite generar automáticamente modelos Sequelize basados en la estructura de tu base de datos existente. Esto es útil cuando ya tienes una base de datos establecida y quieres evitar tener que escribir manualmente los modelos Sequelize para cada tabla.

Para utilizar la ingeniería inversa en Sequelize, puedes usar la herramienta de línea de comandos Sequelize CLI o el método sequelize-auto, que es un generador de código automático.
### Sequelize-auto

Instala sequelize-auto
npm install sequelize-auto

Utilizando la Programatic API se puede realizar el proceso de contruir los modelos a partir de una base de datos.

Ver ejemplo en ./config/serialize-auto.js

Para ejecutar: C:\[..]\backend> node .\config\sequelize-auto.js




### Sequelize-cli
Aquí hay un ejemplo de cómo usar Sequelize CLI para generar modelos basados en una base de datos MySQL existente:

    Instala Sequelize CLI globalmente si aún no lo has hecho:

npm install -g sequelize-cli

En Windows, proporciona la ruta a sequelize-auto: node_modules\.bin\sequelize-auto [args]

    Luego, puedes utilizar el comando sequelize-auto proporcionado por Sequelize CLI para generar modelos Sequelize:

bash

sequelize-auto -o "./models" -d mi_base_de_datos -h localhost -u usuario -p 3306 -x contraseña -e mysql

En este comando:

    -o "./models" especifica el directorio de salida donde se generarán los archivos de modelo.
    -d mi_base_de_datos especifica el nombre de la base de datos que quieres ingeniería inversa.
    -h localhost especifica la dirección del servidor de la base de datos.
    -u usuario especifica el nombre de usuario de la base de datos.
    -x contraseña especifica la contraseña de la base de datos.
    -e mysql especifica el dialecto de la base de datos (en este caso, MySQL).

Este comando generará archivos de modelo en el directorio especificado (./models) basados en la estructura de la base de datos mi_base_de_datos. Estos archivos contendrán definiciones de modelos Sequelize para todas las tablas en la base de datos.

Después de generar los modelos, puedes importarlos en tu aplicación Node.js y utilizarlos para interactuar con la base de datos de la misma manera que lo harías con cualquier otro modelo Sequelize.

Esta es una manera conveniente de comenzar si tienes una base de datos preexistente y deseas utilizar Sequelize en tu aplicación. Sin embargo, es posible que necesites ajustar los modelos generados según tus necesidades específicas una vez que se hayan generado.


Creación de proyecto en Angular

npm install -g @angular/cli

// En powershell como administrador para poder ejecutar ng
Set-ExecutionPolicy Unrestricted

ng new ticketmania

// Instalar e importar axios 
npm install axios

import axios from 'axios';


Add Angular Material to your application by running the following command:

ng add @angular/material

----------------------------------
// Libreria de encriptación en el backed

npm install bcrypt

-------------------------------------

// Libreria de gestión de ficheros en el backend

npm install multer

// Generar fichero de configuracion de karma en el frontend

...\frontend> ng generate config karma 

-----------------------------------------
Instalar Kendo UI Charts

ng add @progress/kendo-angular-charts


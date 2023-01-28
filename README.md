<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Proyecto nest

# Inicializar el proyecto Teslo Shop

1. Clonar repo

2. Ejecutar
```
  yarn install
```

3. Instalar nest cli
```
  npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
  docker compose up -d
```

5. Clonar el archivo el __.env.template__ y renombrarlo a .env

6. Llenar las variables de entorno definidas en .env

7. Ejecutar la app. 
```
  yarn start:dev
```

8. Reconstruir los datos con el seed.
```
  localhost:3000/api/v2/teslo
```


## Stak Usado
* Mongo db
* Nest
* Table Plus



# Libreririas
1. Instalar las siguientes dependencias.
```
  #Crear un server statico para el api.
  yarn add @nestjs/serve-static

  # Validadores
  yarn add class-validator class-transformer


  #Validadores de parametros.
  yarn add @nestjs/config
  yarn add joi


  # orm
  yarn add @nestjs/typeorm typeorm pg
```
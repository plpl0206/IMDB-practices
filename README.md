#   IMDB

Implement IMDB api services.

##  Features

- User (user who provide movie and comment)
    1. sign up.
    2. sign in.
    3. get user info.
    4. user info update.
    5. remove user.

- Movie
    1. create new movie.
    2. get one movie info.
    3. get movie list.
    4. remove movie.

- Comment 
    1. create a new comment about one movie.
    2. get comment list about one movie.
    3. update comment.
    4. remove comment.

- Audit log
    1. recording the log when someone provide new movie.
    2. recording the log when someone provide new comment.

##  Dependencies
    
- Programming Language
    1. NodeJS version: 12

- libraries
    1. Express
    2. Moment
    3. Socket.io
    4. sequelize
    5. ioredis

- Database
  1. mariadb
  2. redis

## Database Schemas

- user
    userId: 
        primaryKey: true
        defaultValue: uuid
        dataType: string
    username:
        NotNull: true
        defaultValue: ''
        dataType: string
    email:
        NotNull: true
        unique: true
        defaultValue: ''
        dataType: string
    password:
        NotNull: true
        defaultValue: ''
        dataType: string

- movie
    id:
        primaryKey: true
        defaultValue: auto gen number
        dataType: integer
    name:
        NotNull: true
        defaultValue: ''
        dataType: string
    releaseDate:
        NotNull: true
        defaultValue: current timestamp
        dataType: date
    avgRating:
        NotNull: false
        defaultValue: 0.00
        dataType: float
    ratingCount:
        NotNull: false
        defaultValue: 0
        dataType: integer

- comment
    id:
        primaryKey: true
        defaultValue: auto gen number
        dataType: integer
    userId:
        NotNull: true
        value: uuid relation to user
        dataType: string
    movieId:
        NotNull: true
        value: integer relation to movie
        dataType: integer
    rating:
        NotNull: true
        defaultValue: 0
        range: 0 ~ 4
        dataType: integer
    description:
        NotNull: false
        defaultValue: ''
        dataType: text

- auditLog
    id:
        primaryKey: true
        defaultValue: auto gen number
        dataType: integer
    userId:
        NotNull: true
        value: uuid relation to user
        dataType: string
    movieId:
        NotNull: true
        value: integer relation to movie
        dataType: integer
    detail:
        NotNull: false
        defaultValue: ''
        dataType: text
    operationTime:
        NotNull: true
        defaultValue: current timestamp
        dataType: date

## APIs

- sign_up

    - path: /api/sign_up
    - method: POST
    - Content-type: application/json
    - parameters: 
        - body:
            email
            username
            password

- sign_in

    - path: /api/sign_in
    - method: POST
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token

- user

    - path: /api/user
    - method: GET
    - Content-type: application/json
    - parameters: 
        None

    - path: /api/user
    - method: PUT
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token
        - body:
            { username | password } 
    
    - path: /api/user/:userId
    - method: DELETE
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token

- movie

    - path: /api/movie/offset/:offset/limit/:limit
    - method: GET
    - Content-type: application/json
    - parameters: 
        None

    - path: /api/movie
    - method: GET
    - Content-type: application/json
    - parameters: 
        None

    - path: /api/movie
    - method: POST
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token
        - body:
            name
            releaseDate
    
    - path: /api/movie/:movieId
    - method: PUT
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token
        - body:
            { name | releaseDate }
    
    - path: /api/movie/:movie
    - method: DELETE
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token

- comment

    - path: /api/comment/movie/:movieId/offset/:offset/limit/  :limit
    - method: GET
    - Content-type: application/json
    - parameters: 
        None

    - path: /api/comment
    - method: POST
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token
        - body:
            movieId
            rating
            { description }
    
    - path: /api/comment/:commentId
    - method: PUT
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token
        - body:
            { rating | description }
    
    - path: /api/comment/:commentId
    - method: DELETE
    - Content-type: application/json
    - parameters: 
        - head:
            user_id
            user_token

## Docker Build and Run

- build

```
$ docker-compose build
```

- run

```
$ docker-compose up
```

## Development

#### Install dependecies

```
$ npm install
```

#### Run ESlint

- lint check

```
$ npm run lint
```

- lint fix

```
$ npm run lint:fix
```

#### Run develop

```
$ npm run dev
```

will run lint fix and lint check automatically

#### Run 

```
$ npm start
```

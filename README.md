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
    1. create a new comment about one movie.
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
    - userId: 
        1. primaryKey: true
        2. defaultValue: uuid
        3. dataType: string
    - username:
        1. NotNull: true
        2. defaultValue: ''
        3. dataType: string
    - email:
        1. NotNull: true
        2. unique: true
        3. defaultValue: ''
        4. dataType: string
    - password:
        1. NotNull: true
        2. defaultValue: ''
        3. dataType: string

- movie
    - id:
        1. primaryKey: true
        2. defaultValue: auto gen number
        3. dataType: integer
    - name:
        1. NotNull: true
        2. defaultValue: ''
        3. dataType: string
    - releaseDate:
        1. NotNull: true
        2. defaultValue: current timestamp
        3. dataType: date
    - avgRating:
        1. NotNull: false
        2. defaultValue: 0.00
        3. dataType: float
    - ratingCount:
        1. NotNull: false
        2. defaultValue: 0
        3. dataType: integer

- comment
    - id:
        1. primaryKey: true
        2. defaultValue: auto gen number
        3. dataType: integer
    - userId:
        1. NotNull: true
        2. value: uuid relation to user
        3. dataType: string
    - movieId:
        1. NotNull: true
        2. value: integer relation to movie
        3. dataType: integer
    - rating:
        1. NotNull: true
        2. defaultValue: 0
        3. range: 0 ~ 4
        4. dataType: integer
    - description:
        1. NotNull: false
        2. defaultValue: ''
        3. dataType: text

- auditLog
    - id:
        1. primaryKey: true
        2. defaultValue: auto gen number
        3. dataType: integer
    - userId:
        1. NotNull: true
        2. value: uuid relation to user
        3. dataType: string
    - movieId:
        1. NotNull: true
        2. value: integer relation to movie
        3. dataType: integer
    - detail:
        1. NotNull: false
        2. defaultValue: ''
        3. dataType: text
    - operationTime:
        1. NotNull: true
        2. defaultValue: current timestamp
        3. dataType: date

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
        - body:
            email
            password

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

    - path: /api/movie
    - method: GET
    - Content-type: application/json
    - parameters: 
        - query:
            offset
            limit

    - path: /api/movie/:movieId
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

    - path: /api/comment
    - method: GET
    - Content-type: application/json
    - parameters: 
        - query:
            movieId
            offset
            limit

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

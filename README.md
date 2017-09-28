# friends-management

## [Demo](https://friends-management-api.herokuapp.com/documentation)

Deployed onto Heroku with MongoDB hosted on MLab.

## Tech Stack
* **Framework**: HapiJS
* **Database**: MongoDB
* **Unit Test**: Mocha, Chai
* **Documentation**: Swagger
* **Linter**: Eslint

## Setup development environment

Before start, download the repository and duplicate .env.sample to be .env file.

### With Vagrant

**Requirements**
* [Vagrant](https://www.vagrantup.com/)
* [librarian-chef](https://github.com/applicationsonline/librarian-chef)
* Ruby

Run the following commands to setup the environment with Vagrant:
1. ```librarian-chef install --verbose```
2. ```vagrant up```
3. ```vagrant ssh```
4. ```cd /var/www/friends-management```
5. ```npm install```
6. ```npm start```

### Without Vagrant

**Requirements**
* NodeJS
* MongoDB

Run the following commands to setup the environment with Vagrant:
1. ```cd public```
2. ```npm install```
3. ```npm start```

The project will run on [http://localhost:3000](http://localhost:3000). Go to /documentation for Swagger documentation.

### npm scripts
    
    
    
    Name              | Responsibility
    ----------------- | --------------------------------------------
    `start`           | Run the application locally in a development environment
    `test `           | Run the application's test suite (runs unit tests, checks code style)
    `unit `           | Run the application's unit tests
    `lint `           | Run the application's style check
    
## APIs

Assumption: All the email addresses passed in are valid

1. **POST /User**

Create a new user in database. *Email* is required.

2. **POST /friends**

Create a friend connection between two email addresses. It receives the following JSON request:
```bash
{
  "friends":
    [
      "andy@example.com",
      "john@example.com"
    ]
}
```
If user with the given email address does not exist, 400 error will be returned.

if either email address blocks the other one, it will return {success: false} .

If friends connection already exists, it will return {success: true} but no new connection will be added.

3. **GET /friends**

Retrieve the friends list for an email address. *Email* is required.

If user with the given email address does not exist, 400 error will be returned.

4. **POST /friends/common**

Retrieve the common friends list between two email addresses. It receives the following JSON request:
```bash
{
  "friends":
    [
      "andy@example.com",
      "john@example.com"
    ]
}
```
If user with the given email address does not exist, 400 error will be returned.

5. **POST /block**

The API receives the following JSON request:
```bash
{
  "requestor": "andy@example.com",
  "target": "john@example.com"
}
```

If user with the given email address does not exist, 400 error will be returned.

No duplicate records will be added into the database.

6. **POST /subscribe**

The API receives the following JSON request:
```bash
{
  "requestor": "andy@example.com",
  "target": "john@example.com"
}
```

If user with the given email address does not exist, 400 error will be returned.

No duplicate records will be added into the database.

7. **POST /subscribers**

The API receives the following JSON request:
```bash
{
  "sender":  "john@example.com",
  "text": "Hello World! kate@example.com"
}
```
If user with the given sender email address does not exist, 400 error will be returned.

If user mentioned in text does not exist, it will still be added to recipients.

No duplicate recipient will be printed out.


## License

MIT

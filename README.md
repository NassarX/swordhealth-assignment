# Sword Health - Maintenance Task Manager


### Table of Contents
- [Application Overview](application-overview)
- [Main Features](main-features)
- [Notes About Application Services](#notes-about-application-services)    
- [Getting started](#getting-started)  
- [Up And Running](#up-and-running)
- [Remove application](#remove-application)
- [Usage](#usage)
- [Unit tests](#unit-tests)

## Application overview
This is an API to manage maintenance tasks performed during a working day. There are two types of users: Manager and Technician. Technicians can only see, create or update their own performed tasks while Managers can see tasks from all the technicians and delete them. Additionally, Managers receive notifications when a technician performs a task. Tasks have a summary and a date when they were performed, and the summary can contain personal information.

## Main Features

- Node.js with [TypeScript](https://www.typescriptlang.org) support.
- [Express framework](https://expressjs.com) to handle server requests.
- Configured dockerization for [MySQL](https://hub.docker.com/_/mysql/), [Node](https://hub.docker.com/_/node), and [RabbitMQ](https://hub.docker.com/_/rabbitmq) images.
- User registration and authentication with [Passport JWT strategy](http://www.passportjs.org/packages/passport-jwt/).
- Authorization and [Role-Based Access Control RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) for users.
- User module with all required CRUD endpoints.
- Tasks module with all required CRUD endpoints with pagination.
- Input validation and schema definition with [Zod](https://zod.dev).
- Logger to the file system.
- MySQL ORM using [Sequelize](https://sequelize.org/docs/v6/).
- RabbitMQ integration for message queues and publish-subscribe messaging.
- [Anonymization](https://en.wikipedia.org/wiki/Data_anonymization) feature to anonymize personal information in task summaries.

## Notes About Application Services

### Authentication and Authorization

The system uses Passport and JWT strategy for authentication, with authorization implemented through role-based permissions. Custom middleware is used to protect routes based on user permissions.

### Tasks Module

The tasks module includes all necessary endpoints for creating, updating, and deleting tasks, as well as retrieving tasks by technician or manager. Tasks are stored in a MySQL database using Sequelize ORM.

### Notification System

The notification system in this project is implemented using RabbitMQ. Whenever a technician performs a task, the system publishes messages on different channels (e.g. email, SMS) to notify managers. To receive these messages, managers can subscribe to specific queues using a direct exchange. This ensures that messages are routed to the correct queue based on the provided routing key.
### Anonymization

The system includes an anonymization feature to protect sensitive information in task summaries. Personal information such as contact details, numbers, addresses, etc .. are replaced with **.

### Dockerization

The system can be easily deployed using Docker, with pre-configured images available for MySQL, Node, and RabbitMQ.

### RabbitMQ Integration

This project includes RabbitMQ integration for handling message queues and publish-subscribe messaging. The application uses the AMQP library to publish messages.

## Getting Started

This application is shipped with the Docker Compose environment and requires Docker to be installed locally and running.
If you're not familiar with Docker or don't have it locally, please reach out to 
[the official website](https://www.docker.com)
 to learn more and follow the Docker installation instructions to install it on your platform:   

[Docker for Mac](https://docs.docker.com/desktop/install/mac-install/)  
[Docker for Linux](https://docs.docker.com/desktop/get-started/)  
[Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)

The test assignment application is containerized within three containers that have Mysql, Node and RabbitMQ respectively. 
You don't need to build anything locally, the related images will be automatically pulled from the remote registry 
as soon as you run the application for the first time.

Included tools:
- Node 19.6
- express 4.18
- Typescript 4.9
- Nodemon 2.0
- Eslint 8.34
- Jest 19.5
- RabbitMQ
- Composer

A look into app dependencies: 

* `dotenv` - A zero-dependency module for loading environment variables from a .env file.
* `compression` - A middleware for compressing response bodies in Express.
* `cors` - A middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
* `morgan` - A middleware for logging HTTP requests and responses in Express.
* `http-status-codes` - A library for working with HTTP status codes.
* `passport-jwt` - A Passport strategy for authenticating with JWTs.
* `jsonwebtoken` - A library for generating and verifying JSON Web Tokens (JWTs).
* `mysql2` - A library for connecting to MySQL databases.
* `sequelize` - An ORM (Object-Relational Mapping) library for working with databases.
* `typedi` - A dependency injection library for TypeScript.
* `zod` - A library for validating and parsing data based on schemas.
* `amqplib` - to handle AMQP (Advanced Message Queuing Protocol) connections and channels.

## Up and Running

Once you have Docker up and running please perform the following steps:

**1. Working directory**

Change the current working directory to `swordhealth-assignment`.  

**You can save time and run `make up` to see the magic happens or if you prefer the long road perform next steps.**

**2. Setup .env files**

Copy `/.env.dist` to `/.env`.  
Copy `/env/mysql.env.dist` to `/env/mysql.env`.  
Copy `/env/node.env.dist` to `/env/node.env`.  
Copy `/env/rabbitmq.env.dist` to `/env/rabbitmq.env`.

Update required settings there for the application:  

Copy `/app/env/.env.dist` to `/app/env/.env`.   
Copy `/app/env/amqp.env.dist` to `/app/env/amqp.env`.   
Copy `/app/env/.env.dist` to `/app/env/database.env`. 

**3. Run application**

Please execute the following command to build and run application containers:
    	
    docker-compose -f docker-compose.build.yml build
    docker-compose up --detach

If you run the application for the first time, this will pull the images, 
create `app-db-mysql`, `app-api-node` and `app-messaging-rmq` containers in the `sword_health_assignment` Compose project and 
run the `yarn start` command.

The container will be listening on port `3000` on your `localhost`, you can access the application server using the 
following URL: [http://localhost:3000](http://localhost:3000).

## Remove application

As soon as you are done you can stop the application:

    docker-compose down

or again you save time and stop container and remove the images by running `make down`

## Usage


### Notes About API End Points
The API provides endpoints for managing tasks and users. You'll need to register as a manager | technion and log in to access the protected endpoints.

You can use a tool like Postman to test the API endpoints. 
#### Postman Collection: `/addons/postman`

Here's an overview of the available endpoints:

- **POST `/api/v1/auth/register`** Register a new user.  
- **POST `/apiv1//auth/login`** Log in and get a JWT token.   
- **[GET, POST]`/api/v1/tasks`** Get all tasks (managers only) or create a new task (technicians only).   
- **[PUT, DELETE]`/api/v1/tasks/{:taskId}`** Get, update task (technicians only) or delete a task (managers only).
- **[GET]`/api/v1/users/{:userId}/tasks/`**: Get all user tasks (managers only).  

In addition, the notification service sends messages to a manager queue each time a technician performs a task.
you can watch published and consumed messages through terminal.

## Unit tests

In progress !!!

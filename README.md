## API-Flash-Ticket

### 💻 Project Description

- This is an API for controlling, managing and selling diferents types of tickets, it must be possible to create a user (commun and admin), login that user, create a event and do some crud operation on redis databse, such as (create a event, create a event reserve and ect).

- Trougth rabbitmq, must be possible to buy a event ticket that was previously reserved.

### 🚀 Technologies

- Typescritp / Node.js in version v24.20.0 (LTS)
- Nest
- Postgres
- Redis
- RabbitMQ
- PrismaORM
- Docker
- JasonWebToken JWT
- Bcrypt
- Nest/Observable
- Nest/Authguard
- Nest/Swagger

### 🚀 End-Points

- Use an http request provider such as `Insomnia` or `Postman` and even the `ThunderClient` extention on vscode IDE to create all the follow endpoints, to be able to test the app.

###### POST: `api/users`
###### POST: `api/users/createToken`

- Needs to be an `ADMIN` user, use a `Bearer` token.
###### POST: `api/events`
###### GET: `api/events/:event_id`
###### DEL: `api/events/deleteEvent/:event_id`

###### POST: `api/customers/createEventReserve`
###### POST: `api/customers/orderCheckoutEvent`
###### DEL: `api/customers/deleteReserve/:user_id/:event_id`

### 🛠️ About .env.example file

- Make sure that all the enviroment variables is filled with the rigth configurations, you can rename this file after do it from `.env.example` to `.env`, or create a new one ........... it is very `IMPORTANT` to the all the stuffs working well.

### 🛠️🚀 How to running this application

- After ckeck the previous step, if you have a docker installed, you just need to run the following comand `yarn docker:up`, after docker is ok, open a second terminal and run `yarn setup:prisma`, for configure `prismaORM` stuffs.

- Note if you are using a different package manager such as (npm, pnpm etc), just replace (yarn) at the previous step.

- You can run `npx prisma studio`, to see and work with migrations

- You can open in some databse interface such as `beekeeper studio`, and access a redis instance by using the credentials on `.env`

- To see the `rabbitmq` stuffs, you can go to your browser and type this url `http://localhost:15672/`, as well as redis you nedd to pass the credentials to log in.

### 📚 About the architecture of the application.

- This app was created as the same as `MVC` architecture, trying to keep the good organization and responsability of the layers, to make easy to give maintenance and to be able to implement new stuffs as well.

### 🚀 How to run the swagger Documentation of this application

- With the application already up, go to your web brownser and type the follow url .... `http://localhost:port/api-doc`

- Hint to see the json schemma of the swagger doc type `http://localhost:port/swagger/json`

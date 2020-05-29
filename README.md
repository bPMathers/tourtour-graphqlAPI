<!---


####################
### Dev + Test Setup
####################

-- ENV VARIABLES --
Placeholder .env files included in config folder. Don't forget to use your own secret keys, put your own endpoints and then add .env files to .gitignore!

npm install

-- DEPLOY TO DEV ENV --
prisma deploy -e ../config/dev.env

-- DEPLOY TO TEST ENV --
prisma deploy -e ../config/test.env

-- GENERATE SCHEMA --
Set default endpoint in .graphqlconfig and then npm run get-schema to generate/fetch schema

-- START PRISMA API CONTAINER
cd graphql-prisma/prisma && docker-compose up -d (http://localhost:4466/default/dev)

-- RUN NODEJS SERVER IN DEV ENV --  
npm run dev (http://localhost:4000)

-- RUN TESTS --
npm run test

After updating Schema
x) npm run get-schema to generate xyz (TODO: be more precise)

x) prisma deploy -e path/to/env (TODO: be more precise : when and why exactly)

###############
### Prod Setup
###############

-- CUSTOMIZE ENDPOINT --
Set PRISMA_ENDPOINT in config/prod.env

-- DEPLOY TO PROD ENV --
prisma deploy -e ../config/prod.env

###########################################################
### Notes on using Prisma Cloud/Heroku
###########################################################
Suggestion: Use Heroku & Prisma Cloud to setup prod env

- add server (which will run our Docker container) & postgress database on prisma cloud. They will be hosted on Heroku (need to link heroku account during the process)
- connect to server to view DB (suggestion: using PGAdmin). Get credentials on Heroku

Then, locally (using heroku-cli):
- heroku create
- set env variables on heroku using heroku config:set
- verify env variable set correctly with heroku config
- commit and git push heroku master

--->

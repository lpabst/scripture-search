# docker-experiment

Rather than the docker container running nodemon on the typescript files and watching everything, this experiments with the idea of running nodemon on the /build dir index.js instead, and then mapping that in from your local machine. Then, when you want to do local dev, you run `npm run dev` locally, which spins up some typescript watchers so you get hot reloading in your code. The hope is that this will use less resources for projects that are spun up but aren't actively being developed on (like in a micro-service architecture).

## setup and development

- create a `.env` file in the root of the project. You'll need to populate it using the `.env.example` as a guide
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up
- If you want to dev locally, run `npm run dev` to spin up the typescript filewatchers

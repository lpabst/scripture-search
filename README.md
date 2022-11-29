# scripture-search

I'm going to try putting millions of items in some indexes and see what the benchmark results are

## setup and development

- create a `.env` file in the root of the project. You'll need to populate it using the `.env.example` as a guide
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up
- If you want to dev locally, run `npm run dev` to spin up the typescript filewatchers (this is built from the docker-experiement repo I did)

## scripts

- get the container running following the steps above
- make sure dev mode is running (see above as well) so that changes to the scripts are mapped into the container
- exec into the container with `docker exec -it <containerName> /bin/sh`, for example: `docker exec -it scripture-search.api /bin/sh`
- navigate to the scripts dir with `cd /app/build/scripts`
- use node to run the desired script, for example `node bulkCreateESRecords.js`

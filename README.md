# elasticsearch-tutorial

I'm going to try putting millions of items in some indexes and see what the benchmark results are

## setup and development

- create a `.env` file in the root of the project. You'll need to populate it using the `.env.example` as a guide
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up
- If you want to dev locally, run `npm run dev` to spin up the typescript filewatchers (this is built from the docker-experiement repo I did)

## scripts

- get the container running following the steps above
- make sure dev mode is running (see above as well) so that changes to the scripts are mapped into the container
- exec into the container with `docker exec -it <containerName> /bin/sh`, for example: `docker exec -it elasticsearch.tutorial.api /bin/sh`
- navigate to the scripts dir with `cd /app/build/scripts`
- use node to run the desired script, for example `node bulkCreateESRecords.js`

## Benchmarks

### Bulk Create

- 7.8s to create 6,760 records (in batches of 10) with starting ~14,000 records and ending ~20,000 records
- 10.5s to create 67,600 records (in batches of 100) with starting ~20,000 records and ending ~87,000 records
- 25s to create 676,000 records (in batches of 1000) with starting ~290,000 records and ending ~966,000 records
- 4m4s to create 6,760,000 records (in batches of 1000) with starting ~966,000 records and ending ~ 7,700,000 records
- 24s to create 676,000 records (in batches of 1000) with start 7.8 million records
  - NOTE: index size does not seem to matter for record creation times (at least not up to 8 million or so)
- Up to this point, records were only being created with 2 attributes (id & name). I'm going to try creating some now with 8 extra attr (10 total), and each of those 8 will be random 32 character strings. Let's see if record size matters
  - 1m13s to create 676,000 records in batches of 1000. It only took about 25s when the records were smaller, so that clearly had an impact
- Now let's see what the batchSize does! I'll try batches of 100 and batches of 10,000 to see how it impacts the speed. I'll do all of the tests with 100,000 records
  - batches of 100 = 28s
  - batches of 1,000 = 20s
  - batches of 10,000 = 19s

### Queries

- 20ms with 20,000 records in the index
- 10ms with 87,000 records in the index
- 26ms with 966,000 records in the index
- 10ms with 7.7 millions records in the index (right after inserting, my first query took 147ms, but every one after that has been 10ms or so :shrug:)
  - NOTE: index size does not seem to matter for querying, at least not up to 8 million or so
-

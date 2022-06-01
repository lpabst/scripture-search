# shop-platform

## setup and development

- create a `.env` file in the root of the project. You'll need to populate it using the `.env.example` as a guide
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up

## Elasticsearch

This app uses elasticsearch for searching through products. Here are some helpful commands for the CLI, or you can use `https://elasticvue.com/`, it's free and open-source

1. view index settings `curl -H 'Content-Type: application/json' -X GET http://localhost:9200/products\?pretty`
2. get items in index `curl -H 'Content-Type: application/json' -X GET http://localhost:9200/products/_search\?pretty`
3. search items in index that contain `house`: `curl -H 'Content-Type: application/json' -X GET http://localhost:9200/products/_search\?pretty -d '{"query":{"multi_match":{"query":"house","fields":["name","tags"]}}}'`

## TODO:

- shopping cart
  - front end and backend for guests and signed in users
- checkout with stripe (bank account?)
  - purchase price - fee needs to be allocated in the DB to the shop's balance
  - checkout as guest or as signed in user
- I need an AWS account with S3 to house listings/images (or I could use the filesystem...)
  - cleanup old listing images to save on costs...
  - max number of images (or image size) per listing? This would help stay within cost for the listing fee
- ACH to send money from our company account to the shop's account
- end user agreement? privacy policy?
- host the app on EC2 or something

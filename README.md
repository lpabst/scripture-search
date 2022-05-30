# shop-platform

## setup and development

- create a `.env` file in the root of the project
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up

## TODO:

- login
- create normal account and/or shop
- create shop for existing account
- list products on shop
- search products as user
- shopping cart
- checkout with stripe (bank account?)
  - purchase price - fee needs to be allocated in the DB to the shop's balance
- ACH to send money from our company account to the shop's account
- end user agreement? privacy policy?
- I need an AWS account with S3 to house listings/images (or I could use the filesystem...)
  - cleanup old listing images to save on costs...
- max number of listing per account? or max number of images or image size per account?
- host the app on EC2 or something

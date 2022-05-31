# shop-platform

## setup and development

- create a `.env` file in the root of the project. You'll need to populate it using the `.env.example` as a guide
- dev env vars are listed in the `docker-compose.override.yml` file
- run `docker-compose up -d` to spin things up

## TODO:

- figure out how to search products as user (search by tags maybe? or elasticsearch? maybe we can have a tags table with a 1-many relationship to a product, and the user can add tags when they create the product? elasticsearch on the name and/or description might do just as well though. I'll have to think about this a bit)
- shopping cart
- checkout with stripe (bank account?)
  - purchase price - fee needs to be allocated in the DB to the shop's balance
  - checkout as guest or as signed in user
- ACH to send money from our company account to the shop's account
- end user agreement? privacy policy?
- I need an AWS account with S3 to house listings/images (or I could use the filesystem...)
  - cleanup old listing images to save on costs...
- max number of listing per account? or max number of images or image size per account?
- host the app on EC2 or something

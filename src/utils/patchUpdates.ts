import { UpdateProductDTO } from "../types/repos/UpdateProductDTO";
import { UpdateShopDTO } from "../types/repos/UpdateShopDTO";

export function getShopUpdatesFromRequestBody(requestBody: any): UpdateShopDTO {
  const shopUpdates: UpdateShopDTO = {};

  // only include updates that have a value provided so we don't override existing values with null data
  if (requestBody.name !== undefined) {
    shopUpdates.name = requestBody.name;
  }
  if (requestBody.description !== undefined) {
    shopUpdates.description = requestBody.description;
  }
  if (requestBody.websiteUrl !== undefined) {
    shopUpdates.websiteUrl = requestBody.websiteUrl;
  }
  if (requestBody.ACHRoutingNumber !== undefined) {
    shopUpdates.ACHRoutingNumber = requestBody.ACHRoutingNumber;
  }
  if (requestBody.ACHAccountNumber !== undefined) {
    shopUpdates.ACHAccountNumber = requestBody.ACHAccountNumber;
  }

  return shopUpdates;
}

export function getProductUpdatesFromRequestBody(
  requestBody: any
): UpdateProductDTO {
  const productUpdates: UpdateProductDTO = {};

  // only include updates that have a value provided so we don't override existing values with null data
  if (requestBody.name !== undefined) {
    productUpdates.name = requestBody.name;
  }
  if (requestBody.description !== undefined) {
    productUpdates.description = requestBody.description;
  }
  if (requestBody.price !== undefined) {
    productUpdates.price = requestBody.price;
  }
  if (requestBody.weightOunces !== undefined) {
    productUpdates.weightOunces = requestBody.weightOunces;
  }

  return productUpdates;
}

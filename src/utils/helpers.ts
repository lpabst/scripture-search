import { UpdateShopDTO } from "../types/repos/UpdateShopDTO";

export async function promiseTimeout(msDelay: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msDelay);
  });
}

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

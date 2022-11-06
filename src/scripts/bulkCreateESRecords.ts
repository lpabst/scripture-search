import { Context } from "../context";
import { randomString, randomWord } from "../utils/randomization";

const context = new Context();

async function bulkCreateESRecords() {
  console.log("running");
  const recordsToCreate = 100000;

  console.time("generate prefixes");
  const prefixesArr = generatePrefixesArr();
  console.timeEnd("generate prefixes");

  console.time("bulk create records");
  for (let i = 0; i < prefixesArr.length; i++) {
    if (i % 100 === 0) {
      console.log(`creating records for prefix: ${prefixesArr[i]}`);
    }

    const prefix = prefixesArr[i];
    const numRecordsForPrefix = recordsToCreate / prefixesArr.length;
    await createRecordsWithPrefix(prefix, numRecordsForPrefix);
  }
  console.timeEnd("bulk create records");
  console.log(`Done. Created ${recordsToCreate} records`);
}

// 676 total prefixes, aa, ab, ac, ... , zx, zy, zz
function generatePrefixesArr(): string[] {
  let prefixesArr: string[] = [];
  const letters = "abcdefghijklmnopqrstuvwxyz";
  letters.split("").forEach((letter) => {
    letters.split("").forEach((letter2) => {
      prefixesArr.push(`${letter}${letter2}`);
    });
  });
  return prefixesArr;
}

async function createRecordsWithPrefix(
  prefix: string,
  numToCreate: number
): Promise<void> {
  const batchSize = Math.min(numToCreate, 10000);
  const records = generateRecordsWithPrefix(prefix, batchSize);
  await context.repos.search.bulkIndexProducts(records);

  if (batchSize < numToCreate) {
    return createRecordsWithPrefix(prefix, numToCreate - batchSize);
  }
}

function generateRecordsWithPrefix(prefix: string, numToCreate: number) {
  let records = [];
  while (records.length < numToCreate) {
    records.push({
      id: randomString(16),
      name: prefix + " " + randomWord(16 - prefix.length),
      randomKey: randomString(32),
      randomKey2: randomString(32),
      randomKey3: randomString(32),
      randomKey4: randomString(32),
      randomKey5: randomString(32),
      randomKey6: randomString(32),
      randomKey7: randomString(32),
      randomKey8: randomString(32),
    });
  }
  return records;
}

bulkCreateESRecords();

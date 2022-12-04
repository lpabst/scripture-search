import { Context } from "../context";
import { Client } from "@elastic/elasticsearch";
import axios from "axios";
import { AppDataSource } from "../data/dataSource";
import {
  IndicesPutSettingsRequest,
  IndicesPutMappingRequest,
} from "@elastic/elasticsearch/lib/api/types";

let context: Context;
let elasticSearchClient: Client;

async function indexScriptures() {
  console.log("script running");

  await AppDataSource.initialize().catch((e) => {
    console.log("Error connecting to DB");
    throw e;
  });
  console.log("DB connected");

  context = new Context();
  elasticSearchClient = new Client({
    node: process.env.ELASTICH_SEARCH_CONNECTION_URL,
  });
  // await insertBibleVersesIntoSqlDb();
  await setupNewScriptureIndex();

  console.log("start indexing");
  await indexAllVersesFromSqlDb();
  console.log(`Done`);
  process.exit(0);
}

async function insertBibleVersesIntoSqlDb() {
  const result = await axios.get(
    "https://raw.githubusercontent.com/renyuzhuo/KJV-JSON/master/kjv.json"
  );
  await Promise.all(
    result.data.map(async (scripture: any) => {
      const bookChapterAndVerse = scripture.name.split(" ");
      const chapterAndVerse = bookChapterAndVerse.pop();
      const book = bookChapterAndVerse.join(" ");
      const [chapter, verse] = chapterAndVerse.split(":");
      try {
        return await context.services.scripture.createScripture({
          book,
          chapter: Number(chapter),
          verse: Number(verse),
          text: scripture.verse,
        });
      } catch (e) {
        console.log("Error inserting scripture into sql db");
        console.log(scripture);
        console.log(book, chapter, verse);
        console.log((e as any).message);
      }
    })
  );
}

async function setupNewScriptureIndex() {
  try {
    console.log("delete old index");
    await elasticSearchClient.indices.delete({
      index: "scriptures",
    });
    await elasticSearchClient.indices.refresh({ index: "scriptures" });
  } catch (e) {}

  try {
    console.log("create new index");
    elasticSearchClient.indices.create({
      index: "scriptures",
    });
    await elasticSearchClient.indices.refresh({ index: "scriptures" });
  } catch (e) {}
  return;

  // the stuff below here didn't seem to be helping anything
  const indexSettings: IndicesPutSettingsRequest = {
    index: "scriptures",
    settings: {
      analysis: {
        analyzer: {
          my_analyzer: {
            type: "custom",
            tokenizer: "my_tokenizer",
          },
        },
        tokenizer: {
          my_tokenizer: {
            type: "ngram",
            min_gram: 3,
            max_gram: 20,
            token_chars: ["letter", "digit"],
          },
        },
      },
      max_ngram_diff: 20,
    },
  };
  const indexMappings: IndicesPutMappingRequest = {
    index: "scriptures",
    properties: {
      code: { type: "long" },
      description: {
        type: "text",
        analyzer: "my_analyzer",
      },
      display_name: {
        type: "text",
        analyzer: "my_analyzer",
      },
      brand: {
        type: "text",
        analyzer: "my_analyzer",
      },
    },
  };

  try {
    console.log("update index settings");
    await elasticSearchClient.indices.putSettings(indexSettings);
    await elasticSearchClient.indices.putMapping(indexMappings);
    await elasticSearchClient.indices.refresh({ index: "scriptures" });
  } catch (e) {}
  console.log("settings and mappings are updated");
}

async function indexAllVersesFromSqlDb() {
  console.log("add verses to index");
  let indexing = true;
  const batchSize = 1000;
  let offset = 0;
  while (indexing) {
    console.log(`Query scriptures limit ${batchSize}, offset ${offset}`);
    const batchOfScriptures = await context.services.scripture.scanScriptures(
      batchSize,
      offset
    );
    console.log(`Found ${batchOfScriptures.length} scriptures to index`);
    await context.repos.search.bulkIndexScriptures(batchOfScriptures);
    offset += batchSize;
    if (batchOfScriptures.length < 1000) {
      indexing = false;
    }
  }
}

indexScriptures();

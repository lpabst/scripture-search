import { Context } from "../context";
import axios from "axios";
import { AppDataSource } from "../data/dataSource";

let context: Context;

async function indexScriptures() {
  console.log("script running");

  await AppDataSource.initialize().catch((e) => {
    console.log("Error connecting to DB");
    throw e;
  });
  console.log("DB connected");

  context = new Context();
  // await getBibleVersesIntoSqlDb();

  console.log("start indexing");
  await indexAllVersesFromSqlDb();
  console.log(`Done`);
  process.exit(0);
}

async function getBibleVersesIntoSqlDb() {
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

async function indexAllVersesFromSqlDb() {
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

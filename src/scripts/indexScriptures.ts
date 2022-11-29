import { Context } from "../context";
import axios from "axios";

const context = new Context();

const scriptureBookChapterCount = {
  ot: {
    gen: 50,
    ex: 40,
    lev: 27,
    num: 36,
    deut: 34,
    josh: 24,
    judg: 21,
    ruth: 4,
    "1-sam": 31,
    "2-sam": 24,
    "1-kgs": 22,
    "2-kgs": 25,
    "1-chr": 29,
    "2-chr": 36,
    ezra: 10,
    neh: 13,
    todo: "add more",
  },
};

async function indexScriptures() {
  console.log("running");
  await indexBible();
  console.log(`Done`);
}

async function indexBible() {
  const result = await axios.get(
    "https://raw.githubusercontent.com/renyuzhuo/KJV-JSON/master/kjv.json"
  );
  console.log(Array.isArray(result.data));
}

indexScriptures();

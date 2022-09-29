const fs = require("fs");
const Airtable = require("airtable");
require("dotenv").config();

const apiKey = process.env["AIRTABLE_API_KEY"];
const baseId = process.env["AIRTABLE_BASE_ID"];

const file = fs.readFileSync("tags.json");
const fileData = JSON.parse(file);

let descArr = fileData
  .map(d => Object.keys(d).map((key) => d[key]))
  .reduce((a, b) => a.concat(b), [])
  .map(d => d.map((e) => e.replace(/_/g, " ")));

const allRecords = [];

const base = new Airtable({ apiKey }).base(baseId);
// write the name of the base here
base("Youtube Videos")
  .select({
    view: "Grid view",
  })
  .eachPage(function page(records, fetchNextPage) {
    records.forEach((record) => allRecords.push(record.id));
    fetchNextPage();
  })
  .then(() => {
    for (let i = 0; i < allRecords.length; i++) {
      base("Youtube Videos").update(
        allRecords[i],
        {
          test: descArr[i].join(", "),
        },
        function (err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    }
  });

  // craete dummy array
  const dummy = ["f1","a2",3,4,5,6,7]

  for(let i of dummy){
    console.log(i)
  }
  

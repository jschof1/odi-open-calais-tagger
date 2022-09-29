const Airtable = require("airtable");
require("dotenv").config();

export const apiKey = process.env["AIRTABLE_API_KEY"];
export const baseId = process.env["AIRTABLE_BASE_ID"];

const file = await fs.readFileSync("tags.json");
const fileData = JSON.parse(file);


const allRecords = [];

const base = new Airtable({ apiKey }).base(baseId);
// write the name of the base here
base("Youtube Videos")
  .select({
    view: "Grid view",
  })
  .eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      allRecords.push(record.id);
    });
    fetchNextPage();
  })
  .then(() => {
    for (let i = 0; i < allRecords.length; i++) {
      base("Youtube Videos").update(
        allRecords[i],
        {
          test: fileData[i].join(", "),
        },
        function (err, record) {
          if (err) {
            console.error(err);
            return;
          }
        //   console.log(record.get("test"));
        }
      );
    }
  });

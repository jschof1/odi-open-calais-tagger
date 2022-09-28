const Airtable = require("airtable");
require("dotenv").config({ path: "/.env" });

export const apiKey = process.env["AIRTABLE_API_KEY"];
export const baseId = process.env["AIRTABLE_BASE_ID"];

const base = new Airtable({ apiKey }).base(baseId);

async function fetchTable() {
  let allDescriptions = [];
// write the name of the base here
  const records = await base("Youtube Videos")
    .select({ view: "Grid view" })
    .all();
  records.forEach(function (record) {
    allDescriptions.push(record.fields.Description);
  });
  return await allDescriptions;
}
fetchTable()
  .then((res) => {
    fs.writeFile("allDescriptions.json", JSON.stringify(res), function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

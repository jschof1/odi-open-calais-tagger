const calais = require("opencalais-tagging");
var fs = require("fs");

require("dotenv").config();
const token2 = process.env["API_TOKEN2"];

const loadAndFetch = async () => {
  let file = await fs.readFileSync("allDescriptions.json");
  let fileData = JSON.parse(file);

  let arr = [];

  let i = -1;

  const interval = setInterval(async () => {
    let arr2 = [];
    i += 1;
    // choose how many requests you want to make - REMEMBER you are limited to 500 per day
    if (i === 50) {
      fs.writeFile("tags.json", JSON.stringify(arr), function (err, result) {
        if (err) console.log("error", err);
      });
      clearInterval(interval);
    }
    try {
      const options = {
        content: fileData[i],
        accessToken: token2,
      };

      const allData = await calais.tag(options);
      delete allData.doc;

      let calaisResponse = Object.values(allData);
      const allNames = calaisResponse.filter((obj) => obj.name);

      for (let x of allNames) {
        if (
          x._type === "Person" ||
          x._type === "Company" ||
          x._type === "Organization" ||
          x._typeGroup === "socialTag" ||
          x._typeGroup === "topics"
        ) {
          arr2.push(x.name);
        }
      }
      return arr.push({ [i]: arr2 });
    } catch (err) {
      return arr.push({ [i]: ["DESCRIPTION EMPTY"] });
    }
  }, 5000);
};
loadAndFetch();

const calais = require("opencalais-tagging");
var fs = require("fs");
require("dotenv").config();

const token = process.env["API_TOKEN"];

const loadAndFetch = async () => {
  let arr = [];
  let file = await fs.readFileSync("allDescriptions.json");
  let fileData = JSON.parse(file);
  let i = 0;


  const interval = setInterval(async () => {
    i++;
    if (i === 150) {
      fs.writeFile("tags.json", JSON.stringify(arr), function (err, result) {
        if (err) console.log("error", err);
      });
      clearInterval(interval);
    }
    try {
      const options = {
        content: fileData[i],
        accessToken: token,
      };

      const allData = await calais.tag(options);
      delete allData.doc;

      let calaisResponse = Object.values(allData);
      const allNames = calaisResponse.filter((obj) => obj.name);
      let arr2 = [];

      for (let x of allNames) {
        if (
          x._type === "Person" ||
          x._type === "Company" ||
          x._type === "Organization" ||
          x._typeGroup === "socialTag" ||
          x._typeGroup === "topics"
        ) {
          console.log(arr2);
          arr2.push(x.name);
        }
      }
      return arr.push(arr2);
    } catch (err) {
      console.log(err);
      return arr.push(["DESCRIPTION EMPTY"]);
    }
  }, 2000);
};
loadAndFetch();

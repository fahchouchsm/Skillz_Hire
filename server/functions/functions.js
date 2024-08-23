const { User } = require("../DB/models/userSchema");
const _ = require("lodash");
const colors = require("colors");

const lastOnline = async (data) => {
  console.log(`${data}`.red);
  try {
    await User.findByIdAndUpdate(data.id, { lastOnline: _.now() });
    console.log("Online updated".bgCyan);
  } catch (error) {
    console.error("Error updating last online:", error);
  }
};

module.exports = { lastOnline };

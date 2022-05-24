const { User } = require("./models/user");

const getAdminById = async (id) => {
  try {
    return (
      await User.findAll({
        where: {
          id: id,
        },
        limit: 1,
      })
    )[0].dataValues;
  } catch (err) {
    if (process.env.DEBUG == true) {
      console.log(err);
    }
    return null;
  }
};

module.exports = getAdminById;

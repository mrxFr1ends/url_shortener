import "dotenv/config";
import app from "./app";
import sequelize from "./sequelize";

const startApp = async function () {
  await sequelize
    .sync()
    .then(() => console.log("Successfully synchronizing the database!"))
    .catch(error => {
      console.log("Failed to synchronizing the database:", error)
      throw error;
    });
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
  });
};

startApp();

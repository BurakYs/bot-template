const mongoose = require("mongoose");
module.exports = async client => {
    const logger = client.utils.logger
    mongoose.set('strictQuery', true)
    mongoose.connect(client.config.project.mongo, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    mongoose.connection.on("connected", async () => {
        logger.success("Connected to MongoDB")
    });

    mongoose.connection.on("error", error => {
        logger.error("An error occurred while connecting to MongoDB")
        console.error(error)
    });
    mongoose.connection.on("disconnected", () => {
        logger.error("Lost connection with MongoDB")
    });
}
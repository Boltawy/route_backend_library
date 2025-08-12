import mongoose, { connect } from "mongoose";
import { configDotenv } from "dotenv"
configDotenv({ path: './config/dev.env' })

const establishDBConnection = () => {
    console.log(process.env.DBNAME)
    mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB"));
}

export default establishDBConnection;
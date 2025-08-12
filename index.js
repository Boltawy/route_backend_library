import { configDotenv } from 'dotenv'
configDotenv({ path: './config/dev.env' })
import establishDBConnection from "./src/DB/db.connection.js"
import express from 'express'
import userRouter from './src/modules/user/user.router.js'
import cors from 'cors'
import bookRouter from './src/modules/book/book.router.js'
import transactionRouter from './src/modules/transaction/transaction.router.js'


const app = express()
establishDBConnection()
app.use(express.json())

app.use(cors())

app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)
app.use("/api/transactions", transactionRouter)

app.use((req, res, next) => {
    next({
        statusCode: 404,
        status: "Error",
        message: "Route not found"
    })
})


app.use((err, req, res, next) => { //global error handler
    res.status(err.statusCode || 500).json({
        "status": err.status || "Error",
        "message": err.message || "Something went wrong",
        "error": err.error
    })
})

app.get('/', (req, res) => res.sendFile("index.html", { root: "./public" }))
app.listen(process.env.PORT, () => console.log(`Nirvalla Tasks listening on port ${process.env.PORT}.`))

const {MongoClient} = require("mongodb")
const url = process.env.MONGO_URL
const client = new MongoClient(url)
const safeUrl = `${url.slice(0,14)}***${url.slice(15,17)}***${url.slice(47)}`
const dbname = "HDFC"
const collection1="saving"
const collection2="current"
const accountTransfer = client.db(dbname).collection(collection1)
const accountReceiver = client.db(dbname).collection(collection2)


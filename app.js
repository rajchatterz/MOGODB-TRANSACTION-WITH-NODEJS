const {MongoClient} = require("mongodb")
require('dotenv').config()
const url = process.env.MONGO_URL
const client = new MongoClient(url)
const safeUrl = `${url.slice(0,14)}***${url.slice(15,17)}***${url.slice(47)}`
const dbname = "HDFC"
const collection1="saving"
const collection2="current"
const account = client.db(dbname).collection(collection1)
const transfers = client.db(dbname).collection(collection2)

let account_id_sender = "000001"
let account_id_receiver="000002"
let transaction_amount=200
// start a session
// every session will last for 60 seconds
const session = client.startSession()

// now implemet the logic behind the transaction
const main =async()=>{
    try {
        const transactionResult = await session.withTransaction(async()=>{
            const senderUpdate = await account.updateOne(
                {account_id:account_id_sender},
                {$inc:{balance:-transaction_amount}},
                {session}
            )
            const receiverUpdate = await account.updateOne(
                {account_id:account_id_receiver},
                {$inc:{balance:transaction_amount}},
                {session}
            )
            const transfer = {
                transfer_id:"000003",
                amount:200,
                from_account:account_id_sender,
                to_account:account_id_receiver
            }
            const updatesenderTransaction = await account.updateOne(
                {account_id:account_id_sender},
                {$push:{transfer_completed:transfer.transfer_id}},
                {session}
            )
            const updateReceiverTransaction = await account.updateOne(
                {account_id:account_id_receiver},
                {$push:{transfer_completed:transfer.transfer_id}},
                {session}
            )
            if(transactionResult){
                console.log('Transactipn completed successfully')
            }else{
                console.log("transaction Failed")
            }
        })
        
    } catch (error) {
        console.error(`Transaction aborted: ${error}`);
        process.exit(1)
    }finally{
        await session.endSession()
        await client.close()
    }
} 
main()
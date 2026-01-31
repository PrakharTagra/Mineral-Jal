import { MongoClient } from "mongodb";

const uri =
  "mongodb://mineral_jal_db_user:Vca3wnUuKQFCJIjD@cluster0-shard-00-00.q8cv053.mongodb.net:27017,cluster0-shard-00-01.q8cv053.mongodb.net:27017,cluster0-shard-00-02.q8cv053.mongodb.net:27017/mydb?ssl=true&replicaSet=atlas-XXXX&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected (NON-SRV)");
  } catch (err) {
    console.error("❌ Failed", err);
  } finally {
    await client.close();
  }
}

run();

const { client, connectDB} = require('./src/database.js');

async function startApp() {
    await connectDB();






await client.close();

}

startApp()

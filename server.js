const express = require("express");
// const hostname = '127.0.0.1';
// const port = 3000;
const application = express();
application.use(express.json());
// controllers/csvController.js

const service = require('./service');


  application.post("/csv",async(req, res) =>{
    const csvFilePath = 'us-500.csv'; // Replace with your CSV file path
    const batchSize=1000
    const pauseDuration = 10
    try {
      const data = await service.processCSV(csvFilePath,batchSize,pauseDuration);
      console.log(data);
      return res.status(200).json({ success: true, message: 'CSV file successfully processed.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  application.get("/", (req, res) => {
    res.send("Hello");
 });



 application.get('/account', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    // Fetch, sort, and paginate the data
    const paginatedData = await service.getAllAccount(page);

    res.json(paginatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

application.get('/account2', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    // Fetch, sort, and paginate the data
    const paginatedData = await service.getAllAccountOptimized(page);

    res.json(paginatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

application.listen(9009, () => {
    console.log("server started @ http://localhost:9009");
  }); 

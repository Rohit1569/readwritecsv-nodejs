// const fs = require('fs');
// const csv = require('csv-parser');
// const accountConfig = require("./model-config/accountConfig");

// class CsvService {
//   async processCSV(csvFilePath, batchSize, pauseDuration) {
//     console.log("Starting CSV processing...");
//     try {
//       const readStream = fs.createReadStream(csvFilePath);
//       row=await this.readAndStoreBatches(readStream, batchSize, pauseDuration);
//       console.log("CSV processing completed successfully.");
//       return row
//     } catch (error) {
//       console.error(`Error processing CSV: ${error.message}`);
//     }
//   }

//   async readAndStoreBatches(readStream, batchSize, pauseDuration) {
//     return new Promise((resolve, reject) => {
//       let currentBatch = [];
//       let rowCount = 0;

//       readStream
//         .pipe(csv())
//         .on('data', async (row) => {
//           currentBatch.push(row);
//           rowCount++;

//           if (rowCount === batchSize) {
//             // Pause the readStream
//             readStream.pause();

//             await this.processBatch(currentBatch, pauseDuration);

//             // Clear the current batch and reset the row count
//             currentBatch = [];
//             rowCount = 0;

//             // Resume the readStream
//             readStream.resume();
//           }
//         })
//         .on('end', async () => {
//           if (currentBatch.length > 0) {
//             await this.processBatch(currentBatch, pauseDuration);
//           }
//           readStream.close();
//           resolve();
//         })
//         .on('error', (error) => {
//           readStream.close();
//           reject(error);
//         });
//     });
//   }

//   async processBatch(batch, pauseDuration) {
//     console.log(`Processing and storing batch in the database...`);
//     console.log('Data in the current batch:', batch);

//     // Uncomment the line below to actually store the data in the database
//     await accountConfig.model.bulkCreate(batch);

//     console.log('Batch stored successfully.');
//     await this.delay(pauseDuration);
//   }

//   delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
// }

// module.exports = new CsvService();
//differ joint
const fs = require('fs');
const csv = require('csv-parser');
const accountConfig = require("./model-config/accountConfig");
const {Sequelize}=require("./models")
const account = require('./models/account');

class CsvService {
  constructor(){}

  async processCSV(csvFilePath, batchSize, pauseDuration) {
    console.log("Starting CSV processing...");
    try {
      const readStream = fs.createReadStream(csvFilePath);
      let row = await this.readAndStoreBatches(readStream, batchSize, pauseDuration);
      console.log("CSV processing completed successfully.");
      return row;
    } catch (error) {
      console.error(`Error processing CSV: ${error.message}`);
    }
  }

  async readAndStoreBatches(readStream, batchSize, pauseDuration) {
    let currentBatch = [];
    let rowCount = 0;
    let result;

    readStream
      .pipe(csv())
      .on('data', async (row) => {
        currentBatch.push(row);
        rowCount++;

        if (rowCount === batchSize) {
          // Pause the readStream
          readStream.pause();

          result = await this.processBatch(currentBatch, pauseDuration);

          // Clear the current batch and reset the row count
          currentBatch = [];
          rowCount = 0;

          // Resume the readStream
          readStream.resume();
        }
      })
      .on('end', async () => {
        if (currentBatch.length > 0) {
          result = await this.processBatch(currentBatch, pauseDuration);
        }
        readStream.close();
      })
      .on('error', (error) => {
        readStream.close();
        console.error(`Error processing CSV: ${error.message}`);
      });

    return result;
  }

  async processBatch(batch, pauseDuration) {
    console.log(`Processing and storing batch in the database...`);
    console.log('Data in the current batch:', batch);

    
    await accountConfig.model.bulkCreate(batch);

    console.log('Batch stored successfully.');
    await this.delay(pauseDuration);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//differjoin
 
  async getAllAccount(page) {
    const start = new Date();
    const limit = 20;
    const offset = (page - 1) * limit;
  
    try {
      // Fetch data, sort it in ascending order by id, and paginate
      const rawData = await accountConfig.model.findAll({
        order: [['id', 'ASC']],
        limit: limit,
        offset: offset,
      });
  
      const paginatedData = rawData.map(account => account.toJSON());
  
      const end = new Date();
      const executionTime = end - start;
  
      console.log(`Execution time for getAllAccount: ${executionTime} milliseconds`);
  
      return { rows: paginatedData, executionTime };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  
  async  getAllAccountOptimized(page) {
    const start = new Date();
    const limit = 20;
    const offset = (page - 1) * limit;
  //plain indexing,gin,join indexing
    try {
      const result = await accountConfig.model.findAll({
        attributes: ['id','first_name','last_name','company_name'],
        include: [{
        model:account,
        as: 'account',
        attributes: ['id','first_name','last_name','company_name'],
        order: [['id', 'ASC']],
        limit: limit,
        offset: offset,
        }],
        order: [['id', 'ASC']],
      });
  
      const end = new Date();
      const executionTime = end - start;
      console.log(`Execution time for getAllAccount: ${executionTime} milliseconds`);
  
      return { result, executionTime };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
  



//problem
//store 10million data in db
//make pages each page should contain 20 records
//reduce time to visit last page by 50 %




module.exports = new CsvService();

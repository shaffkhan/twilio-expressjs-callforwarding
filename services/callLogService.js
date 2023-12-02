const CallLog = require('../models/CallLog'); 

// Function to create a new call log
async function createCallLog(data) {
  try {
    const callLog = new CallLog(data);
    const result = await callLog.save();
    console.log('result',result)
    return result;
  } catch (error) {
    throw new Error(`Error creating call log: ${error.message}`);
  }
}

// Function to get all call logs
async function getAllCallLogs() {
  try {
    const callLogs = await CallLog.find();
    return callLogs;
  } catch (error) {
    throw new Error(`Error getting call logs: ${error.message}`);
  }
}

// Function to get call log by ID
async function getCallLogById(callLogId) {
  try {
    const callLog = await CallLog.findById(callLogId);
    return callLog;
  } catch (error) {
    throw new Error(`Error getting call log by ID: ${error.message}`);
  }
}

module.exports = {
  createCallLog,
  getAllCallLogs,
  getCallLogById,
};

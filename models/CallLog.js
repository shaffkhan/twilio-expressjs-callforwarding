const mongoose = require('mongoose');

const callLogsSchema = new mongoose.Schema({
  to:{
    type:String,
    require:[true,"Call receiver is required"],
  },
  from:{
    type:String,
    require:[true,"Call dialer is required"],
  },
  recording_url : {
    type:String,
    unique:true,
  },
  recording_duration:{
    type:Number,
  },
  call_status:{
    type:String,
  },
  status: {
    type: Boolean,
    default: true
  },
},
{
  timestamps: true,
}
);

const CallLog = mongoose.model('CallLog', callLogsSchema);

module.exports = CallLog;
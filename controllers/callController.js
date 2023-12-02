const twilio = require('twilio');
const callLogService = require('../services/callLogService');


const handleCall = async (req, res) => {
    try {
        const twiml = new twilio.twiml.VoiceResponse();
        const message = "Press 1 to forward the call to Shaff Khan or press 2 to drop a voice."
        
        twiml.gather({
            input: 'dtmf',
            numDigits: 1,
            timeout: 10,
            action: '/api/v1/call/handle-input',
        })
            .say(message);

        // If user doesn't input anything, loop
        twiml.redirect('/api/v1/call/handle-call');
        res.type('text/xml');
        res.status(200).send(twiml.toString());

    } catch (error) {
        res.status(500).json({
            error: true,
            error_message: "Something went wrong",
            error_detail: error.message
        })
    }
}

const handleInput = async (req, res) => {
    try {

        const userChoice = req.body.Digits;

        const twiml = new twilio.twiml.VoiceResponse();

        if (userChoice === '1') {
            const { To, From, CallStatus } = req.body;
            console.log("here 1")
            const twilioPhoneNumber = process.env.TWILIO_NUMBER;
            const forwardingPhoneNumber = process.env.FORWARDING_NUMBER;
            console.log(twilioPhoneNumber,forwardingPhoneNumber,To,From,CallStatus)
            await callLogService.createCallLog({
                to: To,
                from: From,
                call_status: CallStatus
            })
            console.log("here 2")
            
            twiml.dial({ callerId: twilioPhoneNumber }, forwardingPhoneNumber);

        } else if (userChoice === '2') {
            // Record a voice message
            twiml.say('Please leave your message after the beep.');
            twiml.record({
                action: '/api/v1/call/handle-recording',
                maxLength: 10,
                finishOnKey: '#',
            });
        } else {
            // Handle invalid input
            twiml.say('Invalid choice. Please try again.');
            twiml.redirect('/api/v1/call/handle-call');
        }

        res.type('text/xml');
        res.send(twiml.toString());
    }
    catch (error) {
        res.status(500).json({
            error: true,
            error_message: "Something went wrong",
            error_detail: error.message
        })
    }
}

const handleRecording = async (req, res) => {
    try {
        
        const { To, From, CallStatus, RecordingUrl, RecordingDuration } = req.body;
        await callLogService.createCallLog({
            to: To,
            from: From,
            call_status: CallStatus,
            recording_url: RecordingUrl,
            recording_duration:RecordingDuration,
        })
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Thank you for your message. Goodbye.');

        res.type('text/xml');
        res.send(twiml.toString());
    } catch (error) {
        res.status(500).json({
            error: true,
            error_message: "Something went wrong",
            error_detail: error.message
        })
    }


}

const getAllCallLogs = async (req,res) => {
    try{
        const callLogs = await callLogService.getAllCallLogs();
        res.json({
            error:false,
            response:callLogs,
            success_message:"Successfully fetched call logs"
        })
    }catch(error){

    }
}


module.exports = {
    handleCall,
    handleInput,
    handleRecording,
    getAllCallLogs,
}
const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)
const StateProvider = require('../DataStores/StateProvider')

// Phone numbers to alert with SMS
var felidaeFundTeam = [process.env.RFLABS_NUMBER]
// SMS message
var smsBody = "This is a sightings alert!"
var Script = require('./script')
var permission_fulfillment = function(Context){

    // Twilio messaging service
    if (process.env.TWILIO_TRIGGER === 'active') {
        Promise.all(felidaeFundTeam.map(number => {
            return twilio.messages.create({
                to: number,
                from: process.env.TWILIO_MESSAGING_SERVICE_SID,
                body: smsBody
            })
        })).then(message => {
            console.log("Alert Felidae Fund team SMS sent!")
        }).catch(err => {
            console.log(err)
        })
    }
    
    Context.report.timestampSighting = Date.now();
    if (Context.location) {
        Context.report.latlonOfSighting = JSON.stringify(Context.location.coordinates)
        Context.assistant
            .say(Script.SIGHTING_REPORTED)
            .finish({"exit":true});
    } else {
        StateProvider.setState(Context, "gettingLocation")
        UserStore.set(Context, {previousMessage: Script.REQUEST_ADDRESS})
        Context.assistant
            .say(Script.REQUEST_ADDRESS)
            .finish();
    }
    Context.report.save()    
}

module.exports = permission_fulfillment;

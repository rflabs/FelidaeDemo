var SubmitReport = function(Context){
    Context.report.isTest = true

    Context.assistant
    .say("Your report has been submitted. Thank you")
    .finish({"exit": true})

    Context.report.save()
}

module.exports = SubmitReport;
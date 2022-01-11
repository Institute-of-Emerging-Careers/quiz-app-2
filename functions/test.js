const {sendHTMLMail} = require("./sendEmail")

try {
    await sendHTMLMail(email, `Welcome to IEC LCMS`, 
        { 
            heading: 'Welcome to the IEC LCMS',
            inner_text: "We have sent you an assessment to solve.<br>You have 72 hours to solve the assessment.",
            button_announcer: "Click on the button below to solve the Assessment",
            button_text: "Solve Assessment",
            button_link: "https://apply.iec.org.pk/student/login"
        }
    )
} catch(err) {
    console.log("Email sending failed.")
}
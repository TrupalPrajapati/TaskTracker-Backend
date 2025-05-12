const nodeMailer = require("nodemailer");

const sendingMail = async(to,subject,text)=>{
   
    //transporter
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:"trupalm2211@gmail.com",
            pass:"eyyo orwk rgbi bprx"
        }
    })

    //mailOption (obj)
    const mailOption = {
        from:"trupalm2211@gmail.com",
        to:to,
        subject:subject,
        html: "<div>"+text+"<div>"
    }

    //mailres
    const mailRes = await transporter.sendMail(mailOption);
    console.log(mailRes);
    return mailRes
    
}
   
module.exports = {
    sendingMail
}

require('dotenv').config()
const express = require('express')
const app = express()
const handleError = require('./middlewares/handleError')
const salesforce = require('./middlewares/salesforce')
const {SfDate} = require('jsforce')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/contact' , salesforce , async (req,res,next) => {
    try {
        const SF = req.SF

        const {donation , email , fullName , nric , phone , address} = req.body

        // check email
        const checkEmail = await SF.sobject("Contact")
                                .findOne({Email: email})
                                .select(["Email" , "LastName" , "Phone" , "NRIC__c" , "MailingCity"])
        console.log(checkEmail)
        if(!checkEmail) {
            // create contact
            let result = await SF.sobject("Contact").create({
                Email: email,
                LastName: fullName,
                MailingCity: address,
                NRIC__c: nric,
                Phone: phone,
            })
            if(!result.success) { next(result.errors) }
        }


        // get data contact
        let contact = await SF.sobject("Contact")
                            .findOne({Email: email})
                            .select(["LastName" , "Id"])

        console.log(contact)
        // create donation
        let date = new Date()
        let donationResult = await SF.sobject("Donation__c")
                                .create({
                                    Donor_Name__c: contact.Id,
                                    Donation_Amount__c: donation,
                                    Donation_Datetime__c: date.toISOString()
                                })
        if(!donationResult.success) { next(result.errors) }

        res.status(200).json({
            message: "Donation success."
        })


        // -------------- calback ---------------
        /* SF.sobject("Contact").create({
            Email : "latif@mail.com",
            LastName: "abdul latif",
            // MailingAddress: "cilacap, jateng",
            Phone: "081239123092",
            NRIC__c: "F1239201L",
        } , (err ,result) => {
            if (err || !result.success) { return console.error(err, result); }
            console.log("Created record id : " + result.id);
            res.status(200).send("success")
        }) */

        // -------------- async await --------------
        /* let result = await SF.sobject("Contact").create({
            Email: "ihsan2@mail.com",
            LastName: "Ihsan2",
            // MailingStreet: "Jalan Cilebut",
            MailingCity: "Bogor , Jawa Barat",
            // MailingState: "Jawa Barat",
            Phone: "081239123092",
            NRIC__c: "F1239201L",
        })

        if (!result.success) { next(result.errors)}
        console.log(result) */

    } catch (error) {
        console.log(error)
        next({code: 500 , message: "Internal server error"})
    }
})

app.use(handleError)

app.listen(8000 , () => {
    console.log('server running at port 8000')
})
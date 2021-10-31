require('dotenv').config()
const express = require('express')
const app = express()
const handleError = require('./middlewares/handleError')
const salesforce = require('./middlewares/salesforce')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/donate' , salesforce , async (req,res,next) => {
    try {
        const SF = req.SF
        const {donation , email , fullName , nric , phoneNumber , address} = req.body

        // check email
        const checkEmail = await SF.sobject("Contact")
                                .findOne({Email: email})
                                .select(["Email" , "LastName" , "Phone" , "NRIC__c" , "MailingCity"])
        if(!checkEmail) {
            // create contact
            let result = await SF.sobject("Contact").create({
                Email: email,
                LastName: fullName,
                MailingCity: address,
                NRIC__c: nric,
                Phone: phoneNumber,
            })
            if(!result.success) { next(result.errors) }
        }


        // get data contact
        let contact = await SF.sobject("Contact")
                            .findOne({Email: email})
                            .select(["LastName" , "Id"])

        // create donation
        let date = new Date()
        let donationResult = await SF.sobject("Donation__c")
                                .create({
                                    Donor_Name__c: contact.Id,
                                    Donation_Amount__c: donation,
                                    Donation_Datetime__c: date.toISOString()
                                })
        if(!donationResult.success) { next(result.errors) }

        res.status(201).json({
            message: "Donation success."
        })

    } catch (error) {
        next(error)
    }
})

app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT , () => {
    console.log(`server running at port ${PORT}`)
})
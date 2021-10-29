const handleError = (err,req,res,next) => {
    console.log(err)
    res.status(err.code).json({
        message: err.message,
    })
}

module.exports = handleError
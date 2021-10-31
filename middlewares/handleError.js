const handleError = (err,req,res,next) => {
    console.log(err)
    res.status(err.code || 500).json({
        message: err.message || "Internal server error"
    })
}

module.exports = handleError
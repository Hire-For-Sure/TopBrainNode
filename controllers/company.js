"use strict"

const Company = require('./../models/company')

exports.getCompanies = function(req, res, next) {
    Company.find(function(err, companies){
        if (err)
            return next(err)
        return res.status(200).json(companies)
    })
}

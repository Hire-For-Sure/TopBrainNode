"use strict"

const Company = require('./../models/company')

exports.getCompanies = function(req, res, next) {
    Company.find(function(err, companies){
        if (err)
            return next(err)
        return res.status(200).json(companies)
    })
}

exports.addCompany = function(req, res, next){
    const name = req.body.name
    const image = req.body.image
    if(!name)
        return res.status(422).json({name: "Name is required"})
    if(!image)
        return res.status(422).json({name: "Image is required"})
    let company = new Company({
        name: name,
        image: image
    })
    company.save(function(err, company){
        if(err)
            return next(err)
        res.status(201).json(company)
    })
}

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

exports.deleteCompany = function(req, res, next){
    const _id = req.body._id
    Company.findOneAndDelete({
        _id: _id
    }, function(err, company){
        if(err){return next(err)}
        if(!company){
            return res.status(422).send({
                error: "No company exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })   
    })
}

exports.editCompany = function(req, res, next){
    const _id = req.body._id
    Company.findOne({_id: _id}, function(err, company){
        if(err)
            return next(err)
        if(!company)
            return res.status(422).send({error: "No company exists with the provided _id!"})
        const name = req.body.name
        const image = req.body.image

        if(name)company.name = name        
        if(image)company.image = image
        company.save(function(err, company){
            if(err)
                return next(err)
            res.status(200).json(company)
        })

    })
}

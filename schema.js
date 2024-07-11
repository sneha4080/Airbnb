const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({ //listing name je eror aave aema ae ni obj required hovi joi  // obj n para title etc
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0), //not negative nums
       image : Joi.string().allow("",null) //empty null hoy 
       //image beacause new.ejs na ander listing[image] kiya hai input tag ke name mai
        
      
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
});
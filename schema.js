const Joi = require('joi');

module.exports =  listingSchema = Joi.object({
    listing : Joi.object({ //listing name je eror aave aema ae ni obj required hovi joi  // obj n para title etc
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0), //not negative nums
       img : Joi.string().allow("",null) //empty null hoy 
        
      
    }).required
})
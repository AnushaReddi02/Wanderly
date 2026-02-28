const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),

        description: Joi.string().required(),

        price: Joi.number()
            .required()
            .min(0), // prevents negative price

        location: Joi.string().required(),

        country: Joi.string().required(),

        image: Joi.string()
            .allow("", null) // allows empty or null image URL
    }).required()
});
const joi=require("joi");


module.exports.postSchema=joi.object({
    posting:joi.object({
title:joi.string().required(),
description:joi.string().required(),
location:joi.string().required(),
country:joi.string().required(),
price:joi.number().required().min(0),
image_url:joi.string().allow("",null),






    }).required(),
})

// create schema for sever side validation on reviews section

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),

    }).required(),
});
const Joi = require("joi");

const roomValidationSchema = Joi.object({
  room_number: Joi.string().required(),
  floor: Joi.number().required(),
  area: Joi.number().required(),
  price: Joi.number().required(),
  title: Joi.string().required(),
  address: Joi.string().required(),
  description: Joi.string().allow(""),
  facilities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  status: Joi.string().valid("available", "occupied", "maintenance"),
  rating: Joi.number().min(0).max(5),
  review_count: Joi.number().min(0),
});

exports.validateRoom = (room) => {
  return roomValidationSchema.validate(room);
};

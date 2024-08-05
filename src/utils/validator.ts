import { linkRegex } from "./consts"

const { celebrate, Joi } = require("celebrate");

export const createCardValidator = celebrate({
  body: Joi.object().keys ({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(linkRegex),
  }),
});

export const cardIdValidator = celebrate({
  params: Joi.object().keys ({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const createUserValidator = celebrate({
  body: Joi.object().keys ({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(linkRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const loginValidator = celebrate({
  body: Joi.object().keys ({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const userIdValidator = celebrate({
  params: Joi.object().keys ({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const updateUserInfoValidator = celebrate({
  body: Joi.object().keys ({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const updateAvatarValidator = celebrate({
  body: Joi.object().keys ({
    avatar: Joi.string().pattern(linkRegex).required(),
  }),
});
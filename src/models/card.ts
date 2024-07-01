import { model, Schema } from "mongoose";
import { ObjectId } from "mongoose";
import validator from "validator";

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: "Неправильный формат ссылки"
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: [
    {
      default: [],
      type: Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<ICard>("Card", cardSchema);
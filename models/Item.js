const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [4, "Title name must be at least 4 characters long."],
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, "Desctiption name must be less than 200 characters long."],
  },
  category: {
    type: String,
    required: true,
    enum: ["estate", "vehicles", "furniture", "electronics", "other"],
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value >= 0,
      message: "Price must be positive",
    },
  },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  subscribeList: { type: Array, ref: "User", default: [] },
});

const Item = model("Item", itemSchema);

module.exports = Item;

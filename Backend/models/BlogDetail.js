const mongoose = require("mongoose");

const blogDetailSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    imageUrl: { type: String },
    dropdown: [
      {
        selectedType: { type: String, required: true },
        fields: {
          leftContent: { type: String },
          rightContent: { type: String },
          singleImage: { type: String },
          leftImage: { type: String },
          rightImage: { type: String },
          quote: { type: String },
          title: { type: String },
          description: { type: String },
          points: { type: [String] },   
          embedLink: { type: String },
        },
      },
    ],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogDetail", blogDetailSchema);

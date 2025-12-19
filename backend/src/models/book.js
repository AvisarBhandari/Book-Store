import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,

    price: Number,
    discountPercentage: { type: Number, default: 0 },
    finalPrice: Number,

    genres: [String],

    coverImage: String,
    bookFile: String,

    soldCount: { type: Number, default: 0 },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// INDEXES

// Bestseller sorting
bookSchema.index({ soldCount: -1 });

// Highest discount sorting
bookSchema.index({ discountPercentage: -1 });

// Price range filter
bookSchema.index({ finalPrice: 1 });

// Genre filtering
bookSchema.index({ genres: 1 });

// New arrivals
bookSchema.index({ createdAt: -1 });

// Seller dashboard (future)
bookSchema.index({ seller: 1 });

// Status + sorting 
bookSchema.index({ status: 1, soldCount: -1 });
bookSchema.index({ status: 1, discountPercentage: -1 });
bookSchema.index({ status: 1, createdAt: -1 });


bookSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discountPercentage) / 100;
  next();
});

const Book = mongoose.model("Book", bookSchema);
export default Book;

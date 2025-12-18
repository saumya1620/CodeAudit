import Review from "../models/Review.js"; // your MongoDB model

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { language, code, review } = req.body;
    const newReview = new Review({
      user: req.user.id, // comes from your auth middleware
      language,
      code,
      review,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a user
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

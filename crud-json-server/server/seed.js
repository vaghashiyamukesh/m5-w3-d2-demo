const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Book = require("./models/Book");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/book_list";

const seed = async () => {
  const sourcePath = path.join(__dirname, "..", "db.backup.json");
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const source = require(sourcePath);
  const posts = Array.isArray(source.posts) ? source.posts : [];

  if (posts.length === 0) {
    throw new Error("No posts found in db.backup.json");
  }

  const books = posts.map((post) => ({
    bookId: post.id,
    title: post.title,
    author: post.author,
  }));

  await mongoose.connect(MONGODB_URI);
  await Book.deleteMany({});
  await Book.insertMany(books);

  console.log(`Imported ${books.length} books into MongoDB`);
  await mongoose.disconnect();
};

seed()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Seed failed", error);
    await mongoose.disconnect();
    process.exit(1);
  });
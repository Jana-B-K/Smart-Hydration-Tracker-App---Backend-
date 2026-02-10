import app from "./src/app.js";
import connectDB from "./src/config/dbConfig.js";
const PORT = process.env.PORT;
console.log("app.js loaded")

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
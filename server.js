import app from "./src/app.js";
import connectDB from "./src/config/dbConfig.js";
const PORT = process.env.PORT;
console.log("app.js loaded")

await connectDB();

// Import cron AFTER DB connected
await import("./src/cron/reminder.cron.js");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
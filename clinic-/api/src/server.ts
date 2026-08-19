import "dotenv/config";
import app from "./app";
import { connectToDatabase } from "./config/database";

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/clinic";

async function start(): Promise<void> {
  await connectToDatabase(mongoUri);
  app.listen(port, () => {
    console.log(`Clinic API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

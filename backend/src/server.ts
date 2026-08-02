import app from "./app";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
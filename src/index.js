import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on PORT:${process.env.PORT}`);
});

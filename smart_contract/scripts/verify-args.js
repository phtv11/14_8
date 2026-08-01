require("dotenv").config();

const admin = process.env.BACKEND_WALLET || process.env.PRIVATE_KEY_ADDRESS || "0x0000000000000000000000000000000000000000";
const rtbAddress = process.env.RTB_ADDRESS;

if (!rtbAddress) {
  console.error("Missing RTB_ADDRESS in smart_contract/.env");
  process.exit(1);
}

console.log(JSON.stringify([admin, rtbAddress]));

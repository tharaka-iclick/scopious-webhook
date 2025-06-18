// const express = require("express");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Create logs directory if it doesn't exist
// const logsDir = path.join(__dirname, "logs");
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // Request logging middleware
// app.use((req, res, next) => {
//   const logEntry = {
//     timestamp: new Date().toISOString(),
//     method: req.method,
//     path: req.path,
//     headers: req.headers,
//     body: req.body,
//     query: req.query,
//   };

//   // Log to console
//   console.log("Incoming Request:", logEntry);

//   // Log to file
//   const logFile = path.join(logsDir, "requests.log");
//   fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");

//   next();
// });

// // Webhook endpoint
// app.post("/webhook", (req, res) => {
//   try {
//     console.log("Webhook payload received:", req.body);

//     // Respond to the client
//     res.status(200).json({
//       status: "success",
//       message: "Webhook received successfully",
//       receivedData: req.body,
//     });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to process webhook",
//       error: error.message,
//     });
//   }
// });

// // Test endpoint (for GET requests)
// app.get("/webhook-test", (req, res) => {
//   res.json({
//     message: "Webhook test endpoint is working!",
//     queryParams: req.query,
//     timestamp: new Date().toISOString(),
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Webhook endpoint: POST http://localhost:${PORT}/webhook`);
//   console.log(`Test endpoint: GET http://localhost:${PORT}/webhook-test`);
// });

// Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Create logs directory
// const logsDir = path.join(__dirname, "logs");
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // Request logging middleware
// app.use((req, res, next) => {
//   const logData = {
//     timestamp: new Date().toISOString(),
//     method: req.method,
//     path: req.path,
//     ip: req.ip,
//     headers: req.headers,
//   };

//   // Skip logging body for GET requests
//   if (req.method !== "GET") {
//     logData.body = req.body;
//   }

//   // Log to file
//   const logFile = path.join(logsDir, "webhook_requests.log");
//   fs.appendFileSync(logFile, JSON.stringify(logData) + "\n");

//   next();
// });

// // LoRaWAN Webhook Processor
// app.post("/webhook", (req, res) => {
//   try {
//     const payload = req.body;

//     // Validate payload structure
//     if (!payload.end_device_ids || !payload.uplink_message) {
//       console.error("Invalid payload structure");
//       return res.status(400).json({ error: "Invalid payload structure" });
//     }

//     // Process device data
//     const deviceData = {
//       device_id: payload.end_device_ids.device_id,
//       application_id: payload.end_device_ids.application_ids.application_id,
//       dev_eui: payload.end_device_ids.dev_eui,
//       dev_addr: payload.end_device_ids.dev_addr,
//       received_at: payload.received_at,
//     };

//     // Process sensor data
//     const sensorData = {
//       port: payload.uplink_message.f_port,
//       counter: payload.uplink_message.f_cnt,
//       raw_payload: payload.uplink_message.frm_payload,
//       decoded_payload: payload.uplink_message.decoded_payload,
//       temperature: payload.uplink_message.decoded_payload?.temperature,
//       location: payload.uplink_message.locations?.user,
//       network: payload.uplink_message.network_ids,
//       gateway: payload.uplink_message.rx_metadata?.[0]?.gateway_ids,
//     };

//     // Log important data
//     console.log("📡 LoRaWAN Uplink Received:", {
//       device: deviceData.device_id,
//       temperature: sensorData.temperature,
//       location: sensorData.location,
//       timestamp: deviceData.received_at,
//     });

//     // Here you would typically:
//     // 1. Store to database
//     // 2. Process alerts (e.g., temperature thresholds)
//     // 3. Forward to other systems

//     res.status(200).json({
//       status: "success",
//       device: deviceData.device_id,
//       temperature: sensorData.temperature,
//       received_at: deviceData.received_at,
//     });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       details: error.message,
//     });
//   }
// });

// // Status endpoint
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>LoRaWAN Webhook Receiver</h1>
//     <p>Endpoint: POST /webhook</p>
//     <p>Status: Running</p>
//     <p>Uptime: ${process.uptime()} seconds</p>
//   `);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
// });

// const express = require("express");
// const http = require("http");
// const app = express();

// // Configuration
// const CONFIG = {
//   port: 8080,
//   webhookBaseUrl: "/webhook",
//   customHeaders: {
//     "X-Custom-Header": "Webhook-Integration",
//   },
// };

// // Middleware to parse JSON
// app.use(express.json());

// // Webhook endpoint for uplink messages
// app.post(`${CONFIG.webhookBaseUrl}/uplink`, async (req, res) => {
//   try {
//     const contentType = req.headers["content-type"];
//     if (contentType !== "application/json") {
//       return res.status(415).json({ error: "Unsupported content type" });
//     }

//     // Handle JSON payload
//     const data = req.body;
//     console.log("Received JSON uplink:", JSON.stringify(data, null, 2));

//     // Process the uplink data (add your logic here)
//     // Example: Save to database, forward to another service, etc.
//     console.log("Processing uplink data:", data);

//     // Respond with success
//     res.status(200).json({ status: "success" });
//   } catch (error) {
//     console.error("Error processing uplink:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Optional: Additional endpoint for other message types
// app.post(`${CONFIG.webhookBaseUrl}/other`, (req, res) => {
//   console.log("Received other message:", req.body);
//   res.status(200).json({ status: "success" });
// });

// // Add custom headers to all responses
// app.use((req, res, next) => {
//   for (const [key, value] of Object.entries(CONFIG.customHeaders)) {
//     res.setHeader(key, value);
//   }
//   next();
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Start server
// server.listen(CONFIG.port, () => {
//   console.log(
//     `Webhook server running on http://localhost:${CONFIG.port}${CONFIG.webhookBaseUrl}`
//   );
// });

// // Error handling
// server.on("error", (error) => {
//   console.error("Server error:", error);
// });

// // Handle process termination
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received. Closing server...");
//   server.close(() => {
//     console.log("Server closed.");
//     process.exit(0);
//   });
// });

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(
  bodyParser.json({
    strict: false, // Allows any JSON value (not just objects/arrays)
    type: "application/json", // Explicitly only parse application/json
    verify: (req, res, buf) => {
      req.rawBody = buf.toString("utf8");
      console.log("Raw incoming payload:", req.rawBody);
    },
  })
);

router.get("/", (req, res) => {
  res.send("App is running..");
});

app.post("/webhook", (req, res) => {
  console.log("Received webhook payload:", req.body);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  // res.status(200).send("Webhook received successfully");
  res.status(200).json({
    message: "Webhook received successfully",
    parsedBody: req.body,
    rawBody: req.rawBody,
    headers: req.headers,
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(400).json({ error: err.message });
});

app.use("/.netlify/functions/app", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Secure webhook server running on port ${PORT}`);
});

module.exports.handler = serverless(app);

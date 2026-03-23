const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { initDb, run, get, all } = require("./db");
const authMiddleware = require("./authMiddleware");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    const existedUser = await get("SELECT id FROM users WHERE email = ?", [email]);

    if (existedUser) {
      return response.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    return response.status(201).json({ message: "Register successful" });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    const user = await get("SELECT id, email, password FROM users WHERE email = ?", [email]);

    if (!user) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "super-secret-key",
      { expiresIn: "1d" }
    );

    return response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/booking", authMiddleware, async (request, response) => {
  try {
    const { bookingTime } = request.body;

    if (!bookingTime) {
      return response.status(400).json({ message: "bookingTime is required" });
    }

    const parsedDate = new Date(bookingTime);

    if (Number.isNaN(parsedDate.getTime())) {
      return response.status(400).json({ message: "Invalid datetime" });
    }

    const normalizedDate = parsedDate.toISOString();
    const created = await run("INSERT INTO bookings (user_id, booking_time) VALUES (?, ?)", [
      request.userId,
      normalizedDate,
    ]);

    return response.status(201).json({
      id: created.id,
      bookingTime: normalizedDate,
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.get("/booking", authMiddleware, async (request, response) => {
  try {
    const bookings = await all(
      "SELECT id, booking_time as bookingTime, created_at as createdAt FROM bookings WHERE user_id = ? ORDER BY booking_time ASC",
      [request.userId]
    );

    return response.json(bookings);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/booking/:id", authMiddleware, async (request, response) => {
  try {
    const { id } = request.params;

    const deleted = await run("DELETE FROM bookings WHERE id = ? AND user_id = ?", [id, request.userId]);

    if (!deleted.changes) {
      return response.status(404).json({ message: "Booking not found" });
    }

    return response.json({ message: "Booking deleted" });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

async function startServer() {
  await initDb();
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

startServer();

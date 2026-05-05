import express from "express";
import cors from "cors";

const app = express();
const PORT = 3069;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// Fake Data
// ─────────────────────────────────────────────────────────────────────────────

const users = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@suki.io",
    role: "Frontend Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
    joined: "2023-03-15",
    // Sensitive fields - should NOT be exposed to browser
    stripeCustomerId: "cus_Rj8vK2mN4pL1xQ",
    lastLoginIp: "192.168.1.47",
    sessionToken: "sess_abc123xyz789def456",
    internalDatabaseId: "mongo_65f2a1b3c4d5e6f7a8b9c0d1",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    email: "rahul@suki.io",
    role: "Backend Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul",
    joined: "2023-06-01",
    stripeCustomerId: "cus_Xk9wL3nO5qM2yR",
    lastLoginIp: "10.0.0.23",
    sessionToken: "sess_def456abc123ghi789",
    internalDatabaseId: "mongo_75g3b2c4d5e6f7a8b9c0d2",
  },
  {
    id: 3,
    name: "Ananya Reddy",
    email: "ananya@suki.io",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya",
    joined: "2024-01-10",
    stripeCustomerId: "cus_Yl0xM4oP6rN3zS",
    lastLoginIp: "172.16.0.105",
    sessionToken: "sess_ghi789def456jkl012",
    internalDatabaseId: "mongo_85h4c3d5e6f7a8b9c0d3",
  },
  {
    id: 4,
    name: "Vikram Patel",
    email: "vikram@suki.io",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram",
    joined: "2023-09-22",
    stripeCustomerId: "cus_Zm1yN5pQ7sO4aT",
    lastLoginIp: "192.168.2.89",
    sessionToken: "sess_jkl012ghi789mno345",
    internalDatabaseId: "mongo_95i5d4e6f7a8b9c0d4",
  },
  {
    id: 5,
    name: "Meera Iyer",
    email: "meera@suki.io",
    role: "UX Designer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Meera",
    joined: "2024-02-05",
    stripeCustomerId: "cus_An2zO6qR8tP5bU",
    lastLoginIp: "10.10.10.42",
    sessionToken: "sess_mno345jkl012pqr678",
    internalDatabaseId: "mongo_05j6e5f7a8b9c0d5e6",
  },
];

// User activity stats (internal analytics - normally from separate internal service)
const userStats = {
  1: { totalLogins: 247, documentsCreated: 89, apiCallsThisMonth: 1523 },
  2: { totalLogins: 312, documentsCreated: 156, apiCallsThisMonth: 2341 },
  3: { totalLogins: 98, documentsCreated: 45, apiCallsThisMonth: 876 },
  4: { totalLogins: 189, documentsCreated: 23, apiCallsThisMonth: 3102 },
  5: { totalLogins: 156, documentsCreated: 234, apiCallsThisMonth: 1245 },
};

const posts = [
  {
    id: 1,
    userId: 1,
    title: "Getting Started with React Server Components",
    body: "React Server Components represent a paradigm shift in how we think about rendering...",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    userId: 1,
    title: "CSS Container Queries Are Here",
    body: "After years of waiting, container queries have finally landed in all major browsers...",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    userId: 2,
    title: "Building REST APIs with Express",
    body: "Express remains one of the most popular frameworks for building Node.js APIs...",
    createdAt: "2024-01-22",
  },
  {
    id: 4,
    userId: 3,
    title: "Product Roadmap Best Practices",
    body: "A good roadmap communicates vision while remaining flexible enough to adapt...",
    createdAt: "2024-03-01",
  },
  {
    id: 5,
    userId: 4,
    title: "Docker Compose for Local Development",
    body: "Setting up consistent development environments across a team can be challenging...",
    createdAt: "2024-02-10",
  },
  {
    id: 6,
    userId: 5,
    title: "Design Systems That Scale",
    body: "Building a design system is easy. Maintaining one that scales is hard...",
    createdAt: "2024-03-05",
  },
];

const comments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    body: "Great introduction! Looking forward to trying this out.",
    createdAt: "2024-01-16",
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    body: "How does this affect our existing codebase?",
    createdAt: "2024-01-17",
  },
  {
    id: 3,
    postId: 2,
    userId: 5,
    body: "Finally! This is going to change how we approach responsive design.",
    createdAt: "2024-02-21",
  },
  {
    id: 4,
    postId: 3,
    userId: 1,
    body: "Nice writeup. Would love to see a follow-up on authentication middleware.",
    createdAt: "2024-01-23",
  },
  {
    id: 5,
    postId: 5,
    userId: 2,
    body: "This saved us so much time on onboarding new devs!",
    createdAt: "2024-02-11",
  },
  {
    id: 6,
    postId: 6,
    userId: 4,
    body: "The component library section is spot on.",
    createdAt: "2024-03-06",
  },
];

let nextUserId = 6;

// ─────────────────────────────────────────────────────────────────────────────
// Delay Middleware
// ─────────────────────────────────────────────────────────────────────────────

function delayMiddleware(req, res, next) {
  const delay = parseInt(req.query.delay, 10) || 800;
  setTimeout(next, delay);
}

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

// Health check (no delay)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /api/users
app.get("/api/users", delayMiddleware, (req, res) => {
  res.json({ data: users, total: users.length });
});

// GET /api/users/:id
app.get("/api/users/:id", delayMiddleware, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id, 10));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ data: user });
});

// GET /api/users/:id/stats (internal analytics - would normally be on private network)
app.get("/api/users/:id/stats", delayMiddleware, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const stats = userStats[userId];
  if (!stats) {
    return res.status(404).json({ error: "Stats not found" });
  }
  res.json({ data: stats });
});

// GET /api/users/:id/posts
app.get("/api/users/:id/posts", delayMiddleware, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const userPosts = posts.filter((p) => p.userId === userId);
  res.json({ data: userPosts });
});

// GET /api/posts/:id/comments
app.get("/api/posts/:id/comments", delayMiddleware, (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const postComments = comments
    .filter((c) => c.postId === postId)
    .map((c) => {
      const user = users.find((u) => u.id === c.userId);
      return {
        id: c.id,
        postId: c.postId,
        author: user ? user.name : "Unknown",
        text: c.body,
      };
    });
  res.json({ data: postComments });
});

// POST /api/users
app.post("/api/users", delayMiddleware, (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const newUser = {
    id: nextUserId++,
    name,
    email,
    role: role || "Team Member",
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name.split(" ")[0]}`,
    joined: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);
  res.status(201).json({ data: newUser });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ██████╗  █████╗ ████████╗ █████╗     ███████╗███████╗████████╗ ██████╗██╗   ║
║   ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██╔════╝██╔════╝╚══██╔══╝██╔════╝██║   ║
║   ██║  ██║███████║   ██║   ███████║    █████╗  █████╗     ██║   ██║     ███████║
║   ██║  ██║██╔══██║   ██║   ██╔══██║    ██╔══╝  ██╔══╝     ██║   ██║     ██╔══██║
║   ██████╔╝██║  ██║   ██║   ██║  ██║    ██║     ███████╗   ██║   ╚██████╗██║  ██║
║   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚═╝     ╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
║                                                                               ║
║                        Workshop API Server                                    ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   Server running at: http://localhost:${PORT}                                  ║
║   Default delay: 800ms (override with ?delay=ms)                              ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   Available Endpoints:                                                        ║
║                                                                               ║
║   GET  /api/health              Health check (no delay)                       ║
║   GET  /api/users               List all users                                ║
║   GET  /api/users/:id           Get single user                               ║
║   GET  /api/users/:id/posts     Get user's posts                              ║
║   GET  /api/posts/:id/comments  Get post's comments                           ║
║   POST /api/users               Create new user                               ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   Example requests:                                                           ║
║   curl http://localhost:${PORT}/api/users?delay=300                            ║
║   curl http://localhost:${PORT}/api/users/1                                    ║
║   curl -X POST -H "Content-Type: application/json" \\                          ║
║        -d '{"name":"Test","email":"test@suki.io"}' \\                          ║
║        http://localhost:${PORT}/api/users                                      ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);
});

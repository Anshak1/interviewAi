import express from "express";
import cors from "cors";
import axios from "axios";
import { prisma } from "./lib/prisma";

const app = express();

// Create axios instance with timeout
const githubAxios = axios.create({
    timeout: 10000, // 10 seconds
});

app.use(express.json({ limit: "10kb" }));
app.use(cors());

// Simple in-memory IP-based rate limiter (no external dependency required)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function preinterRateLimiter(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const ip = req.ip || "unknown";
    const now = Date.now();
    const entry = requestCounts.get(ip);

    if (!entry || entry.resetAt <= now) {
        requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        console.warn(`Rate limit exceeded for IP: ${ip}`);
        return res.status(429).json({
            message: "Too many interview requests from this IP, please try again later",
        });
    }

    entry.count += 1;
    return next();
}

app.post("/api/v1/preinter", preinterRateLimiter, async (req, res) => {
    try {
        // github from header
        const { github } = req.body;

        if (!github || typeof github !== "string") {
            return res.status(400).json({
                message: "GitHub URL is required and must be a string",
            });
        }

        let username = github.trim();

        // GitHub username validation regex: alphanumeric, hyphens, max 39 chars
        const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38})?$/;

        // Only attempt URL parsing when the input actually looks like a URL
        // (has a protocol, or is prefixed with a github.com host). This avoids
        // misclassifying plain usernames (e.g. "octocat") as URLs, since
        // `new URL("https://octocat")` would otherwise parse successfully.
        const looksLikeUrl =
            /^https?:\/\//i.test(username) ||
            /^(www\.)?github\.com\//i.test(username);

        if (looksLikeUrl) {
            let githubUrl: URL;
            try {
                githubUrl = new URL(
                    /^https?:\/\//i.test(username)
                        ? username
                        : `https://${username}`
                );
            } catch {
                return res.status(400).json({
                    message: "Invalid GitHub URL",
                });
            }

            // Only accept github.com URLs
            if (githubUrl.hostname !== "github.com" && githubUrl.hostname !== "www.github.com") {
                return res.status(400).json({
                    message: "Only github.com URLs are accepted",
                });
            }

            username =
                githubUrl.pathname
                    .split("/")
                    .filter(Boolean)[0] || "";
        }

        if (!username || !githubUsernameRegex.test(username)) {
            return res.status(400).json({
                message: "Invalid GitHub username",
            });
        }

        console.log("GitHub username:", username);


        const reposResponse = await githubAxios.get(
            `https://api.github.com/users/${username}/repos`,
            {
                params: {
                    sort: "updated",
                    per_page: 5,
                },
            }
        );

        const repos = reposResponse.data;

        
        const repoData = await Promise.all(
            repos.map(async (repo: any) => {
                let readme = "";

                try {
                    const readmeResponse = await githubAxios.get(
                        `https://api.github.com/repos/${username}/${repo.name}/readme`
                    );

                    readme = Buffer.from(
                        readmeResponse.data.content,
                        "base64"
                    ).toString("utf-8");
                } catch {
                    readme = "";
                }

                return {
                    title: repo.name,
                    description: repo.description,
                    readme,
                    stars: repo.stargazers_count,
                    language: repo.language,
                    url: repo.html_url,
                };
            })
        );

        // 5. Save everything in DB
        const interview = await prisma.interview.create({
            data: {
                metadata: repoData,
                status: "pre",
            },
        });

        // 6. Send interview ID to frontend
        return res.status(201).json({
            message: "Interview initialized successfully",
            id: interview.id,
        });
    } catch (error: any) {
        console.error(
            "Pre-interview error:",
            error.response?.data || error.message
        );

        if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
            return res.status(504).json({
                message: "GitHub API request timed out, please try again",
            });
        }

        if (error.response?.status === 404) {
            return res.status(404).json({
                message: "GitHub user not found",
            });
        }

        return res.status(500).json({
            message: "Failed to initialize interview",
        });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
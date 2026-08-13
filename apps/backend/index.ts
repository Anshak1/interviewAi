import express from "express";
import cors from "cors";
import axios from "axios";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/v1/preinter", async (req, res) => {
    try {
        // github from header
        const { github } = req.body;

        if (!github) {
            return res.status(400).json({
                message: "GitHub URL is required",
            });
        }

        let username = github.trim();

        try {
            const githubUrl = new URL(
                username.startsWith("http")
                    ? username
                    : `https://${username}`
            );

            username =
                githubUrl.pathname
                    .split("/")
                    .filter(Boolean)[0] || username;
        } catch {
            username = username
                .replace("github.com/", "")
                .split("/")[0];
        }

        if (!username) {
            return res.status(400).json({
                message: "Invalid GitHub URL",
            });
        }

        console.log("GitHub username:", username);


        const reposResponse = await axios.get(
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
                    const readmeResponse = await axios.get(
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
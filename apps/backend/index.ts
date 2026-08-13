import express from "express";
import cors from "cors"
import axios from "axios";
import { prisma } from "./lib/prisma";
const app = express();

app.use(express.json());

app.use(cors())
const server = app.listen(3000);
// scrape github repo
app.post('api/v1/preinter',async (req,res)=>{
    const githubUrl = req.body;
    if(githubUrl){
        let username = githubUrl;
        try {
            const url = new URL(githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`);
            username = url.pathname.split('/').filter(Boolean)[0] || username;
        } catch (e) {
            // fallback to assuming the string itself is the username if parsing fails
            username = username.replace('github.com/', '').split('/')[0];
        }
        try {
            const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);
            
            const repo = await Promise.all(
                reposRes.data.slice(0,5).map(async (x:any)=>{
                const readmeRes = await axios.get(
                    `rname}/${x.name}/readme`);                
                
                return {
                    title:x.name,
                    description:x.description,
                    readme:atob(readmeRes.data.content)
                }
            })
            )
            await prisma.interview.create({
                data:{
                    meatadata:repo
                }
            })
            return res.status(200).json({
                message:"ho gaya db me push"
            })

        } catch (error) {
            return res.status(411).json({
                message:"error in calling api"
            })
        }
    }


})





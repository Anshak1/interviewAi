import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const BACKEND_URL = "http://localhost:3001";

export function Form() {
    const [github, setGithub] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function submit() {
        if (!github.trim()) {
            toast.error("Please provide a GitHub URL");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${BACKEND_URL}/api/v1/preinter`,
                {
                    github: github.trim(),
                }
            );

            toast.success("Interview initialized successfully");

            navigate(`/interview/${response.data.id}`);
        } catch (err: any) {
            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex flex-col justify-center items-center w-screen min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">

            {/* Background animated gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/30 blur-[120px] mix-blend-screen" />

            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px] mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
                className="z-10 w-full max-w-md p-8 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl"
            >

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <Sparkles className="w-8 h-8" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    AnsAi Interview
                </h2>

                <p className="text-center text-slate-400 mb-8 text-sm">
                    Let AI conduct a personalized technical interview based on your GitHub profile.
                </p>

                {/* GitHub */}
                <div className="mb-6">

                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        GitHub Profile URL
                    </label>

                    <Input
                        placeholder="https://github.com/username"
                        className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-blue-500"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submit();
                            }
                        }}
                    />

                    <p className="text-xs text-slate-500 mt-2">
                        We'll analyze your recent repositories and README files.
                    </p>
                </div>

                {/* Submit */}
                <Button
                    onClick={submit}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border-0"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear"
                                }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />

                            <span>
                                Preparing Interview...
                            </span>

                        </div>
                    ) : (
                        "Start Interview"
                    )}
                </Button>

            </motion.div>
        </div>
    );
}
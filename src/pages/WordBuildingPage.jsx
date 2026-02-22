import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Tooltip,
    LinearProgress,
    Stack,
    Chip,
    Dialog,
    Zoom,
    Backdrop,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useNavigate } from "react-router-dom";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PanToolRoundedIcon from "@mui/icons-material/PanToolRounded";

/**
 * Words for the Word Building practice
 */
const WORDS = [
    { word: "CAT", hint: "A furry pet that meows", emoji: "🐱" },
    { word: "DOG", hint: "Man's best friend", emoji: "🐶" },
    { word: "SUN", hint: "Star at center of solar system", emoji: "☀️" },
    { word: "BAT", hint: "Flying nocturnal mammal", emoji: "🦇" },
    { word: "BOX", hint: "Cardboard container", emoji: "📦" },
];

const THEMES = {
    light: {
        primary: "#FF8E53",
        secondary: "#FE6B8B",
        accent: "#9C27B0",
        background: "#F1F5F9",
        card: "rgba(255, 255, 255, 0.9)",
        cardBorder: "rgba(0, 0, 0, 0.05)",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        success: "#10B981",
        divider: "rgba(0, 0, 0, 0.05)",
        neonGlow: "rgba(255, 142, 83, 0.2)",
    },
    dark: {
        primary: "#FF8E53",
        secondary: "#FE6B8B",
        accent: "#9C27B0",
        background: "#0F172A",
        card: "rgba(30, 41, 59, 0.7)",
        cardBorder: "rgba(255, 255, 255, 0.1)",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        success: "#10B981",
        divider: "rgba(255, 255, 255, 0.05)",
        neonGlow: "rgba(255, 142, 83, 0.3)",
    },
};
const LS_THEME_KEY = "edusign_quiz_theme_mode";

/**
 * Webcam Panel (Reused logic)
 */
function WebcamPanel({ onFrame, running, setRunning, colors: C }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState("");

    const start = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setRunning(true);
        } catch (e) {
            setError("Camera permission denied. Please allow camera access to play.");
            setRunning(false);
        }
    };

    const stop = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRunning(false);
    };

    useEffect(() => {
        return () => stop(); // Stop camera on component unmount
    }, []);

    useEffect(() => {
        if (!running) return;
        let rafId = null;
        let lastSent = 0;
        const tick = () => {
            const now = Date.now();
            if (videoRef.current && canvasRef.current && now - lastSent > 350) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                canvas.width = 320;
                canvas.height = 240;
                ctx.drawImage(video, 0, 0, 320, 240);
                onFrame?.(canvas.toDataURL("image/jpeg", 0.7));
                lastSent = now;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => rafId && cancelAnimationFrame(rafId);
    }, [running, onFrame]);

    return (
        <Box sx={{ width: "100%", maxWidth: 640, mx: "auto" }}>
            {/* Animated Border Wrapper */}
            <Box
                sx={{
                    position: "relative",
                    p: "4px", // Border width
                    borderRadius: "28px",
                    overflow: "hidden",
                    background: `linear-gradient(45deg, #FFB74D, #FF8E53, #9C27B0, #2196F3, #FFB74D)`,
                    backgroundSize: "300% 300%",
                    animation: "gradientFlow 6s linear infinite",
                    boxShadow: running ? `0 0 40px ${C.neonGlow}` : "none",
                    "@keyframes gradientFlow": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                    },
                }}
            >
                <Box
                    sx={{
                        borderRadius: "24px",
                        overflow: "hidden",
                        aspectRatio: "1.4 / 1", // Slightly wider/smaller
                        position: "relative",
                        background: C.background,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: running ? "block" : "none" }} />
                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {!running && (
                        <Box sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Box sx={{ fontSize: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>📷</Box>
                            <Typography sx={{ color: "#FFF", fontWeight: 600, fontSize: 16, lineHeight: 1.4, maxWidth: 300 }}>
                                {error || "Camera access required to start the ASL Quiz session."}
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={start}
                                sx={{
                                    mt: 1,
                                    borderRadius: "40px",
                                    background: "rgba(255, 142, 83, 0.15)",
                                    border: `1px solid ${C.primary}44`,
                                    color: C.primary,
                                    textTransform: "none",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    px: 3,
                                    "&:hover": { background: "rgba(255, 142, 83, 0.25)" }
                                }}
                            >
                                You can still use the Simulate button below!
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Chip
                    label={running ? "SYSTEM ACTIVE" : "ENGINE STANDBY"}
                    size="small"
                    sx={{
                        background: running ? `${C.success}22` : C.divider,
                        color: running ? C.success : C.textSecondary,
                        fontWeight: 800,
                        fontSize: 10,
                        letterSpacing: 1,
                        px: 1
                    }}
                />
            </Box>
        </Box>
    );
}

/**
 * Onboarding Dialog
 */
function OnboardingDialog({ open, onStart, colors: C }) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    background: C.background,
                    borderRadius: "40px",
                    maxWidth: 550,
                    width: "90%",
                    p: 6,
                    border: `1px solid ${C.cardBorder}`,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                    textAlign: "center"
                }
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {/* Hand Icon */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: `${C.success}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1
                    }}
                >
                    <PanToolRoundedIcon sx={{ fontSize: 50, color: C.success }} />
                </Box>

                {/* Text */}
                <Typography variant="body1" sx={{ color: C.textPrimary, fontWeight: 500, lineHeight: 1.6 }}>
                    Learn <span style={{ color: C.primary, fontWeight: 700 }}>ASL signs</span> by showing them to your camera!
                    Match each letter to <span style={{ color: C.secondary, fontWeight: 700 }}>complete the word</span> and earn <span style={{ color: C.primary, fontWeight: 700 }}>points</span>.
                </Typography>

                {/* Chips */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
                    {[
                        { icon: <PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />, label: "Use your camera" },
                        { icon: "🤘", label: "Show ASL signs" },
                        { icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />, label: "Earn points" },
                    ].map((c, i) => (
                        <Box
                            key={i}
                            sx={{
                                background: C.card,
                                border: `1px solid ${C.cardBorder}`,
                                borderRadius: "40px",
                                px: 1.5,
                                py: 0.8,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                                color: C.textSecondary,
                                fontSize: 11,
                                fontWeight: 600
                            }}
                        >
                            <Box sx={{ color: C.primary, display: "flex" }}>{c.icon}</Box>
                            {c.label}
                        </Box>
                    ))}
                </Box>

                {/* Start Button */}
                <Button
                    fullWidth
                    onClick={onStart}
                    sx={{
                        mt: 2,
                        height: 60,
                        borderRadius: "40px",
                        fontSize: 18,
                        fontWeight: 900,
                        textTransform: "none",
                        background: `linear-gradient(45deg, ${C.primary}, ${C.secondary})`,
                        color: "#FFF",
                        boxShadow: `0 8px 30px ${C.primary}66`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: `0 12px 40px ${C.primary}99`,
                        }
                    }}
                >
                    Start Quiz 🚀
                </Button>
            </Box>
        </Dialog>
    );
}

export default function WordBuildingPage() {
    const navigate = useNavigate();

    // Theme state - default to dark
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(LS_THEME_KEY);
        return saved || "dark";
    });

    const C = useMemo(() => THEMES[theme], [theme]);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem(LS_THEME_KEY, next);
    };

    const [showOnboarding, setShowOnboarding] = useState(true);
    const [wordIdx, setWordIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [running, setRunning] = useState(false);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [predicting, setPredicting] = useState(false);

    const current = WORDS[wordIdx];
    const targetChar = current.word[charIdx];

    const nextLetter = useCallback(() => {
        if (charIdx < current.word.length - 1) {
            setCharIdx(charIdx + 1);
        } else {
            setTimeout(() => {
                setCharIdx(0);
                setWordIdx((prev) => (prev + 1) % WORDS.length);
            }, 500);
        }
    }, [charIdx, current.word.length]);

    const onFrame = useCallback(async (dataUrl) => {
        if (!running || predicting) return;
        setPredicting(true);
        try {
            const res = await fetch("http://localhost:8000/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: dataUrl, target: targetChar, mode: "quiz" }),
            });
            if (res.ok) {
                const data = await res.json();
                setAttempts(prev => prev + 1);
                if (data.label === targetChar && data.confidence > 0.6) {
                    setCorrectCount(prev => prev + 1);
                    setStreak(prev => prev + 1);
                    setScore(prev => prev + 10);
                    nextLetter();
                } else {
                    setStreak(0);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPredicting(false);
        }
    }, [running, predicting, targetChar, nextLetter]);

    return (
        <Box
            sx={{
                height: { xs: "auto", md: "100vh" },
                width: "100vw",
                background: C.background,
                p: { xs: 2, md: 3 },
                color: C.textPrimary,
                display: "flex",
                flexDirection: "column",
                overflow: { xs: "auto", md: "hidden" },
                transition: "all 0.3s ease",
            }}
        >
            <OnboardingDialog open={showOnboarding} onStart={() => setShowOnboarding(false)} colors={C} />
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <IconButton onClick={() => navigate("/mode")} sx={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.textPrimary }}>
                    <ArrowBackRoundedIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>ASL Quiz</Typography>
                    <Typography sx={{ color: C.textSecondary, fontSize: 13 }}>Word {wordIdx + 1} of {WORDS.length}</Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
                        <IconButton onClick={toggleTheme} sx={{ color: C.textPrimary, background: C.card, border: `1px solid ${C.cardBorder}` }}>
                            {theme === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ background: C.card, px: 2, py: 1, borderRadius: "12px", border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 18 }}>🔥</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{streak}</Typography>
                    </Box>
                    <Box sx={{ background: C.card, px: 2, py: 1, borderRadius: "12px", border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 18 }}>✨</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{score}</Typography>
                    </Box>
                </Stack>
            </Box>

            <LinearProgress
                variant="determinate"
                value={(wordIdx / WORDS.length) * 100}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    mb: 2,
                    background: C.divider,
                    "& .MuiLinearProgress-bar": { background: `linear-gradient(45deg, ${C.primary}, ${C.secondary})` }
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    flex: 1,
                    minHeight: 0,
                    mb: 1
                }}
            >
                {/* Left: Camera */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
                    <WebcamPanel onFrame={onFrame} running={running} setRunning={setRunning} colors={C} />
                    <Button onClick={() => nextLetter()} sx={{ color: C.textSecondary, fontWeight: 700, mt: 1 }}>Skip Letter</Button>
                </Box>

                {/* Right: Interaction */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
                    {/* Prompt Card */}
                    <Card sx={{ background: C.card, borderRadius: "24px", border: `1px solid ${C.cardBorder}`, flex: "0 0 auto", transition: "all 0.3s ease" }}>
                        <CardContent sx={{ textAlign: "center", p: 2.5 }}>
                            <Box sx={{ fontSize: 60, mb: 1 }}>{current.emoji}</Box>
                            <Box sx={{ background: `${C.primary}1A`, py: 0.8, px: 2, borderRadius: "20px", display: "inline-block", mb: 2 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{current.hint}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1, background: `linear-gradient(45deg, ${C.primary}, ${C.secondary})`, px: 2.5, py: 1, borderRadius: "40px", fontWeight: 900, fontSize: 14, color: "#FFF" }}>
                                    <span>👋</span> Sign the letter: {targetChar}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Spelling Slots */}
                    <Card sx={{ background: C.card, borderRadius: "24px", border: `1px solid ${C.cardBorder}`, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", transition: "all 0.3s ease" }}>
                        <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.textSecondary, letterSpacing: 2, mb: 2, textAlign: "center" }}>SPELL THE WORD</Typography>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                {current.word.split("").map((char, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 54,
                                            height: 54,
                                            borderRadius: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: i < charIdx ? `${C.success}22` : (i === charIdx ? `${C.primary}1A` : C.divider),
                                            border: i === charIdx ? `2px solid ${C.primary}` : `1px solid ${C.cardBorder}`,
                                            boxShadow: i === charIdx ? `0 0 15px ${C.primary}44` : "none",
                                            transition: "all 0.3s ease",
                                            animation: i === charIdx ? "activeBlink 1.5s infinite" : "none",
                                            "@keyframes activeBlink": {
                                                "0%": { opacity: 1, transform: "scale(1)" },
                                                "50%": { opacity: 0.7, transform: "scale(0.95)" },
                                                "100%": { opacity: 1, transform: "scale(1)" },
                                            }
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 24, fontWeight: 900, color: i < charIdx ? C.success : (i === charIdx ? C.primary : C.textSecondary) }}>
                                            {char}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Large Stats */}
                    <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
                        {[
                            { label: "Correct", val: correctCount, icon: "✅", color: C.success },
                            { label: "Attempts", val: attempts, icon: "🎯", color: "#3B82F6" },
                            { label: "Streak", val: streak, icon: "🔥", color: C.primary },
                        ].map((s, i) => (
                            <Card key={i} sx={{ flex: 1, background: C.card, borderRadius: "16px", border: `1px solid ${C.cardBorder}`, transition: "all 0.3s ease" }}>
                                <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                                    <Typography sx={{ fontSize: 14, mb: 0.2 }}>{s.icon}</Typography>
                                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</Typography>
                                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: C.textSecondary }}>{s.label}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

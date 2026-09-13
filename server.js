import "dotenv/config";
import express from "express";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({limit:"1mb"}));
app.use(express.static("public"));

app.post("/api/chat", async (req,res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: "You are NOVA, a helpful personal AI assistant. Reply naturally in Persian when the user speaks Persian. Be concise, useful, and honest. Never claim to have performed actions you did not perform.",
      input: messages.slice(-20).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "")
      }))
    });
    res.json({ text: response.output_text });
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"AI connection failed. Check OPENAI_API_KEY and server logs."});
  }
});

app.post("/api/transcribe", upload.single("audio"), async (req,res) => {
  try {
    if (!req.file) return res.status(400).json({error:"No audio file"});
    const file = new File([req.file.buffer], req.file.originalname || "audio.webm", {type:req.file.mimetype || "audio/webm"});
    const tr = await openai.audio.transcriptions.create({
      model: process.env.TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
      file,
      language: "fa"
    });
    res.json({text: tr.text});
  } catch(e) {
    console.error(e);
    res.status(500).json({error:"Speech transcription failed."});
  }
});

app.post("/api/tts", async (req,res) => {
  try {
    const text = String(req.body.text || "").slice(0,4000);
    const speech = await openai.audio.speech.create({
      model: process.env.TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.TTS_VOICE || "alloy",
      input: text,
      response_format: "mp3"
    });
    const buffer = Buffer.from(await speech.arrayBuffer());
    res.set("Content-Type","audio/mpeg");
    res.send(buffer);
  } catch(e) {
    console.error(e);
    res.status(500).json({error:"Text-to-speech failed."});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`NOVA running on http://localhost:${port}`));

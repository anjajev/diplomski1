import express, { Request, Response } from "express";
import multer from "multer";
import OpenAI from "openai";

const router = express.Router();

/**
 * Multer – upload slike
 * - ograničavamo veličinu fajla na ~6MB da neko ne pošalje ogroman fajl
 */
const upload = multer({
  limits: {
    fileSize: 6 * 1024 * 1024, // 6 MB
  },
});

/**
 * OpenAI klijent
 * (za sada hardcodovan ključ – obavezno kasnije prebaci u .env)
 */
const client = new OpenAI({
  apiKey:
    "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",
});

/**
 * POST /api/classify-artikal
 * Prima jednu sliku (field name: "image") i vraća:
 *  { tip, kategorija, boja }
 */
router.post(
  "/api/classify-artikal",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Slika je obavezna." });
      }

      const base64 = req.file.buffer.toString("base64");
      const mime = req.file.mimetype;

      const prompt = `
Analiziraj sliku odeće i vrati tačno jednu liniju u formatu:

tip=<jedna rec: majica|haljina|suknja|farmerice|jakna|duks|sorts|odeća>, kategorija=<muski|zenski|unisex>, boja=<crna|bela|plava|crvena|zelena|zuta|roze|braon|siva|ljubicasta|nepoznata>

Primer:
tip=majica, kategorija=zenski, boja=crna

Vrati isključivo tu jednu liniju, bez dodatnog teksta, bez objašnjenja, bez navodnika.
`.trim();

      const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini", // vision model – ako ikad zeza, možeš probati "gpt-4o-mini"
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mime};base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 200,
      });

      const content = completion.choices[0]?.message?.content;
      let rawText = "";

      if (typeof content === "string") {
        rawText = content;
      } else if (Array.isArray(content)) {
        // novi format: niz delova
        rawText = (content as any[])
          .map((part) => (part.text ? part.text : ""))
          .join("");
      } else {
        rawText = String(content ?? "");
      }

      // npr: "tip=majica, kategorija=zenski, boja=crna"
      const line = rawText.toLowerCase().trim();

      let tip = "odeća";
      let kategorija = "unisex";
      let boja = "nepoznata";

      const parts = line.split(",");

      for (const part of parts) {
        const p = part.trim();

        if (p.startsWith("tip=")) {
          tip = p.replace("tip=", "").trim() || "odeća";
        } else if (p.startsWith("kategorija=")) {
          kategorija = p.replace("kategorija=", "").trim() || "unisex";
        } else if (p.startsWith("boja=")) {
          boja = p.replace("boja=", "").trim() || "nepoznata";
        }
      }

      return res.json({ tip, kategorija, boja });
    } catch (err: any) {
      console.error("AI ERROR:", err?.message || err);

      // Po želji ovde možeš da loguješ još detalja:
      // console.error("AI ERROR DETAILS:", err?.response?.data || err);

      return res.status(500).json({
        error: "AI klasifikacija nije uspela. Pokušajte ponovo.",
      });
    }
  }
);

export default router;

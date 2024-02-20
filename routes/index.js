const { Router } = require("express");
const postgres = require("@vercel/postgres");
const dynamic = require("./demo.route");

const r = Router();

r.use("/demo", dynamic);

r.get("/", async (req, res) => {
  await createNotes();
  const { rows } = await postgres.sql`SELECT * from NOTES`;
  return res.json(Object.values(rows));
});

r.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { rows } = await postgres.sql`SELECT * FROM notes WHERE id=${id}`;

  if (!rows.length) {
    return res.json({ error: "note not found" });
  }

  return res.json(rows[0]);
});

r.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { content } = JSON.parse(req.body);

  const { rowCount } =
    await postgres.sql`UPDATE notes SET content = ${content} WHERE id=${id}`;

  if (!rowCount) {
    return res.json({ error: "note not found" });
  }

  return res.json("Successfully edited the note.");
});

r.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { rowCount } = await postgres.sql`DELETE FROM notes WHERE id=${id}`;

  if (!rowCount) {
    return res.json({ error: "note not found" });
  }

  return res.json("Successfully deleted the note.");
});

r.post("/", async (req, res) => {
  await createNotes();
  const { content } = JSON.parse(req.body);
  if (content) {
    await postgres.sql`INSERT INTO notes (content) VALUES (${content})`;
    return res.json("Successfully created note");
  } else {
    return res.json("Note NOT created since content is missing.");
  }
});

module.exports = r;

async function createNotes() {
  return await postgres.sql`
    CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
}

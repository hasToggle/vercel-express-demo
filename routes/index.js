const { Router } = require("express");
const postgres = require("@vercel/postgres");
const user = require("./user.route");

const r = Router();

r.use("/:user", user);

r.get("/:id", async (req, res) => {
  await createTables();
  const id = req.params.id;
  const { rows } = await postgres.sql`SELECT * FROM notes WHERE id=${id}`;

  if (!rows.length) {
    return res.json({ error: "note not found" });
  }

  return res.json(rows[0]);
});

r.put("/:id", async (req, res) => {
  await createTables();
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
  await createTables();
  const id = req.params.id;

  const { rowCount } = await postgres.sql`DELETE FROM notes WHERE id=${id}`;

  if (!rowCount) {
    return res.json({ error: "note not found" });
  }

  return res.json("Successfully deleted the note.");
});

module.exports = r;

async function createTables() {
  await postgres.sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
  await postgres.sql`
      CREATE TABLE IF NOT EXISTS notes (
          id SERIAL PRIMARY KEY,
          content VARCHAR(255) NOT NULL,
          "userId" integer REFERENCES users (id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
      `;
}

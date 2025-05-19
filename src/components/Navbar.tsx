import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import type { PGliteWithLive } from "@electric-sql/pglite/live";

const getData = async (db: PGliteWithLive) => {
  const rows = await db.exec("SELECT * FROM my_table;");
  console.log(rows);
};

const getRandomName = () => {
  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace"];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * 100);
};

const insertRandomItem = async (db: PGliteWithLive) => {
  const name = getRandomName();
  const number = getRandomNumber();

  await db.exec(`
    INSERT INTO my_table (name, number)
    VALUES ('${name}', ${number});
  `);
};

export default function Navbar() {
  const db = usePGlite();

  const liveQuery = useLiveQuery(`SELECT * FROM my_table;`);

  return (
    <>
      <div>
        Navbar
        <button onClick={() => getData(db)}>Get Data</button>
        <button onClick={() => insertRandomItem(db)}>Insert Random Data</button>
      </div>
      Live query: {JSON.stringify(liveQuery)}
    </>
  );
}

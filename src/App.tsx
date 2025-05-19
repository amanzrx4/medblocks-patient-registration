import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import "./App.css";
import Navbar from "./components/Navbar";

const db = await PGlite.create({
  extensions: { live },
  dataDir: "idb://test-1",
});

function App() {
  return (
    <PGliteProvider db={db}>
      <Navbar />
    </PGliteProvider>
  );
}

export default App;

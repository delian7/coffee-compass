import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

createRoot(document.getElementById("root")!).render(<App />);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importing the App component
import "./index.css"; // Importing any global styles (optional)
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root"); // Get the root element from index.html

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // Create root only if element exists
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    console.error("Error: 'root' element not found in index.html");
}
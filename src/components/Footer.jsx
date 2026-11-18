import React from "react";
import { ROLL_NO, CARD } from "../config.js";

export default function Footer() {
  return (
    <footer className="app-footer">
      ET 617 · Roll No: {ROLL_NO} · Card {CARD}
    </footer>
  );
}

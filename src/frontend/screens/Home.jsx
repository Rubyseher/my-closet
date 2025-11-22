// import { useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveDrawer from "../components/Utilities/ResponsiveDrawer";

export default function Home() {
  return (
    <div>
      <ResponsiveDrawer />
      <Link to="/Trial">
        Hi
        <button> try it </button>
      </Link>
    </div>
  );
}

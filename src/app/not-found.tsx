"use client";

import { Authenticated } from "@refinedev/core";
import { Suspense } from "react";

function ErrorComponent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#666" }}>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense>
      <Authenticated key="not-found">
        <ErrorComponent />
      </Authenticated>
    </Suspense>
  );
}

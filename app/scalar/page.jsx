"use client";

import { ApiReferenceReact } from "@scalar/api-reference";

export default function ScalarPage() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "/openapi.json",
        theme: "purple",
      }}
    />
  );
}
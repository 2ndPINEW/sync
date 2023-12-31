import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "generouted/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/reset.css";
import "./styles/variable.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  </React.StrictMode>
);

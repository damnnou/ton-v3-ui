import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import { SwapPage } from "./pages/swap";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import PoolsPage from "./pages/pools";
import CreatePoolPage from "./pages/create-pool";
import V3Page from "./pages/V3";
import { TonClientProvider } from "./hooks/common/useTonClient.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate replace to={"/v3"} />,
    },
    {
        path: "/swap",
        element: (
            <App>
                <SwapPage />
            </App>
        ),
    },
    {
        path: "/pools",
        element: (
            <App>
                <PoolsPage />
            </App>
        ),
    },
    {
        path: "/create-pool",
        element: (
            <App>
                <CreatePoolPage />
            </App>
        ),
    },
    {
        path: "/v3",
        element: (
            <App>
                <V3Page />
            </App>
        ),
    },
]);

const manifestUrl = "https://damnnou.github.io/ton-manifest/ton-manifest.json";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <TonClientProvider>
                <RouterProvider router={router} />
            </TonClientProvider>
        </TonConnectUIProvider>
    </React.StrictMode>
);

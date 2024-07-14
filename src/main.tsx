import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import { SwapPage } from "./pages/swap";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import PoolsPage from "./pages/pools";
import CreatePoolPage from "./pages/create-pool";
import { TonClientProvider } from "./hooks/common/useTonClient.tsx";
import PoolPage from "./pages/pool.tsx";
import CreatePositionPage from "./pages/create-position.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate replace to={"/swap"} />,
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
        path: "/pool/:poolId",
        element: (
            <App>
                <PoolPage />
            </App>
        ),
    },
    {
        path: "/pool/:poolId/create-position",
        element: (
            <App>
                <CreatePositionPage />
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

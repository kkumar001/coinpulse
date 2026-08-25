"use client";

import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

function toWsPoolId(poolId: string): string {
    if (!poolId) return "";
    if (poolId.includes(":")) return poolId;

    const evmSep = poolId.indexOf("_0x");
    if (evmSep !== -1) {
        return `${poolId.slice(0, evmSep)}:${poolId.slice(evmSep + 1)}`;
    }

    const sep = poolId.lastIndexOf("_");
    if (sep === -1) return "";
    return `${poolId.slice(0, sep)}:${poolId.slice(sep + 1)}`;
}

export const useCoinGeckoWebSocket = ({
    coinId,
    poolId,
    liveInterval = "1m",
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    const subscribed = useRef(new Set<string>());
    const pendingByChannel = useRef(new Map<string, Record<string, unknown>>());

    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

    const [isWsReady, setIsWsReady] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(WS_BASE);
        wsRef.current = ws;

        const send = (payload: Record<string, unknown>) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(payload));
            }
        };

        const handleMessage = (event: MessageEvent) => {
            let msg: WebSocketMessage;
            try {
                msg = JSON.parse(event.data);
            } catch {
                return;
            }

            if (msg.type === "ping") {
                send({ type: "pong" });
                return;
            }

            if (msg.type === "confirm_subscription") {
                try {
                    const { channel } = JSON.parse(msg.identifier ?? "{}") as {
                        channel?: string;
                    };
                    if (!channel) return;

                    subscribed.current.add(channel);
                    const pending = pendingByChannel.current.get(channel);
                    if (pending) {
                        send({
                            command: "message",
                            identifier: JSON.stringify({ channel }),
                            data: JSON.stringify(pending),
                        });
                        pendingByChannel.current.delete(channel);
                    }
                } catch {
                    return;
                }
                return;
            }

            if (msg.c === "C1") {
                setPrice({
                    usd: msg.p ?? 0,
                    coin: msg.i,
                    price: msg.p,
                    change24h: msg.pp,
                    marketCap: msg.m,
                    volume24h: msg.v,
                    timestamp: msg.t,
                });
            }

            if (msg.c === "G2") {
                const newTrade: Trade = {
                    price: Number(msg.pu ?? 0),
                    value: Number(msg.vo ?? 0),
                    timestamp: msg.t ?? 0,
                    type: msg.ty,
                    amount: Number(msg.to ?? 0),
                };

                setTrades((prev) => [newTrade, ...prev].slice(0, 7));
            }

            if (msg.ch === "G3") {
                const timestamp = msg.t ?? 0;

                const candle: OHLCData = [
                    timestamp,
                    Number(msg.o ?? 0),
                    Number(msg.h ?? 0),
                    Number(msg.l ?? 0),
                    Number(msg.c ?? 0),
                ];

                setOhlcv(candle);
            }
        };

        ws.onopen = () => {
            if (wsRef.current === ws) setIsWsReady(true);
        };
        ws.onmessage = handleMessage;
        ws.onclose = () => {
            if (wsRef.current === ws) setIsWsReady(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsWsReady(false);
        };

        return () => {
            if (wsRef.current === ws) {
                wsRef.current = null;
                setIsWsReady(false);
            }
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (!isWsReady) return;
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const send = (payload: Record<string, unknown>) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(payload));
            }
        };

        const unsubscribeAll = () => {
            subscribed.current.forEach((channel) => {
                send({
                    command: "unsubscribe",
                    identifier: JSON.stringify({ channel }),
                });
            });
            subscribed.current.clear();
            pendingByChannel.current.clear();
        };

        const subscribe = (channel: string, data?: Record<string, unknown>) => {
            if (data) pendingByChannel.current.set(channel, data);

            send({
                command: "subscribe",
                identifier: JSON.stringify({ channel }),
            });
        };

        setPrice(null);
        setTrades([]);
        setOhlcv(null);
        unsubscribeAll();

        subscribe("CGSimplePrice", {
            coin_id: [coinId],
            vs_currencies: ["usd"],
            action: "set_tokens",
        });

        const poolAddress = toWsPoolId(poolId);
        if (poolAddress) {
            subscribe("OnchainTrade", {
                "network_id:pool_addresses": [poolAddress],
                action: "set_pools",
            });
            subscribe("OnchainOHLCV", {
                "network_id:pool_addresses": [poolAddress],
                interval: liveInterval,
                token: "base",
                action: "set_pools",
            });
        }

        return unsubscribeAll;
    }, [coinId, poolId, isWsReady, liveInterval]);

    return {
        price,
        trades,
        ohlcv,
        isConnected: isWsReady,
    };
};

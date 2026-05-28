'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography, Marker } from 'react-simple-maps';

const clients = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        country: "United States",
        coordinates: [-100.0, 40.0],
        projectsCount: 4,
        investedAmount: 12500,
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        country: "Canada",
        coordinates: [-95.0, 60.0],
        projectsCount: 3,
        investedAmount: 8000,
    },
    {
        id: "3",
        name: "Peter Jones",
        email: "peter@example.com",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        country: "United Kingdom",
        coordinates: [-2.0, 54.0],
        projectsCount: 8,
        investedAmount: 25000,
    },
    {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        country: "Germany",
        coordinates: [10.45, 51.16],
        projectsCount: 2,
        investedAmount: 5000,
    },
    {
        id: "5",
        name: "Maria Garcia",
        email: "maria@example.com",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        country: "Spain",
        coordinates: [-3.7, 40.4],
        projectsCount: 6,
        investedAmount: 18000,
    },
    {
        id: "6",
        name: "Mohammed Ali",
        email: "mohammed@example.com",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
        country: "Bangladesh",
        coordinates: [90.35, 23.68],
        projectsCount: 10,
        investedAmount: 30000,
    },
    {
        id: "7",
        name: "Fatima Khan",
        email: "fatima@example.com",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
        country: "United Arab Emirates",
        coordinates: [54.37, 24.45],
        projectsCount: 7,
        investedAmount: 22000,
    },
    {
        id: "8",
        name: "Another Client",
        email: "another@example.com",
        avatar: "https://randomuser.me/api/portraits/men/8.jpg",
        country: "United States",
        coordinates: [-115.0, 36.0],
        projectsCount: 2,
        investedAmount: 5000,
    },
    {
        id: "9",
        name: "Miss India",
        email: "another@example.com",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        country: "India",
        coordinates: [93.35, 23.68],
        projectsCount: 8,
        investedAmount: 1000,
    },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ClientMap = () => {
    const [tooltipData, setTooltipData] = useState(null);
    // mousePos is relative to the outer container div
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredClientId, setHoveredClientId] = useState(null);
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const containerRef = useRef(null);
    // Ref copy of position so filterZoomEvent closure is never stale
    const positionRef = useRef(position);
    useEffect(() => { positionRef.current = position; }, [position]);

    const clientDataByCountry = clients.reduce((acc, client) => {
        if (!acc[client.country]) acc[client.country] = [];
        acc[client.country].push(client);
        return acc;
    }, {});

    const handleMoveEnd = (newPosition) => {
        if (newPosition.zoom <= 1) {
            setPosition({ coordinates: [0, 0], zoom: 1 });
        } else {
            setPosition(newPosition);
        }
    };

    // Track cursor position relative to container for custom tooltip placement
    const handleMouseMove = useCallback((e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }, []);

    // ─── FIX 2: inverse scale so markers stay the same pixel size at every zoom level
    const markerScale = 1 / position.zoom;

    return (
        <div
            ref={containerRef}
            className="w-full bg-[#0b1329] rounded-2xl shadow-2xl p-4 border border-slate-800 overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            <div className="w-full">

                {/* Zoom hint badge */}
                <div className="absolute top-4 left-4 bg-slate-950/70 border border-slate-800 backdrop-blur-sm text-[10px] text-slate-400 py-1 px-2.5 rounded pointer-events-none z-10 hidden sm:block select-none">
                    {position.zoom === 1 ? (
                        <span className="text-teal-400 font-medium">Scroll up to zoom in</span>
                    ) : (
                        <span>Zoom: {position.zoom.toFixed(1)}x • Drag to look around</span>
                    )}
                </div>

                <ComposableMap
                    width={800}
                    height={330}
                    projection="geoEqualEarth"
                    projectionConfig={{ scale: 124 }}
                    className="w-full select-none"
                    style={{ display: 'block' }}
                >
                    <defs>
                        <clipPath id="avatar-clip">
                            <circle cx="0" cy="0" r="6" />
                        </clipPath>
                    </defs>

                    <ZoomableGroup
                        zoom={position.zoom}
                        center={position.coordinates}
                        minZoom={1}
                        maxZoom={6}
                        onMoveEnd={handleMoveEnd}
                        // filterZoomEvent is passed straight to d3-zoom's .filter().
                        // Blocking 'mousedown' prevents drag (pan) initiation while
                        // leaving wheel events alone so scroll-to-zoom still works.
                        filterZoomEvent={(evt) => {
                            if (evt.type === 'mousedown' && positionRef.current.zoom <= 1) return false;
                            return !evt.button;
                        }}
                    >
                        {/* ── LAYER 1: Countries ── */}
                        {/* pointer-events disabled while a client is hovered so the country
                            onMouseEnter can never fire through the avatar hitbox            */}
                        <g style={{ pointerEvents: hoveredClientId ? 'none' : 'auto' }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryName = geo.properties.name;
                                        const countryClients =
                                            clientDataByCountry[countryName] ||
                                            (countryName === "United States of America"
                                                ? clientDataByCountry["United States"]
                                                : null);
                                        const hasWorked = !!countryClients;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                    // Guard: never show country tooltip when a client is active
                                                    if (hoveredClientId) return;
                                                    setTooltipData({
                                                        type: 'country',
                                                        name: countryName === "United States of America"
                                                            ? "United States"
                                                            : countryName,
                                                        hasWorked,
                                                        clients: countryClients || [],
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    if (!hoveredClientId) setTooltipData(null);
                                                }}
                                                style={{
                                                    default: {
                                                        fill: hasWorked ? "#0d9488" : "#1e293b",
                                                        stroke: "#0b1329",
                                                        strokeWidth: 0.5,
                                                        outline: "none",
                                                        transition: "fill 150ms ease",
                                                    },
                                                    hover: {
                                                        fill: hasWorked ? "#14b8a6" : "#334155",
                                                        stroke: "#0b1329",
                                                        strokeWidth: 0.7,
                                                        outline: "none",
                                                        cursor: position.zoom > 1 ? "move" : "pointer",
                                                    },
                                                    pressed: {
                                                        fill: "#0f766e",
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </g>

                        {/* ── LAYER 2: Client markers ── */}
                        <g style={{ pointerEvents: 'auto' }}>
                            {clients.map((client) => (
                                <Marker key={client.id} coordinates={client.coordinates}>
                                    {/*
                                     * FIX 2 — counter-scale the inner group by 1/zoom.
                                     * ZoomableGroup applies a CSS/SVG scale of `zoom` to everything
                                     * inside it; multiplying by the inverse keeps visual size constant.
                                     */}
                                    <g
                                        transform={`scale(${markerScale})`}
                                        className="cursor-pointer"
                                        onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            setHoveredClientId(client.id);
                                            setTooltipData({ type: 'client', client });
                                        }}
                                        onMouseLeave={(e) => {
                                            e.stopPropagation();
                                            setHoveredClientId(null);
                                            setTooltipData(null);
                                        }}
                                    >
                                        {/* Pulse ring — non-interactive */}
                                        <circle r={8} className="fill-teal-400/20 animate-ping pointer-events-none" />
                                        {/* Solid backing disc */}
                                        <circle r={7} className="fill-teal-400 stroke-slate-950 stroke-[1] pointer-events-none" />
                                        {/* Avatar image */}
                                        <image
                                            href={client.avatar}
                                            x="-6" y="-6"
                                            height="12" width="12"
                                            clipPath="url(#avatar-clip)"
                                            className="pointer-events-none"
                                        />
                                        {/* Enlarged transparent hitbox for easier targeting */}
                                        <circle r={12} fill="transparent" />
                                    </g>
                                </Marker>
                            ))}
                        </g>
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* ──────────────────────────────────────────────────────────────────
             * FIX 1 — Custom mouse-following tooltip rendered in the outer
             * container.  ReactTooltip cannot anchor to SVG Marker nodes so the
             * client card never appeared; this implementation is framework-free
             * and has zero dependency on data-tooltip-id attributes.
             * ────────────────────────────────────────────────────────────────── */}
            {tooltipData && (() => {
                // Offset so the card doesn't sit under the cursor
                const OFFSET_X = 14;
                const OFFSET_Y = 14;
                const containerW = containerRef.current?.offsetWidth ?? 800;
                const containerH = containerRef.current?.offsetHeight ?? 580;

                // Approximate card dimensions to flip when near an edge
                const cardW = tooltipData.type === 'client' ? 200 : 180;
                const cardH = tooltipData.type === 'client' ? 160 : 90;

                const flipX = mousePos.x + OFFSET_X + cardW > containerW;
                const flipY = mousePos.y + OFFSET_Y + cardH > containerH;

                const left = flipX
                    ? mousePos.x - cardW - OFFSET_X
                    : mousePos.x + OFFSET_X;
                const top = flipY
                    ? mousePos.y - cardH - OFFSET_Y
                    : mousePos.y + OFFSET_Y;

                return (
                    <div
                        className="absolute pointer-events-none z-50"
                        style={{ left, top, transition: 'left 40ms linear, top 40ms linear' }}
                    >
                        {/* ── Client card ── */}
                        {tooltipData.type === 'client' && (
                            <div className="p-3.5 bg-slate-950 text-white rounded-xl border-2 border-teal-500 flex flex-col items-center shadow-2xl min-w-[190px]">
                                <img
                                    src={tooltipData.client.avatar}
                                    className="w-12 h-12 rounded-full border-2 border-teal-400 object-cover shadow-md mb-2"
                                    alt=""
                                />
                                <p className="font-bold text-sm text-white text-center leading-tight">
                                    {tooltipData.client.name}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate max-w-[160px] mb-2">
                                    {tooltipData.client.email}
                                </p>
                                <div className="w-full text-xs bg-slate-900 rounded-lg p-2 border border-slate-800 space-y-0.5">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Country:</span>
                                        <span className="font-medium text-teal-300">{tooltipData.client.country}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Projects:</span>
                                        <span className="font-medium text-white">{tooltipData.client.projectsCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Invested:</span>
                                        <span className="font-medium text-emerald-400">
                                            ${tooltipData.client.investedAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Country card (only when no client is active) ── */}
                        {tooltipData.type === 'country' && !hoveredClientId && (
                            tooltipData.hasWorked ? (
                                <div className="p-3 bg-slate-950 text-white rounded-xl border border-teal-500/40 shadow-2xl min-w-[170px]">
                                    <p className="font-bold text-teal-400 text-sm border-b border-slate-800 pb-1 mb-1.5">
                                        {tooltipData.name}
                                    </p>
                                    <p className="text-xs text-slate-300 flex justify-between py-0.5">
                                        <span>👥 Clients:</span>
                                        <span className="font-semibold text-white">{tooltipData.clients.length}</span>
                                    </p>
                                    <p className="text-xs text-slate-300 flex justify-between py-0.5">
                                        <span>💼 Projects:</span>
                                        <span className="font-semibold text-white">
                                            {tooltipData.clients.reduce((s, c) => s + c.projectsCount, 0)}
                                        </span>
                                    </p>
                                    <p className="text-xs text-slate-300 flex justify-between py-0.5">
                                        <span>💰 Invested:</span>
                                        <span className="font-semibold text-teal-400">
                                            ${tooltipData.clients.reduce((s, c) => s + c.investedAmount, 0).toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <div className="py-1 px-2.5 bg-slate-950 text-slate-200 text-xs font-medium rounded-md shadow-md border border-slate-800">
                                    {tooltipData.name}
                                </div>
                            )
                        )}
                    </div>
                );
            })()}
        </div>
    );
};

export default ClientMap;
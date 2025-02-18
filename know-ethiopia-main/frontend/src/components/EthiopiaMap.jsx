import React, { useState } from "react";

const ethiopiaRegions = [
  { name: "Tigray", code: "TG", color: "#FF6B6B" },
  { name: "Afar", code: "AF", color: "#4ECDC4" },
  { name: "Amhara", code: "AM", color: "#45B7D1" },
  { name: "Benishangul-Gumuz", code: "BG", color: "#FFA07A" },
  { name: "Addis Ababa", code: "AA", color: "#98D8C8" },
  { name: "Dire Dawa", code: "DD", color: "#F7DC6F" },
  { name: "Harari", code: "HR", color: "#BB8FCE" },
  { name: "Oromia", code: "OR", color: "#85C1E2" },
  { name: "Somali", code: "SO", color: "#F8B739" },
  { name: "Gambela", code: "GM", color: "#52B788" },
  { name: "SNNP", code: "SN", color: "#E76F51" },
  { name: "Sidama", code: "SD", color: "#2A9D8F" }
];

const EthiopiaMap = ({ onClick, size, mapColor, strokeColor, strokeWidth, className }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <div style={{ width: size || "100%" }} className={`${className || ""} relative`}>
      <svg viewBox="0 0 800 700" className="w-full h-auto">
        <path d="M 350 50 L 450 50 L 480 80 L 470 130 L 420 150 L 370 140 L 340 100 Z" fill={hoveredRegion === "Tigray" ? "#F59E0B" : "#FF6B6B"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Tigray")} onMouseEnter={() => setHoveredRegion("Tigray")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="410" y="100" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">Tigray</text>
        <path d="M 480 80 L 580 120 L 620 200 L 600 280 L 550 260 L 520 220 L 470 130 Z" fill={hoveredRegion === "Afar" ? "#F59E0B" : "#4ECDC4"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Afar")} onMouseEnter={() => setHoveredRegion("Afar")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="540" y="190" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">Afar</text>
        <path d="M 340 100 L 370 140 L 420 150 L 470 130 L 520 220 L 480 280 L 420 300 L 360 280 L 320 240 L 300 180 Z" fill={hoveredRegion === "Amhara" ? "#F59E0B" : "#45B7D1"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Amhara")} onMouseEnter={() => setHoveredRegion("Amhara")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="390" y="220" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">Amhara</text>
        <path d="M 180 200 L 250 180 L 300 180 L 320 240 L 300 300 L 250 320 L 200 300 L 170 250 Z" fill={hoveredRegion === "Benishangul-Gumuz" ? "#F59E0B" : "#FFA07A"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Benishangul-Gumuz")} onMouseEnter={() => setHoveredRegion("Benishangul-Gumuz")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="240" y="250" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">B-Gumuz</text>
        <path d="M 200 300 L 250 320 L 280 360 L 270 400 L 230 420 L 190 400 L 180 350 Z" fill={hoveredRegion === "Gambela" ? "#F59E0B" : "#52B788"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Gambela")} onMouseEnter={() => setHoveredRegion("Gambela")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="230" y="370" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" pointerEvents="none">Gambela</text>
        <path d="M 300 300 L 360 280 L 420 300 L 480 280 L 520 320 L 540 380 L 520 450 L 480 500 L 420 520 L 360 510 L 310 480 L 280 440 L 270 400 L 280 360 Z" fill={hoveredRegion === "Oromia" ? "#F59E0B" : "#85C1E2"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Oromia")} onMouseEnter={() => setHoveredRegion("Oromia")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="400" y="400" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" pointerEvents="none">Oromia</text>
        <circle cx="390" cy="340" r={hoveredRegion === "Addis Ababa" ? "18" : "15"} fill={hoveredRegion === "Addis Ababa" ? "#F59E0B" : "#98D8C8"} stroke={strokeColor || "#333"} strokeWidth="2" style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Addis Ababa")} onMouseEnter={() => setHoveredRegion("Addis Ababa")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="390" y="345" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">AA</text>
        <circle cx="520" cy="340" r={hoveredRegion === "Dire Dawa" ? "16" : "13"} fill={hoveredRegion === "Dire Dawa" ? "#F59E0B" : "#F7DC6F"} stroke={strokeColor || "#333"} strokeWidth="2" style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Dire Dawa")} onMouseEnter={() => setHoveredRegion("Dire Dawa")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="520" y="344" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">DD</text>
        <circle cx="540" cy="325" r={hoveredRegion === "Harari" ? "14" : "11"} fill={hoveredRegion === "Harari" ? "#F59E0B" : "#BB8FCE"} stroke={strokeColor || "#333"} strokeWidth="2" style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Harari")} onMouseEnter={() => setHoveredRegion("Harari")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="540" y="329" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">HR</text>
        <path d="M 550 260 L 600 280 L 650 320 L 680 380 L 670 450 L 640 500 L 590 520 L 540 480 L 520 450 L 520 380 L 520 320 Z" fill={hoveredRegion === "Somali" ? "#F59E0B" : "#F8B739"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Somali")} onMouseEnter={() => setHoveredRegion("Somali")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="600" y="400" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" pointerEvents="none">Somali</text>
        <path d="M 310 480 L 360 510 L 420 520 L 450 540 L 430 580 L 380 600 L 320 590 L 280 560 L 270 520 Z" fill={hoveredRegion === "SNNP" ? "#F59E0B" : "#E76F51"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("SNNP")} onMouseEnter={() => setHoveredRegion("SNNP")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="360" y="550" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">SNNP</text>
        <path d="M 380 520 L 420 520 L 440 540 L 430 570 L 400 580 L 370 570 L 365 540 Z" fill={hoveredRegion === "Sidama" ? "#F59E0B" : "#2A9D8F"} stroke={strokeColor || "#333"} strokeWidth={strokeWidth || "1"} style={{ cursor: "pointer" }} onClick={() => onClick && onClick("Sidama")} onMouseEnter={() => setHoveredRegion("Sidama")} onMouseLeave={() => setHoveredRegion(null)} />
        <text x="400" y="550" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">Sidama</text>
      </svg>
      {hoveredRegion && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg z-10">
          {hoveredRegion}
        </div>
      )}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
        {ethiopiaRegions.map((region) => (
          <div key={region.code} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => onClick && onClick(region.name)} onMouseEnter={() => setHoveredRegion(region.name)} onMouseLeave={() => setHoveredRegion(null)}>
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: region.color }} />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthiopiaMap;

// chore: know-ethiopia backfill 1774943306

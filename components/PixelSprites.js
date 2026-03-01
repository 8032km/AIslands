"use client";

/* ══════════════════════════════════════════════
   Pixel Art SVG Sprites — v2 (Ocean-Integrated)
   
   Every island now has:
   • Shallow-water ring (lighter blue)
   • Shore foam pixels (white dots along water edge)
   • Wave ripple lines
   • Larger, more detailed terrain
   ══════════════════════════════════════════════ */

const S = { imageRendering: "pixelated", display: "block" };

function P({ x, y, w = 1, h = 1, c }) {
    return <rect x={x} y={y} width={w} height={h} fill={c} />;
}

/* Color constants */
const SHALLOW = "#7BB8E8";
const FOAM = "rgba(255,255,255,0.55)";
const FOAM_SOFT = "rgba(255,255,255,0.3)";
const RIPPLE = "rgba(255,255,255,0.2)";
const SAND = "#E8C890";
const SAND_DARK = "#D4B070";
const SAND_EDGE = "#C9A560";
const GRASS = "#6BBF7A";
const GRASS_DK = "#5AAF66";
const GRASS_ACC = "#4A9B56";
const TRUNK = "#8B5E3C";
const LEAF = "#2D8B4E";
const LEAF_LT = "#3DA85E";
const WOOD = "#A0805A";
const WOOD_DK = "#8B6F47";
const ROOF_R = "#C25040";
const ROOF_RD = "#D45545";
const ROOF_RL = "#E06050";
const DOOR = "#4A3520";
const WINDOW = "#88D4F0";
const WSHADOW = "#3A7BB8";

/* ═══════════════════════════════════════
   HUB ISLAND — Large central island
   ═══════════════════════════════════════ */
export function HubIsland({ width = 200 }) {
    return (
        <svg viewBox="0 0 48 40" width={width} style={S}>
            {/* ── Water ring (shallow water around island) ── */}
            <P x={4} y={30} w={40} h={3} c={SHALLOW} />
            <P x={6} y={29} w={36} h={1} c={SHALLOW} />
            <P x={3} y={31} w={42} h={2} c={SHALLOW} />
            <P x={8} y={33} w={32} h={2} c={SHALLOW} />
            <P x={2} y={32} w={2} h={1} c={SHALLOW} />
            <P x={44} y={32} w={2} h={1} c={SHALLOW} />

            {/* ── Shore foam (white pixels along waterline) ── */}
            <P x={5} y={30} w={2} h={1} c={FOAM} />
            <P x={12} y={31} w={3} h={1} c={FOAM} />
            <P x={22} y={32} w={4} h={1} c={FOAM} />
            <P x={33} y={31} w={2} h={1} c={FOAM} />
            <P x={40} y={30} w={2} h={1} c={FOAM} />
            <P x={8} y={33} w={2} h={1} c={FOAM_SOFT} />
            <P x={36} y={33} w={3} h={1} c={FOAM_SOFT} />

            {/* ── Ripple lines ── */}
            <P x={1} y={35} w={6} h={1} c={RIPPLE} />
            <P x={40} y={36} w={7} h={1} c={RIPPLE} />
            <P x={18} y={37} w={8} h={1} c={RIPPLE} />

            {/* ── Water shadow (depth) ── */}
            <P x={8} y={30} w={32} h={2} c={WSHADOW} />
            <P x={10} y={32} w={28} h={1} c={WSHADOW} />

            {/* ── Sand / beach base ── */}
            <P x={6} y={25} w={36} h={5} c={SAND} />
            <P x={8} y={24} w={32} h={1} c={SAND} />
            <P x={10} y={23} w={28} h={1} c={SAND} />
            <P x={5} y={27} w={38} h={2} c={SAND_DARK} />
            <P x={7} y={29} w={34} h={1} c={SAND_EDGE} />

            {/* ── Grass terrain ── */}
            <P x={10} y={17} w={28} h={6} c={GRASS} />
            <P x={8} y={19} w={32} h={4} c={GRASS} />
            <P x={12} y={16} w={24} h={1} c={GRASS} />
            <P x={9} y={18} w={30} h={1} c={GRASS_DK} />
            <P x={11} y={22} w={5} h={1} c={GRASS_ACC} />
            <P x={30} y={21} w={4} h={1} c={GRASS_ACC} />
            <P x={18} y={17} w={3} h={1} c={GRASS_ACC} />

            {/* ── Central Tower ── */}
            <P x={20} y={13} w={8} h={4} c={WOOD_DK} />
            <P x={21} y={11} w={6} h={2} c={WOOD} />
            <P x={22} y={9} w={4} h={2} c={WOOD} />
            <P x={20} y={10} w={8} h={1} c={ROOF_R} />
            <P x={21} y={9} w={6} h={1} c={ROOF_RD} />
            <P x={22} y={8} w={4} h={1} c={ROOF_RL} />
            {/* Flag */}
            <P x={24} y={3} w={1} h={5} c={WOOD_DK} />
            <P x={25} y={3} w={5} h={2} c="#E8985A" />
            <P x={25} y={3} w={5} h={1} c="#F0A060" />
            {/* Tower window */}
            <P x={23} y={12} w={2} h={1} c={DOOR} />

            {/* ── Left Palm Tree ── */}
            <P x={13} y={13} w={1} h={5} c={TRUNK} />
            <P x={11} y={11} w={2} h={2} c={LEAF} />
            <P x={13} y={11} w={2} h={1} c={LEAF_LT} />
            <P x={14} y={12} w={2} h={1} c={LEAF} />
            <P x={10} y={12} w={1} h={1} c={LEAF_LT} />

            {/* ── Right Palm Tree ── */}
            <P x={33} y={14} w={1} h={4} c={TRUNK} />
            <P x={31} y={12} w={2} h={2} c={LEAF} />
            <P x={33} y={12} w={2} h={1} c={LEAF_LT} />
            <P x={34} y={13} w={2} h={1} c={LEAF} />

            {/* ── Small details ── */}
            <P x={16} y={17} w={1} h={1} c="#E8E060" />
            <P x={28} y={18} w={1} h={1} c="#E870A0" />
            <P x={35} y={20} w={1} h={1} c="#E8E060" />
            <P x={12} y={20} w={1} h={1} c="#E870A0" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   PROJECTS ISLAND
   ═══════════════════════════════════════ */
export function ProjectsIsland({ width = 130 }) {
    return (
        <svg viewBox="0 0 32 28" width={width} style={S}>
            {/* Water ring */}
            <P x={2} y={22} w={28} h={2} c={SHALLOW} />
            <P x={4} y={21} w={24} h={1} c={SHALLOW} />
            <P x={1} y={23} w={30} h={2} c={SHALLOW} />
            <P x={6} y={25} w={20} h={2} c={SHALLOW} />

            {/* Shore foam */}
            <P x={3} y={22} w={2} h={1} c={FOAM} />
            <P x={14} y={23} w={3} h={1} c={FOAM} />
            <P x={25} y={22} w={2} h={1} c={FOAM} />
            <P x={8} y={25} w={2} h={1} c={FOAM_SOFT} />

            {/* Ripples */}
            <P x={0} y={26} w={4} h={1} c={RIPPLE} />
            <P x={26} y={27} w={5} h={1} c={RIPPLE} />

            {/* Water shadow */}
            <P x={5} y={22} w={22} h={2} c={WSHADOW} />

            {/* Sand */}
            <P x={3} y={17} w={26} h={5} c={SAND} />
            <P x={5} y={16} w={22} h={1} c={SAND} />
            <P x={2} y={19} w={28} h={2} c={SAND_DARK} />
            <P x={4} y={21} w={24} h={1} c={SAND_EDGE} />

            {/* Grass */}
            <P x={5} y={12} w={22} h={4} c={GRASS} />
            <P x={7} y={11} w={18} h={1} c={GRASS} />
            <P x={4} y={14} w={24} h={2} c={GRASS_DK} />
            <P x={8} y={15} w={3} h={1} c={GRASS_ACC} />
            <P x={20} y={14} w={2} h={1} c={GRASS_ACC} />

            {/* Workshop */}
            <P x={12} y={7} w={10} h={5} c={WOOD} />
            <P x={11} y={6} w={12} h={1} c={ROOF_R} />
            <P x={12} y={5} w={10} h={1} c={ROOF_RD} />
            <P x={13} y={4} w={8} h={1} c={ROOF_RL} />
            <P x={14} y={3} w={6} h={1} c={ROOF_RL} />
            <P x={15} y={10} w={2} h={2} c={DOOR} />
            <P x={19} y={8} w={2} h={1} c={WINDOW} />

            {/* Hammer */}
            <P x={6} y={10} w={1} h={3} c={WOOD_DK} />
            <P x={5} y={9} w={3} h={1} c="#B0B0B8" />
            <P x={5} y={8} w={3} h={1} c="#C0C0C8" />

            {/* Wood planks */}
            <P x={24} y={13} w={2} h={1} c={WOOD} />
            <P x={23} y={14} w={3} h={1} c={WOOD_DK} />
        </svg>
    );
}

/* ═══════════════════════════════════════
   COLLABORATE ISLAND
   ═══════════════════════════════════════ */
export function CollabIsland({ width = 140 }) {
    return (
        <svg viewBox="0 0 36 28" width={width} style={S}>
            {/* Water ring left */}
            <P x={0} y={22} w={15} h={2} c={SHALLOW} />
            <P x={1} y={21} w={12} h={1} c={SHALLOW} />
            <P x={0} y={24} w={14} h={2} c={SHALLOW} />
            {/* Water ring right */}
            <P x={21} y={22} w={15} h={2} c={SHALLOW} />
            <P x={23} y={21} w={12} h={1} c={SHALLOW} />
            <P x={22} y={24} w={14} h={2} c={SHALLOW} />
            {/* Water ring bridge area */}
            <P x={14} y={17} w={8} h={2} c={SHALLOW} />

            {/* Shore foam */}
            <P x={2} y={22} w={2} h={1} c={FOAM} />
            <P x={10} y={23} w={2} h={1} c={FOAM} />
            <P x={24} y={22} w={2} h={1} c={FOAM} />
            <P x={32} y={23} w={2} h={1} c={FOAM} />

            {/* Ripples */}
            <P x={0} y={26} w={5} h={1} c={RIPPLE} />
            <P x={30} y={27} w={5} h={1} c={RIPPLE} />
            <P x={13} y={20} w={4} h={1} c={RIPPLE} />

            {/* Water shadows */}
            <P x={3} y={22} w={10} h={1} c={WSHADOW} />
            <P x={23} y={22} w={10} h={1} c={WSHADOW} />

            {/* ── Left island ── */}
            <P x={1} y={16} w={14} h={6} c={SAND} />
            <P x={0} y={18} w={16} h={3} c={SAND_DARK} />
            <P x={2} y={21} w={12} h={1} c={SAND_EDGE} />
            <P x={3} y={11} w={10} h={5} c={GRASS} />
            <P x={2} y={13} w={12} h={3} c={GRASS_DK} />

            {/* Left hut */}
            <P x={4} y={8} w={7} h={3} c={WOOD} />
            <P x={3} y={7} w={9} h={1} c={ROOF_R} />
            <P x={4} y={6} w={7} h={1} c={ROOF_RD} />
            <P x={5} y={5} w={5} h={1} c={ROOF_RL} />
            <P x={7} y={9} w={1} h={2} c={DOOR} />
            <P x={5} y={10} w={1} h={1} c="#E8985A" />

            {/* ── Bridge ── */}
            <P x={15} y={16} w={6} h={1} c={WOOD_DK} />
            <P x={14} y={15} w={1} h={2} c={TRUNK} />
            <P x={21} y={15} w={1} h={2} c={TRUNK} />
            <P x={15} y={17} w={6} h={1} c="#6B4F2C" />
            {/* Rope */}
            <P x={15} y={14} w={6} h={1} c={SAND_EDGE} />

            {/* ── Right island ── */}
            <P x={21} y={16} w={14} h={6} c={SAND} />
            <P x={20} y={18} w={16} h={3} c={SAND_DARK} />
            <P x={22} y={21} w={12} h={1} c={SAND_EDGE} />
            <P x={23} y={11} w={10} h={5} c={GRASS} />
            <P x={22} y={13} w={12} h={3} c={GRASS_DK} />

            {/* Right hut */}
            <P x={25} y={8} w={7} h={3} c={WOOD} />
            <P x={24} y={7} w={9} h={1} c="#5B9BD5" />
            <P x={25} y={6} w={7} h={1} c="#6CA8DE" />
            <P x={26} y={5} w={5} h={1} c="#7DB5E6" />
            <P x={28} y={9} w={1} h={2} c={DOOR} />
            <P x={30} y={10} w={1} h={1} c="#5B9BD5" />

            {/* Sparkles above bridge */}
            <P x={16} y={12} w={1} h={1} c="#E8E060" />
            <P x={18} y={13} w={1} h={1} c="#E8E060" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   FEED ISLAND
   ═══════════════════════════════════════ */
export function FeedIsland({ width = 130 }) {
    return (
        <svg viewBox="0 0 32 28" width={width} style={S}>
            {/* Water ring */}
            <P x={2} y={22} w={28} h={2} c={SHALLOW} />
            <P x={4} y={21} w={24} h={1} c={SHALLOW} />
            <P x={1} y={23} w={30} h={2} c={SHALLOW} />
            <P x={6} y={25} w={20} h={2} c={SHALLOW} />

            {/* Shore foam */}
            <P x={3} y={22} w={2} h={1} c={FOAM} />
            <P x={14} y={23} w={3} h={1} c={FOAM} />
            <P x={26} y={22} w={2} h={1} c={FOAM} />

            {/* Ripples */}
            <P x={0} y={26} w={5} h={1} c={RIPPLE} />
            <P x={25} y={27} w={6} h={1} c={RIPPLE} />

            {/* Water shadow */}
            <P x={5} y={22} w={22} h={2} c={WSHADOW} />

            {/* Sand */}
            <P x={3} y={17} w={26} h={5} c={SAND} />
            <P x={5} y={16} w={22} h={1} c={SAND} />
            <P x={2} y={19} w={28} h={2} c={SAND_DARK} />
            <P x={4} y={21} w={24} h={1} c={SAND_EDGE} />

            {/* Grass */}
            <P x={5} y={12} w={22} h={4} c={GRASS} />
            <P x={7} y={11} w={18} h={1} c={GRASS} />
            <P x={4} y={14} w={24} h={2} c={GRASS_DK} />
            <P x={10} y={15} w={3} h={1} c={GRASS_ACC} />

            {/* Bulletin Board */}
            <P x={12} y={6} w={1} h={6} c={WOOD_DK} />
            <P x={19} y={6} w={1} h={6} c={WOOD_DK} />
            <P x={11} y={5} w={10} h={1} c={WOOD} />
            <P x={11} y={6} w={10} h={5} c="#E8D5B8" />
            <P x={12} y={6} w={7} h={1} c="#3B3226" />
            <P x={12} y={7} w={8} h={1} c="#5C4F3D" />
            <P x={12} y={8} w={5} h={1} c="#3B3226" />
            <P x={15} y={5} w={1} h={1} c={ROOF_RL} />

            {/* Chat bubble */}
            <P x={22} y={8} w={6} h={4} c="#FFFFFF" />
            <P x={23} y={7} w={4} h={1} c="#FFFFFF" />
            <P x={22} y={12} w={1} h={1} c="#FFFFFF" />
            <P x={23} y={9} w={1} h={1} c="#5B9BD5" />
            <P x={24} y={9} w={1} h={1} c="#5B9BD5" />
            <P x={25} y={9} w={1} h={1} c="#5B9BD5" />

            {/* Palm tree */}
            <P x={6} y={10} w={1} h={3} c={TRUNK} />
            <P x={4} y={8} w={2} h={2} c={LEAF} />
            <P x={6} y={8} w={2} h={1} c={LEAF_LT} />
            <P x={7} y={9} w={1} h={1} c={LEAF} />
            <P x={3} y={9} w={1} h={1} c={LEAF_LT} />
        </svg>
    );
}

/* ═══════════════════════════════════════
   AI AGENTS ISLAND
   ═══════════════════════════════════════ */
export function AgentsIsland({ width = 130 }) {
    return (
        <svg viewBox="0 0 32 30" width={width} style={S}>
            {/* Water ring */}
            <P x={2} y={24} w={28} h={2} c={SHALLOW} />
            <P x={4} y={23} w={24} h={1} c={SHALLOW} />
            <P x={1} y={25} w={30} h={2} c={SHALLOW} />
            <P x={6} y={27} w={20} h={2} c={SHALLOW} />

            {/* Shore foam */}
            <P x={3} y={24} w={2} h={1} c={FOAM} />
            <P x={14} y={25} w={3} h={1} c={FOAM} />
            <P x={25} y={24} w={2} h={1} c={FOAM} />
            <P x={8} y={27} w={2} h={1} c={FOAM_SOFT} />

            {/* Ripples */}
            <P x={0} y={28} w={4} h={1} c={RIPPLE} />
            <P x={26} y={29} w={5} h={1} c={RIPPLE} />

            {/* Water shadow */}
            <P x={5} y={24} w={22} h={2} c={WSHADOW} />

            {/* Sand */}
            <P x={3} y={19} w={26} h={5} c={SAND} />
            <P x={5} y={18} w={22} h={1} c={SAND} />
            <P x={2} y={21} w={28} h={2} c={SAND_DARK} />
            <P x={4} y={23} w={24} h={1} c={SAND_EDGE} />

            {/* Grass */}
            <P x={5} y={14} w={22} h={4} c={GRASS} />
            <P x={7} y={13} w={18} h={1} c={GRASS} />
            <P x={4} y={16} w={24} h={2} c={GRASS_DK} />

            {/* Robot */}
            <P x={12} y={10} w={8} h={4} c="#A0A0B0" />
            <P x={13} y={9} w={6} h={1} c="#B0B0C0" />
            <P x={13} y={5} w={6} h={4} c="#C0C0D0" />
            <P x={12} y={6} w={1} h={2} c="#C0C0D0" />
            <P x={19} y={6} w={1} h={2} c="#C0C0D0" />
            <P x={14} y={6} w={2} h={2} c="#60E0F0" />
            <P x={17} y={6} w={2} h={2} c="#60E0F0" />
            <P x={15} y={3} w={2} h={2} c="#A0A0B0" />
            <P x={14} y={2} w={4} h={1} c="#60E0F0" />
            <P x={10} y={11} w={2} h={1} c="#A0A0B0" />
            <P x={20} y={11} w={2} h={1} c="#A0A0B0" />
            <P x={10} y={12} w={1} h={1} c="#B0B0C0" />
            <P x={21} y={12} w={1} h={1} c="#B0B0C0" />

            {/* Glow */}
            <P x={11} y={8} w={1} h={1} c="#60E0F0" />
            <P x={21} y={7} w={1} h={1} c="#60E0F0" />
            <P x={13} y={3} w={1} h={1} c="#80F0FF" />
            <P x={7} y={15} w={2} h={1} c="#90D0E0" />
            <P x={23} y={14} w={2} h={1} c="#90D0E0" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   PRICING ISLAND
   ═══════════════════════════════════════ */
export function PricingIsland({ width = 130 }) {
    return (
        <svg viewBox="0 0 32 28" width={width} style={S}>
            {/* Water ring */}
            <P x={2} y={22} w={28} h={2} c={SHALLOW} />
            <P x={4} y={21} w={24} h={1} c={SHALLOW} />
            <P x={1} y={23} w={30} h={2} c={SHALLOW} />
            <P x={6} y={25} w={20} h={2} c={SHALLOW} />

            {/* Shore foam */}
            <P x={4} y={22} w={2} h={1} c={FOAM} />
            <P x={15} y={23} w={3} h={1} c={FOAM} />
            <P x={26} y={22} w={2} h={1} c={FOAM} />

            {/* Ripples */}
            <P x={0} y={26} w={5} h={1} c={RIPPLE} />
            <P x={26} y={27} w={5} h={1} c={RIPPLE} />

            {/* Water shadow */}
            <P x={5} y={22} w={22} h={2} c={WSHADOW} />

            {/* Sand */}
            <P x={3} y={17} w={26} h={5} c={SAND} />
            <P x={5} y={16} w={22} h={1} c={SAND} />
            <P x={2} y={19} w={28} h={2} c={SAND_DARK} />
            <P x={4} y={21} w={24} h={1} c={SAND_EDGE} />

            {/* Grass */}
            <P x={5} y={12} w={22} h={4} c={GRASS} />
            <P x={7} y={11} w={18} h={1} c={GRASS} />
            <P x={4} y={14} w={24} h={2} c={GRASS_DK} />

            {/* Treasure Chest */}
            <P x={12} y={9} w={9} h={4} c={WOOD} />
            <P x={12} y={8} w={9} h={1} c={WOOD_DK} />
            <P x={11} y={9} w={1} h={3} c={WOOD_DK} />
            <P x={21} y={9} w={1} h={3} c={WOOD_DK} />
            <P x={16} y={9} w={1} h={1} c="#FFD700" />
            <P x={13} y={8} w={7} h={1} c={SAND_EDGE} />

            {/* Gold coins */}
            <P x={10} y={13} w={2} h={1} c="#FFD700" />
            <P x={9} y={12} w={2} h={1} c="#FFC400" />
            <P x={22} y={12} w={2} h={1} c="#FFD700" />
            <P x={23} y={13} w={2} h={1} c="#FFC400" />
            <P x={17} y={7} w={1} h={1} c="#FFE44D" />

            {/* Gems */}
            <P x={6} y={14} w={1} h={1} c="#E060E0" />
            <P x={25} y={15} w={1} h={1} c="#60E0F0" />

            {/* Palm tree */}
            <P x={25} y={9} w={1} h={4} c={TRUNK} />
            <P x={23} y={7} w={2} h={2} c={LEAF} />
            <P x={25} y={7} w={2} h={1} c={LEAF_LT} />
            <P x={26} y={8} w={2} h={1} c={LEAF} />
        </svg>
    );
}

/* ═══════════════════════════════════════
   SMALL PIXEL ICONS (feature cards)
   ═══════════════════════════════════════ */

export function IconHammer({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            <P x={3} y={2} w={4} h={2} c="#B0B0B8" />
            <P x={3} y={1} w={4} h={1} c="#C0C0C8" />
            <P x={4} y={4} w={2} h={1} c="#A0A0A8" />
            <P x={5} y={5} w={2} h={1} c={WOOD_DK} />
            <P x={6} y={6} w={2} h={1} c={WOOD_DK} />
            <P x={7} y={7} w={2} h={1} c={WOOD} />
            <P x={8} y={8} w={2} h={1} c={WOOD} />
            <P x={9} y={9} w={2} h={1} c={WOOD_DK} />
            <P x={10} y={10} w={2} h={2} c={TRUNK} />
            <P x={11} y={12} w={2} h={1} c="#6B4F2C" />
        </svg>
    );
}

export function IconPeople({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            <P x={3} y={2} w={2} h={2} c="#E8985A" />
            <P x={2} y={4} w={4} h={1} c="#E8985A" />
            <P x={3} y={5} w={2} h={3} c="#5B9BD5" />
            <P x={2} y={6} w={1} h={2} c="#5B9BD5" />
            <P x={5} y={6} w={1} h={2} c="#5B9BD5" />
            <P x={3} y={8} w={1} h={2} c="#3B3226" />
            <P x={4} y={8} w={1} h={2} c="#3B3226" />
            <P x={11} y={2} w={2} h={2} c="#E8985A" />
            <P x={10} y={4} w={4} h={1} c="#E8985A" />
            <P x={11} y={5} w={2} h={3} c="#7EC8A4" />
            <P x={10} y={6} w={1} h={2} c="#7EC8A4" />
            <P x={13} y={6} w={1} h={2} c="#7EC8A4" />
            <P x={11} y={8} w={1} h={2} c="#3B3226" />
            <P x={12} y={8} w={1} h={2} c="#3B3226" />
            <P x={6} y={6} w={4} h={1} c="#E8E060" />
            <P x={7} y={5} w={2} h={1} c="#FFE44D" />
        </svg>
    );
}

export function IconBubble({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            <P x={2} y={2} w={12} h={7} c="#FFFFFF" />
            <P x={3} y={1} w={10} h={1} c="#FFFFFF" />
            <P x={3} y={9} w={10} h={1} c="#FFFFFF" />
            <P x={3} y={10} w={2} h={2} c="#FFFFFF" />
            <P x={1} y={3} w={1} h={5} c={SAND_DARK} />
            <P x={14} y={3} w={1} h={5} c={SAND_DARK} />
            <P x={3} y={0} w={10} h={1} c={SAND_DARK} />
            <P x={4} y={3} w={8} h={1} c="#5B9BD5" />
            <P x={4} y={5} w={6} h={1} c="#7EC8A4" />
            <P x={4} y={7} w={7} h={1} c="#E8985A" />
        </svg>
    );
}

export function IconRobot({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            <P x={7} y={0} w={2} h={1} c="#60E0F0" />
            <P x={7} y={1} w={1} h={2} c="#A0A0B0" />
            <P x={4} y={3} w={8} h={5} c="#C0C0D0" />
            <P x={3} y={4} w={1} h={3} c="#B0B0C0" />
            <P x={12} y={4} w={1} h={3} c="#B0B0C0" />
            <P x={5} y={5} w={2} h={2} c="#60E0F0" />
            <P x={9} y={5} w={2} h={2} c="#60E0F0" />
            <P x={6} y={5} w={1} h={1} c="#40C0D0" />
            <P x={10} y={5} w={1} h={1} c="#40C0D0" />
            <P x={6} y={7} w={4} h={1} c="#A0A0B0" />
            <P x={5} y={9} w={6} h={4} c="#A0A0B0" />
            <P x={6} y={9} w={4} h={1} c="#B0B0C0" />
            <P x={7} y={10} w={2} h={1} c="#60E0F0" />
            <P x={3} y={10} w={2} h={1} c="#B0B0C0" />
            <P x={11} y={10} w={2} h={1} c="#B0B0C0" />
            <P x={6} y={13} w={1} h={2} c="#A0A0B0" />
            <P x={9} y={13} w={1} h={2} c="#A0A0B0" />
        </svg>
    );
}

/* ── Pixel Palm Tree (standalone decoration) ── */
export function PixelPalm({ width = 30 }) {
    return (
        <svg viewBox="0 0 10 14" width={width} style={S}>
            <P x={4} y={6} w={2} h={6} c={TRUNK} />
            <P x={5} y={5} w={1} h={1} c={TRUNK} />
            <P x={1} y={3} w={3} h={2} c={LEAF} />
            <P x={4} y={3} w={3} h={1} c={LEAF_LT} />
            <P x={6} y={4} w={3} h={2} c={LEAF} />
            <P x={0} y={4} w={2} h={1} c={LEAF_LT} />
            <P x={8} y={3} w={2} h={1} c={LEAF_LT} />
            <P x={3} y={2} w={5} h={1} c="#4AB868" />
            <P x={2} y={12} w={6} h={1} c={SAND_EDGE} />
        </svg>
    );
}

/* ── Pixel Notes Icon (scroll / notepad) ── */
export function IconNotes({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            {/* Page */}
            <P x={3} y={1} w={10} h={14} c="#F5F0E1" />
            <P x={4} y={0} w={8} h={1} c="#E8DCC8" />
            <P x={4} y={15} w={8} h={1} c="#E8DCC8" />
            {/* Fold corner */}
            <P x={11} y={1} w={2} h={2} c="#D4C8B0" />
            {/* Lines */}
            <P x={5} y={3} w={6} h={1} c="#A09888" />
            <P x={5} y={5} w={7} h={1} c="#A09888" />
            <P x={5} y={7} w={5} h={1} c="#A09888" />
            <P x={5} y={9} w={7} h={1} c="#A09888" />
            <P x={5} y={11} w={4} h={1} c="#A09888" />
            {/* Binding */}
            <P x={3} y={2} w={1} h={12} c={WOOD_DK} />
        </svg>
    );
}

/* ── Pixel Share Icon (arrow up & out) ── */
export function IconShare({ size = 48 }) {
    return (
        <svg viewBox="0 0 16 16" width={size} height={size} style={S}>
            <P x={7} y={1} w={2} h={8} c="#5B9BD5" />
            <P x={6} y={3} w={1} h={1} c="#5B9BD5" />
            <P x={9} y={3} w={1} h={1} c="#5B9BD5" />
            <P x={5} y={4} w={1} h={1} c="#5B9BD5" />
            <P x={10} y={4} w={1} h={1} c="#5B9BD5" />
            <P x={4} y={7} w={2} h={1} c="#5B9BD5" />
            <P x={10} y={7} w={2} h={1} c="#5B9BD5" />
            <P x={4} y={8} w={1} h={6} c="#5B9BD5" />
            <P x={11} y={8} w={1} h={6} c="#5B9BD5" />
            <P x={4} y={14} w={8} h={1} c="#5B9BD5" />
        </svg>
    );
}

/* ── Pixel Bird (seagull for travel animation) ── */
export function PixelBird({ width = 40 }) {
    return (
        <svg viewBox="0 0 16 10" width={width} style={S}>
            {/* Body */}
            <P x={5} y={4} w={6} h={3} c="#F5F0E1" />
            <P x={4} y={5} w={1} h={2} c="#E8DCC8" />
            {/* Head */}
            <P x={11} y={3} w={3} h={3} c="#F5F0E1" />
            <P x={14} y={4} w={1} h={1} c="#E8985A" />
            <P x={13} y={3} w={1} h={1} c="#3B3226" />
            {/* Wings */}
            <P x={3} y={2} w={4} h={2} c="#D4C8B0" />
            <P x={1} y={1} w={3} h={1} c="#E8DCC8" />
            <P x={0} y={0} w={2} h={1} c="#F5F0E1" />
            <P x={6} y={2} w={3} h={1} c="#D4C8B0" />
            {/* Tail */}
            <P x={3} y={6} w={2} h={1} c="#D4C8B0" />
            <P x={2} y={7} w={2} h={1} c="#E8DCC8" />
        </svg>
    );
}


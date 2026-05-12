"use client";

interface MapHandleProps {
  state: number;
  onClick: () => void;
}

export default function MapHandle({ state, onClick }: MapHandleProps) {
  const arrowRotation = state === 0 ? "rotate(0deg)" : "rotate(180deg)";

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "100%", // 📍 เริ่มต้นที่ขอบล่างสุดของแผนที่พอดี
        left: "50%",
        transform: "translateX(-50%) translateY(-2px)", // 📍 ดึงขึ้น 2px เพื่อให้เส้นขาวทับขอบแผนที่พอดี (เพราะ SVG เริ่มที่ Y=2)
        zIndex: 1005,
        cursor: "pointer",
        width: "398px",
        display: "flex",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <div style={{ position: "relative", width: "398px", height: "34px" }}>
        {/* SVG พื้นหลังสีขาวมีเงา */}
        <svg
          width="max-w"
          height="34"
          viewBox="0 0 398 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.20))",
            display: "block",
          }}
        >
          <path
            d="M394 14H226.775C226.756 14.0366 226.737 14.0739 226.717 14.1104C225.209 16.8402 222.999 19.3208 220.213 21.4102C217.427 23.4994 214.12 25.1564 210.48 26.2871C206.841 27.4178 202.94 28 199 28C195.06 28 191.159 27.4178 187.52 26.2871C183.88 25.1564 180.573 23.4994 177.787 21.4102C175.001 19.3208 172.791 16.8402 171.283 14.1104C171.263 14.0739 171.244 14.0366 171.225 14H4V2H394V14Z"
            fill="white"
          />
        </svg>

        {/* ไอคอนลูกศร */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: "50%",
            marginLeft: "-16px",
            transition: "transform 0.3s ease",
            transform: arrowRotation,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 12L16 20L24 12" stroke="#5180CE" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

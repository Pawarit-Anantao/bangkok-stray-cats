"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // ไม่ต้องโชว์ถ้ามีหน้าเดียว

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={containerStyle}>
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{ ...btnStyle, opacity: currentPage === 1 ? 0.3 : 1 }}
      >
        {"<"}
      </button>

      {/* เลขหน้า */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            ...btnStyle,
            backgroundColor: currentPage === p ? "#8F8362" : "transparent",
            color: currentPage === p ? "#FFF" : "#8F8362",
            fontWeight: currentPage === p ? "bold" : "normal",
          }}
        >
          {p}
        </button>
      ))}

      {/* ปุ่มถัดไป */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{ ...btnStyle, opacity: currentPage === totalPages ? 0.3 : 1 }}
      >
        {">"}
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "20px",
  paddingBottom: "40px",
  width: "100%",
};

const btnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "1.5px solid #8F8362",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "12px",
  transition: "all 0.2s ease",
  backgroundColor: "transparent",
};

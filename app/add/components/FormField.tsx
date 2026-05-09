"use client";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

// ✅ ต้องมีคำว่า default ตรงนี้ครับ
export default function FormField({ label, children }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8F8362' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
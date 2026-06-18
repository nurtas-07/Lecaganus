export function LiquidGlass({ as: Tag = "section", className = "", children, intense = false }) {
  return (
    <Tag className={`glass ${intense ? "glass-intense" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

export function LogoMark() {
  return (
    <div className="logo-mark" aria-label="Mentoria Hub">
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path className="logo-cap" d="M32 7 58 18.5 32 30 6 18.5 32 7Z" />
        <path className="logo-book left" d="M12 27.5c7.6.8 13.8 3.2 18.7 7.3v18.5c-5.4-4.5-11.7-7.1-18.7-7.8v-18Z" />
        <path className="logo-book right" d="M52 27.5c-7.6.8-13.8 3.2-18.7 7.3v18.5c5.4-4.5 11.7-7.1 18.7-7.8v-18Z" />
        <path className="logo-spine" d="M32 31.5v22" />
      </svg>
    </div>
  );
}

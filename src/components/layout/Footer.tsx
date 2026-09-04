export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-border px-6 py-4 mt-auto">
      <p className="text-center text-[10px] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        © {year} Iridium. Todos los derechos reservados.
      </p>
    </footer>
  );
}

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-white text-md font-medium">
            Releef
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

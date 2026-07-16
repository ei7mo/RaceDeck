import { Rajdhani } from "next/font/google";
import Link from "next/link";

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

function Navbar() {
  return (
    <header className="sticky top-0 z-20">
      <nav
        className={`text-center p-4 ${rajdhani.className} border-b-2 border-border bg-nav`}
      >
        <Link href="/" className="text-f1-red text-3xl cursor-pointer">
          RaceDeck
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;

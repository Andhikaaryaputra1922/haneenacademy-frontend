"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useLegalModal } from "@/shared/components/providers/LegalModalProvider";
import Link from "next/link";
import ShapeGrid from "@/shared/components/ui/ShapeGrid";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const { showSyarat, showPrivasi } = useLegalModal();

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        .auth-input {
          width: 100%;
          background: #f8f9fb;
          border: 1.5px solid #e8eaf0;
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #0B213F;
          transition: all 0.2s ease;
          outline: none;
        }
        .auth-input::placeholder { color: #b0b8c8; }
        .auth-input:focus {
          border-color: #D4AF37;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }
        .auth-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #8892a4;
          margin-bottom: 7px;
        }
        .auth-btn-primary {
          width: 100%;
          background: #0B213F;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-btn-primary:hover { background: #0d2847; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(11,33,63,0.2); }
        .auth-btn-primary:active { transform: translateY(0); }
        .auth-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0f2f8 0%, #f8f6f0 100%)" }}
      >
        {/* Animated background shape grid */}
        <div className="absolute inset-0 z-0">
          <ShapeGrid
            speed={0.3}
            squareSize={36}
            direction="diagonal"
            borderColor="rgba(11,33,63,0.03)"
            hoverFillColor="rgba(212,175,55,0.08)"
            shape="hexagon"
            hoverTrailAmount={6}
          />
        </div>

        {/* Subtle background blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(11,33,63,0.06) 0%, transparent 70%)" }} />

        {/* Logo */}
        <Link href="/" className="mb-4 flex flex-col items-center justify-center overflow-hidden h-20">
          <img
            src="/images/logo.svg"
            alt="Haneen Academy"
            style={{ 
              height: "420px", 
              width: "auto", 
              marginTop: "-10px",
              marginBottom: "-10px",
              filter: "brightness(0) saturate(0) brightness(0.2)" 
            }}
          />
        </Link>

        {/* Children content wrapper */}
        {children}

        {/* Footer */}
        <p className="mt-8 text-center" style={{ fontSize: "11px", color: "#b0b8c8", lineHeight: 1.6 }}>
          © 2026 Haneen Academy ·{" "}
          <button onClick={showSyarat} className="hover:text-[#0B213F] transition-colors bg-transparent border-none cursor-pointer p-0"
            style={{ fontSize: "11px", color: "#b0b8c8", fontWeight: 600 }}>
            Syarat & Ketentuan
          </button>
          {" · "}
          <button onClick={showPrivasi} className="hover:text-[#0B213F] transition-colors bg-transparent border-none cursor-pointer p-0"
            style={{ fontSize: "11px", color: "#b0b8c8", fontWeight: 600 }}>
            Kebijakan Privasi
          </button>
        </p>
      </main>
    </GoogleOAuthProvider>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import StudentChecker from "./StudentChecker";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={28}
            height={28}
            className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform"
          />
          <span className="text-xl font-bold font-serif">Carolline</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline-block"
          >
            Features
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline-block"
          >
            Contact
          </Link>
          <StudentChecker
            title="Let's See if You are a Student"
            description="Please enter your email to check your student status."
            triggerText="Chat"
            className="py-10"
          />
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}

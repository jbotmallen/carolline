"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StudentChecker from "../layout/StudentChecker";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-medium inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Student Assistant
          </Badge>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif tracking-tight">
            Meet{" "}
            <span className="text-primary inline-flex items-center gap-2">
              Carolline
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"
                />
              </motion.span>
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto">
            Your intelligent guide to student handbooks, policies, and school
            resources
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Get instant, accurate answers to all your questions about school
          policies, rules, and procedures. Powered by advanced AI and RAG
          technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <StudentChecker
            title="Let's See if You are a Student"
            description="Please enter your email to check your student status."
            triggerText="Get Started"
            className="py-6 px-8 text-lg font-medium"
            triggerClassName="h-12 px-8 text-lg font-medium"
          />
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 hover:text-primary-foreground"
          >
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
        >
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Always Available
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">
              Instant
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Response Time
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Accurate Info
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

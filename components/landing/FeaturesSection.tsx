"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Zap,
  Shield,
  Clock,
  Search,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description:
      "Chat naturally with Carolline as if talking to a friendly advisor. Ask questions in your own words.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Advanced RAG technology searches through handbooks and policies to find exactly what you need.",
  },
  {
    icon: Zap,
    title: "Instant Answers",
    description:
      "Get accurate responses in seconds. No more scrolling through lengthy PDFs or documents.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Access information anytime, anywhere. Carolline never sleeps and is always ready to help.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Knowledge",
    description:
      "Trained on complete student handbooks, rulebooks, and all official school documentation.",
  },
  {
    icon: Shield,
    title: "Reliable & Accurate",
    description:
      "Every answer is sourced directly from official documents, ensuring trustworthy information.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif">
            Why Choose Carolline?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed to make your student life easier with intelligent,
            accessible, and accurate information at your fingertips.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the future of student support?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/chat"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Carolline Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

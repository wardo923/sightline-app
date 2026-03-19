"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What instruments does SightLine scan?",
    answer: "SPY, QQQ, BTC, ETH, SOL, and other major instruments. You choose your universe during setup and can change it anytime.",
  },
  {
    question: "Does SightLine place trades?",
    answer: "No. SightLine delivers structured alerts only. It does not connect to any brokerage, execute orders, or manage positions. You maintain full control.",
  },
  {
    question: "Do I need trading experience?",
    answer: "Every alert includes a defined Entry, Stop, and Target. No indicator interpretation. No trendline drawing. The system does the analysis. You make the call.",
  },
  {
    question: "How are alerts delivered?",
    answer: "Email, push notification, or SMS depending on your plan. Pro and Elite receive real-time push alerts the moment a setup is identified.",
  },
  {
    question: "What is the Strategy Wizard?",
    answer: "A 7-step onboarding flow. Markets, behavior, pattern style, activity level, timeframe, alert hours, risk tolerance. Under 2 minutes. Reconfigure anytime.",
  },
  {
    question: "What happens after the free trial?",
    answer: "Choose a plan. If you don't subscribe, your account pauses. No hidden charges. No automatic billing.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel from your account settings instantly. No contracts. No fees. No retention calls.",
  },
]

export function FaqSection() {
  return (
    <section className="section-glow-top py-24 md:py-32" id="faq">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Straight answers.
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-14">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

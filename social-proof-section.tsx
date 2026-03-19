import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "SightLine helped me stop guessing entries. The structured approach makes it easier to stay disciplined.",
    author: "Marcus T.",
    role: "Developing Trader",
  },
  {
    quote: "The trade validity alerts are what make it different. Knowing when a setup weakens helps me manage risk better.",
    author: "Sarah K.",
    role: "Active Trader",
  },
  {
    quote: "The wizard makes it easy to get setups that match how I trade. No more sifting through random signals.",
    author: "James R.",
    role: "Experienced Trader",
  },
]

export function SocialProofSection() {
  return (
    <section className="section-glow-top py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Built for Real Traders
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-glow group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/30"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <Quote className="mb-5 h-8 w-8 text-primary/40" />
              
              <p className="flex-1 text-base leading-relaxed text-foreground italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              
              <div className="mt-6 border-t border-border/50 pt-5">
                <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

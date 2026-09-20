export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border border-sand-200 bg-gradient-to-br from-leaf-50 via-white to-sand-50 p-8 mb-6">
        <h1 className="text-3xl font-semibold text-soil-900 tracking-tight">How It Works</h1>
        <p className="mt-2 text-sand-700">Get started in a few easy steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Create an account', desc: 'Sign up and set your preferences.' },
          { title: 'List your books', desc: 'Add books you want to trade or donate.' },
          { title: 'Browse & request', desc: 'Find matches and send requests.' },
          { title: 'Exchange sustainably', desc: 'Meet locally or ship responsibly.' },
        ].map((step, idx) => (
          <div key={idx} className="rounded-xl border border-sand-200 bg-white p-6 shadow-subtle">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-medium">{idx + 1}</div>
            <h3 className="mt-3 font-semibold text-soil-900">{step.title}</h3>
            <p className="mt-1 text-sm text-sand-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}



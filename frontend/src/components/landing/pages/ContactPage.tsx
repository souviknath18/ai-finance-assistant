"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function ContactPage() {
  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-[#dfe9fb] bg-white px-3.5 text-[12px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#9aa1b5] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";

  return (
    <main className="min-h-screen bg-[#f8faff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <MessageCircle size={18} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Contact Aura
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
            We&apos;d be happy to hear from you
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
            Send us your questions, feedback, support requests, or product
            suggestions and we&apos;ll help you with your Aura Finance
            experience.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left */}
          <div className="space-y-4">
            {/* Help Card */}
            <article className="relative overflow-hidden rounded-3xl bg-black p-5 text-white shadow-[0_14px_36px_rgba(15,23,42,0.16)] sm:p-6">
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-emerald-300">
                  <Sparkles size={17} />
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                  Aura Support
                </p>

                <h2 className="mt-1.5 text-[20px] font-bold tracking-tight sm:text-[23px]">
                  How can we help?
                </h2>

                <p className="mt-3 text-[12px] leading-6 text-[#b7c0d4]">
                  Contact us about account access, financial connections, transaction
                  processing, document imports, technical issues, feature suggestions,
                  or general product questions.
                </p>
              </div>

              <MessageCircle
                size={140}
                className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.04]"
              />
            </article>

            {/* Email Support */}
            <article className="rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#7c839b]">
                    Email Support
                  </p>

                  <h3 className="mt-1 text-[14px] font-bold text-black">
                    Need direct assistance?
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#565e74]">
                    Add your official support email before launching the
                    application publicly.
                  </p>

                  <p className="mt-3 text-[11px] font-bold text-emerald-700">
                    support@aurafinance.example
                  </p>
                </div>
              </div>
            </article>

            {/* Help Note */}
            <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                Helpful Tip
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-[#565e74]">
                For technical issues, include what you were doing, what you
                expected to happen, and any error message you saw.
              </p>
            </article>
          </div>

          {/* Contact Form */}
          <article className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
            {submitted ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={22} />
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                  Message Submitted
                </p>

                <h2 className="mt-1.5 text-[21px] font-bold tracking-tight text-black">
                  Message received
                </h2>

                <p className="mt-3 max-w-md text-[12px] leading-6 text-[#565e74]">
                  This form is currently a frontend preview. Connect it to your
                  backend or email provider before production launch.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSubmitted(false)
                  }
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[11px] font-bold text-white transition hover:opacity-90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                    Get in Touch
                  </p>

                  <h2 className="mt-1 text-[20px] font-bold tracking-tight text-black sm:text-[22px]">
                    Send a message
                  </h2>

                  <p className="mt-2 text-[11px] leading-5 text-[#565e74] sm:text-[12px]">
                    Tell us what you need help with and provide as much detail
                    as possible.
                  </p>
                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="mt-6 space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Enter your name"
                        className={
                          inputClass
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@example.com"
                        className={
                          inputClass
                        }
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="How can we help?"
                      className={
                        inputClass
                      }
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Describe your question or issue"
                      className="mt-1.5 w-full resize-none rounded-xl border border-[#dfe9fb] bg-white px-3.5 py-3 text-[12px] leading-5 text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#9aa1b5] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.16)]"
                  >
                    Send Message
                    <Send size={13} />
                  </button>
                </form>
              </>
            )}
          </article>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
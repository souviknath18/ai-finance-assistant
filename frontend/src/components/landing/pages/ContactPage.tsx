"use client";

import { FormEvent, useState } from "react";
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
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <MessageCircle size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Contact Us
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
            We would be happy to hear from you
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Send us your questions, feedback or support requests and we will
            help you with your Aura Finance experience.
          </p>
        </div>
      </section>

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5">
            <article className="rounded-3xl border border-[#dce9ff] bg-[#131b2e] p-6 text-white shadow-sm sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#89f5e7]">
                <Sparkles size={20} />
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                How can we help?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#a5aec4]">
                Contact us about account access, document processing, feature
                suggestions, technical problems or general product questions.
              </p>
            </article>

            <article className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
                  <Mail size={19} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black">
                    Email Support
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#565e74]">
                    Add your official support email here before launching the
                    application publicly.
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#006a61]">
                    support@aurafinance.example
                  </p>
                </div>
              </div>
            </article>
          </div>

          <article className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#89f5e7]/25 text-[#006a61]">
                  <CheckCircle2 size={28} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-black">
                  Message received
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#565e74]">
                  This form is currently a frontend preview. Connect it to your
                  backend or email provider before production launch.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-black">
                  Send a message
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#565e74]">
                  Complete the form below and provide as much detail as
                  possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-black"
                      >
                        Full name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your name"
                        className="mt-2 w-full rounded-xl border border-[#dce9ff] bg-[#f8f9ff] px-4 py-3 text-sm text-black outline-none transition placeholder:text-[#9aa1b5] focus:border-[#006a61]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-black"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="mt-2 w-full rounded-xl border border-[#dce9ff] bg-[#f8f9ff] px-4 py-3 text-sm text-black outline-none transition placeholder:text-[#9aa1b5] focus:border-[#006a61]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-black"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="How can we help?"
                      className="mt-2 w-full rounded-xl border border-[#dce9ff] bg-[#f8f9ff] px-4 py-3 text-sm text-black outline-none transition placeholder:text-[#9aa1b5] focus:border-[#006a61]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-black"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Describe your question or issue"
                      className="mt-2 w-full resize-none rounded-xl border border-[#dce9ff] bg-[#f8f9ff] px-4 py-3 text-sm leading-6 text-black outline-none transition placeholder:text-[#9aa1b5] focus:border-[#006a61]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#006a61] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005049]"
                  >
                    Send Message
                    <Send size={16} />
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
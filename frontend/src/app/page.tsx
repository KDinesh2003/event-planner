import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#fff7f9] text-[#1a1a1a] font-[family-name:var(--font-geist-sans)] px-6 sm:px-20 py-16 flex flex-col gap-20">
      {/* Hero Section */}
      <main className="text-center flex flex-col gap-8 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#c2185b]">
          Welcome to Events Hub
        </h1>
        <p className="text-lg sm:text-xl text-[#333333]">
          One platform for students and organizers to create, explore, and register for all campus happenings. Fast, intuitive, and built for campus life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <Link
            href="/pages/auth/student-register"
            className="rounded-full bg-[#c2185b] hover:bg-[#a3154e] text-white font-semibold text-base px-6 py-3 transition-all shadow-md"
          >
            Register as Student
          </Link>
          <Link
            href="/pages/auth/organizer-register"
            className="rounded-full border-2 border-[#c2185b] text-[#c2185b] hover:bg-[#fce4ec] font-semibold text-base px-6 py-3 transition-all shadow-md"
          >
            Register as Organizer
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="grid sm:grid-cols-3 gap-6 text-center">
        {[
          {
            title: "Discover Events",
            desc: "Explore a variety of events happening around your campus – from tech to cultural fests.",
          },
          {
            title: "Manage Effortlessly",
            desc: "Organizers can create, edit, and manage events easily with intuitive tools.",
          },
          {
            title: "Track Registrations",
            desc: "Students can keep track of registered events and organizers can view participants.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <h3 className="text-[#c2185b] font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-[#555555]">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#c2185b] mb-6">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {[
            {
              step: "1. Register",
              desc: "Sign up as a student or organizer to unlock full features of the app.",
            },
            {
              step: "2. Explore / Create",
              desc: "Students browse upcoming events. Organizers create and manage events.",
            },
            {
              step: "3. Attend & Enjoy",
              desc: "Participate, engage, and make the most of your campus journey!",
            },
          ].map((item, i) => (
            <div key={i}>
              <h4 className="font-semibold text-lg text-[#c2185b] mb-1">{item.step}</h4>
              <p className="text-sm text-[#555555]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-center text-[#777] border-t border-[#e4c6ce] pt-6">
        © 2025 Events Hub
      </footer>
    </div>
  );
}

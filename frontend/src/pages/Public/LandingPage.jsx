import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  BookOpen,
  Users,
  BarChart3,
  ChevronRight,
  Star,
  GraduationCap,
  Trophy,
  Target,
  Quote,
  Menu,
  X
} from "lucide-react";

const LandingPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!loading && user) {
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }
  const scrollTo = (id) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0b0c10] min-h-screen text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 py-4 px-6 md:px-12 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => scrollTo("hero")}
        >
          <BookOpen className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Delta Institute
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => scrollTo("about")}
            className="hover:text-white transition-colors"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="hover:text-white transition-colors"
          >
            Our Services
          </button>
          <button
            onClick={() => scrollTo("testimonials")}
            className="hover:text-white transition-colors"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollTo("success")}
            className="hover:text-white transition-colors"
          >
            Success Stories
          </button>
        </div>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full bg-indigo-600/20 text-indigo-400 font-semibold hover:bg-indigo-600/30 transition-all border border-indigo-500/30 text-sm"
          >
            Portal Login
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-[#0b0c10]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => scrollTo("about")} className="text-2xl font-medium text-slate-300 hover:text-white">About Us</button>
        <button onClick={() => scrollTo("services")} className="text-2xl font-medium text-slate-300 hover:text-white">Our Services</button>
        <button onClick={() => scrollTo("testimonials")} className="text-2xl font-medium text-slate-300 hover:text-white">Testimonials</button>
        <button onClick={() => scrollTo("success")} className="text-2xl font-medium text-slate-300 hover:text-white">Success Stories</button>
        <Link to="/login" className="mt-4 px-8 py-3 rounded-full bg-indigo-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/30" onClick={() => setIsMenuOpen(false)}>
          Portal Login
        </Link>
      </div>

      <div className="pt-24 space-y-32 pb-32">
        {/* --- HERO SECTION --- */}
        <section
          id="hero"
          className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />

          <h1 className="z-10 text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight mt-12 max-w-5xl">
            Shaping the Minds
            <br />
            of Tomorrow
          </h1>
          <p className="z-10 text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed">
            Leading tuition institute dedicated to academic excellence. Manage
            student progress, track attendance, and analyze performance
            effortlessly.
          </p>

          <Link
            to="/login"
            className="z-10 group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:-translate-y-1"
          >
            <span>Student & Admin Portal</span>
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* --- ABOUT US --- */}
        <section id="about" className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-2">
                About Delta Institute
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                A Legacy of Educational{" "}
                <span className="text-blue-400">Excellence</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                For over a decade, Delta Institute has been at the forefront of
                providing quality education and personalized tutoring. We
                believe that every student has untapped potential waiting to be
                discovered.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Our approach blends traditional teaching methodologies with
                modern tracking, ensuring parents, students, and educators are
                perfectly aligned on the learning journey.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border-l-2 border-indigo-500 pl-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    5000+
                  </div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">
                    Students Taught
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="text-3xl font-bold text-white mb-1">98%</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-linear-to-br from-indigo-900/40 to-blue-900/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
                <img
                  src=""
                  alt=" Image of Director"
                  className="w-4/5 h-4/5 border border-amber-50"
                />
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- OUR SERVICES --- */}
        <section id="services" className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold text-sm mb-4">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Comprehensive Tracking
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Batch Management
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Streamline class schedules, categorize standard batches
                dynamically, and monitor collective batch performance from a
                single interface.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <BookOpen className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Live Attendance
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Keep parents informed with real-time attendance logs, historical
                absence tracking, and automated reporting systems.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
                <BarChart3 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Performance Analytics
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Generate dynamic marksheets, compare subject-wise progression
                over semesters, and identify areas requiring attention
                instantly.
              </p>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section
          id="testimonials"
          className="py-20 relative bg-black/40 border-y border-white/5"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm mb-4">
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                What Parents Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Jenkins",
                  role: "Parent of 10th Grader",
                  text: "The dedication of the teachers and the transparency of the app has made tracking my child's progress incredibly seamless.",
                },
                {
                  name: "Michael Chang",
                  role: "Parent of 12th Grader",
                  text: "Delta Institute completely transformed my son's approach to mathematics. The performance analytics helped focus on exactly what he needed.",
                },
                {
                  name: "Priya Sharma",
                  role: "Parent of 8th Grader",
                  text: "Knowing immediately if my daughter missed a class gives me peace of mind. The attendance tracking is a feature I genuinely appreciate.",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl relative"
                >
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                  <div className="flex text-amber-500 mb-6 gap-1">
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                  </div>
                  <p className="text-lg text-slate-300 mb-8 relative z-10 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <span className="text-slate-500 text-sm">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SUCCESS STORIES --- */}
        <section id="success" className="px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold text-sm mb-4">
                Results that Matter
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Student Success Stories
              </h2>
            </div>
            <p className="text-slate-400 max-w-md pb-2">
              Real achievements from students who pushed their boundaries with
              our guidance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                year: "2024",
                name: "Neha Gupta",
                grade: "99.4%",
                image: "https://i.pravatar.cc/150?img=5",
              },
              {
                year: "2024",
                name: "Rohan Desai",
                grade: "98.2%",
                image: "https://i.pravatar.cc/150?img=8",
              },
              {
                year: "2025",
                name: "Alex Thompson",
                grade: "97.8%",
                image: "https://i.pravatar.cc/150?img=11",
              },
              {
                year: "2025",
                name: "Priya Sharma",
                grade: "98.5%",
                image: "https://i.pravatar.cc/150?img=9",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative mb-6">
                  <div className="w-36 h-44 sm:w-40 sm:h-52 rounded-xl overflow-hidden border border-white/10 shadow-xl group-hover:border-indigo-500/50 transition-colors">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                    Class of {story.year}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {story.name}
                </h3>
                <div className="text-amber-400 font-extrabold text-3xl drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                  {story.grade}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-500/50" />
          <span className="font-bold tracking-tight text-white/50">
            Delta Institute
          </span>
        </div>
        <p className="mb-2">
          © {new Date().getFullYear()} Delta Institute App. All rights reserved.
        </p>
        <p className="text-sm text-slate-600">
          Made with ❤️ by{" "}
          <span className="text-indigo-400 font-medium"> KIKI Web-Tech</span>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

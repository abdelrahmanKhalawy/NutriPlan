import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = (delay = 0) => ({
    ref: (el) => revealRefs.current.push(el),
    className: 'reveal',
    style: { animationDelay: `${delay}s` },
  });

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .hero-mesh {
          background: linear-gradient(-45deg,#f8f9ff,#eff4ff,#f0fdf4,#f8f9ff);
          background-size: 400% 400%;
          animation: mesh 15s ease infinite;
          position: relative;
        }
        .hero-mesh::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(at 0% 0%, rgba(92,222,151,0.1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0,109,64,0.08) 0px, transparent 50%);
          pointer-events: none;
        }
        .reveal { opacity: 0; }
        .reveal.active {
          animation: fadeUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .nav-link { position: relative; }
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0; height: 2px;
          bottom: -4px; left: 0;
          background-color: #059669;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover::after { width: 100%; }
        .tilt-card {
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
          transform-style: preserve-3d;
        }
        .tilt-card:hover {
          transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02);
        }
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(40px) scale(0.98); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          0%   { opacity:0; }
          100% { opacity:1; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-20px); }
        }
        @keyframes mesh {
          0%   { background-position:0% 50%; }
          50%  { background-position:100% 50%; }
          100% { background-position:0% 50%; }
        }
        .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-float   { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/10">
        <div className="flex justify-between items-center h-24 px-8 md:px-16 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 animate-fade-in">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-emerald-600 hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}>
              NutriPlan
            </Link>
          </div>
          <div className="flex items-center gap-8 animate-fade-in">
            <Link to="/login"
                  className="nav-link text-slate-600 font-medium hover:text-emerald-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register"
                  className="bg-[#0b1c30] text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-emerald-900 hover:shadow-lg active:scale-95 duration-300">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex items-center pt-24">
        <section className="relative w-full overflow-hidden hero-mesh py-12 md:py-24">
          <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left */}
            <div className="space-y-10 z-10">
              <div {...reveal(0.1)}
                   className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700/5 text-emerald-700 border border-emerald-700/10"
                   style={{ animationDelay: '0.1s' }}>
                <span className="text-[10px] tracking-widest uppercase font-semibold"
                      style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  The Future of Wellness
                </span>
              </div>

              <h1 {...reveal(0.1)}
                  className="reveal text-5xl lg:text-7xl text-[#0b1c30] tracking-tight leading-[1.05]"
                  style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, animationDelay: '0.1s' }}
>
                Precision nutrition for{' '}
                <span className="text-emerald-700 italic inline-block hover:scale-105 transition-transform cursor-default">
                  longevity.
                </span>
              </h1>

              <p {...reveal(0.3)}
                 className="reveal text-lg text-[#3d4a40] max-w-lg leading-relaxed opacity-80"
                 style={{ fontFamily: 'Plus Jakarta Sans', animationDelay: '0.1s' }}
>
                Stop guessing. Start living. Elite wellness coaching combined with
                biological data to rewrite your health story.
              </p>

              <div {...reveal(0.5)}
                   className="reveal flex flex-wrap gap-6 pt-4"
                   style={{ animationDelay: '0.5s' }}>
                <Link to="/register"
                      className="px-10 py-5 bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-700/20 hover:bg-emerald-600 transition-all hover:-translate-y-1 active:scale-95">
                  Start Your Odyssey
                </Link>
              </div>

              <div {...reveal(0.5)}
                   className="reveal flex items-center gap-4 pt-12"
                   style={{ animationDelay: '0.5s' }}>
                <div className="flex -space-x-3">
                  {[
                    'AB6AXuAWY-FWxKb_CWmnKrW10goObfev2aRcYwF4y04FuGTslAWxMn8iuLbPQZ0dTnwARoIj-4Vo5hASb09cQ9m7Ga0rqWddyUDxP6E3KpTVChSAU3BWsY0cHqFemoCauJyAdazsYFrcH7Ww57nx1V0rPx822-zreb-VP2eGLYTL5JsIdGHpk0glo9HtA_j-NsarVGzPjuuKYJ35JSy_unVxxZfGo4RfCXBRkav2z3m-q2Kw2LvhJv05oRlpVZQCgJ32ug5c3RFV-KqeALhq',
                    'AB6AXuAj_MFq7vrgaEggldlg9NfMQKIJ0CJXG4DgWKnIRyKzTGLyUBoQm71BMudMw4pRn2L0n2sA1IL9xQnUvDlY57g0c4Ewy6FuX3F3Acsm94ch-OIBjKI9OEmmbb0bnZyG2dlfmcbyDTY7tF5fsQqP4O0pF85PEJvL-i_ez5IbP56zaM0JOcTQlpWGGEAT_mC96MB0tukyCMv0pihYSwXoz_-2jkD3HPFtv6UrIFL8ex3cOH20hvXANuRgEr074z_hpJ_ebudDsWxYeVdo',
                    'AB6AXuAI-ff6sNZO2XDd9YUUGLmsL2WjJ8vaOrD7OfVIokTel90Py2aYESQT8gXK41zBJyFqYNw-jvDsxmlw_DWI8Bs4mpBg_r07V5coEei-lzl2cESUXAgP9Vz-zyLxKLo2o9YbGlK2qWDHV97l-qXfGLs0GkpiQFps3qNClxA8Zsvk8dbX4RMFjXZy17slF-DyVczhskxzbPRF6S-zn3jVCq0cLd7lYmQwnAwtFFqLDLmKyljhQcdsviDyr-qyE6AGPunlTGljANWCkHrW',
                  ].map((id, i) => (
                    <img key={i}
                         alt="member"
                         className="w-10 h-10 rounded-full border-2 border-white object-cover grayscale hover:grayscale-0 hover:scale-125 hover:z-10 transition-all duration-500 cursor-pointer"
                         src={`https://lh3.googleusercontent.com/aida-public/${id}`} />
                  ))}
                </div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#3d4a40] opacity-60">
                  Trusted by 12,000+ members
                </p>
              </div>
            </div>

            {/* Right - image card */}
            <div className="relative animate-fade-in group hidden lg:block">
              <div className="animate-float">
                <div className="absolute -inset-10 bg-emerald-700/10 rounded-full blur-3xl group-hover:bg-emerald-700/20 transition-all duration-1000" />
                <div className="tilt-card relative aspect-square rounded-[60px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,109,64,0.15)] bg-white border border-white/40">
                  <img alt="vibrant healthy salad bowl"
                       className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3000ms] ease-out"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrZB5jmkHcHZWfELgRzYd09g5bB9iXFIQH5JwsPbZcnzmmdFH5eoAzyYT3Bq1aNNtsrSRa-LhZ8mkbnv4CWND6FyByAqQRJxJGttfFd5UjTUjJX6MUSeMia1ny9nANWRAxClFbILhQP6k4M7yLonna7cx3S-29a10r8zbmUiOgawbGnmmKE_63fqGk6n2xrg4_mniv1Oj6mkJTJmr2XOAqFR2dwRaBKRRbPUijwg5KaOKzB5LFLHDdPtGRf9pBdZdEJQjNDKNw-rzO" />
                  <div className="absolute bottom-10 left-10 right-10 glass-card p-8 rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-700 text-xl tracking-tight"
                            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                        Vitality Index
                      </span>
                      <span className="text-[#3d4a40] text-[10px] tracking-widest uppercase"
                            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                        Optimal
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-700 rounded-full transition-all duration-1000 delay-500 ease-out"
                           style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-white/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-100 pt-12">
          <div className="flex flex-col gap-1 items-center md:items-start group cursor-default">
            <span className="text-lg font-bold text-emerald-600 tracking-tighter group-hover:translate-x-1 transition-transform"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}>
              NutriPlan
            </span>
            <p className="text-[12px] text-slate-400">© 2025 NutriPlan. All rights reserved.</p>
          </div>
          <div className="flex gap-12">
            {['Privacy', 'Contact', 'Terms'].map((item) => (
              <a key={item} href="#"
                 className="nav-link text-[12px] uppercase tracking-widest font-semibold text-slate-500 hover:text-emerald-600 transition-all">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
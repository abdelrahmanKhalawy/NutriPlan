import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/authStore';

const BASE_URL = 'http://localhost:5016/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', remember: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (mode === 'login') {
      const res = await login({ email: form.email, password: form.password });
      if (res.success) navigate('/dashboard');
    } else {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      if (res.success) navigate('/health-profile');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setLocalError('');
      try {
        const res = await fetch(`${BASE_URL}/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) { setLocalError(data.message || 'Google login failed.'); return; }

        // حفظ في localStorage وـ store يدوياً
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
        useAuthStore.setState({ token: data.token, user: { name: data.name, email: data.email, role: data.role } });
        navigate('/dashboard');
      } catch {
        setLocalError('Google login failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setLocalError('Google login was cancelled or failed.'),
  });

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    clearError();
    setForm({ name: '', email: '', password: '', remember: false });
  };

  const displayError = localError || error;

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .mesh-gradient {
          background-color: #006d40;
          background-image:
            radial-gradient(at 0% 0%, hsla(152,100%,43%,1) 0, transparent 50%),
            radial-gradient(at 50% 0%, hsla(161,95%,70%,1) 0, transparent 50%),
            radial-gradient(at 100% 0%, hsla(197,85%,63%,1) 0, transparent 50%),
            radial-gradient(at 0% 100%, hsla(152,100%,43%,1) 0, transparent 50%);
        }
        .input-focus-glow:focus-within { box-shadow: 0 0 0 4px rgba(0,109,64,0.1); }
        .btn-hover-glow:hover { box-shadow: 0 0 20px rgba(0,109,64,0.3); transform: translateY(-1px) scale(1.01); }
        @keyframes fadeInUp {
          0%   { opacity:0; transform:translateY(20px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeInRight {
          0%   { opacity:0; transform:translateX(-20px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes blob {
          0%   { transform:translate(0,0) scale(1); }
          33%  { transform:translate(30px,-50px) scale(1.1); }
          66%  { transform:translate(-20px,20px) scale(0.9); }
          100% { transform:translate(0,0) scale(1); }
        }
        .animate-fade-in-up    { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-blob          { animation: blob 7s infinite; }
        .delay-1 { animation-delay:0.1s; }
        .delay-2 { animation-delay:0.2s; }
        .delay-3 { animation-delay:0.3s; }
      `}</style>

      <main className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 z-0 mesh-gradient">
          <img alt="Healthy lifestyle background"
               className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Y0xbB3fmH07MwkoUpF3rsI3Vrwg9vOPuYuuwjQrAQ0KbX1bpsdVbj9tzSdrPZZhTKbsH07ODIAsWbW6Jxwk6OlAz_XcXo0zkBz6vHFNVGfSSvzUI9SMdmCxDjVgvoIjNkdakcGMlZuR44nBXpWWuF_kHwZZlWaGEWX8KP1x2ZvOsXkJy8z7FWAV_JPMMGmYgsLqASJ600UMKvabmix-Pf96nZN1TsJIH81JpIfMHw4SpiYkeN9GEvd8A_g1lRuQwJLY3hNDwFaqA"/>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-[#5cde97] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-2" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-3" />
        </div>

        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 p-6 md:p-12">

          {/* Left branding */}
          <section className="hidden lg:flex flex-col flex-1 text-white animate-fade-in-right">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#006d40] shadow-xl">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings:"'FILL' 1" }}>eco</span>
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight" style={{ fontFamily:'Plus Jakarta Sans' }}>NutriPlan</h1>
              </div>
              <p className="text-xl opacity-90 max-w-lg leading-relaxed" style={{ fontFamily:'Inter' }}>
                Elevate your wellness journey with precision nutrition. Your personal concierge to vitality, backed by data and crafted with care.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl max-w-md">
              <div className="flex gap-1 mb-4 text-[#5cde97]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-lg italic mb-6 leading-relaxed" style={{ fontFamily:'Inter' }}>
                "Since joining NutriPlan, I've reclaimed my energy and finally understood what my body actually needs. It's life-changing."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full ring-2 ring-[#5cde97]/50 p-1">
                  <div className="w-full h-full rounded-full bg-[#5cde97]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">person</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#5cde97]" style={{ fontFamily:'Lexend' }}>Alex Sterling</p>
                  <p className="text-xs opacity-70">Gold Member since 2023</p>
                </div>
              </div>
            </div>
          </section>

          {/* Auth Card */}
          <section className="w-full max-w-lg animate-fade-in-up">
            <div className="glass p-8 md:p-12 rounded-2xl shadow-2xl">

              <div className="text-center mb-10">
                <div className="lg:hidden flex justify-center mb-6">
                  <span className="text-3xl font-extrabold text-[#006d40] tracking-tighter" style={{ fontFamily:'Plus Jakarta Sans' }}>NutriPlan</span>
                </div>
                <h2 className="text-3xl font-bold text-[#0b1c30] mb-2" style={{ fontFamily:'Plus Jakarta Sans' }}>
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-[#3d4a40] opacity-80" style={{ fontFamily:'Inter' }}>
                  {mode === 'login' ? 'Access your personalized health dashboard' : 'Start your wellness journey today'}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex p-1.5 bg-black/5 rounded-xl mb-10 ring-1 ring-black/5">
                <button onClick={() => switchMode('login')}
                        className={`flex-1 py-2.5 px-4 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${
                          mode === 'login' ? 'bg-white text-[#006d40] shadow-lg' : 'text-[#3d4a40] hover:text-[#0b1c30]'
                        }`} style={{ fontFamily:'Lexend' }}>
                  SIGN IN
                </button>
                <button onClick={() => switchMode('register')}
                        className={`flex-1 py-2.5 px-4 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${
                          mode === 'register' ? 'bg-white text-[#006d40] shadow-lg' : 'text-[#3d4a40] hover:text-[#0b1c30]'
                        }`} style={{ fontFamily:'Lexend' }}>
                  REGISTER
                </button>
              </div>

              {/* Error */}
              {displayError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {displayError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="space-y-2 group animate-fade-in-up delay-1">
                    <label className="text-[10px] font-bold text-[#3d4a40] uppercase tracking-widest ml-1" style={{ fontFamily:'Lexend' }} htmlFor="name">Full Name</label>
                    <div className="relative input-focus-glow transition-all duration-300 rounded-xl overflow-hidden border border-black/10 focus-within:border-[#006d40]">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4a40]/50">person</span>
                      <input className="w-full pl-12 pr-4 py-3.5 bg-white/50 focus:bg-white transition-all outline-none border-none text-[#0b1c30] placeholder:text-[#3d4a40]/30"
                             style={{ fontFamily:'Inter' }} id="name" type="text" placeholder="Ahmed Mohamed"
                             value={form.name} onChange={handleChange} required />
                    </div>
                  </div>
                )}

                <div className="space-y-2 group animate-fade-in-up delay-1">
                  <label className="text-[10px] font-bold text-[#3d4a40] uppercase tracking-widest ml-1" style={{ fontFamily:'Lexend' }} htmlFor="email">Email Address</label>
                  <div className="relative input-focus-glow transition-all duration-300 rounded-xl overflow-hidden border border-black/10 focus-within:border-[#006d40]">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4a40]/50">mail</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-white/50 focus:bg-white transition-all outline-none border-none text-[#0b1c30] placeholder:text-[#3d4a40]/30"
                           style={{ fontFamily:'Inter' }} id="email" type="email" placeholder="name@company.com"
                           value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2 group animate-fade-in-up delay-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-[#3d4a40] uppercase tracking-widest" style={{ fontFamily:'Lexend' }} htmlFor="password">Password</label>
                    {mode === 'login' && (
                      <a className="text-[10px] font-bold text-[#006d40] uppercase tracking-widest hover:underline" href="#">Forgot?</a>
                    )}
                  </div>
                  <div className="relative input-focus-glow transition-all duration-300 rounded-xl overflow-hidden border border-black/10 focus-within:border-[#006d40]">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4a40]/50">lock</span>
                    <input className="w-full pl-12 pr-12 py-3.5 bg-white/50 focus:bg-white transition-all outline-none border-none text-[#0b1c30] placeholder:text-[#3d4a40]/30"
                           style={{ fontFamily:'Inter' }} id="password" type={showPassword ? 'text' : 'password'}
                           placeholder="••••••••" value={form.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#3d4a40]/50 cursor-pointer hover:text-[#006d40] transition-colors">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center gap-2 px-1 animate-fade-in-up delay-3">
                    <input className="w-4 h-4 rounded-md border-black/10 text-[#006d40] focus:ring-[#006d40] focus:ring-offset-0 bg-white/50 cursor-pointer"
                           id="remember" type="checkbox" checked={form.remember} onChange={handleChange} />
                    <label className="text-xs font-medium text-[#3d4a40] cursor-pointer select-none" htmlFor="remember">Keep me logged in</label>
                  </div>
                )}

                <button type="submit" disabled={loading}
                        className="w-full py-4 bg-[#006d40] text-white font-bold rounded-xl transition-all duration-300 btn-hover-glow flex items-center justify-center gap-2 mt-8 animate-fade-in-up delay-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <span>Loading...</span> : (
                    <>
                      <span>{mode === 'login' ? 'Continue to Dashboard' : 'Create Account'}</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 mb-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/5"></div>
                  </div>
                  <span className="relative px-4 bg-transparent text-[10px] font-bold text-[#3d4a40] uppercase tracking-[0.2em]" style={{ fontFamily:'Lexend' }}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button onClick={() => googleLogin()} disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/50 hover:bg-white border border-black/10 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                {googleLoading ? (
                  <span className="text-sm font-bold text-[#0b1c30]" style={{ fontFamily:'Inter' }}>Connecting...</span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-bold text-[#0b1c30]" style={{ fontFamily:'Inter' }}>Continue with Google</span>
                  </>
                )}
              </button>

              <footer className="mt-8 text-center">
                <p className="text-[10px] text-[#3d4a40] font-medium leading-relaxed opacity-60">
                  By signing in, you agree to our <br/>
                  <a className="text-[#006d40] hover:underline font-bold" href="#">Terms of Service</a>
                  {' & '}
                  <a className="text-[#006d40] hover:underline font-bold" href="#">Privacy Policy</a>.
                </p>
              </footer>

            </div>
          </section>
        </div>
      </main>
    </>
  );
}
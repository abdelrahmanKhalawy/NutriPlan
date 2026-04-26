import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const BASE_URL = 'http://localhost:5016/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuthStore();

  const [meals, setMeals] = useState([]);
  const [progress, setProgress] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [today] = useState(1);
  const [eatenMeals, setEatenMeals] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const mealsRes = await fetch(`${BASE_URL}/mealplan/day/${today}`, { headers });
        if (mealsRes.ok) {
          const mealsData = await mealsRes.json();
          setMeals(mealsData.meals || []);
          setTotalCalories(mealsData.totalCalories || 0);
        }

        const progressRes = await fetch(`${BASE_URL}/progress/summary`, { headers });
        if (progressRes.ok) {
          const pd = await progressRes.json();
          if (pd.currentWeight !== undefined) {
            setProgress({
              ...pd,
              currentWeight: Number(pd.currentWeight) || 0,
              totalChange: Number(pd.totalChange) || 0,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, today]);

  const toggleEaten = (mealId) => {
    setEatenMeals((prev) => {
      const next = new Set(prev);
      if (next.has(mealId)) next.delete(mealId);
      else next.add(mealId);
      return next;
    });
  };

  const getMealsByType = (type) => meals.filter((m) => m.mealType === type);

  // Total macros from plan (= daily target for this user)
  const totalProtein = Number(meals.reduce((s, m) => s + m.protein, 0).toFixed(1));
  const totalCarbs   = Number(meals.reduce((s, m) => s + m.carbs, 0).toFixed(1));
  const totalFat     = Number(meals.reduce((s, m) => s + m.fat, 0).toFixed(1));

  // Consumed macros (eaten meals only)
  const eatenList        = meals.filter((m) => eatenMeals.has(m.mealPlanId));
  const consumedCalories = eatenList.reduce((s, m) => s + m.calories, 0);
  const consumedProtein  = Number(eatenList.reduce((s, m) => s + m.protein, 0).toFixed(1));
  const consumedCarbs    = Number(eatenList.reduce((s, m) => s + m.carbs, 0).toFixed(1));
  const consumedFat      = Number(eatenList.reduce((s, m) => s + m.fat, 0).toFixed(1));

  // Percentages based on today's plan (not fixed targets)
  const proteinPct = totalProtein > 0 ? Math.min(100, Math.round((consumedProtein / totalProtein) * 100)) : 0;
  const carbsPct   = totalCarbs   > 0 ? Math.min(100, Math.round((consumedCarbs   / totalCarbs)   * 100)) : 0;
  const fatPct     = totalFat     > 0 ? Math.min(100, Math.round((consumedFat     / totalFat)     * 100)) : 0;

  const circumference = 2 * Math.PI * 70;
  const calPct        = totalCalories > 0 ? Math.min(1, consumedCalories / totalCalories) : 0;
  const strokeOffset  = circumference * (1 - calPct);

  const getFoodImage = (foodName, mealType) => {
  const name = foodName.toLowerCase();
  if (name.includes('beef') || name.includes('steak') || name.includes('meat'))
    return 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80';
  if (name.includes('chicken') || name.includes('poultry'))
    return 'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?w=400&q=80';
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('soup') || name.includes('broth'))
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80';
  if (name.includes('egg'))
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80';
  if (name.includes('banana') || name.includes('fruit') || name.includes('berry'))
    return 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80';
  if (name.includes('rice') || name.includes('pasta') || name.includes('bread') || name.includes('grain'))
    return 'https://images.unsplash.com/photo-1536304993881-ff86e0c9af47?w=400&q=80';
  if (name.includes('salad') || name.includes('vegetable') || name.includes('broccoli') || name.includes('spinach'))
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80';
  if (name.includes('yogurt') || name.includes('milk') || name.includes('cheese') || name.includes('dairy'))
    return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80';
  if (name.includes('oat') || name.includes('cereal') || name.includes('granola'))
    return 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80';
  const defaults = {
    Breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80',
    Lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    Dinner:    'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80',
    Snack:     'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80',
  };
  return defaults[mealType] || defaults.Lunch;
};

  return (
    <>
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { background-color: #f8f9ff; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col p-4 gap-2 h-screen w-64 border-r border-slate-200 bg-[#F8FAFC] sticky top-0">
          <div className="px-4 py-6 mb-4">
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>NutriPlan</h1>
            <p className="text-xs text-slate-500">Health Concierge</p>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {[
              { icon: 'grid_view',      label: 'Overview', active: true,  path: '/dashboard' },
              { icon: 'restaurant',     label: 'My Meals', active: false, path: '/meal-plan' },
              { icon: 'monitoring',     label: 'Progress', active: false, path: '/progress'  },
              { icon: 'payments',       label: 'Billing',  active: false, path: '/billing'   },
              { icon: 'account_circle', label: 'Profile',  active: false, path: '/profile'   },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-transform duration-200 hover:translate-x-1 w-full text-left ${
                        item.active ? 'bg-[#2BB673]/10 text-[#2BB673]' : 'text-slate-600 hover:bg-slate-200/50'
                      }`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto p-4 bg-[#2bb673]/10 rounded-xl border border-[#2bb673]/20">
            <p className="text-xs font-semibold text-[#006d40] mb-2">Upgrade to Pro</p>
            <p className="text-[10px] text-[#3d4a40] mb-3 leading-relaxed">Get personalized coach and deep metabolic insights.</p>
            <button onClick={() => navigate('/billing')}
                    className="w-full bg-[#2bb673] text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">

          {/* Top Nav */}
          <header className="flex justify-between items-center h-16 px-6 sticky top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
            <div className="flex items-center gap-8">
              <span className="text-xl font-extrabold text-[#2BB673] tracking-tighter" style={{ fontFamily: 'Plus Jakarta Sans' }}>NutriPlan</span>
              <nav className="hidden lg:flex items-center gap-6">
                {[
                  { label: 'Dashboard', path: '/dashboard', active: true  },
                  { label: 'Meal Plan', path: '/meal-plan', active: false },
                  { label: 'Progress',  path: '/progress',  active: false },
                ].map((item) => (
                  <button key={item.label} onClick={() => navigate(item.path)}
                          className={`text-sm font-medium tracking-tight ${
                            item.active ? 'text-[#2BB673] font-semibold border-b-2 border-[#2BB673] pb-4 mt-4' : 'text-slate-500 hover:text-[#2BB673] transition-colors'
                          }`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-[#2bb673] transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button onClick={() => { logout(); navigate('/login'); }}
                      className="text-slate-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">logout</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-[#2bb673] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="p-8 md:p-10 flex-1">
            <div className="max-w-7xl mx-auto space-y-10">

              {/* Welcome */}
              <div>
                <p className="text-[#006d40] text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: 'Lexend' }}>Daily Overview</p>
                <h2 className="text-4xl font-bold text-[#0b1c30]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                </h2>
                <p className="text-lg text-[#3d4a40] mt-2" style={{ fontFamily: 'Inter' }}>
                  {loading ? 'Loading your plan...' : `Day ${today} — ${meals.length} meals planned · ${eatenMeals.size} eaten`}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24 text-center">
                  <div>
                    <span className="material-symbols-outlined text-5xl text-[#006d40]"
                          style={{ display: 'block', animation: 'spin 1s linear infinite' }}>refresh</span>
                    <p className="mt-4 text-[#3d4a40]">Loading your nutrition data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Macros Card */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-50">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-[#0b1c30]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Today's Macros</h3>
                        <span className="text-sm text-slate-400 font-medium">
                          {consumedCalories} / {totalCalories} kcal consumed
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Calories Circle */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                              <circle cx="80" cy="80" fill="transparent" r="70" stroke="#2bb67320" strokeWidth="12" />
                              <circle cx="80" cy="80" fill="transparent" r="70" stroke="#2bb673" strokeWidth="12"
                                      strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0b1c30]" style={{ fontFamily: 'Lexend' }}>{consumedCalories}</span>
                              <span className="text-xs font-semibold text-slate-400 uppercase">kcal eaten</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 text-center">
                            {totalCalories - consumedCalories > 0
                              ? `${totalCalories - consumedCalories} kcal remaining`
                              : '🎯 Daily target reached!'}
                          </p>
                        </div>

                        {/* Macro Bars — dynamic based on today's plan */}
                        <div className="space-y-6 flex flex-col justify-center">
                          {[
                            { label: 'Protein', consumed: consumedProtein, target: totalProtein, pct: proteinPct },
                            { label: 'Carbs',   consumed: consumedCarbs,   target: totalCarbs,   pct: carbsPct  },
                            { label: 'Fats',    consumed: consumedFat,     target: totalFat,     pct: fatPct    },
                          ].map((m) => (
                            <div key={m.label} className="space-y-2">
                              <div className="flex justify-between text-sm font-semibold">
                                <span className="text-slate-600">{m.label}</span>
                                <span className="text-[#0b1c30]">{m.consumed}g / {m.target}g</span>
                              </div>
                              <div className="h-3 w-full bg-[#2bb673]/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#2bb673] rounded-full transition-all duration-600"
                                     style={{ width: `${m.pct}%` }} />
                              </div>
                              <p className="text-[10px] text-slate-400 text-right">{m.pct}% of today's plan</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weight Trend */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col">
                      <h3 className="text-xl font-semibold text-[#0b1c30] mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>Weight Trend</h3>
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="w-full h-32 flex items-end justify-between gap-1 mb-6">
                          {[80, 85, 75, 90, 95, 70, 65].map((h, i) => (
                            <div key={i} className="w-full rounded-t-lg bg-slate-100"
                                 style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="text-center">
                          {progress && progress.currentWeight > 0 ? (
                            <>
                              <span className="text-2xl font-bold text-[#006d40]" style={{ fontFamily: 'Lexend' }}>
                                {progress.currentWeight} kg
                              </span>
                              <p className="text-sm text-[#3d4a40] font-medium flex items-center justify-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[#006d40] text-sm">
                                  {progress.totalChange <= 0 ? 'trending_down' : 'trending_up'}
                                </span>
                                {Math.abs(progress.totalChange)} kg {progress.totalChange <= 0 ? 'lost' : 'gained'} total
                              </p>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-slate-400">No progress logged yet</p>
                              <button onClick={() => navigate('/progress')}
                                      className="text-xs font-bold text-[#006d40] hover:underline">
                                Log your first weigh-in →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Today's Meals */}
                    <div className="lg:col-span-12">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#0b1c30]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Today's Meal Plan</h3>
                          <p className="text-xs text-slate-400 mt-1">Tap the ✓ button after eating a meal to track your intake</p>
                        </div>
                        <button onClick={() => navigate('/meal-plan')}
                                className="text-sm font-bold text-[#006d40] hover:underline">
                          View Full Plan →
                        </button>
                      </div>

                      {meals.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                          <span className="material-symbols-outlined text-4xl text-slate-300">restaurant</span>
                          <p className="mt-4 text-slate-400">No meals found for today.</p>
                          <button onClick={() => navigate('/health-profile')}
                                  className="mt-4 text-sm font-bold text-[#006d40] hover:underline block mx-auto">
                            Set up your health profile →
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {['Breakfast', 'Lunch', 'Dinner'].map((type) => {
                            const typeMeals = getMealsByType(type);
                            if (typeMeals.length === 0) return null;
                            const meal = typeMeals[0];
                            const eaten = eatenMeals.has(meal.mealPlanId);
                            return (
                              <div key={type}
                                   className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
                                     eaten ? 'border-[#2bb673]/40 ring-2 ring-[#2bb673]/20' : 'border-slate-100'
                                   }`}>
                                <div className="relative h-48">
                                  <img className={`w-full h-full object-cover transition-all duration-300 ${eaten ? 'opacity-60' : ''}`}
                                       alt={meal.foodName} src={getFoodImage(meal.foodName, type)} />
                                  {eaten && (
                                    <div className="absolute inset-0 bg-[#2bb673]/10 flex items-center justify-center">
                                      <div className="bg-[#2bb673] rounded-full p-3">
                                        <span className="material-symbols-outlined text-white text-2xl"
                                              style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight text-[#0b1c30]">
                                    {type}
                                  </div>
                                  <button onClick={() => toggleEaten(meal.mealPlanId)}
                                          className={`absolute bottom-4 right-4 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                                            eaten ? 'bg-[#2bb673] text-white scale-110' : 'bg-white text-[#2bb673] hover:bg-[#2bb673] hover:text-white hover:scale-110'
                                          }`}
                                          title={eaten ? 'Mark as not eaten' : 'Mark as eaten'}>
                                    <span className="material-symbols-outlined text-xl"
                                          style={{ fontVariationSettings: eaten ? "'FILL' 1" : "'FILL' 0" }}>
                                      {eaten ? 'check_circle' : 'add_circle'}
                                    </span>
                                  </button>
                                </div>
                                <div className="p-6">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-[#0b1c30]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{meal.foodName}</h4>
                                    {eaten && (
                                      <span className="text-[10px] font-bold text-[#2bb673] bg-[#2bb673]/10 px-2 py-0.5 rounded-full shrink-0">Eaten ✓</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 bg-[#006d40]/5 text-[#006d40] text-[10px] font-bold rounded">
                                      {meal.protein.toFixed(1)}g Protein
                                    </span>
                                    <span className="px-2 py-0.5 bg-[#006d40]/5 text-[#006d40] text-[10px] font-bold rounded">
                                      {meal.carbs.toFixed(1)}g Carbs
                                    </span>
                                  </div>
                                  <div className="mt-4 flex justify-between items-center text-slate-400 text-xs">
                                    <span>{meal.calories} kcal</span>
                                    <span>{meal.fat.toFixed(1)}g Fat</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>
          </main>

          <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full gap-4">
              <p className="text-xs text-slate-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>© 2025 NutriPlan. Clarity through Nutrition.</p>
              <div className="flex gap-6">
                {['Privacy Policy', 'Terms', 'Support', 'Blog'].map((l) => (
                  <a key={l} href="#" className="text-xs text-slate-400 hover:text-slate-900 underline transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
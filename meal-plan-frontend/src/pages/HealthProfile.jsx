import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const BASE_URL = 'http://localhost:5016/api';

const ALLERGIES = ['gluten', 'dairy', 'nuts', 'fish', 'eggs', 'soy'];
const ALLERGY_LABELS = { gluten: 'Gluten Free', dairy: 'Dairy Free', nuts: 'Nut Allergy', fish: 'Fish', eggs: 'Eggs', soy: 'Soy' };
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FOODS = [
  'Chicken Breast', 'Salmon', 'Tuna', 'Eggs', 'Greek Yogurt', 'Cottage Cheese',
  'Avocado', 'Broccoli', 'Spinach', 'Sweet Potato', 'Brown Rice', 'Quinoa',
  'Oats', 'Banana', 'Blueberries', 'Almonds', 'Walnuts', 'Olive Oil',
  'Lentils', 'Black Beans', 'Chickpeas', 'Beef', 'Turkey', 'Shrimp',
  'Kale', 'Tomatoes', 'Cucumber', 'Carrots', 'Bell Peppers', 'Mushrooms',
];

export default function HealthProfile() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    height: 175,
    weight: 74.5,
    age: '',
    bloodType: 'A+',
    diseases: 'None',
    allergies: [],
    mealsPerDay: 3,
    goal: 'WeightLoss',
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredFoods = FOODS.filter(
    (f) => f.toLowerCase().includes(foodSearch.toLowerCase()) && !selectedFoods.includes(f)
  );

  const addFood = (food) => {
    setSelectedFoods((prev) => [...prev, food]);
    setFoodSearch('');
    setShowDropdown(false);
  };

  const removeFood = (food) => setSelectedFoods((prev) => prev.filter((f) => f !== food));

  const toggleAllergy = (allergy) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = {
        height: Number(form.height),
        weight: Number(form.weight),
        age: Number(form.age),
        bloodType: form.bloodType,
        diseases: form.diseases,
        allergies: form.allergies.join(', '),
        favoriteFoods: selectedFoods.join(', '),
        mealsPerDay: Number(form.mealsPerDay),
        goal: form.goal,
      };

      const profileRes = await fetch(`${BASE_URL}/healthprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!profileRes.ok) {
        const data = await profileRes.json();
        setError(data.message || 'Failed to save profile.');
        return;
      }

      await fetch(`${BASE_URL}/mealplan/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <header className="w-full h-20 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100">
        <span className="text-[#006d40] font-bold text-xl tracking-tighter" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          NutriPlan
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="h-2 rounded-full bg-[#006d40] w-12 transition-all duration-300" />
            <div className="h-2 rounded-full bg-[#dce9ff] w-2" />
            <div className="h-2 rounded-full bg-[#dce9ff] w-2" />
          </div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#6d7a6f] ml-2"
                style={{ fontFamily: 'Lexend' }}>
            STEP 1 OF 3
          </span>
        </div>
      </header>

      <main className="min-h-[calc(100vh-80px)] max-w-5xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left */}
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-4xl font-bold text-[#0b1c30] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Tell us about your <span className="text-[#006d40]">Vitals</span>.
            </h1>
            <p className="text-lg text-[#6d7a6f] leading-relaxed" style={{ fontFamily: 'Inter' }}>
              We use these metrics to calculate your Basal Metabolic Rate and personalize your nutrient density targets.
            </p>
            <div className="hidden lg:block mt-16">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-lg">
                <img alt="Nutrition planning" className="w-full h-full object-cover"
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxTTUGN52TOpdoSg4WMhJ6s1jerz062mks3xWEW72o-I7VCWUHZZFu1S3B9O-pQbVbqw6xxgf_nri4dASbhzWwYdq-vKgG-wX-MogXp6cemsHrWxWrQRKxMswUUTEHjw69mfwba_AtRNA1Fv67sYJW9XcNRHZbtVRVYReVZOgS2mvjVn454vERPd3-xflGa9Ukm41HIct3mijr-lnzEJ5JDGV1omBR2h2oZGBzQ52yTJOTHLgqKs-6-DrwBQsMFAiw9aZIZo22ZQLG"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <span className="text-white font-semibold text-xl" style={{ fontFamily: 'Plus Jakarta Sans' }}>Precision matters.</span>
                  <span className="text-white/80 text-sm">Every gram counts towards your goal.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-10 rounded-xl shadow-[0_4px_24px_-4px_rgba(0,109,64,0.06)] border border-slate-100">
              <form className="space-y-10" onSubmit={handleSubmit}>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">{error}</div>
                )}

                {/* Height & Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Height (cm)', key: 'height', min: 100, max: 250, step: 1 },
                    { label: 'Current Weight (kg)', key: 'weight', min: 30, max: 300, step: 0.5 },
                  ].map(({ label, key, min, max, step }) => (
                    <div key={key} className="space-y-4">
                      <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>{label}</label>
                      <div className="flex items-center justify-between bg-[#f8f9ff] p-4 rounded-lg border border-slate-200 transition-all">
                        <button type="button"
                                onClick={() => setForm((p) => ({ ...p, [key]: parseFloat(Math.max(min, p[key] - step).toFixed(1)) }))}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 hover:bg-[#2bb673] hover:text-white transition-colors">
                          <span className="material-symbols-outlined">remove</span>
                        </button>
                        <span className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>{form[key]}</span>
                        <button type="button"
                                onClick={() => setForm((p) => ({ ...p, [key]: parseFloat(Math.min(max, p[key] + step).toFixed(1)) }))}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 hover:bg-[#2bb673] hover:text-white transition-colors">
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Age, Blood Type, Meals/Day */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>Age</label>
                    <input type="number" placeholder="28" min="10" max="100" required
                           value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                           className="w-full bg-[#eff4ff] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006d40]/20 outline-none" style={{ fontFamily: 'Inter' }} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>Blood Type</label>
                    <select value={form.bloodType} onChange={(e) => setForm((p) => ({ ...p, bloodType: e.target.value }))}
                            className="w-full bg-[#eff4ff] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006d40]/20 outline-none appearance-none" style={{ fontFamily: 'Inter' }}>
                      {BLOOD_TYPES.map((bt) => <option key={bt}>{bt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>Meals / Day</label>
                    <input type="number" placeholder="3" min="1" max="6" required
                           value={form.mealsPerDay} onChange={(e) => setForm((p) => ({ ...p, mealsPerDay: e.target.value }))}
                           className="w-full bg-[#eff4ff] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006d40]/20 outline-none" style={{ fontFamily: 'Inter' }} />
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-4">
                  <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>Allergies & Sensitivities</label>
                  <div className="flex flex-wrap gap-2">
                    {ALLERGIES.map((a) => (
                      <button key={a} type="button" onClick={() => toggleAllergy(a)}
                              className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                                form.allergies.includes(a)
                                  ? 'bg-[#6cf8bb] text-[#00714d] border-transparent'
                                  : 'bg-[#eff4ff] text-[#6d7a6f] border-slate-200 hover:border-[#006d40]'
                              }`} style={{ fontFamily: 'Lexend' }}>
                        {ALLERGY_LABELS[a]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-4">
                  <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>Primary Goal</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'WeightLoss', icon: 'trending_down', label: 'Weight Loss', desc: 'Burn fat while maintaining lean mass.' },
                      { value: 'MuscleBuilding', icon: 'fitness_center', label: 'Muscle Gain', desc: 'Hypertrophy focus with caloric surplus.' },
                      { value: 'WeightGain', icon: 'bolt', label: 'Weight Gain', desc: 'Healthy caloric surplus for mass.' },
                    ].map((g) => (
                      <label key={g.value} className="cursor-pointer group">
                        <input type="radio" name="goal" className="hidden peer"
                               checked={form.goal === g.value}
                               onChange={() => setForm((p) => ({ ...p, goal: g.value }))} />
                        <div className="h-full p-6 rounded-xl border border-slate-200 peer-checked:border-[#006d40] peer-checked:bg-[#7afbb1]/10 group-hover:bg-slate-50 transition-all flex flex-col gap-2">
                          <span className="material-symbols-outlined text-[#006d40]">{g.icon}</span>
                          <span className="font-semibold text-[18px] text-[#0b1c30]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{g.label}</span>
                          <span className="text-xs text-[#6d7a6f] leading-tight">{g.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Favorite Foods — searchable multi-select */}
                <div className="space-y-4">
                  <label className="text-[11px] font-semibold text-[#6d7a6f] uppercase tracking-widest" style={{ fontFamily: 'Lexend' }}>
                    Favorite Foods
                  </label>

                  {/* Selected chips */}
                  {selectedFoods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedFoods.map((food) => (
                        <span key={food}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6cf8bb] text-[#00714d] rounded-full text-[13px] font-semibold"
                              style={{ fontFamily: 'Lexend' }}>
                          {food}
                          <button type="button" onClick={() => removeFood(food)}
                                  className="ml-1 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search input + dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center bg-[#eff4ff] rounded-lg px-4 py-3 gap-2">
                      <span className="material-symbols-outlined text-[#6d7a6f] text-sm">search</span>
                      <input
                        type="text"
                        placeholder="Search foods (e.g. Salmon, Avocado...)"
                        value={foodSearch}
                        onChange={(e) => { setFoodSearch(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        className="flex-1 bg-transparent border-none outline-none text-[#3d4a40]"
                        style={{ fontFamily: 'Inter' }}
                      />
                      {foodSearch && (
                        <button type="button" onClick={() => { setFoodSearch(''); setShowDropdown(false); }}
                                className="text-slate-400 hover:text-slate-600">×</button>
                      )}
                    </div>

                    {showDropdown && filteredFoods.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredFoods.map((food) => (
                          <button key={food} type="button" onClick={() => addFood(food)}
                                  className="w-full text-left px-4 py-3 text-sm text-[#0b1c30] hover:bg-[#eff4ff] transition-colors flex items-center gap-3"
                                  style={{ fontFamily: 'Inter' }}>
                            <span className="material-symbols-outlined text-[#006d40] text-sm">add_circle</span>
                            {food}
                          </button>
                        ))}
                      </div>
                    )}

                    {showDropdown && foodSearch && filteredFoods.length === 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-400">
                        No foods found matching "{foodSearch}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 flex items-center justify-end gap-6 border-t border-slate-100">
                  <button type="submit" disabled={loading}
                          className="bg-[#006d40] text-white font-bold px-16 py-4 rounded-full shadow-lg shadow-[#006d40]/20 hover:-translate-y-0.5 hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {loading ? 'Generating your plan...' : 'Generate My Plan →'}
                  </button>
                </div>

              </form>
            </div>

            {/* Privacy note */}
            <div className="bg-[#dce9ff]/30 p-6 rounded-xl border border-[#dce9ff] flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006d40]">verified_user</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0b1c30]" style={{ fontFamily: 'Inter' }}>Privacy First Policy</p>
                <p className="text-xs text-[#6d7a6f]">Your health data is encrypted and only used to generate your custom nutritional plan. We never sell your personal information.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="w-full py-8 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-slate-400">© 2025 NutriPlan. Clarity through Nutrition.</span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((l) => (
              <a key={l} href="#" className="text-xs text-slate-400 hover:text-[#006d40] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
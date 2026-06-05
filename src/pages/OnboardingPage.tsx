import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { saveUserProfile, completeOnboarding } from '../services/storage';
import type { UserProfile } from '../types';

interface OnboardingPageProps {
  onComplete: () => void;
}

const ACTIVITY_LEVELS: UserProfile['activityLevel'][] = ['sedentary', 'light', 'moderate', 'active'];
const ACTIVITY_ICONS = { sedentary: '🪑', light: '🚶', moderate: '🏃', active: '🔥' };

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { t } = useTranslation(['plan', 'common']);
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);

  const [weight, setWeight] = useState('65');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('light');
  const [targetWeight, setTargetWeight] = useState('');

  const goNext = (next: number) => {
    setFade(false);
    setTimeout(() => {
      setStep(next);
      setFade(true);
    }, 200);
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      weight: parseFloat(weight) || 65,
      height: parseFloat(height) || 170,
      age: parseInt(age) || 25,
      gender,
      activityLevel,
      ...(targetWeight && { targetWeight: parseFloat(targetWeight) }),
    };
    saveUserProfile(profile);
    completeOnboarding();
    onComplete();
  };

  const bmi = (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1);

  return (
    <div className="fixed inset-0 bg-[#eef2ef] flex flex-col z-50 overflow-hidden">
      <div className="absolute top-[-120px] right-[-80px] w-80 h-80 bg-green-200 rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-100px] w-72 h-72 bg-orange-100 rounded-full opacity-40 blur-3xl" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-2">
        {step > 0 ? (
          <button
            onClick={() => goNext(step - 1)}
            className="text-sm text-gray-400 font-medium"
          >
            ←
          </button>
        ) : <div className="w-10" />}

        <div className="flex-1 mx-6">
          <div className="h-1 bg-gray-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {step > 0 && step < 2 ? (
          <button onClick={handleComplete} className="text-sm text-gray-400 font-medium">
            {t('skip')}
          </button>
        ) : <div className="w-10" />}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className={`w-full max-w-md transition-all duration-200 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                <span className="text-4xl">🌿</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t('welcome')}</h1>
                <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">{t('welcomeDesc')}</p>
              </div>
              <button
                onClick={() => goNext(1)}
                className="w-full py-4 bg-green-500 text-white rounded-3xl text-lg font-semibold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-transform"
              >
                {t('startSetup')}
              </button>
            </div>
          )}

          {/* Step 1: Body data */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">{t('bodyData')}</h2>

              {/* Weight / Height / Age */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('weight'), unit: t('kg'), value: weight, set: setWeight },
                  { label: t('height'), unit: t('cm'), value: height, set: setHeight },
                  { label: t('age'), unit: t('years'), value: age, set: setAge },
                ].map(item => (
                  <div key={item.label} className="glass rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-2">{item.label}</p>
                    <input
                      type="number"
                      value={item.value}
                      onChange={e => item.set(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-900 text-2xl font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{item.unit}</p>
                  </div>
                ))}
              </div>

              {/* Gender */}
              <div>
                <p className="text-sm text-gray-500 mb-3">{t('gender')}</p>
                <div className="flex gap-3">
                  {([
                    { key: 'male' as const, emoji: '👨', label: t('male') },
                    { key: 'female' as const, emoji: '👩', label: t('female') },
                  ]).map(item => (
                    <button
                      key={item.key}
                      onClick={() => setGender(item.key)}
                      className={`flex-1 py-4 rounded-2xl text-center transition-all ${
                        gender === item.key
                          ? 'glass border-2 border-green-500'
                          : 'bg-white/50 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <p className={`text-sm font-medium mt-1 ${gender === item.key ? 'text-green-600' : 'text-gray-500'}`}>
                        {item.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity level */}
              <div>
                <p className="text-sm text-gray-500 mb-3">{t('activityLevel')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITY_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setActivityLevel(level)}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left transition-all ${
                        activityLevel === level
                          ? 'glass border-2 border-green-500'
                          : 'bg-white/50 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-lg">{ACTIVITY_ICONS[level]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${activityLevel === level ? 'text-green-600' : 'text-gray-700'}`}>
                          {t(level)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{t(level + 'Desc')}</p>
                      </div>
                      {activityLevel === level && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* BMI */}
              <div className="glass rounded-2xl p-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('bmi')}</span>
                <span className="text-lg font-bold text-gray-900">{bmi}</span>
              </div>

              <button
                onClick={() => goNext(2)}
                className="w-full py-4 bg-green-500 text-white rounded-3xl text-lg font-semibold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-transform"
              >
                {t('next')}
              </button>
            </div>
          )}

          {/* Step 2: Target */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="text-6xl">🏆</div>
                <h2 className="text-2xl font-bold text-gray-900">{t('targetWeight')}</h2>
                <p className="text-gray-400 text-sm">{t('targetWeightDesc')}</p>
              </div>

              <div className="glass rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-400 mb-2">{t('weight')}</p>
                    <p className="text-3xl font-bold text-gray-900">{weight}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('kg')}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-gray-200 mx-2" />
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-400 mb-2">{t('targetWeight')}</p>
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={e => setTargetWeight(e.target.value)}
                      placeholder="--"
                      className="w-full bg-transparent outline-none text-gray-900 text-3xl font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{t('kg')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleComplete}
                  className="flex-1 py-4 bg-white/60 text-gray-500 rounded-3xl font-medium active:scale-[0.98] transition-transform"
                >
                  {t('skip')}
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 py-4 bg-green-500 text-white rounded-3xl font-semibold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-transform"
                >
                  {t('complete')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserProfile, saveUserProfile } from '../services/storage';
import type { UserProfile } from '../types';

interface SettingsPageProps {
  onClose: () => void;
}

const ACTIVITY_LEVELS: UserProfile['activityLevel'][] = ['sedentary', 'light', 'moderate', 'active'];

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { t } = useTranslation('plan');
  const [weight, setWeight] = useState('65');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('light');
  const [targetWeight, setTargetWeight] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setWeight(String(profile.weight));
      setHeight(String(profile.height));
      setAge(String(profile.age));
      setGender(profile.gender);
      setActivityLevel(profile.activityLevel);
      if (profile.targetWeight) setTargetWeight(String(profile.targetWeight));
    }
  }, []);

  const handleSave = () => {
    const profile: UserProfile = {
      weight: parseFloat(weight) || 65,
      height: parseFloat(height) || 170,
      age: parseInt(age) || 25,
      gender,
      activityLevel,
      ...(targetWeight && { targetWeight: parseFloat(targetWeight) }),
    };
    saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
      <div className="glass-heavy rounded-t-[40px] w-full max-w-lg p-6 animate-slide-up max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">{t('settings')}</h2>
          <button onClick={onClose} className="glass w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('weight')} ({t('kg')})</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full px-3 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center font-medium"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('height')} ({t('cm')})</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full px-3 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center font-medium"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('age')} ({t('years')})</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-3 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-2">{t('gender')}</label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    gender === g ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-600'
                  }`}
                >
                  {t(g)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-2">{t('activityLevel')}</label>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setActivityLevel(level)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors ${
                    activityLevel === level
                      ? 'bg-green-500 text-white'
                      : 'bg-white/70 text-gray-600 hover:bg-white/90'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t(level)}</p>
                    <p className={`text-xs ${activityLevel === level ? 'text-green-100' : 'text-gray-400'}`}>
                      {t(level + 'Desc')}
                    </p>
                  </div>
                  {activityLevel === level && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">{t('targetWeight')} ({t('kg')})</label>
            <input
              type="number"
              value={targetWeight}
              onChange={e => setTargetWeight(e.target.value)}
              placeholder={t('targetWeightDesc')}
              className="w-full px-4 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl mt-4 transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {saved ? t('saved') : t('save')}
        </button>
      </div>
    </div>
  );
}

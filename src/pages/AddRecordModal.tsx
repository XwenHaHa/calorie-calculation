import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useApp } from '../store';
import { searchFoods, searchExercises } from '../utils';
import { EXERCISE_TYPES, QUICK_FOOD_ITEMS } from '../constants';
import { recognizeFood } from '../services/food-recognition';
import type { FoodItem, ExerciseItem } from '../constants';
import type { RecognitionResult } from '../services/food-recognition';
import { FoodRecognitionResult } from '../components/FoodRecognitionResult';

interface AddRecordModalProps {
  onClose: () => void;
}

export function AddRecordModal({ onClose }: AddRecordModalProps) {
  const { addNewRecord } = useApp();
  const [mode, setMode] = useState<'food' | 'exercise'>('food');
  const [input, setInput] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const { t } = useTranslation(['add', 'common']);

  // Photo recognition state
  const [showPhotoSource, setShowPhotoSource] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState(false);

  // Quantity/duration selection state
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [duration, setDuration] = useState('30');

  const quantityNum = parseFloat(quantity) || 0;
  const durationNum = parseInt(duration) || 0;

  const searchResults = useMemo(() => {
    if (!input.trim()) return [];
    return mode === 'food' ? searchFoods(input) : searchExercises(input);
  }, [input, mode]);

  const hasQuery = input.trim().length > 0;
  const isSelecting = selectedFood !== null || selectedExercise !== null;

  const handleSelectFood = (item: FoodItem) => {
    setSelectedFood(item);
    setQuantity('100');
  };

  const handleSelectExercise = (item: ExerciseItem) => {
    setSelectedExercise(item);
    setDuration('30');
  };

  const handleBackToSearch = () => {
    setSelectedFood(null);
    setSelectedExercise(null);
  };

  const handleConfirmFood = () => {
    if (!selectedFood) return;
    const q = Math.max(1, quantityNum);
    addNewRecord({
      type: 'food',
      title: selectedFood.nameKey,
      calories: Math.round(selectedFood.calories * q / 100),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleConfirmExercise = () => {
    if (!selectedExercise) return;
    const d = Math.max(1, durationNum);
    addNewRecord({
      type: 'exercise',
      title: selectedExercise.nameKey,
      calories: -Math.round(selectedExercise.caloriesPerHour * d / 60),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleOpenManual = () => {
    setManualTitle(input.trim());
    setManualCalories('');
    setShowManual(true);
  };

  const handleSubmitManual = () => {
    if (!manualTitle || !manualCalories) return;
    addNewRecord({
      type: mode,
      title: manualTitle,
      calories: mode === 'food' ? parseInt(manualCalories) : -Math.abs(parseInt(manualCalories)),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickFood = (nameKey: string, _name: string, cal: number) => {
    addNewRecord({
      type: 'food',
      title: nameKey,
      calories: cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickExercise = (nameKey: string, _name: string, cal: number) => {
    addNewRecord({
      type: 'exercise',
      title: nameKey,
      calories: -cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleModeSwitch = (newMode: 'food' | 'exercise') => {
    setMode(newMode);
    setInput('');
    setSelectedFood(null);
    setSelectedExercise(null);
    setShowManual(false);
    setRecognitionResult(null);
    setRecognitionError(false);
  };

  const handleTakePhoto = async (source: CameraSource) => {
    setShowPhotoSource(false);
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source,
      });

      if (!photo.base64String) return;

      setImagePreview(`data:image/jpeg;base64,${photo.base64String}`);
      setRecognizing(true);
      setRecognitionError(false);

      const result = await recognizeFood(photo.base64String);
      setRecognitionResult(result);
    } catch {
      setRecognitionError(true);
    } finally {
      setRecognizing(false);
    }
  };

  const handleBackFromRecognition = () => {
    setRecognitionResult(null);
    setImagePreview('');
    setRecognitionError(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
      <div className="glass-heavy rounded-t-[40px] w-full max-w-lg p-6 animate-slide-up max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">{t('quickAdd')}</h2>
            <p className="text-gray-400 mt-1">{t('quickAddHint')}</p>
          </div>
          <button onClick={onClose} className="glass w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleModeSwitch('food')}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors ${
              mode === 'food' ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-600'
            }`}
          >
            {t('food', { ns: 'common' })}
          </button>
          <button
            onClick={() => handleModeSwitch('exercise')}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors ${
              mode === 'exercise' ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-600'
            }`}
          >
            {t('exercise', { ns: 'common' })}
          </button>
        </div>

        {/* Photo source selection popup */}
        {showPhotoSource && (
          <div className="mb-3 bg-white/80 rounded-2xl p-2 space-y-1">
            <button
              onClick={() => handleTakePhoto(CameraSource.Camera)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/60 rounded-xl transition-colors text-left"
            >
              <span className="text-xl">📷</span>
              <span className="text-gray-800 text-sm">{t('takePhoto')}</span>
            </button>
            <button
              onClick={() => handleTakePhoto(CameraSource.Photos)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/60 rounded-xl transition-colors text-left"
            >
              <span className="text-xl">🖼️</span>
              <span className="text-gray-800 text-sm">{t('chooseFromAlbum')}</span>
            </button>
          </div>
        )}

        {/* Recognizing loading state */}
        {recognizing && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">{t('recognizing')}</p>
          </div>
        )}

        {/* Recognition error */}
        {recognitionError && !recognizing && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <span className="text-4xl mb-3">😕</span>
            <p className="text-gray-400 mb-4">{t('recognitionFailed')}</p>
            <button
              onClick={() => { setRecognitionError(false); setShowPhotoSource(true); }}
              className="px-6 py-2 bg-green-500 text-white rounded-2xl text-sm"
            >
              {t('back')}
            </button>
          </div>
        )}

        {/* Recognition result */}
        {recognitionResult && !recognizing && !recognitionError ? (
          <FoodRecognitionResult
            result={recognitionResult}
            imagePreview={imagePreview}
            onBack={handleBackFromRecognition}
            onClose={onClose}
          />
        ) : isSelecting ? (
          <div className="flex-1 overflow-y-auto mb-3 min-h-0">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')}
            </button>

            {selectedFood && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/60 rounded-2xl p-4">
                  <span className="text-3xl">{selectedFood.emoji}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{t(selectedFood.nameKey)}</p>
                    <p className="text-gray-400 text-sm">{t('per100g')} {selectedFood.calories} {t('kcal')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">{t('intake')} ({t('grams')})</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      onBlur={() => { if (quantity === '' || quantityNum <= 0) setQuantity('100'); }}
                      min="1"
                      step="50"
                      className="flex-1 px-4 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center text-lg font-medium"
                    />
                    <span className="text-gray-500 text-sm">{t('grams')}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['100', '200', '300', '500'].map(v => (
                      <button
                        key={v}
                        onClick={() => setQuantity(v)}
                        className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                          quantity === v ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-600'
                        }`}
                      >
                        {v}{t('grams')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-400">
                    {selectedFood.calories} × {quantityNum || '—'} ÷ 100
                  </p>
                  <p className="text-2xl font-semibold text-orange-500">
                    = {quantityNum > 0 ? Math.round(selectedFood.calories * quantityNum / 100) : 0} {t('kcal')}
                  </p>
                </div>

                <button
                  onClick={handleConfirmFood}
                  disabled={quantityNum <= 0}
                  className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl ${
                    quantityNum > 0
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {t('confirmAdd')}
                </button>
              </div>
            )}

            {selectedExercise && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/60 rounded-2xl p-4">
                  <span className="text-3xl">{selectedExercise.emoji}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{t(selectedExercise.nameKey)}</p>
                    <p className="text-gray-400 text-sm">{selectedExercise.caloriesPerHour} {t('kcal')} / {t('perHour')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">{t('duration')} ({t('minutes')})</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      onBlur={() => { if (duration === '' || durationNum <= 0) setDuration('30'); }}
                      min="1"
                      step="5"
                      className="flex-1 px-4 py-3 bg-white/70 rounded-2xl outline-none text-gray-800 text-center text-lg font-medium"
                    />
                    <span className="text-gray-500 text-sm">{t('minutes')}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['15', '30', '45', '60'].map(v => (
                      <button
                        key={v}
                        onClick={() => setDuration(v)}
                        className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                          duration === v ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-600'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-500">
                    {t('totalCalories', { calories: durationNum > 0 ? Math.round(selectedExercise.caloriesPerHour * durationNum / 60) : 0 })}
                  </p>
                </div>

                <button
                  onClick={handleConfirmExercise}
                  disabled={durationNum <= 0}
                  className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl ${
                    durationNum > 0
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {t('confirmAdd')}
                </button>
              </div>
            )}
          </div>
        ) : showManual ? (
          /* Manual entry form */
          <div className="flex-1 overflow-y-auto mb-3 min-h-0">
            <button
              onClick={() => setShowManual(false)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')}
            </button>

            <div className="space-y-3">
              <input
                type="text"
                value={manualTitle}
                onChange={e => setManualTitle(e.target.value)}
                placeholder={mode === 'food' ? t('manualFoodPlaceholder') : t('manualExercisePlaceholder')}
                className="w-full px-5 py-4 bg-white/70 rounded-3xl outline-none text-gray-800 placeholder-gray-400"
              />
              <input
                type="number"
                value={manualCalories}
                onChange={e => setManualCalories(e.target.value)}
                placeholder={mode === 'food' ? t('manualCaloriesPlaceholder') : t('manualBurnPlaceholder')}
                className="w-full px-5 py-4 bg-white/70 rounded-3xl outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={handleSubmitManual}
                disabled={!manualTitle || !manualCalories}
                className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl ${
                  manualTitle && manualCalories
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('saveRecord')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search input */}
            <div className="mb-3">
              <div className="bg-white/70 rounded-3xl px-5 py-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={mode === 'food' ? t('searchFoodPlaceholder') : t('searchExercisePlaceholder')}
                  className="bg-transparent outline-none flex-1 text-gray-800 placeholder-gray-400"
                />
                {mode === 'food' && (
                  <button
                    onClick={() => setShowPhotoSource(!showPhotoSource)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Search results */}
            <div className="flex-1 overflow-y-auto mb-3 min-h-0">
              {hasQuery && searchResults.length > 0 && (
                <div className="space-y-1">
                  {mode === 'food'
                    ? (searchResults as FoodItem[]).map(item => (
                        <button
                          key={item.nameKey}
                          onClick={() => handleSelectFood(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/60 hover:bg-white/80 rounded-2xl transition-colors text-left"
                        >
                          <span className="text-xl">{item.emoji}</span>
                          <div className="flex-1">
                            <span className="text-gray-800 text-sm">{t(item.nameKey)}</span>
                            <span className="text-gray-400 text-xs ml-1">/ {t('per100g')}</span>
                          </div>
                          <span className="text-orange-500 font-medium text-sm">{item.calories} {t('kcal')}</span>
                        </button>
                      ))
                    : (searchResults as ExerciseItem[]).map(item => (
                        <button
                          key={item.nameKey}
                          onClick={() => handleSelectExercise(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/60 hover:bg-white/80 rounded-2xl transition-colors text-left"
                        >
                          <span className="text-xl">{item.emoji}</span>
                          <div className="flex-1">
                            <span className="text-gray-800 text-sm">{t(item.nameKey)}</span>
                            <span className="text-gray-400 text-xs ml-1">/ {t('perHour')}</span>
                          </div>
                          <span className="text-green-500 font-medium text-sm">{item.caloriesPerHour} {t('kcal')}</span>
                        </button>
                      ))}
                </div>
              )}

              {/* No results - prompt manual entry */}
              {hasQuery && searchResults.length === 0 && (
                <div className="flex flex-col items-center py-6 space-y-3">
                  <p className="text-gray-400 text-sm">{t('noResults')}</p>
                  <button
                    onClick={handleOpenManual}
                    className="text-green-600 text-sm font-medium hover:underline"
                  >
                    {t('tryManual')}
                  </button>
                </div>
              )}
            </div>

            {/* Quick select chips - only show when no search query */}
            {!hasQuery && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-3">{t('quickSelect', { type: mode === 'food' ? t('food', { ns: 'common' }) : t('exercise', { ns: 'common' }) })}</p>
                <div className="flex flex-wrap gap-2">
                  {mode === 'food'
                    ? QUICK_FOOD_ITEMS.map(item => (
                        <button
                          key={item.nameKey}
                          onClick={() => handleQuickFood(item.nameKey, item.name, item.calories)}
                          className="px-4 py-2 bg-white/70 text-gray-700 rounded-2xl text-sm"
                        >
                          {item.emoji} {t(item.nameKey)} {item.calories}
                        </button>
                      ))
                    : EXERCISE_TYPES.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleQuickExercise(item.nameKey, item.name, Math.round(item.caloriesPerHour / 2))}
                          className="px-4 py-2 bg-white/70 text-gray-700 rounded-2xl text-sm"
                        >
                          {item.emoji} {t(item.nameKey)} {t('per30min')}
                        </button>
                      ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

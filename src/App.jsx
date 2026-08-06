import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

import TitanBackground from './components/layout/TitanBackground'
import ScreenContainer from './components/layout/ScreenContainer'
import UIBlock from './components/layout/UIBlock'

import TitanLogo from './components/branding/TitanLogo'

import TitanButton from './components/ui/TitanButton'

import OnboardingScreen from './screens/OnboardingScreen'
import DashboardScreen from './screens/DashboardScreen'
import WorkoutScreen from './screens/WorkoutScreen'
import CheckpointScreen from './screens/CheckpointScreen'
import CheckpointSummaryScreen from './screens/CheckpointSummaryScreen'

const steps = [
  {
    key: 'name',
    title: '¿Cómo te llamas?',
    subtitle: 'Usaremos tu nombre para personalizar tu experiencia.',
    type: 'input',
    placeholder: 'Escribe tu nombre',
  },
  {
    key: 'gender',
    title: '¿Cuál es tu género biológico?',
    subtitle: 'Esto ayuda a ajustar el enfoque del entrenamiento.',
    type: 'options',
    options: ['Masculino', 'Femenino'],
  },
  {
    key: 'age',
    title: '¿Cuál es tu rango de edad?',
    subtitle: 'La edad ayuda a adaptar volumen e intensidad.',
    type: 'options',
    options: ['18–29', '30–39', '40–49', '50+'],
  },
  {
    key: 'goal',
    title: '¿Cuál es tu objetivo principal?',
    subtitle: 'TitanFit usará esto para construir tu plan.',
    type: 'options',
    options: ['Quemar grasa', 'Ganar fuerza', 'Definición muscular', 'Resistencia'],
  },
  {
    key: 'frequency',
    title: '¿Cuántos días por semana entrenarás?',
    subtitle: 'Elige una frecuencia realista.',
    type: 'options',
    options: ['3 días', '4 días', '5 días'],
  },
  {
    key: 'time',
    title: '¿Cuánto tiempo tienes por sesión?',
    subtitle: 'TitanFit ajustará el volumen del entrenamiento.',
    type: 'options',
    options: ['15 min', '20 min', '30 min', '40 min'],
  },
  {
    key: 'injuries',
    title: '¿Tienes alguna lesión o molestia?',
    subtitle: 'Esto nos ayuda a protegerte desde el inicio.',
    type: 'options',
    options: ['Ninguna', 'Rodilla', 'Espalda', 'Hombro', 'Cuello', 'Muñeca', 'Codo', 'Tobillo'],
  },
  {
    key: 'level',
    title: '¿Cuál es tu nivel actual?',
    subtitle: 'No importa dónde empiezas, importa avanzar.',
    type: 'options',
    options: ['Principiante', 'Intermedio', 'Avanzado'],
  },
]

const checkpointQuestions = [
  {
    key: 'energy',
    title: '¿Cómo te sentiste esta semana?',
    subtitle: 'Esto alimenta el sistema de fatiga.',
    options: [
      'Muy bien, con energía',
      'Bien, normal',
      'Cansado, me costó terminar',
      'Muy fatigado, me sentí agotado',
    ],
  },
  {
    key: 'intention',
    title: '¿Qué quieres hacer la próxima semana?',
    subtitle: 'Esto ajusta la intención del usuario.',
    options: ['Subir intensidad', 'Mantener ritmo', 'Bajar intensidad'],
  },
  {
    key: 'pain',
    title: '¿Tuviste molestias o dolor?',
    subtitle: 'Esto protege al usuario y activa ajustes de seguridad.',
    options: ['Ninguna molestia', 'Leve molestia', 'Dolor moderado', 'Dolor fuerte'],
  },
  {
    key: 'goalUpdate',
    title: '¿Qué objetivo buscas ahora?',
    subtitle: 'Esto puede ajustar entrenamiento y nutrición.',
    options: [
      'Mantener objetivo original',
      'Quemar grasa',
      'Ganar fuerza',
      'Definición muscular',
      'Resistencia',
    ],
  },
]

const painAreas = [
  { key: 'neck', label: 'Cuello' },
  { key: 'shoulder', label: 'Hombros' },
  { key: 'arms', label: 'Brazos' },
  { key: 'forearms', label: 'Antebrazos' },
  { key: 'elbow', label: 'Codos' },
  { key: 'wrist', label: 'Muñecas' },
  { key: 'chest', label: 'Pecho' },
  { key: 'abs', label: 'Abdomen' },
  { key: 'spine', label: 'Columna' },
  { key: 'upper_back', label: 'Espalda alta' },
  { key: 'lower_back', label: 'Espalda baja' },
  { key: 'hip', label: 'Cadera' },
  { key: 'knee', label: 'Rodillas' },
  { key: 'thigh', label: 'Muslos' },
  { key: 'calf', label: 'Pantorrillas' },
  { key: 'ankle', label: 'Tobillos' },
]

function App() {
  const [screen, setScreen] = useState('welcome')
  const [initializingApp, setInitializingApp] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checkpointStep, setCheckpointStep] = useState(0)
  const [checkpointAnswers, setCheckpointAnswers] = useState({})

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const checkpointQuestion = checkpointQuestions[checkpointStep]
  const checkpointProgress = ((checkpointStep + 1) / checkpointQuestions.length) * 100

  const [sessionUser, setSessionUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [activePlan, setActivePlan] = useState(null)
  const [weeklyDays, setWeeklyDays] = useState([])
  const [nutritionProfile, setNutritionProfile] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [dataError, setDataError] = useState(null)

  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  const DEV_EMAIL = 'mtomassellicuesta@gmail.com'
  const [isDeveloperMode, setIsDeveloperMode] = useState(false)
  const [developerUserId, setDeveloperUserId] = useState(null)

  function startOnboarding() {
    setScreen('emailLogin')
}

  function selectAnswer(value) {
    setAnswers({
      ...answers,
      [step.key]: value,
    })
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setScreen('welcome')
    }
  }

  function startCheckpoint() {
    setCheckpointStep(0)
    setScreen('checkpoint')
  }

  function selectCheckpointAnswer(value) {
    setCheckpointAnswers({
      ...checkpointAnswers,
      [checkpointQuestion.key]: value,
    })
  }

  function togglePainArea(areaKey) {
  const currentAreas = checkpointAnswers.painAreas || []

  const nextAreas = currentAreas.includes(areaKey)
    ? currentAreas.filter((item) => item !== areaKey)
    : [...currentAreas, areaKey]

  setCheckpointAnswers({
    ...checkpointAnswers,
    painAreas: nextAreas,
  })
}

  function nextCheckpointStep() {
    if (checkpointStep < checkpointQuestions.length - 1) {
      setCheckpointStep(checkpointStep + 1)
    } else {
      setScreen('checkpointSummary')
    }
  }

  function previousCheckpointStep() {
    if (checkpointStep > 0) {
      setCheckpointStep(checkpointStep - 1)
    } else {
      setScreen('dashboard')
    }
  }

function mapGoal(value) {
  const map = {
    'Quemar grasa': 'fat_loss',
    'Ganar fuerza': 'strength',
    'Definición muscular': 'muscle_definition',
    Resistencia: 'endurance',
  }

  return map[value] || 'fat_loss'
}

function mapGender(value) {
  const map = {
    Masculino: 'male',
    Femenino: 'female',
  }

  return map[value] || 'male'
}

function mapLevel(value) {
  const map = {
    Principiante: 'beginner',
    Intermedio: 'intermediate',
    Avanzado: 'advanced',
  }

  return map[value] || 'beginner'
}

function mapInjury(value) {
  const map = {
    Ninguna: null,
    Rodilla: 'knee',
    Espalda: 'lower_back',
    Hombro: 'shoulder',
    Cuello: 'neck',
    Muñeca: 'wrist',
    Codo: 'elbow',
    Tobillo: 'ankle',
  }

  return map[value] || null
}

function normalizeAgeRange(value) {
  const map = {
    '18–29': '18-29',
    '30–39': '30-39',
    '40–49': '40-49',
    '50+': '50+',
  }

  return map[value] || value
}

async function completeCurrentWorkout() {
  try {
    const sortedDays = [...weeklyDays].sort(
      (a, b) => a.day_number - b.day_number
    )

    const currentDayIndex = sortedDays.findIndex(
      (day) => day.day_number === selectedDayNumber
    )

    const nextWorkoutDay =
      currentDayIndex >= 0
        ? sortedDays[currentDayIndex + 1]
        : null

    // Si no existe otro día, terminó la semana
    if (!nextWorkoutDay) {
      startCheckpoint()
      return
    }

    const { error } = await supabase
      .from('plans')
      .update({
        current_day_number: nextWorkoutDay.day_number,
      })
      .eq('id', activePlan.id)

    if (error) {
      throw error
    }

    setSelectedDayNumber(nextWorkoutDay.day_number)

    setActivePlan((currentPlan) => ({
      ...currentPlan,
      current_day_number: nextWorkoutDay.day_number,
    }))

    setScreen('dashboard')
  } catch (error) {
    console.error(
      'Error al guardar el avance del entrenamiento:',
      error
    )

    setDataError(
      `No se pudo guardar el avance del entrenamiento: ${error.message}`
    )
  }
}

async function loadTitanFitData(userId) {
  setLoadingData(true)
  setDataError(null)

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (userError) throw userError

    if (!userData) {
      setScreen('onboarding')
      return
    }

    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    if (planError) throw planError

    const { data: nutritionData } = await supabase
      .from('nutrition_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    let daysWithExercises = []

    if (!planData) {
  await supabase.rpc('generate_workout_for_day', { p_user_id: userId })
  await supabase.rpc('generate_nutrition_profile', { p_user_id: userId })
  await loadTitanFitData(userId)
  return
}
    if (planData) {
      const { data: daysData, error: daysError } = await supabase
        .from('workout_days')
        .select('*')
        .eq('plan_id', planData.id)
        .eq('week_number', planData.week_number)
        .order('day_number', { ascending: true })

      if (daysError) throw daysError

      const dayIds = daysData.map((day) => day.id)

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercises (
            id,
            display_name,
            type,
            category,
            movement_type,
            thumbnail_url,
            video_url
          )
        `)
        .in('workout_day_id', dayIds)
        .order('order_index', { ascending: true })

      if (exercisesError) throw exercisesError

      daysWithExercises = daysData.map((day) => ({
        ...day,
        exercises: exercisesData.filter(
          (item) => item.workout_day_id === day.id
        ),
      }))
    }

const sortedDays = [...daysWithExercises].sort(
  (a, b) => a.day_number - b.day_number
)

const savedDayNumber = Number(
  planData?.current_day_number || 1
)

const savedDayExists = sortedDays.some(
  (day) => day.day_number === savedDayNumber
)

const restoredDayNumber = savedDayExists
  ? savedDayNumber
  : sortedDays[0]?.day_number || 1

setDbUser(userData)
setActivePlan(planData)
setWeeklyDays(sortedDays)
setSelectedDayNumber(restoredDayNumber)
setNutritionProfile(nutritionData)
setScreen('dashboard')
  } catch (error) {
    console.error(error)
    setDataError(error.message)
  } finally {
    setLoadingData(false)
  }
}

function getGoalLabel(goal) {
  const map = {
    fat_loss: 'Quemar grasa',
    strength: 'Ganar fuerza',
    muscle_definition: 'Definición muscular',
    endurance: 'Resistencia',
  }

  return map[goal] || 'Entrenamiento personalizado'
}

const currentWorkoutDay =
  weeklyDays.find((day) => day.day_number === selectedDayNumber) ||
  weeklyDays[0]

async function sendMagicLink() {
  setLoadingData(true)
  setDataError(null)

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) throw error

    setEmailSent(true)
  } catch (error) {
    console.error(error)
    setDataError(error.message)
  } finally {
    setLoadingData(false)
  }
}

async function completeOnboarding() {
  setLoadingData(true)
  setDataError(null)

  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const authUser = sessionData.session?.user

    if (!authUser) {
      throw new Error('Primero confirma tu email para crear tu cuenta TitanFit.')
    }

    const userId = authUser.id
    const userEmail = authUser.email || email
    const injury = mapInjury(answers.injuries)

    const { error: insertUserError } = await supabase.from('users').upsert({
      id: userId,
      email: userEmail,
      name: answers.name,
      gender: mapGender(answers.gender),
      age_range: normalizeAgeRange(answers.age),
      goal: mapGoal(answers.goal),
      frequency: parseInt(answers.frequency),
      session_time: parseInt(answers.time),
      injuries: injury ? [injury] : [],
      level: mapLevel(answers.level),
    })

    if (insertUserError) throw insertUserError

    const { error: workoutError } = await supabase.rpc(
      'generate_workout_for_day',
      { p_user_id: userId }
    )

    if (workoutError) throw workoutError

    const { error: nutritionError } = await supabase.rpc(
      'generate_nutrition_profile',
      { p_user_id: userId }
    )

    if (nutritionError) throw nutritionError

    setSessionUser(authUser)
    await loadTitanFitData(userId)
  } catch (error) {
    console.error(error)
    setDataError(error.message)
  } finally {
    setLoadingData(false)
  }
}

function mapCheckpointEnergy(value) {
  const map = {
    'Muy bien, con energía': 'very_good',
    'Bien, normal': 'good',
    'Cansado, me costó terminar': 'tired',
    'Muy fatigado, me sentí agotado': 'exhausted',
  }

  return map[value] || 'good'
}

function mapCheckpointIntention(value) {
  const map = {
    'Subir intensidad': 'progress',
    'Mantener ritmo': 'maintain',
    'Bajar intensidad': 'reduce',
  }

  return map[value] || 'maintain'
}

function mapCheckpointPain(value) {
  const map = {
    'Ninguna molestia': 'none',
    'Leve molestia': 'light',
    'Dolor moderado': 'moderate',
    'Dolor fuerte': 'severe',
  }

  return map[value] || 'none'
}

function mapCheckpointGoal(value) {
  const map = {
    'Mantener objetivo original': null,
    'Quemar grasa': 'fat_loss',
    'Ganar fuerza': 'strength',
    'Definición muscular': 'muscle_definition',
    Resistencia: 'endurance',
  }

  return map[value] || null
}

async function generateNextWeek() {
  setLoadingData(true)
  setDataError(null)

  try {
    const userId = sessionUser?.id || dbUser?.id

    if (!userId) {
      throw new Error(
        'No se encontró usuario activo para generar la siguiente semana.'
      )
    }

    const { error: generationError } = await supabase.rpc(
      'complete_week_and_generate_next',
      {
        p_user_id: userId,
        p_energy: mapCheckpointEnergy(
          checkpointAnswers.energy
        ),
        p_intention: mapCheckpointIntention(
          checkpointAnswers.intention
        ),
        p_pain: mapCheckpointPain(
          checkpointAnswers.pain
        ),
        p_pain_areas:
          mapCheckpointPain(checkpointAnswers.pain) === 'none'
            ? []
            : checkpointAnswers.painAreas || [],
        p_next_goal: mapCheckpointGoal(
          checkpointAnswers.goalUpdate
        ),
      }
    )

    if (generationError) {
      throw generationError
    }

    const { error: resetDayError } = await supabase
      .from('plans')
      .update({
        current_day_number: 1,
      })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (resetDayError) {
      throw resetDayError
    }

    setSelectedDayNumber(1)
    setCheckpointStep(0)
    setCheckpointAnswers({})

    await loadTitanFitData(userId)
  } catch (error) {
    console.error(
      'Error al generar la siguiente semana:',
      error
    )

    setDataError(error.message)
  } finally {
    setLoadingData(false)
  }
}

useEffect(() => {
  async function initTitanFit() {
    try {
      setInitializingApp(true)

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      const user = data.session?.user

      const params = new URLSearchParams(window.location.search)
      const devUserId = params.get('dev_user_id')

      if (user) {
        setSessionUser(user)

        const isDev =
          user.email === DEV_EMAIL && devUserId

        if (isDev) {
          setIsDeveloperMode(true)
          setDeveloperUserId(devUserId)

          await loadTitanFitData(devUserId)
          return
        }

        await loadTitanFitData(user.id)
      } else {
        setLoadingData(false)
        setScreen('welcome')
      }
    } catch (error) {
      console.error(
        'Error al inicializar TitanFit:',
        error
      )

      setDataError(error.message)
      setScreen('welcome')
    } finally {
      setInitializingApp(false)
    }
  }

  initTitanFit()
}, [])

if (initializingApp) {
  return (
    <TitanBackground>
      <ScreenContainer
        center
        className="text-center"
      >
        <div className="flex w-full flex-col items-center justify-center">
          <TitanLogo />

          <div className="mt-8 flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

            <p
              className="text-sm font-bold uppercase tracking-[0.16em]"
              style={{
                color: 'var(--titan-text-secondary)',
              }}
            >
              Cargando TitanFit
            </p>
          </div>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

  if (screen === 'welcome') {
  return (
    <TitanBackground>
      <ScreenContainer
        center
        className="text-center"
      >
        <div className="w-full">
          <div className="mb-8">
            <TitanLogo />

            <p
              className="mt-6 text-base leading-relaxed"
              style={{ color: 'var(--titan-text-secondary)' }}
            >
              Disciplina diaria. Resultados reales.
              </p>
          </div>

          <UIBlock
            padding="medium"
            glow="medium"
          >
            <p
              className="leading-relaxed"
              style={{ color: 'var(--titan-text-secondary)' }}
            >
              Tu coach personal de calistenia, progreso físico y recomendaciones alimenticias.
            </p>

            <TitanButton
              className="mt-7"
              onClick={startOnboarding}
            >
              Empezar
            </TitanButton>
          </UIBlock>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

if (screen === 'emailLogin') {
  return (
    <TitanBackground>
      <ScreenContainer
        center
        className="text-center"
      >
        <div className="w-full">
          <TitanLogo />

          <button
            type="button"
            onClick={() => setScreen('welcome')}
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: 'var(--titan-text-secondary)' }}
          >
            <span aria-hidden="true">←</span>
            Volver
          </button>

          <UIBlock
            padding="medium"
            glow="medium"
            className="mt-6 text-left"
          >
            <p
              className="text-sm font-black uppercase tracking-[0.18em]"
              style={{ color: 'var(--titan-cyan)' }}
            >
              Acceso TitanFit
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight">
              Ingresa tu email
            </h1>

            <p
              className="mt-4 leading-relaxed"
              style={{ color: 'var(--titan-text-secondary)' }}
            >
              Te enviaremos un enlace seguro para confirmar tu cuenta y guardar tu progreso.
            </p>

            <label
              htmlFor="titanfit-email"
              className="mt-6 block text-sm font-bold"
              style={{ color: 'var(--titan-text-secondary)' }}
            >
              Correo electrónico
            </label>

            <input
              id="titanfit-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              className="titan-input mt-2"
            />

            {dataError && (
              <div
                className="mt-4 rounded-2xl border p-4 text-sm leading-relaxed"
                style={{
                  color: '#ffd9df',
                  borderColor: 'var(--titan-danger)',
                  background: 'rgba(74, 8, 20, 0.72)',
                }}
              >
                {dataError}
              </div>
            )}

            {emailSent && (
              <div
                className="mt-4 rounded-2xl border p-4 text-sm leading-relaxed"
                style={{
                  color: '#c9ffe9',
                  borderColor: 'var(--titan-success)',
                  background: 'rgba(7, 62, 44, 0.58)',
                }}
              >
                Revisa tu correo y abre el enlace de acceso. Después volverás a TitanFit para completar tu perfil.
              </div>
            )}

            <TitanButton
              className="mt-6"
              onClick={sendMagicLink}
              disabled={!email || loadingData}
            >
              {loadingData
                ? 'Enviando enlace...'
                : 'Enviar enlace de acceso'}
            </TitanButton>
          </UIBlock>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}  

  if (screen === 'dashboard') {
  return (
    <DashboardScreen
      activePlan={activePlan}
      dbUser={dbUser}
      sessionUser={sessionUser}
      fallbackName={answers.name}
      nutritionProfile={nutritionProfile}
      selectedDayNumber={selectedDayNumber}
      goalLabel={getGoalLabel(dbUser?.goal)}
      onStartWorkout={() => setScreen('workout')}
      onStartCheckpoint={startCheckpoint}
    />
  )
}  
  if (screen === 'workout') {
  const workoutDay =
    weeklyDays.find(
      (day) => day.day_number === selectedDayNumber
    ) || weeklyDays[0]

  return (
    <WorkoutScreen
      workoutDay={workoutDay}
      selectedDayNumber={selectedDayNumber}
      goalLabel={getGoalLabel(dbUser?.goal)}
      onBack={() => setScreen('dashboard')}
      onComplete={completeCurrentWorkout}
/>
  )
}
  if (screen === 'checkpoint') {
  return (
    <CheckpointScreen
      checkpointQuestion={checkpointQuestion}
      checkpointStep={checkpointStep}
      questionsLength={checkpointQuestions.length}
      checkpointProgress={checkpointProgress}
      checkpointAnswers={checkpointAnswers}
      painAreas={painAreas}
      onSelectAnswer={selectCheckpointAnswer}
      onTogglePainArea={togglePainArea}
      onPrevious={previousCheckpointStep}
      onNext={nextCheckpointStep}
      onBackToDashboard={() => setScreen('dashboard')}
    />
  )
}

  if (screen === 'checkpointSummary') {
  return (
    <CheckpointSummaryScreen
      checkpointQuestions={checkpointQuestions}
      checkpointAnswers={checkpointAnswers}
      dataError={dataError}
      loadingData={loadingData}
      onGenerateNextWeek={generateNextWeek}
    />
  )
}

  return (
   <OnboardingScreen
      step={step}
      currentStep={currentStep}
      stepsLength={steps.length}
      progress={progress}
      answers={answers}
      loadingData={loadingData}
      onSelectAnswer={selectAnswer}
      onPrevious={previousStep}
      onNext={nextStep}
    />
  )
}

function NutritionBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  )
}

function FoodPieChart({ nutritionProfile }) {
  const protein = nutritionProfile?.protein_pct || 0
  const carbs = nutritionProfile?.carbs_pct || 0
  const fruitsVeg = nutritionProfile?.fruits_veg_pct || 0
  const fats = nutritionProfile?.fats_pct || 0

  const proteinEnd = protein
  const carbsEnd = protein + carbs
  const fruitsVegEnd = protein + carbs + fruitsVeg
  const fatsEnd = protein + carbs + fruitsVeg + fats

  const chartStyle = {
    background: `conic-gradient(
      #f59e0b 0% ${proteinEnd}%,
      #38bdf8 ${proteinEnd}% ${carbsEnd}%,
      #34d399 ${carbsEnd}% ${fruitsVegEnd}%,
      #f472b6 ${fruitsVegEnd}% ${fatsEnd}%
    )`,
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      <div
        className="h-44 w-44 rounded-full border-8 border-slate-950 shadow-xl"
        style={chartStyle}
      />

      <div className="mt-5 grid w-full grid-cols-2 gap-2 text-xs">
        <LegendItem color="bg-amber-500" label="Proteínas" value={protein} />
        <LegendItem color="bg-sky-400" label="Carbohidratos" value={carbs} />
        <LegendItem color="bg-emerald-400" label="Frutas/verduras" value={fruitsVeg} />
        <LegendItem color="bg-pink-400" label="Grasas" value={fats} />
      </div>
    </div>
  )
}

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-3">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-slate-300">
        {label}: <strong className="text-white">{value}%</strong>
      </span>
    </div>
  )
}
export default App
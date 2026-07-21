import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

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

function completeCurrentWorkout() {
  setSelectedDayNumber((currentDay) => {
    const nextDay = currentDay + 1

    if (nextDay <= weeklyDays.length) {
      return nextDay
    }

    return currentDay
  })

  if (selectedDayNumber >= weeklyDays.length) {
    startCheckpoint()
  } else {
    setScreen('dashboard')
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
            movement_type
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

    setDbUser(userData)
    setActivePlan(planData)
    setWeeklyDays(daysWithExercises)
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
      throw new Error('No se encontró usuario activo para generar la siguiente semana.')
    }

    const { error } = await supabase.rpc('complete_week_and_generate_next', {
      p_user_id: userId,
      p_energy: mapCheckpointEnergy(checkpointAnswers.energy),
      p_intention: mapCheckpointIntention(checkpointAnswers.intention),
      p_pain: mapCheckpointPain(checkpointAnswers.pain),
      p_pain_areas:
        mapCheckpointPain(checkpointAnswers.pain) === 'none'
          ? []
          : checkpointAnswers.painAreas || [],
      p_next_goal: mapCheckpointGoal(checkpointAnswers.goalUpdate),
    })

    if (error) throw error

    setSelectedDayNumber(1)
    setCheckpointStep(0)
    setCheckpointAnswers({})

    await loadTitanFitData(userId)
  } catch (error) {
    console.error(error)
    setDataError(error.message)
  } finally {
    setLoadingData(false)
  }
}

useEffect(() => {
  async function initTitanFit() {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user

    const params = new URLSearchParams(window.location.search)
    const devUserId = params.get('dev_user_id')

    if (user) {
      setSessionUser(user)

      const isDev = user.email === DEV_EMAIL && devUserId

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
  }

  initTitanFit()
}, [])

  if (screen === 'welcome') {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <section className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-amber-500 flex items-center justify-center text-5xl shadow-lg">
              ⚡
            </div>

            <h1 className="text-5xl font-black tracking-tight">TitanFit</h1>

            <p className="mt-4 text-lg text-slate-300">
              Disciplina diaria. Resultados reales.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <p className="text-slate-300 leading-relaxed">
              Tu coach personal de calistenia, progreso físico y recomendaciones alimenticias.
            </p>

            <button
              onClick={startOnboarding}
              className="mt-8 w-full rounded-2xl bg-amber-500 px-6 py-4 text-lg font-bold text-slate-950"
            >
              Empezar
            </button>
          </div>
        </section>
      </main>
    )
  }

if (screen === 'emailLogin') {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md">
        <button
          onClick={() => setScreen('welcome')}
          className="mb-6 text-sm font-bold text-slate-400"
        >
          ← Volver
        </button>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <p className="text-sm font-bold text-amber-400">
            Acceso TitanFit
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight">
            Ingresa tu email
          </h1>

          <p className="mt-4 text-slate-300">
            Te enviaremos un enlace seguro para confirmar tu cuenta y guardar tu progreso.
          </p>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg text-white"
          />

          {dataError && (
            <div className="mt-4 rounded-2xl border border-red-500 bg-red-950/50 p-4 text-sm text-red-200">
              {dataError}
            </div>
          )}

          {emailSent && (
            <div className="mt-4 rounded-2xl border border-emerald-500 bg-emerald-950/40 p-4 text-sm text-emerald-200">
              Revisa tu correo y abre el enlace de acceso. Después volverás a TitanFit para completar tu perfil.
            </div>
          )}

          <button
            onClick={sendMagicLink}
            disabled={!email || loadingData}
            className="mt-6 w-full rounded-2xl bg-amber-500 px-6 py-4 text-lg font-black text-slate-950 disabled:opacity-40"
          >
            {loadingData ? 'Enviando enlace...' : 'Enviar enlace de acceso'}
          </button>
        </div>
      </section>
    </main>
  )
}  

  if (screen === 'dashboard') {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-5 py-6">
        <section className="mx-auto w-full max-w-md">
          <header className="mb-6">
           <p className="text-sm font-bold text-amber-400">
            Semana {activePlan?.week_number || 1} de 12
           </p>

            <h1 className="mt-2 text-4xl font-black leading-tight">
              Hola, {dbUser?.name || dbUser?.nombre || answers.name || 'Titán'} 👋
            </h1>

            <p className="mt-2 break-all text-xs text-slate-500">
              ID de soporte: {dbUser?.id || sessionUser?.id || 'Sin ID'}
            </p>

            <p className="mt-3 text-slate-300">
               Disciplina diaria. Resultados reales.
            </p>
          </header>

          <section className="mb-5 rounded-3xl border border-amber-500/30 bg-amber-500 p-5 text-slate-950 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide">
                  Entrenamiento de hoy
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {getGoalLabel(dbUser?.goal)}
                </h2>

                <p className="mt-2 font-semibold">
                  Duración estimada: {dbUser?.session_time || 20} min
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white">
                <p className="text-xs text-slate-400">Día</p>
                <p className="text-2xl font-black">
                  {selectedDayNumber}
                </p>
              </div>
            </div>

            <button
              onClick={() => setScreen('workout')}
              className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 text-lg font-black text-white"
            >
              Comenzar entrenamiento
            </button>
          </section>

         <section className="mb-5 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <p className="text-sm font-bold text-emerald-400">
            Recomendación alimenticia
          </p>

          <h2 className="mt-1 text-2xl font-black">
            {nutritionProfile?.diet_type || 'Perfil nutricional'}
          </h2>

          <FoodPieChart nutritionProfile={nutritionProfile} />

          {nutritionProfile?.meals_per_day && (
            <p className="mt-4 text-sm text-slate-300">
              Comidas recomendadas por día:{' '}
              <span className="font-bold text-white">
                {nutritionProfile.meals_per_day}
              </span>
             </p>
           )}

          {nutritionProfile?.fasting !== undefined &&
            nutritionProfile?.fasting !== null && (
              <p className="mt-2 text-sm text-slate-300">
                Ayuno recomendado:{' '}
                <span className="font-bold text-white">
                  {nutritionProfile.fasting === true ||
                  nutritionProfile.fasting === 'true'
                    ? 'Sí'
                    : 'No'}
                </span>
              </p>
            )}
        </section>

          <section className="mb-5 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-sky-400">
                  Progreso semanal
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Semana {activePlan?.week_number || 1}
                </h2>
              </div>

              <p className="text-2xl font-black text-amber-400">
                {Math.round(((activePlan?.week_number || 1) / 12) * 100)}%
              </p>
            </div>

            <div className="mt-5 h-3 rounded-full bg-slate-950">
              <div
                className="h-3 rounded-full bg-amber-500"
                style={{
                  width: `${Math.round(((activePlan?.week_number || 1) / 12) * 100)}%`,
                }}
              />
            </div>
          </section>

          <section>
            <button
              onClick={startCheckpoint}
              className="w-full rounded-2xl bg-slate-800 px-4 py-4 font-bold text-white"
            >
              Checkpoint semanal
            </button>
          </section>
        </section>
      </main>
    )
  }
  
  if (screen === 'workout') {
  const workoutDay =
    weeklyDays.find((day) => day.day_number === selectedDayNumber) ||
    weeklyDays[0]

  const warmupExercises =
    workoutDay?.exercises?.filter((item) => item.block === 'warmup') || []

  const mainExercises =
    workoutDay?.exercises?.filter((item) => item.block === 'main') || []

  const cooldownExercises =
    workoutDay?.exercises?.filter((item) => item.block === 'cooldown') || []

  return (
    <main className="min-h-screen bg-slate-950 text-white px-5 py-6">
      <section className="mx-auto w-full max-w-md">
        <button
          onClick={() => setScreen('dashboard')}
          className="mb-6 text-sm font-bold text-slate-400"
        >
          ← Volver al dashboard
        </button>

        <p className="text-sm font-bold text-amber-400">
          Día {workoutDay?.day_number || selectedDayNumber} · {getGoalLabel(dbUser?.goal)}
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Entrenamiento de hoy
        </h1>

        <p className="mt-3 text-slate-300">
          Completa las 3 fases: warmup, main y cooldown.
        </p>

        <WorkoutBlock
          title="Warmup"
          exercises={warmupExercises}
        />

        <WorkoutBlock
          title="Main"
          exercises={mainExercises}
        />

        <WorkoutBlock
          title="Cooldown"
          exercises={cooldownExercises}
        />

        <button
          onClick={completeCurrentWorkout}
          className="mt-6 w-full rounded-2xl bg-amber-500 px-6 py-4 text-lg font-black text-slate-950"
        >
          Marcar entrenamiento completado
        </button>
      </section>
    </main>
  )
}
  if (screen === 'checkpoint') {
  const showPainAreas =
    checkpointQuestion.key === 'pain' &&
    checkpointAnswers.pain &&
    checkpointAnswers.pain !== 'Ninguna molestia'

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <div>
          <button
            onClick={() => setScreen('dashboard')}
            className="mb-6 text-sm font-bold text-slate-400"
          >
            ← Volver al dashboard
          </button>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Pregunta {checkpointStep + 1} de {checkpointQuestions.length}
            </span>
            <span>{Math.round(checkpointProgress)}%</span>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-amber-500"
              style={{ width: `${checkpointProgress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <p className="text-sm font-bold text-amber-400">
            Checkpoint semanal
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight">
            {checkpointQuestion.title}
          </h1>

          <p className="mt-4 text-slate-300">
            {checkpointQuestion.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            {checkpointQuestion.options.map((option) => {
              const selected =
                checkpointAnswers[checkpointQuestion.key] === option

              return (
                <button
                  key={option}
                  onClick={() => selectCheckpointAnswer(option)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left text-lg font-bold ${
                    selected
                      ? 'border-amber-500 bg-amber-500 text-slate-950'
                      : 'border-slate-800 bg-slate-900 text-white'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {showPainAreas && (
            <div className="mt-8">
              <p className="text-sm font-bold text-red-300">
                ¿Dónde sentiste la molestia o dolor?
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Puedes seleccionar una o varias zonas.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {painAreas.map((area) => {
                  const selected =
                    checkpointAnswers.painAreas?.includes(area.key)

                  return (
                    <button
                      key={area.key}
                      onClick={() => togglePainArea(area.key)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                        selected
                          ? 'border-red-400 bg-red-500 text-white'
                          : 'border-slate-800 bg-slate-900 text-white'
                      }`}
                    >
                      {area.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={previousCheckpointStep}
            className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white"
          >
            Atrás
          </button>

          <button
            onClick={nextCheckpointStep}
            disabled={
              !checkpointAnswers[checkpointQuestion.key] ||
              (showPainAreas &&
                (!checkpointAnswers.painAreas ||
                  checkpointAnswers.painAreas.length === 0))
            }
            className="rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-950 disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      </section>
    </main>
  )
}

  if (screen === 'checkpointSummary') {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
        <section className="mx-auto w-full max-w-md">
          <p className="text-sm font-bold text-amber-400">
            Checkpoint completado
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight">
            Datos listos para generar la siguiente semana.
          </h1>

          <p className="mt-4 text-slate-300">
            Más adelante esta pantalla enviará la información a Supabase para ejecutar el motor semanal.
          </p>

          <div className="mt-8 space-y-3">
            {checkpointQuestions.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {item.title}
                </p>
                <p className="mt-1 font-bold text-white">
                  {checkpointAnswers[item.key] || 'Sin respuesta'}
                </p>
              </div>
            ))}
          </div>

          {dataError && (
            <div className="mt-6 rounded-2xl border border-red-500 bg-red-950/50 p-4 text-sm text-red-200">
            {dataError}
          </div>
        )}

          <button
            onClick={generateNextWeek}
            disabled={loadingData}
            className="mt-8 w-full rounded-2xl bg-amber-500 px-6 py-4 text-lg font-black text-slate-950 disabled:opacity-50"
          >
            {loadingData ? 'Generando nueva semana...' : 'Generar siguiente semana'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-amber-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-black leading-tight">
            {step.title}
          </h1>

          <p className="mt-4 text-slate-300">
            {step.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            {step.type === 'input' ? (
              <input
                value={answers[step.key] || ''}
                onChange={(event) => selectAnswer(event.target.value)}
                placeholder={step.placeholder}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-lg text-white"
              />
            ) : (
              step.options.map((option) => {
                const selected = answers[step.key] === option

                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-lg font-bold ${
                      selected
                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                        : 'border-slate-800 bg-slate-900 text-white'
                    }`}
                  >
                    {option}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={previousStep}
            className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white"
          >
            Atrás
          </button>

          <button
            onClick={nextStep}
            disabled={!answers[step.key]}
            className="rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-950 disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      </section>
    </main>
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

function WorkoutBlock({ title, exercises }) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-2xl font-black">{title}</h2>

      <div className="mt-4 space-y-3">
        {exercises.length === 0 ? (
          <p className="text-sm text-slate-400">
            No hay ejercicios cargados para este bloque.
          </p>
        ) : (
          exercises.map((item, index) => {
            const exerciseName =
              item.exercises?.display_name || item.exercise_name || 'Ejercicio'

            const hasReps = item.reps !== null && item.reps !== undefined
            const hasDuration =
              item.duration_sec !== null && item.duration_sec !== undefined

            return (
              <div
                key={item.id || `${title}-${index}`}
                className="rounded-2xl bg-slate-950 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-black text-amber-400">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold">{exerciseName}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="rounded-xl bg-slate-900 p-2">
                        <span className="block text-slate-500">Sets</span>
                        <span className="font-bold text-white">
                          {item.sets || '-'}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-900 p-2">
                        <span className="block text-slate-500">
                          {hasReps ? 'Reps' : 'Duración'}
                        </span>
                        <span className="font-bold text-white">
                          {hasReps
                            ? item.reps
                            : hasDuration
                              ? `${item.duration_sec}s`
                              : '-'}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-900 p-2">
                        <span className="block text-slate-500">Descanso</span>
                        <span className="font-bold text-white">
                          {item.rest_sec !== null && item.rest_sec !== undefined
                            ? `${item.rest_sec}s`
                            : '-'}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-900 p-2">
                        <span className="block text-slate-500">Superset</span>
                        <span className="font-bold text-white">
                          {item.superset_group || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

export default App
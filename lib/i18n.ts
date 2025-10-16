export type Language = "de" | "en" | "es" | "fr" | "zh"

export interface Translations {
  // Navigation & Common
  back: string
  save: string
  cancel: string
  delete: string
  edit: string
  view: string
  loading: string
  required: string
  optional: string

  // Auth
  signIn: string
  signUp: string
  register: string
  email: string
  password: string
  name: string
  signInLoading: string
  signUpLoading: string
  signInSuccess: string
  signUpSuccess: string
  welcomeBack: string
  welcome: string

  // Dashboard
  dashboard: string
  todayOverview: string
  quickActions: string
  recentActivity: string
  pucaiScore: string
  mealsToday: string
  currentMood: string
  trackSymptoms: string
  logMeal: string
  recordMood: string
  viewTimeline: string

  // Symptoms (PUCAI)
  symptoms: string
  pucaiQuestionnaire: string
  question: string
  bowelMovements: string
  bloodInStool: string
  stoolConsistency: string
  abdominalPain: string
  generalWellbeing: string
  activityLevel: string

  // Meals
  meals: string
  addMeal: string
  mealHistory: string
  mealName: string
  mealType: string
  mealTime: string
  ingredients: string
  notes: string
  breakfast: string
  lunch: string
  dinner: string
  snack: string
  addIngredient: string
  commonIngredients: string
  mealSaved: string

  // Mood
  mood: string
  recordMoodTitle: string
  moodScale: string
  veryBad: string
  bad: string
  neutral: string
  good: string
  veryGood: string
  moodSaved: string

  // Timeline
  timeline: string
  healthTimeline: string
  last7Days: string
  last14Days: string
  last30Days: string
  pucaiTrend: string
  moodTrend: string
  dailyMeals: string

  // Onboarding
  onboardingWelcome: string
  setupProfile: string
  age: string
  diagnosisYear: string
  currentMedication: string
  profileCreated: string

  // Language selector
  language: string
  selectLanguage: string

  // Profile Settings
  profileSettings: string
  profileSettingsDescription: string
  editProfile: string
  editProfileDescription: string
  profileUpdated: string
  profileUpdatedDescription: string
  basicInformation: string
  medicalInformation: string
  additionalNotes: string
  gender: string
  male: string
  female: string
  diverse: string
  birthDate: string
  selectGender: string
  selectMedication: string
  enterName: string
  enterEmail: string
  saveChanges: string
  notSpecified: string
  noName: string
  other: string
  none: string
  notesPlaceholder: string

  // Weight and Height
  weight: string
  height: string
  weightPlaceholder: string
  heightPlaceholder: string
  physicalInformation: string
  savingChanges: string
  changesSaved: string
  errorSaving: string
  profileSaveError: string
}

const translations: Record<Language, Translations> = {
  de: {
    // Navigation & Common
    back: "Zurück",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    view: "Ansehen",
    loading: "Wird geladen...",
    required: "Pflichtfeld",
    optional: "Optional",

    // Auth
    signIn: "Anmelden",
    signUp: "Registrieren",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",
    signInLoading: "Wird angemeldet...",
    signUpLoading: "Wird erstellt...",
    signInSuccess: "Erfolgreich angemeldet",
    signUpSuccess: "Konto erstellt",
    welcomeBack: "Willkommen zurück bei Remissio!",
    welcome: "Willkommen bei Remissio!",

    // Dashboard
    dashboard: "Dashboard",
    todayOverview: "Heutige Übersicht",
    quickActions: "Schnellaktionen",
    recentActivity: "Letzte Aktivitäten",
    pucaiScore: "PUCAI Score",
    mealsToday: "Mahlzeiten heute",
    currentMood: "Aktuelle Stimmung",
    trackSymptoms: "Symptome erfassen",
    logMeal: "Mahlzeit hinzufügen",
    recordMood: "Stimmung erfassen",
    viewTimeline: "Verlauf ansehen",

    // Symptoms (PUCAI)
    symptoms: "Symptome",
    pucaiQuestionnaire: "PUCAI Fragebogen",
    question: "Frage",
    bowelMovements: "Stuhlgang pro Tag",
    bloodInStool: "Blut im Stuhl",
    stoolConsistency: "Stuhlkonsistenz",
    abdominalPain: "Bauchschmerzen",
    generalWellbeing: "Allgemeines Wohlbefinden",
    activityLevel: "Aktivitätsniveau",

    // Meals
    meals: "Mahlzeiten",
    addMeal: "Mahlzeit hinzufügen",
    mealHistory: "Mahlzeiten-Verlauf",
    mealName: "Mahlzeit Name",
    mealType: "Mahlzeit Typ",
    mealTime: "Uhrzeit",
    ingredients: "Zutaten",
    notes: "Notizen",
    breakfast: "Frühstück",
    lunch: "Mittagessen",
    dinner: "Abendessen",
    snack: "Snack",
    addIngredient: "Hinzufügen",
    commonIngredients: "Häufige Zutaten",
    mealSaved: "Mahlzeit gespeichert",

    // Mood
    mood: "Stimmung",
    recordMoodTitle: "Stimmung erfassen",
    moodScale: "Stimmungsskala (1-5)",
    veryBad: "Sehr schlecht",
    bad: "Schlecht",
    neutral: "Neutral",
    good: "Gut",
    veryGood: "Sehr gut",
    moodSaved: "Stimmung gespeichert",

    // Timeline
    timeline: "Verlauf",
    healthTimeline: "Gesundheitsverlauf",
    last7Days: "Letzte 7 Tage",
    last14Days: "Letzte 14 Tage",
    last30Days: "Letzte 30 Tage",
    pucaiTrend: "PUCAI Verlauf",
    moodTrend: "Stimmungsverlauf",
    dailyMeals: "Tägliche Mahlzeiten",

    // Onboarding
    onboardingWelcome: "Willkommen bei Remissio",
    setupProfile: "Lassen Sie uns Ihr Profil einrichten, um Ihre Gesundheit optimal zu verfolgen.",
    age: "Alter",
    diagnosisYear: "Jahr der Diagnose",
    currentMedication: "Aktuelle Medikation",
    profileCreated: "Profil erstellt",

    // Language selector
    language: "Sprache",
    selectLanguage: "Sprache wählen",

    // Profile Settings
    profileSettings: "Profil-Einstellungen",
    profileSettingsDescription: "Verwalten Sie Ihre persönlichen Daten und medizinischen Informationen.",
    editProfile: "Profil bearbeiten",
    editProfileDescription: "Aktualisieren Sie Ihre persönlichen und medizinischen Informationen.",
    profileUpdated: "Profil aktualisiert",
    profileUpdatedDescription: "Ihre Profil-Informationen wurden erfolgreich gespeichert.",
    basicInformation: "Grundinformationen",
    medicalInformation: "Medizinische Informationen",
    additionalNotes: "Zusätzliche Notizen",
    gender: "Geschlecht",
    male: "Männlich",
    female: "Weiblich",
    diverse: "Divers",
    birthDate: "Geburtsdatum",
    selectGender: "Geschlecht wählen",
    selectMedication: "Medikation wählen",
    enterName: "Name eingeben",
    enterEmail: "E-Mail eingeben",
    saveChanges: "Änderungen speichern",
    notSpecified: "Nicht angegeben",
    noName: "Kein Name",
    other: "Andere",
    none: "Keine",
    notesPlaceholder: "Besondere Umstände, Allergien, oder andere wichtige Informationen...",

    // Weight and Height
    weight: "Gewicht",
    height: "Körpergröße",
    weightPlaceholder: "z.B. 70",
    heightPlaceholder: "z.B. 175",
    physicalInformation: "Körperliche Daten",
    savingChanges: "Änderungen werden gespeichert...",
    changesSaved: "Änderungen gespeichert!",
    errorSaving: "Fehler beim Speichern",
    profileSaveError: "Beim Speichern der Profil-Informationen ist ein Fehler aufgetreten.",
  },

  en: {
    // Navigation & Common
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    loading: "Loading...",
    required: "Required",
    optional: "Optional",

    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    signInLoading: "Signing in...",
    signUpLoading: "Creating account...",
    signInSuccess: "Successfully signed in",
    signUpSuccess: "Account created",
    welcomeBack: "Welcome back to Remissio!",
    welcome: "Welcome to Remissio!",

    // Dashboard
    dashboard: "Dashboard",
    todayOverview: "Today's Overview",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    pucaiScore: "PUCAI Score",
    mealsToday: "Meals Today",
    currentMood: "Current Mood",
    trackSymptoms: "Track Symptoms",
    logMeal: "Log Meal",
    recordMood: "Record Mood",
    viewTimeline: "View Timeline",

    // Symptoms (PUCAI)
    symptoms: "Symptoms",
    pucaiQuestionnaire: "PUCAI Questionnaire",
    question: "Question",
    bowelMovements: "Bowel movements per day",
    bloodInStool: "Blood in stool",
    stoolConsistency: "Stool consistency",
    abdominalPain: "Abdominal pain",
    generalWellbeing: "General wellbeing",
    activityLevel: "Activity level",

    // Meals
    meals: "Meals",
    addMeal: "Add Meal",
    mealHistory: "Meal History",
    mealName: "Meal Name",
    mealType: "Meal Type",
    mealTime: "Time",
    ingredients: "Ingredients",
    notes: "Notes",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    addIngredient: "Add",
    commonIngredients: "Common Ingredients",
    mealSaved: "Meal saved",

    // Mood
    mood: "Mood",
    recordMoodTitle: "Record Mood",
    moodScale: "Mood Scale (1-5)",
    veryBad: "Very Bad",
    bad: "Bad",
    neutral: "Neutral",
    good: "Good",
    veryGood: "Very Good",
    moodSaved: "Mood saved",

    // Timeline
    timeline: "Timeline",
    healthTimeline: "Health Timeline",
    last7Days: "Last 7 Days",
    last14Days: "Last 14 Days",
    last30Days: "Last 30 Days",
    pucaiTrend: "PUCAI Trend",
    moodTrend: "Mood Trend",
    dailyMeals: "Daily Meals",

    // Onboarding
    onboardingWelcome: "Welcome to Remissio",
    setupProfile: "Let us set up your profile to optimally track your health.",
    age: "Age",
    diagnosisYear: "Year of Diagnosis",
    currentMedication: "Current Medication",
    profileCreated: "Profile created",

    // Language selector
    language: "Language",
    selectLanguage: "Select Language",

    // Profile Settings
    profileSettings: "Profile Settings",
    profileSettingsDescription: "Manage your personal data and medical information.",
    editProfile: "Edit Profile",
    editProfileDescription: "Update your personal and medical information.",
    profileUpdated: "Profile Updated",
    profileUpdatedDescription: "Your profile information has been successfully saved.",
    basicInformation: "Basic Information",
    medicalInformation: "Medical Information",
    additionalNotes: "Additional Notes",
    gender: "Gender",
    male: "Male",
    female: "Female",
    diverse: "Diverse",
    birthDate: "Birth Date",
    selectGender: "Select Gender",
    selectMedication: "Select Medication",
    enterName: "Enter Name",
    enterEmail: "Enter Email",
    saveChanges: "Save Changes",
    notSpecified: "Not Specified",
    noName: "No Name",
    other: "Other",
    none: "None",
    notesPlaceholder: "Special circumstances, allergies, or other important information...",

    // Weight and Height
    weight: "Weight",
    height: "Height",
    weightPlaceholder: "e.g. 70",
    heightPlaceholder: "e.g. 175",
    physicalInformation: "Physical Information",
    savingChanges: "Saving changes...",
    changesSaved: "Changes saved!",
    errorSaving: "Error saving",
    profileSaveError: "An error occurred while saving your profile information.",
  },

  es: {
    // Navigation & Common
    back: "Atrás",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    loading: "Cargando...",
    required: "Requerido",
    optional: "Opcional",

    // Auth
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    register: "Registrarse",
    email: "Correo",
    password: "Contraseña",
    name: "Nombre",
    signInLoading: "Iniciando sesión...",
    signUpLoading: "Creando cuenta...",
    signInSuccess: "Sesión iniciada exitosamente",
    signUpSuccess: "Cuenta creada",
    welcomeBack: "¡Bienvenido de vuelta a Remissio!",
    welcome: "¡Bienvenido a Remissio!",

    // Dashboard
    dashboard: "Panel",
    todayOverview: "Resumen de Hoy",
    quickActions: "Acciones Rápidas",
    recentActivity: "Actividad Reciente",
    pucaiScore: "Puntuación PUCAI",
    mealsToday: "Comidas Hoy",
    currentMood: "Estado de Ánimo Actual",
    trackSymptoms: "Rastrear Síntomas",
    logMeal: "Registrar Comida",
    recordMood: "Registrar Estado de Ánimo",
    viewTimeline: "Ver Cronología",

    // Symptoms (PUCAI)
    symptoms: "Síntomas",
    pucaiQuestionnaire: "Cuestionario PUCAI",
    question: "Pregunta",
    bowelMovements: "Deposiciones por día",
    bloodInStool: "Sangre en las heces",
    stoolConsistency: "Consistencia de las heces",
    abdominalPain: "Dolor abdominal",
    generalWellbeing: "Bienestar general",
    activityLevel: "Nivel de actividad",

    // Meals
    meals: "Comidas",
    addMeal: "Agregar Comida",
    mealHistory: "Historial de Comidas",
    mealName: "Nombre de la Comida",
    mealType: "Tipo de Comida",
    mealTime: "Hora",
    ingredients: "Ingredientes",
    notes: "Notas",
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Merienda",
    addIngredient: "Agregar",
    commonIngredients: "Ingredientes Comunes",
    mealSaved: "Comida guardada",

    // Mood
    mood: "Estado de Ánimo",
    recordMoodTitle: "Registrar Estado de Ánimo",
    moodScale: "Escala de Estado de Ánimo (1-5)",
    veryBad: "Muy Malo",
    bad: "Malo",
    neutral: "Neutral",
    good: "Bueno",
    veryGood: "Muy Bueno",
    moodSaved: "Estado de ánimo guardado",

    // Timeline
    timeline: "Cronología",
    healthTimeline: "Cronología de Salud",
    last7Days: "Últimos 7 Días",
    last14Days: "Últimos 14 Días",
    last30Days: "Últimos 30 Días",
    pucaiTrend: "Tendencia PUCAI",
    moodTrend: "Tendencia del Estado de Ánimo",
    dailyMeals: "Comidas Diarias",

    // Onboarding
    onboardingWelcome: "Bienvenido a Remissio",
    setupProfile: "Configuremos su perfil para rastrear óptimamente su salud.",
    age: "Edad",
    diagnosisYear: "Año de Diagnóstico",
    currentMedication: "Medicación Actual",
    profileCreated: "Perfil creado",

    // Language selector
    language: "Idioma",
    selectLanguage: "Seleccionar Idioma",

    // Profile Settings
    profileSettings: "Configuración del Perfil",
    profileSettingsDescription: "Gestiona tus datos personales e información médica.",
    editProfile: "Editar Perfil",
    editProfileDescription: "Actualiza tu información personal y médica.",
    profileUpdated: "Perfil Actualizado",
    profileUpdatedDescription: "Tu información de perfil se ha guardado exitosamente.",
    basicInformation: "Información Básica",
    medicalInformation: "Información Médica",
    additionalNotes: "Notas Adicionales",
    gender: "Género",
    male: "Masculino",
    female: "Femenino",
    diverse: "Diverso",
    birthDate: "Fecha de Nacimiento",
    selectGender: "Seleccionar Género",
    selectMedication: "Seleccionar Medicación",
    enterName: "Ingresar Nombre",
    enterEmail: "Ingresar Email",
    saveChanges: "Guardar Cambios",
    notSpecified: "No Especificado",
    noName: "Sin Nombre",
    other: "Otro",
    none: "Ninguno",
    notesPlaceholder: "Circunstancias especiales, alergias u otra información importante...",

    // Weight and Height
    weight: "Peso",
    height: "Altura",
    weightPlaceholder: "ej. 70",
    heightPlaceholder: "ej. 175",
    physicalInformation: "Información Física",
    savingChanges: "Guardando cambios...",
    changesSaved: "¡Cambios guardados!",
    errorSaving: "Error al guardar",
    profileSaveError: "Ocurrió un error al guardar tu información de perfil.",
  },

  fr: {
    // Navigation & Common
    back: "Retour",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    loading: "Chargement...",
    required: "Requis",
    optional: "Optionnel",

    // Auth
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",
    signInLoading: "Connexion...",
    signUpLoading: "Création du compte...",
    signInSuccess: "Connexion réussie",
    signUpSuccess: "Compte créé",
    welcomeBack: "Bienvenue sur Remissio !",
    welcome: "Bienvenue sur Remissio !",

    // Dashboard
    dashboard: "Tableau de bord",
    todayOverview: "Aperçu d'aujourd'hui",
    quickActions: "Actions Rapides",
    recentActivity: "Activité Récente",
    pucaiScore: "Score PUCAI",
    mealsToday: "Repas d'aujourd'hui",
    currentMood: "Humeur Actuelle",
    trackSymptoms: "Suivre les Symptômes",
    logMeal: "Enregistrer un Repas",
    recordMood: "Enregistrer l'Humeur",
    viewTimeline: "Voir la Chronologie",

    // Symptoms (PUCAI)
    symptoms: "Symptômes",
    pucaiQuestionnaire: "Questionnaire PUCAI",
    question: "Question",
    bowelMovements: "Selles par jour",
    bloodInStool: "Sang dans les selles",
    stoolConsistency: "Consistance des selles",
    abdominalPain: "Douleur abdominale",
    generalWellbeing: "Bien-être général",
    activityLevel: "Niveau d'activité",

    // Meals
    meals: "Repas",
    addMeal: "Ajouter un Repas",
    mealHistory: "Historique des Repas",
    mealName: "Nom du Repas",
    mealType: "Type de Repas",
    mealTime: "Heure",
    ingredients: "Ingrédients",
    notes: "Notes",
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation",
    addIngredient: "Ajouter",
    commonIngredients: "Ingrédients Courants",
    mealSaved: "Repas enregistré",

    // Mood
    mood: "Humeur",
    recordMoodTitle: "Enregistrer l'Humeur",
    moodScale: "Échelle d'Humeur (1-5)",
    veryBad: "Très Mauvais",
    bad: "Mauvais",
    neutral: "Neutre",
    good: "Bon",
    veryGood: "Très Bon",
    moodSaved: "Humeur enregistrée",

    // Timeline
    timeline: "Chronologie",
    healthTimeline: "Chronologie de Santé",
    last7Days: "7 Derniers Jours",
    last14Days: "14 Derniers Jours",
    last30Days: "30 Derniers Jours",
    pucaiTrend: "Tendance PUCAI",
    moodTrend: "Tendance de l'Humeur",
    dailyMeals: "Repas Quotidiens",

    // Onboarding
    onboardingWelcome: "Bienvenue sur Remissio",
    setupProfile: "Configurons votre profil pour suivre votre santé de manière optimale.",
    age: "Âge",
    diagnosisYear: "Année de Diagnostic",
    currentMedication: "Médication Actuelle",
    profileCreated: "Profil créé",

    // Language selector
    language: "Langue",
    selectLanguage: "Sélectionner la Langue",

    // Profile Settings
    profileSettings: "Paramètres du Profil",
    profileSettingsDescription: "Gérez vos données personnelles et informations médicales.",
    editProfile: "Modifier le Profil",
    editProfileDescription: "Mettez à jour vos informations personnelles et médicales.",
    profileUpdated: "Profil Mis à Jour",
    profileUpdatedDescription: "Vos informations de profil ont été sauvegardées avec succès.",
    basicInformation: "Informations de Base",
    medicalInformation: "Informations Médicales",
    additionalNotes: "Notes Supplémentaires",
    gender: "Genre",
    male: "Masculin",
    female: "Féminin",
    diverse: "Divers",
    birthDate: "Date de Naissance",
    selectGender: "Sélectionner le Genre",
    selectMedication: "Sélectionner la Médication",
    enterName: "Entrer le Nom",
    enterEmail: "Entrer l'Email",
    saveChanges: "Sauvegarder les Modifications",
    notSpecified: "Non Spécifié",
    noName: "Pas de Nom",
    other: "Autre",
    none: "Aucun",
    notesPlaceholder: "Circonstances particulières, allergies ou autres informations importantes...",

    // Weight and Height
    weight: "Poids",
    height: "Taille",
    weightPlaceholder: "ex. 70",
    heightPlaceholder: "ex. 175",
    physicalInformation: "Informations Physiques",
    savingChanges: "Sauvegarde en cours...",
    changesSaved: "Modifications sauvegardées !",
    errorSaving: "Erreur de sauvegarde",
    profileSaveError: "Une erreur s'est produite lors de la sauvegarde de vos informations de profil.",
  },

  zh: {
    // Navigation & Common
    back: "返回",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    view: "查看",
    loading: "加载中...",
    required: "必填",
    optional: "可选",

    // Auth
    signIn: "登录",
    signUp: "注册",
    register: "注册",
    email: "邮箱",
    password: "密码",
    name: "姓名",
    signInLoading: "登录中...",
    signUpLoading: "创建账户中...",
    signInSuccess: "登录成功",
    signUpSuccess: "账户已创建",
    welcomeBack: "欢迎回到 Remissio！",
    welcome: "欢迎使用 Remissio！",

    // Dashboard
    dashboard: "仪表板",
    todayOverview: "今日概览",
    quickActions: "快速操作",
    recentActivity: "最近活动",
    pucaiScore: "PUCAI 评分",
    mealsToday: "今日用餐",
    currentMood: "当前心情",
    trackSymptoms: "记录症状",
    logMeal: "记录用餐",
    recordMood: "记录心情",
    viewTimeline: "查看时间线",

    // Symptoms (PUCAI)
    symptoms: "症状",
    pucaiQuestionnaire: "PUCAI 问卷",
    question: "问题",
    bowelMovements: "每日排便次数",
    bloodInStool: "便血",
    stoolConsistency: "大便性状",
    abdominalPain: "腹痛",
    generalWellbeing: "总体健康状况",
    activityLevel: "活动水平",

    // Meals
    meals: "用餐",
    addMeal: "添加用餐",
    mealHistory: "用餐历史",
    mealName: "餐名",
    mealType: "餐型",
    mealTime: "时间",
    ingredients: "食材",
    notes: "备注",
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "零食",
    addIngredient: "添加",
    commonIngredients: "常用食材",
    mealSaved: "用餐已保存",

    // Mood
    mood: "心情",
    recordMoodTitle: "记录心情",
    moodScale: "心情量表 (1-5)",
    veryBad: "很差",
    bad: "差",
    neutral: "一般",
    good: "好",
    veryGood: "很好",
    moodSaved: "心情已保存",

    // Timeline
    timeline: "时间线",
    healthTimeline: "健康时间线",
    last7Days: "过去7天",
    last14Days: "过去14天",
    last30Days: "过去30天",
    pucaiTrend: "PUCAI 趋势",
    moodTrend: "心情趋势",
    dailyMeals: "每日用餐",

    // Onboarding
    onboardingWelcome: "欢迎使用 Remissio",
    setupProfile: "让我们设置您的个人资料，以便更好地跟踪您的健康状况。",
    age: "年龄",
    diagnosisYear: "诊断年份",
    currentMedication: "当前用药",
    profileCreated: "个人资料已创建",

    // Language selector
    language: "语言",
    selectLanguage: "选择语言",

    // Profile Settings
    profileSettings: "个人资料设置",
    profileSettingsDescription: "管理您的个人数据和医疗信息。",
    editProfile: "编辑个人资料",
    editProfileDescription: "更新您的个人和医疗信息。",
    profileUpdated: "个人资料已更新",
    profileUpdatedDescription: "您的个人资料信息已成功保存。",
    basicInformation: "基本信息",
    medicalInformation: "医疗信息",
    additionalNotes: "附加备注",
    gender: "性别",
    male: "男性",
    female: "女性",
    diverse: "其他",
    birthDate: "出生日期",
    selectGender: "选择性别",
    selectMedication: "选择药物",
    enterName: "输入姓名",
    enterEmail: "输入邮箱",
    saveChanges: "保存更改",
    notSpecified: "未指定",
    noName: "无姓名",
    other: "其他",
    none: "无",
    notesPlaceholder: "特殊情况、过敏或其他重要信息...",

    // Weight and Height
    weight: "体重",
    height: "身高",
    weightPlaceholder: "例如 70",
    heightPlaceholder: "例如 175",
    physicalInformation: "身体信息",
    savingChanges: "正在保存更改...",
    changesSaved: "更改已保存！",
    errorSaving: "保存错误",
    profileSaveError: "保存个人资料信息时发生错误。",
  },
}

export function useTranslation(language: Language = "de") {
  return {
    t: translations[language],
    language,
  }
}

export function getAvailableLanguages(): { code: Language; name: string; flag: string }[] {
  return [
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]
}

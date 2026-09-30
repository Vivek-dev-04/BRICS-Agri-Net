import { BricsLanguage } from "./languages";

export interface TranslationsSchema {
  nav: {
    portalTitle: string;
    tagline: string;
    officialBadge: string;
    topRibbon: string;
    myFarms: string;
    cropPlanner: string;
    diseaseDiagnostics: string;
    bricsCommons: string;
    database: string;
    cadsApi: string;
    inspectDb: string;
    signIn: string;
    signOut: string;
    switchFarmer: string;
  };
  common: {
    back: string;
    cancel: string;
    save: string;
    submit: string;
    refresh: string;
    download: string;
    search: string;
    all: string;
    verifiedFarmer: string;
    healthy: string;
    moderate: string;
    critical: string;
    active: string;
    language: string;
    selectLanguage: string;
    close: string;
    view: string;
    delete: string;
  };
  dashboard: {
    welcome: string;
    activeParcel: string;
    overviewTitle: string;
    soilHealthScore: string;
    soilStatus: string;
    irrigationNeed: string;
    weatherToday: string;
    canopyNdvi: string;
    quickActions: string;
    generateAdvisory: string;
    diagnoseLeaves: string;
    planNextCrop: string;
    recentDiagnostics: string;
    farmDetails: string;
    acreage: string;
    primaryCrop: string;
    soilType: string;
    irrigationType: string;
    location: string;
  };
  advisory: {
    title: string;
    subtitle: string;
    farmerView: string;
    agronomistView: string;
    listenAloud: string;
    stopAudio: string;
    printSlip: string;
    recalculate: string;
    irrigationTitle: string;
    soilTitle: string;
    diseaseTitle: string;
    regenerativeTitle: string;
    actionExplanation: string;
    feedbackQuestion: string;
    feedbackClear: string;
    feedbackRecalibrate: string;
    feedbackThanks: string;
    telemetryFeeds: string;
  };
  disease: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    tapToChoose: string;
    takePhoto: string;
    browseGallery: string;
    quickSamples: string;
    runningInference: string;
    diagnosticResult: string;
    visibleSymptoms: string;
    organicRemedy: string;
    chemicalRemedy: string;
    immediateActions: string;
    preventiveControls: string;
    dosageCalculator: string;
    sprayingMethod: string;
    parcelAcreage: string;
    totalWater: string;
    chemicalReq: string;
    organicBioReq: string;
    scoutingHistory: string;
    bricsSurveillance: string;
  };
  cropPlanner: {
    title: string;
    subtitle: string;
    targetSeason: string;
    strategicGoal: string;
    reAnalyze: string;
    rankedOptions: string;
    suitabilityScore: string;
    sowingWindow: string;
    waterNeed: string;
    expectedYield: string;
    estRevenue: string;
    soilRationale: string;
    climateResilience: string;
    regenerativeBenefits: string;
  };
  commons: {
    title: string;
    subtitle: string;
    fieldExchangeTab: string;
    modelsRegistryTab: string;
    macroTelemetryTab: string;
    publishPractice: string;
    filterNation: string;
    practiceArea: string;
    measuredFieldImpact: string;
    upvotes: string;
    peerDiscussion: string;
    share: string;
    runSimulation: string;
    downloadSpec: string;
  };
}

export const PLATFORM_TRANSLATIONS: Record<BricsLanguage, TranslationsSchema> = {
  en: {
    nav: {
      portalTitle: "BRICS Agri-Net",
      tagline: "Agricultural Advisory & Telemetry Portal",
      officialBadge: "OFFICIAL",
      topRibbon: "Interoperable Digital Public Infrastructure for Climate-Resilient Farming",
      myFarms: "My Farms",
      cropPlanner: "Crop Planner",
      diseaseDiagnostics: "Disease Diagnostics",
      bricsCommons: "BRICS Commons & Models",
      database: "Database (DB)",
      cadsApi: "CADS API",
      inspectDb: "Inspect DB",
      signIn: "Farmer Sign In",
      signOut: "Sign Out",
      switchFarmer: "Switch Farmer",
    },
    common: {
      back: "Back",
      cancel: "Cancel",
      save: "Save",
      submit: "Submit",
      refresh: "Refresh",
      download: "Download",
      search: "Search",
      all: "All",
      verifiedFarmer: "Verified Farmer",
      healthy: "Healthy",
      moderate: "Moderate",
      critical: "Critical",
      active: "Active",
      language: "Language",
      selectLanguage: "Select Language",
      close: "Close",
      view: "View",
      delete: "Delete",
    },
    dashboard: {
      welcome: "Welcome back",
      activeParcel: "Active Farm Parcel",
      overviewTitle: "Real-Time Field Telemetry & Soil Health",
      soilHealthScore: "Soil Health Score",
      soilStatus: "Pedological Balance",
      irrigationNeed: "Irrigation Need",
      weatherToday: "Weather & Evaporative Demand",
      canopyNdvi: "Canopy Chlorophyll NDVI",
      quickActions: "Farmer Operational Actions",
      generateAdvisory: "Generate AI Field Advisory",
      diagnoseLeaves: "Scan Leaves for Disease",
      planNextCrop: "Plan Next Crop Rotation",
      recentDiagnostics: "Recent Disease Scans",
      farmDetails: "Farm Parcel Specification",
      acreage: "Area (Acres)",
      primaryCrop: "Primary Crop",
      soilType: "Soil Pedology",
      irrigationType: "Irrigation Setup",
      location: "Grid Location",
    },
    advisory: {
      title: "Localized Field Advisory",
      subtitle: "Customized guidance telling you exactly what actions to take today regarding water, fertilizer, disease watch, and regenerative soil health.",
      farmerView: "Farmer View",
      agronomistView: "Agronomist Data",
      listenAloud: "Listen Aloud",
      stopAudio: "Stop Audio",
      printSlip: "Print Slip",
      recalculate: "Re-Calculate",
      irrigationTitle: "1. Irrigation Scheduling",
      soilTitle: "2. Soil & Nutrient Protocol",
      diseaseTitle: "3. Disease & Climate Risk Watch",
      regenerativeTitle: "4. Regenerative Agriculture Practice",
      actionExplanation: "Action & Explanation:",
      feedbackQuestion: "Was this advisory clear and actionable for your field work today?",
      feedbackClear: "Clear & Actionable",
      feedbackRecalibrate: "Needs Recalibration",
      feedbackThanks: "Thank you! Your feedback improves our BRICS cooperative model.",
      telemetryFeeds: "What Data Fed This Advisory:",
    },
    disease: {
      title: "Leaf Disease Vision Diagnostic",
      subtitle: "Take a photo of any unhealthy leaves on your farm. AI detects the disease, calculates field spray dosages, and prescribes eco-friendly remedies.",
      uploadTitle: "Upload or Snap Leaf Photo",
      tapToChoose: "Tap to Choose Photo from Device",
      takePhoto: "Take Photo with Camera",
      browseGallery: "Browse Gallery",
      quickSamples: "Or Test with Calibrated BRICS Pathogen Samples:",
      runningInference: "Running Vision Model Inference...",
      diagnosticResult: "Diagnostic Assessment",
      visibleSymptoms: "Visible Symptoms on Leaf:",
      organicRemedy: "Organic Biological Remedy",
      chemicalRemedy: "Agronomic Chemical Protocol",
      immediateActions: "Immediate Field Action Steps",
      preventiveControls: "Preventive Cultural Controls",
      dosageCalculator: "Field Application Dosage Calculator",
      sprayingMethod: "Spraying Method",
      parcelAcreage: "Parcel Acreage",
      totalWater: "Total Water Required",
      chemicalReq: "Chemical Requirement:",
      organicBioReq: "Organic Bio-Extract:",
      scoutingHistory: "Field Scouting & Diagnostic History",
      bricsSurveillance: "BRICS Pathogen Surveillance Watch",
    },
    cropPlanner: {
      title: "What Should Be Planted Next?",
      subtitle: "AI crop planning engine that analyzes soil chemistry, local weather patterns, and water availability to prescribe high-yield, resilient crop selections.",
      targetSeason: "Target Season:",
      strategicGoal: "Farmer Strategic Goal:",
      reAnalyze: "Re-Analyze Farm",
      rankedOptions: "Ranked Crop Recommendations",
      suitabilityScore: "Suitability Match",
      sowingWindow: "Sowing Window",
      waterNeed: "Water Need",
      expectedYield: "Expected Yield",
      estRevenue: "Est. Revenue",
      soilRationale: "Soil Suitability Rationale:",
      climateResilience: "Climate & Water Resilience:",
      regenerativeBenefits: "Soil Regenerative Benefits:",
    },
    commons: {
      title: "BRICS Shared Data Models & Farmer Commons",
      subtitle: "Open digital public platform connecting farmers, national agronomic institutes (EMBRAPA, ICAR, CAAS, RAS, ARC), and standardized CADS cross-border data telemetry.",
      fieldExchangeTab: "Farmer Commons & Field Exchange",
      modelsRegistryTab: "Shared Data Models Registry",
      macroTelemetryTab: "Member State Macro Telemetry",
      publishPractice: "Publish Field Practice",
      filterNation: "Nation:",
      practiceArea: "Practice Area:",
      measuredFieldImpact: "Measured Field Impact:",
      upvotes: "Upvotes",
      peerDiscussion: "Peer Discussion",
      share: "Share",
      runSimulation: "Run Live Simulation",
      downloadSpec: "Download Spec",
    },
  },

  hi: {
    nav: {
      portalTitle: "ब्रिक्स एग्री-नेट",
      tagline: "कृषि परामर्श एवं टेलीमेट्री पोर्टल",
      officialBadge: "आधिकारिक",
      topRibbon: "जलवायु-सहिष्णु खेती के लिए अंतर-संचालनीय डिजिटल सार्वजनिक अवसंरचना",
      myFarms: "मेरे खेत",
      cropPlanner: "फसल योजना",
      diseaseDiagnostics: "रोग निदान",
      bricsCommons: "ब्रिक्स साझा मंच",
      database: "डेटाबेस (DB)",
      cadsApi: "कैड्स एपीआई",
      inspectDb: "डेटाबेस देखें",
      signIn: "किसान साइन इन",
      signOut: "साइन आउट",
      switchFarmer: "किसान बदलें",
    },
    common: {
      back: "वापस",
      cancel: "रद्द करें",
      save: "सुरक्षित करें",
      submit: "जमा करें",
      refresh: "ताज़ा करें",
      download: "डाउनलोड",
      search: "खोजें",
      all: "सभी",
      verifiedFarmer: "सत्यापित किसान",
      healthy: "स्वस्थ",
      moderate: "मध्यम",
      critical: "गंभीर",
      active: "सक्रिय",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
      close: "बंद करें",
      view: "देखें",
      delete: "हटाएं",
    },
    dashboard: {
      welcome: "स्वागत है",
      activeParcel: "सक्रिय खेत पार्सल",
      overviewTitle: "वास्तविक समय खेत टेलीमेट्री और मृदा स्वास्थ्य",
      soilHealthScore: "मृदा स्वास्थ्य स्कोर",
      soilStatus: "मृदा पोषक संतुलन",
      irrigationNeed: "सिंचाई आवश्यकता",
      weatherToday: "मौसम एवं वाष्पीकरण मांग",
      canopyNdvi: "पत्ती क्लोरोफिल (NDVI)",
      quickActions: "किसान कार्य योजना",
      generateAdvisory: "एआई कृषि परामर्श प्राप्त करें",
      diagnoseLeaves: "पत्ती रोग की जांच करें",
      planNextCrop: "अगली फसल चक्र की योजना बनाएं",
      recentDiagnostics: "हाल के रोग परीक्षण",
      farmDetails: "खेत पार्सल विवरण",
      acreage: "क्षेत्रफल (एकड़)",
      primaryCrop: "मुख्य फसल",
      soilType: "मृदा प्रकार",
      irrigationType: "सिंचाई प्रणाली",
      location: "ग्रिड स्थान",
    },
    advisory: {
      title: "स्थानीयकृत कृषि परामर्श",
      subtitle: "अनुकूलित मार्गदर्शन जो आपको बताता है कि आज सिंचाई, खाद, रोग निगरानी और मृदा सुधार पर क्या कदम उठाने हैं।",
      farmerView: "किसान दृश्य",
      agronomistView: "कृषि वैज्ञानिक डेटा",
      listenAloud: "सुनें (ऑडियो)",
      stopAudio: "ऑडियो रोकें",
      printSlip: "पर्ची प्रिंट करें",
      recalculate: "पुनः गणना करें",
      irrigationTitle: "1. सिंचाई अनुसूची",
      soilTitle: "2. मृदा एवं पोषण प्रोटोकॉल",
      diseaseTitle: "3. रोग एवं मौसम जोखिम निगरानी",
      regenerativeTitle: "4. पुनर्योजी कृषि अभ्यास",
      actionExplanation: "कार्रवाई एवं कारण:",
      feedbackQuestion: "क्या यह सलाह आपके आज के खेत कार्य के लिए स्पष्ट और उपयोगी थी?",
      feedbackClear: "स्पष्ट और उपयोगी",
      feedbackRecalibrate: "सुधार की आवश्यकता है",
      feedbackThanks: "धन्यवाद! आपकी प्रतिक्रिया हमारे ब्रिक्स सहयोगी मॉडल को मजबूत बनाती है।",
      telemetryFeeds: "इस सलाह के मुख्य डेटा स्रोत:",
    },
    disease: {
      title: "पत्ती रोग दृष्टि निदान",
      subtitle: "खेत की किसी भी अस्वस्थ पत्ती की तस्वीर लें। एआई रोग की तुरंत पहचान करता है, छिड़काव खुराक की गणना करता है और जैविक उपचार बताता है।",
      uploadTitle: "पत्ती की तस्वीर अपलोड करें या खींचें",
      tapToChoose: "डिवाइस से तस्वीर चुनें",
      takePhoto: "कैमरे से तस्वीर लें",
      browseGallery: "गैलरी से चुनें",
      quickSamples: "या ब्रिक्स पैथोलॉजी नमूनों के साथ परीक्षण करें:",
      runningInference: "विज़न मॉडल परीक्षण चल रहा है...",
      diagnosticResult: "निदान मूल्यांकन",
      visibleSymptoms: "पत्ती पर दिखाई देने वाले लक्षण:",
      organicRemedy: "जैविक उपचार",
      chemicalRemedy: "कृषि रासायनिक प्रोटोकॉल",
      immediateActions: "तत्काल खेत कार्रवाई कदम",
      preventiveControls: "रोकथाम और नियंत्रण उपाय",
      dosageCalculator: "खेत छिड़काव खुराक कैलकुलेटर",
      sprayingMethod: "छिड़काव विधि",
      parcelAcreage: "खेत का रकबा (एकड़)",
      totalWater: "कुल आवश्यक पानी",
      chemicalReq: "रासायनिक आवश्यकता:",
      organicBioReq: "जैविक सत्व:",
      scoutingHistory: "खेत निगरानी एवं निदान इतिहास",
      bricsSurveillance: "ब्रिक्स रोगजनक निगरानी अलर्ट",
    },
    cropPlanner: {
      title: "अगली फसल क्या बोएं?",
      subtitle: "एआई फसल योजना इंजन जो आपकी मिट्टी, स्थानीय मौसम और पानी की उपलब्धता का विश्लेषण कर लाभकारी और जलवायु-सहिष्णु फसलें सुझाता है।",
      targetSeason: "लक्षित मौसम:",
      strategicGoal: "किसान की प्राथमिकता:",
      reAnalyze: "खेत का पुनः विश्लेषण करें",
      rankedOptions: "प्राथमिकता अनुसार फसल अनुशंसाएं",
      suitabilityScore: "सटीकता स्कोर",
      sowingWindow: "बुवाई की अवधि",
      waterNeed: "पानी की आवश्यकता",
      expectedYield: "अनुमानित उपज",
      estRevenue: "अनुमानित आय",
      soilRationale: "मृदा अनुकूलता कारण:",
      climateResilience: "जलवायु एवं जल सहिष्णुता:",
      regenerativeBenefits: "मृदा पुनर्योजी लाभ:",
    },
    commons: {
      title: "ब्रिक्स साझा डेटा मॉडल एवं किसान मंच",
      subtitle: "किसानों, राष्ट्रीय कृषि संस्थानों (EMBRAPA, ICAR, CAAS, RAS, ARC) और मानकीकृत कैड्स क्रॉस-बॉर्डर टेलीमेट्री को जोड़ने वाला खुला मंच।",
      fieldExchangeTab: "किसान मंच एवं अनुभव साझाकरण",
      modelsRegistryTab: "साझा डेटा मॉडल रजिस्ट्री",
      macroTelemetryTab: "सदस्य राष्ट्र मैक्रो टेलीमेट्री",
      publishPractice: "खेत का अनुभव प्रकाशित करें",
      filterNation: "राष्ट्र:",
      practiceArea: "कार्य क्षेत्र:",
      measuredFieldImpact: "मापा गया खेत प्रभाव:",
      upvotes: "समर्थन",
      peerDiscussion: "साथी चर्चा",
      share: "साझा करें",
      runSimulation: "लाइव सिमुलेशन चलाएं",
      downloadSpec: "विशिष्टता डाउनलोड करें",
    },
  },

  pt: {
    nav: {
      portalTitle: "BRICS Agri-Net",
      tagline: "Portal de Assessoria e Telemetria Agrícola",
      officialBadge: "OFICIAL",
      topRibbon: "Infraestrutura Pública Digital Interoperável para Agricultura Resiliente ao Clima",
      myFarms: "Minhas Fazendas",
      cropPlanner: "Planejador de Culturas",
      diseaseDiagnostics: "Diagnóstico de Doenças",
      bricsCommons: "Comunidade e Modelos BRICS",
      database: "Banco de Dados (BD)",
      cadsApi: "API CADS",
      inspectDb: "Inspecionar BD",
      signIn: "Entrar Agricultor",
      signOut: "Sair",
      switchFarmer: "Trocar Agricultor",
    },
    common: {
      back: "Voltar",
      cancel: "Cancelar",
      save: "Salvar",
      submit: "Enviar",
      refresh: "Atualizar",
      download: "Baixar",
      search: "Buscar",
      all: "Todos",
      verifiedFarmer: "Agricultor Verificado",
      healthy: "Saudável",
      moderate: "Moderado",
      critical: "Crítico",
      active: "Ativo",
      language: "Idioma",
      selectLanguage: "Selecione o Idioma",
      close: "Fechar",
      view: "Ver",
      delete: "Excluir",
    },
    dashboard: {
      welcome: "Bem-vindo de volta",
      activeParcel: "Talhão Agrícola Ativo",
      overviewTitle: "Telemetria de Campo e Saúde do Solo em Tempo Real",
      soilHealthScore: "Índice de Saúde do Solo",
      soilStatus: "Equilíbrio Nutricional",
      irrigationNeed: "Necessidade de Irrigação",
      weatherToday: "Clima e Demanda Evaporativa",
      canopyNdvi: "NDVI de Clorofila da Copa",
      quickActions: "Ações Operacionais do Produtor",
      generateAdvisory: "Gerar Assessoria Agronômica com IA",
      diagnoseLeaves: "Escanear Folhas para Doenças",
      planNextCrop: "Planejar Rotação da Próxima Safra",
      recentDiagnostics: "Varreduras Recentes de Doenças",
      farmDetails: "Especificação do Talhão",
      acreage: "Área (Acres)",
      primaryCrop: "Cultura Principal",
      soilType: "Pedologia do Solo",
      irrigationType: "Sistema de Irrigação",
      location: "Coordenadas da Grade",
    },
    advisory: {
      title: "Assessoria de Campo Localizada",
      subtitle: "Orientações sob medida indicando exatamente quais ações tomar hoje quanto a irrigação, adubação, pragas e práticas regenerativas.",
      farmerView: "Visão do Produtor",
      agronomistView: "Dados do Agrônomo",
      listenAloud: "Ouvir em Voz Alta",
      stopAudio: "Parar Áudio",
      printSlip: "Imprimir Ordem",
      recalculate: "Recalcular",
      irrigationTitle: "1. Agendamento de Irrigação",
      soilTitle: "2. Protocolo de Solo e Nutrientes",
      diseaseTitle: "3. Monitoramento de Doenças e Risco Climático",
      regenerativeTitle: "4. Prática Agrícola Regenerativa",
      actionExplanation: "Ação e Justificativa Técnica:",
      feedbackQuestion: "Esta recomendação foi clara e aplicável no seu manejo hoje?",
      feedbackClear: "Clara e Aplicável",
      feedbackRecalibrate: "Necessita Calibração",
      feedbackThanks: "Obrigado! Seu feedback aprimora os modelos cooperativos dos BRICS.",
      telemetryFeeds: "Fontes de Dados Integradas:",
    },
    disease: {
      title: "Diagnóstico Visual de Doenças Foliares",
      subtitle: "Tire uma foto das folhas danificadas. A IA identifica patógenos, calcula dosagens exatas de pulverização e prescreve tratamentos biológicos.",
      uploadTitle: "Enviar ou Fotografar Folha",
      tapToChoose: "Toque para Escolher Foto do Dispositivo",
      takePhoto: "Tirar Foto com a Câmera",
      browseGallery: "Escolher da Galeria",
      quickSamples: "Ou Teste com Amostras Calibradas dos BRICS:",
      runningInference: "Executando Inferência do Modelo de Visão...",
      diagnosticResult: "Avaliação do Diagnóstico",
      visibleSymptoms: "Sintomas Visíveis na Folha:",
      organicRemedy: "Tratamento Biológico Orgânico",
      chemicalRemedy: "Protocolo Químico Agronômico",
      immediateActions: "Ações Imediatas de Campo",
      preventiveControls: "Manejo Cultural Preventivo",
      dosageCalculator: "Calculadora de Dosagem para Pulverização",
      sprayingMethod: "Método de Aplicação",
      parcelAcreage: "Área do Talhão (Acres)",
      totalWater: "Volume Total de Calda",
      chemicalReq: "Necessidade Química:",
      organicBioReq: "Bioextrato Orgânico:",
      scoutingHistory: "Histórico de Monitoramento e Diagnóstico",
      bricsSurveillance: "Rede de Vigilância Fitossanitária BRICS",
    },
    cropPlanner: {
      title: "O que Plantar na Próxima Safra?",
      subtitle: "Mecanismo de IA que cruza nutrientes do solo, histórico meteorológico e disponibilidade hídrica para recomendar culturas de alta rentabilidade.",
      targetSeason: "Safra Alvo:",
      strategicGoal: "Objetivo do Produtor:",
      reAnalyze: "Reanalisar Talhão",
      rankedOptions: "Recomendações Ranqueadas por Aptidão",
      suitabilityScore: "Índice de Aptidão",
      sowingWindow: "Janela de Semeadura",
      waterNeed: "Consumo Hídrico",
      expectedYield: "Produtividade Estimada",
      estRevenue: "Receita Projetada",
      soilRationale: "Compatibilidade com o Solo:",
      climateResilience: "Resiliência Climática e Hídrica:",
      regenerativeBenefits: "Benefícios Regenerativos ao Solo:",
    },
    commons: {
      title: "Modelos Compartilhados e Fórum de Produtores BRICS",
      subtitle: "Plataforma pública aberta conectando produtores rurais, institutos de pesquisa (EMBRAPA, ICAR, CAAS, RAS, ARC) e telemetria CADS.",
      fieldExchangeTab: "Troca de Experiências de Campo",
      modelsRegistryTab: "Registro de Modelos Científicos",
      macroTelemetryTab: "Telemetria Macrorregional dos Membros",
      publishPractice: "Publicar Prática de Campo",
      filterNation: "País:",
      practiceArea: "Área da Prática:",
      measuredFieldImpact: "Impacto Mensurado no Campo:",
      upvotes: "Votos",
      peerDiscussion: "Discussão entre Produtores",
      share: "Compartilhar",
      runSimulation: "Executar Simulação Live",
      downloadSpec: "Baixar Especificação",
    },
  },

  ru: {
    nav: {
      portalTitle: "БРИКС Агри-Нет",
      tagline: "Портал агрорекомендаций и телеметрии",
      officialBadge: "ОФИЦИАЛЬНО",
      topRibbon: "Цифровая общественная инфраструктура для климатически устойчивого сельского хозяйства",
      myFarms: "Мои фермы",
      cropPlanner: "Планировщик культур",
      diseaseDiagnostics: "Диагностика болезней",
      bricsCommons: "Сообщество и модели БРИКС",
      database: "База данных (БД)",
      cadsApi: "CADS API",
      inspectDb: "Инспекция БД",
      signIn: "Вход для фермеров",
      signOut: "Выход",
      switchFarmer: "Сменить пользователя",
    },
    common: {
      back: "Назад",
      cancel: "Отмена",
      save: "Сохранить",
      submit: "Отправить",
      refresh: "Обновить",
      download: "Скачать",
      search: "Поиск",
      all: "Все",
      verifiedFarmer: "Проверенный фермер",
      healthy: "Здоровое",
      moderate: "Умеренно",
      critical: "Критично",
      active: "Активно",
      language: "Язык",
      selectLanguage: "Выберите язык",
      close: "Закрыть",
      view: "Открыть",
      delete: "Удалить",
    },
    dashboard: {
      welcome: "Добро пожаловать",
      activeParcel: "Активное поле",
      overviewTitle: "Полевая телеметрия и плодородие почвы в реальном времени",
      soilHealthScore: "Индекс плодородия почвы",
      soilStatus: "Баланс элементов питания",
      irrigationNeed: "Потребность в орошении",
      weatherToday: "Погода и эвапотранспирация",
      canopyNdvi: "Индекс вегетации NDVI",
      quickActions: "Оперативные действия фермера",
      generateAdvisory: "Сформировать рекомендации ИИ",
      diagnoseLeaves: "Диагностировать болезни листьев",
      planNextCrop: "Спланировать севооборот",
      recentDiagnostics: "Недавние обследования",
      farmDetails: "Параметры земельного участка",
      acreage: "Площадь (акров)",
      primaryCrop: "Основная культура",
      soilType: "Тип почвы",
      irrigationType: "Система полива",
      location: "Координаты участка",
    },
    advisory: {
      title: "Локализованные агрономические рекомендации",
      subtitle: "Индивидуальный план оперативных мероприятий по поливу, внесению удобрений, защите растений и сохранению почвенного углерода.",
      farmerView: "Вид для фермера",
      agronomistView: "Данные для агронома",
      listenAloud: "Озвучить текст",
      stopAudio: "Остановить звук",
      printSlip: "Печать наряда",
      recalculate: "Пересчитать",
      irrigationTitle: "1. График орошения",
      soilTitle: "2. Почвенное питание и удобрения",
      diseaseTitle: "3. Контроль болезней и погодных рисков",
      regenerativeTitle: "4. Регенеративные агротехнологии",
      actionExplanation: "Мероприятие и агрообоснование:",
      feedbackQuestion: "Были ли данные рекомендации понятны и применимы сегодня?",
      feedbackClear: "Понятно и применимо",
      feedbackRecalibrate: "Требует калибровки",
      feedbackThanks: "Спасибо! Ваш отзыв улучшает коллективные модели БРИКС.",
      telemetryFeeds: "Источники данных для анализа:",
    },
    disease: {
      title: "Визуальная диагностика болезней листьев",
      subtitle: "Сфотографируйте поврежденный лист. ИИ мгновенно определит патоген, рассчитает дозировку рабочего раствора и предложит биопрепараты.",
      uploadTitle: "Загрузить или сделать фото листа",
      tapToChoose: "Нажмите для выбора фото с устройства",
      takePhoto: "Сделать снимок на камеру",
      browseGallery: "Выбрать из галереи",
      quickSamples: "Или протестируйте эталонные образцы БРИКС:",
      runningInference: "Выполняется компьютерный анализ снимка...",
      diagnosticResult: "Результаты фитопатологического анализа",
      visibleSymptoms: "Видимые симптомы на растении:",
      organicRemedy: "Биологическое средство защиты",
      chemicalRemedy: "Агрохимический протокол",
      immediateActions: "Неотложные меры в поле",
      preventiveControls: "Профилактические агроприемы",
      dosageCalculator: "Калькулятор дозировки рабочего раствора",
      sprayingMethod: "Способ опрыскивания",
      parcelAcreage: "Площадь обработки (акров)",
      totalWater: "Общий объем воды",
      chemicalReq: "Потребность в препарате:",
      organicBioReq: "Биологический экстракт:",
      scoutingHistory: "История фитосанитарного мониторинга",
      bricsSurveillance: "Мониторинг трансграничных патогенов БРИКС",
    },
    cropPlanner: {
      title: "Что посеять в следующем сезоне?",
      subtitle: "ИИ-планировщик анализирует NPK, прогноз погоды и влагообеспеченность для подбора наиболее доходных и устойчивых культур.",
      targetSeason: "Сезон сева:",
      strategicGoal: "Приоритет фермера:",
      reAnalyze: "Пересчитать подбор культур",
      rankedOptions: "Рекомендованные культуры по степени пригодности",
      suitabilityScore: "Коэффициент пригодности",
      sowingWindow: "Оптимальное окно сева",
      waterNeed: "Потребность во влаге",
      expectedYield: "Прогнозируемая урожайность",
      estRevenue: "Расчетная выручка",
      soilRationale: "Обоснование по почвенным факторам:",
      climateResilience: "Климатическая устойчивость:",
      regenerativeBenefits: "Почвоулучшающие свойства:",
    },
    commons: {
      title: "Общие модели данных и Сообщество фермеров БРИКС",
      subtitle: "Открытая цифровая платформа, объединяющая фермеров, научные институты (EMBRAPA, ICAR, CAAS, РАН, ARC) и телеметрию CADS.",
      fieldExchangeTab: "Обмен полевым опытом",
      modelsRegistryTab: "Реестр научных моделей данных",
      macroTelemetryTab: "Макротелеметрия стран БРИКС",
      publishPractice: "Опубликовать опыт поля",
      filterNation: "Страна:",
      practiceArea: "Направление практики:",
      measuredFieldImpact: "Подтвержденный полевой эффект:",
      upvotes: "Голоса",
      peerDiscussion: "Обсуждение с коллегами",
      share: "Поделиться",
      runSimulation: "Запустить расчет модели",
      downloadSpec: "Скачать спецификацию",
    },
  },

  zh: {
    nav: {
      portalTitle: "金砖农业网 (BRICS Agri-Net)",
      tagline: "农业建议与遥测数字平台",
      officialBadge: "官方认证",
      topRibbon: "用于气候适应型农业的互操作数字公共基础设施",
      myFarms: "我的农场",
      cropPlanner: "作物规划",
      diseaseDiagnostics: "病害诊断",
      bricsCommons: "金砖共享与模型",
      database: "数据库 (DB)",
      cadsApi: "CADS 接口",
      inspectDb: "检查数据库",
      signIn: "农民登录",
      signOut: "退出登录",
      switchFarmer: "切换农民",
    },
    common: {
      back: "返回",
      cancel: "取消",
      save: "保存",
      submit: "提交",
      refresh: "刷新",
      download: "下载",
      search: "搜索",
      all: "全部",
      verifiedFarmer: "认证农民",
      healthy: "健康",
      moderate: "中等",
      critical: "严重",
      active: "活跃",
      language: "语言",
      selectLanguage: "选择语言",
      close: "关闭",
      view: "查看",
      delete: "删除",
    },
    dashboard: {
      welcome: "欢迎回来",
      activeParcel: "当前地块",
      overviewTitle: "实时田间遥测与土壤健康",
      soilHealthScore: "土壤健康评分",
      soilStatus: "土壤养分平衡",
      irrigationNeed: "灌溉需求",
      weatherToday: "天气与蒸散需求",
      canopyNdvi: "冠层叶绿素 NDVI",
      quickActions: "农事操作指引",
      generateAdvisory: "生成AI精准农事建议",
      diagnoseLeaves: "叶片病害智能检测",
      planNextCrop: "规划下一茬作物轮作",
      recentDiagnostics: "近期检测记录",
      farmDetails: "地块基本信息",
      acreage: "面积 (英亩)",
      primaryCrop: "主栽作物",
      soilType: "土壤类型",
      irrigationType: "灌溉设施",
      location: "空间网格坐标",
    },
    advisory: {
      title: "精准田间农事决策建议",
      subtitle: "根据当前地块定制的行动方案，指导今天关于灌溉、施肥、病害监测和土壤保育的具体操作。",
      farmerView: "农户视图",
      agronomistView: "农艺专家视图",
      listenAloud: "语音朗读",
      stopAudio: "停止朗读",
      printSlip: "打印工单",
      recalculate: "重新计算",
      irrigationTitle: "1. 灌溉计划调度",
      soilTitle: "2. 土壤与精准施肥方案",
      diseaseTitle: "3. 病害与气候风险监控",
      regenerativeTitle: "4. 再生农业实践方案",
      actionExplanation: "操作建议与技术解析:",
      feedbackQuestion: "此农事建议是否对您今天的田间作业清晰实用？",
      feedbackClear: "清晰实用",
      feedbackRecalibrate: "需要重新校准",
      feedbackThanks: "感谢您的反馈！您的评价将帮助优化金砖多边农业大模型。",
      telemetryFeeds: "驱动此建议的数据流:",
    },
    disease: {
      title: "叶片病害视觉智能诊断",
      subtitle: "拍摄田间异常病叶照片，AI即刻识别病原体，精准计算施药用量，并推荐环保生物防治方案。",
      uploadTitle: "上传或拍摄病叶照片",
      tapToChoose: "点击从设备相册选择",
      takePhoto: "使用手机相机拍摄",
      browseGallery: "浏览图库",
      quickSamples: "或使用金砖标准病理样本测试:",
      runningInference: "视觉大模型正在分析叶片...",
      diagnosticResult: "诊断结果评估",
      visibleSymptoms: "叶面可见病理表征:",
      organicRemedy: "有机生物防治方案",
      chemicalRemedy: "农药化学防控规程",
      immediateActions: "田间应急处置步骤",
      preventiveControls: "预防性农艺调控",
      dosageCalculator: "田间施药剂量换算器",
      sprayingMethod: "喷雾施药方式",
      parcelAcreage: "喷施地块面积 (英亩)",
      totalWater: "需配制药液总量",
      chemicalReq: "药剂需求量:",
      organicBioReq: "生物提取剂需求量:",
      scoutingHistory: "田间植保监测与历史记录",
      bricsSurveillance: "金砖国家跨境病害联防联控预警",
    },
    cropPlanner: {
      title: "下一茬应该种什么？",
      subtitle: "结合土壤养分、微气象预报和水资源供给，通过AI模型为您推荐高产、抗逆、耐候的作物方案。",
      targetSeason: "播种季节:",
      strategicGoal: "农户经营目标:",
      reAnalyze: "重新分析地块",
      rankedOptions: "作物适宜度排序推荐",
      suitabilityScore: "适宜度匹配指数",
      sowingWindow: "适宜播种期",
      waterNeed: "耗水需求",
      expectedYield: "预期产量",
      estRevenue: "预估产值",
      soilRationale: "土壤适宜性技术依据:",
      climateResilience: "气候与水分适应能力:",
      regenerativeBenefits: "土壤生态修复收益:",
    },
    commons: {
      title: "金砖农业共享数据模型与农民平台",
      subtitle: "连接普通农户、国家级农业科研院所（EMBRAPA、ICAR、中国农科院CAAS、俄罗斯科学院RAS、ARC）的开放式数字公共品。",
      fieldExchangeTab: "农户田间经验交流平台",
      modelsRegistryTab: "共享农业模型注册表",
      macroTelemetryTab: "成员国宏观农业遥测",
      publishPractice: "发布田间实践经验",
      filterNation: "国别:",
      practiceArea: "技术领域:",
      measuredFieldImpact: "实测田间成效:",
      upvotes: "点赞",
      peerDiscussion: "同行探讨",
      share: "分享",
      runSimulation: "运行在线模拟计算",
      downloadSpec: "下载模型规范",
    },
  },
};

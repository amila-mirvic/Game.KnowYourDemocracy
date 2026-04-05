export const WORLD3_FEEDBACK_MESSAGES = [
  "{NAME} KEEP GOING",
  "{NAME} SOLID MOVE",
  "{NAME} GOOD THINKING",
  "{NAME} STAY ACTIVE",
  "{NAME} NICE CHOICE",
  "{NAME} YOU'RE BUILDING IMPACT",
  "{NAME} THINK CIVICALLY",
  "{NAME} GOOD STRATEGY",
];

export const WORLD3_INTROS = {
  task1: {
    backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg1.png`,
    introText:
      "You arrive at a large open square filled with people. Some are speaking, organizing, and moving. Others are watching silently. A voice echoes:\n“In democracy, doing nothing is also a choice. But what kind of choice are you making?”\nTo move forward, you must recognize the difference between participation and passivity.",
    infoTitle: "INSTRUCTIONS",
    infoRows: [
      { image: `${process.env.PUBLIC_URL}/world1/task1/correct.png`, text: "ACTIVE PARTICIPATION" },
      { image: `${process.env.PUBLIC_URL}/world1/task1/middle.png`, text: "PASSIVE / LIMITED PARTICIPATION" },
      { image: `${process.env.PUBLIC_URL}/world1/task1/wrong.png`, text: "NON-PARTICIPATION / DISENGAGEMENT" },
      { image: `${process.env.PUBLIC_URL}/world1/task1/points.png`, text: "POINTS" },
      { image: `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`, text: "CURIOSITY POINTS" },
    ],
    startRoute: "/world-3/task-1",
  },
  task2: {
    backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg2.png`,
    introText:
      "You pause and look around. Different thoughts appear in front of you: “I don’t understand.” “It doesn’t matter.” “It’s too risky.” A voice asks:\n“What stops people from taking action? And what could help them move forward?”",
    infoTitle: "INSTRUCTIONS",
    infoRows: [
      { text: "MATCH EACH BARRIER WITH THE MOST EFFECTIVE SOLUTION" },
      { text: "2 BARRIERS PER ROUND" },
      { text: "CORRECT MATCH = +3" },
      { text: "ONE CORRECT MATCH = +1" },
    ],
    startRoute: "/world-3/task-2",
  },
  task3: {
    backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg3.png`,
    introText:
      "You continue your journey and reach a new stage. Different situations appear in front of you. A message appears:\n“Caring is not enough. What matters is choosing the right action.”",
    infoTitle: "INSTRUCTIONS",
    infoRows: [
      { text: "CHOOSE THE MOST EFFECTIVE ACTION IN EACH SCENARIO" },
      { text: "BEST ACTION = +8" },
      { text: "WEAKER ACTIONS GIVE FEWER OR NO POINTS" },
      { text: "THINK STRATEGICALLY, NOT EMOTIONALLY" },
    ],
    startRoute: "/world-3/task-3",
  },
  task4: {
    backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg4.png`,
    introText:
      "You arrive in your city. A message appears:\n“Democracy is not something you watch. It is something you build.”\nA youth space in your city is being closed. Your goal: create an effective response.",
    infoTitle: "INSTRUCTIONS",
    infoRows: [
      { text: "STEP 1 — CHOOSE ALLIES" },
      { text: "STEP 2 — CHOOSE UP TO 3 ACTIONS" },
      { text: "STEP 3 — CHOOSE COMMUNICATION STYLE" },
      { text: "BUILD THE STRONGEST CIVIC STRATEGY" },
    ],
    startRoute: "/world-3/task-4",
  },
};

export const WORLD3_TASK1 = {
  backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg1.png`,
  pointsIcon: `${process.env.PUBLIC_URL}/world1/task1/points.png`,
  curiosityIcon: `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`,
  whyIcon: `${process.env.PUBLIC_URL}/world1/task1/why.png`,
  answerButtons: {
    correct: `${process.env.PUBLIC_URL}/world1/task1/correct.png`,
    middle: `${process.env.PUBLIC_URL}/world1/task1/middle.png`,
    wrong: `${process.env.PUBLIC_URL}/world1/task1/wrong.png`,
  },
  badges: {
    beginner: `${process.env.PUBLIC_URL}/world1/task1/beginner.png`,
    advanced: `${process.env.PUBLIC_URL}/world1/task1/advanced.png`,
    expert: `${process.env.PUBLIC_URL}/world1/task1/expert.png`,
    curiosity: `${process.env.PUBLIC_URL}/world1/task1/curiosity.png`,
  },
  statements: [
    {
      id: 1,
      text: "VOTING IN ELECTIONS",
      correct: "correct",
      why: "Voting is a key action, but democracy continues between elections.",
      wrongFeedback: "This belongs to ACTIVE PARTICIPATION.",
    },
    {
      id: 2,
      text: "SIGNING A PETITION ABOUT A LOCAL ISSUE",
      correct: "correct",
      why: "Small actions can create collective impact.",
      wrongFeedback: "This belongs to ACTIVE PARTICIPATION.",
    },
    {
      id: 3,
      text: "COMPLAINING ONLINE WITHOUT TAKING FURTHER ACTION",
      correct: "middle",
      why: "Expression matters, but without action, impact is limited.",
      wrongFeedback: "This belongs to PASSIVE / LIMITED PARTICIPATION.",
    },
    {
      id: 4,
      text: "IGNORING POLITICAL DECISIONS BECAUSE “NOTHING CHANGES”",
      correct: "wrong",
      why: "Disengagement reduces democratic pressure.",
      wrongFeedback: "This belongs to NON-PARTICIPATION / DISENGAGEMENT.",
    },
    {
      id: 5,
      text: "JOINING A YOUTH ORGANIZATION OR INITIATIVE",
      correct: "correct",
      why: "Organizing with others increases influence.",
      wrongFeedback: "This belongs to ACTIVE PARTICIPATION.",
    },
    {
      id: 6,
      text: "SHARING INFORMATION WITHOUT CHECKING IT",
      correct: "wrong",
      why: "Participation without responsibility can damage democracy.",
      wrongFeedback: "This belongs to NON-PARTICIPATION / HARMFUL ACTION.",
    },
    {
      id: 7,
      text: "ATTENDING A PUBLIC DISCUSSION OR CONSULTATION",
      correct: "correct",
      why: "Being present creates space for your voice.",
      wrongFeedback: "This belongs to ACTIVE PARTICIPATION.",
    },
    {
      id: 8,
      text: "ONLY FOLLOWING INFLUENCERS FOR POLITICAL OPINIONS",
      correct: "middle",
      why: "Consuming opinions is not the same as forming your own.",
      wrongFeedback: "This belongs to PASSIVE / LIMITED PARTICIPATION.",
    },
    {
      id: 9,
      text: "ORGANIZING A COMMUNITY ACTION",
      correct: "correct",
      why: "Initiative is one of the strongest forms of participation.",
      wrongFeedback: "This belongs to ACTIVE PARTICIPATION.",
    },
    {
      id: 10,
      text: "CHOOSING NOT TO VOTE OR ENGAGE AT ALL",
      correct: "wrong",
      why: "Silence allows decisions to happen without you.",
      wrongFeedback: "This belongs to NON-PARTICIPATION / DISENGAGEMENT.",
    },
  ],
};

export const WORLD3_TASK2 = {
  backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg2.png`,
  pointsIcon: `${process.env.PUBLIC_URL}/world1/task1/points.png`,
  curiosityIcon: `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`,
  whyIcon: `${process.env.PUBLIC_URL}/world1/task1/why.png`,
  badges: {
    beginner: `${process.env.PUBLIC_URL}/world1/task1/beginner.png`,
    advanced: `${process.env.PUBLIC_URL}/world1/task1/advanced.png`,
    expert: `${process.env.PUBLIC_URL}/world1/task1/expert.png`,
  },
  rounds: [
    {
      id: 1,
      title: "ROUND 1",
      prompt: "(MATCH EACH BARRIER WITH THE MOST EFFECTIVE SOLUTION)",
      pairs: [
        {
          barrierId: "BARRIER 1",
          barrier: "I DON’T UNDERSTAND POLITICS",
          correctSolutionId: "S1",
        },
        {
          barrierId: "BARRIER 2",
          barrier: "MY VOICE DOESN’T MATTER",
          correctSolutionId: "S2",
        },
      ],
      solutions: [
        { id: "S1", label: "ACCESSIBLE EDUCATION, CLEAR EXPLANATIONS, YOUTH-FRIENDLY CONTENT" },
        { id: "S2", label: "JOIN COLLECTIVE ACTION (GROUPS, NGOS, CAMPAIGNS)" },
        { id: "S3", label: "FLEXIBLE PARTICIPATION (ONLINE TOOLS, QUICK ACTIONS)" },
        { id: "S4", label: "SAFE PARTICIPATION SPACES, LEGAL PROTECTIONS, ANONYMITY OPTIONS" },
      ],
      feedback: "Understanding and collective action remove two of the most common barriers to participation.",
    },
    {
      id: 2,
      title: "ROUND 2",
      prompt: "(MATCH EACH BARRIER WITH THE MOST EFFECTIVE SOLUTION)",
      pairs: [
        {
          barrierId: "BARRIER 3",
          barrier: "I DON’T HAVE TIME",
          correctSolutionId: "S3",
        },
        {
          barrierId: "BARRIER 4",
          barrier: "I’M AFRAID OF CONSEQUENCES",
          correctSolutionId: "S4",
        },
      ],
      solutions: [
        { id: "S3", label: "FLEXIBLE PARTICIPATION (ONLINE TOOLS, QUICK ACTIONS)" },
        { id: "S4", label: "SAFE PARTICIPATION SPACES, LEGAL PROTECTIONS, ANONYMITY OPTIONS" },
        { id: "S5", label: "DIGITAL PARTICIPATION, ONLINE COMMUNITIES, YOUTH NETWORKS" },
        { id: "S6", label: "TRANSPARENCY TOOLS, WATCHDOG ORGANIZATIONS, ACCOUNTABILITY ACTIONS" },
      ],
      feedback: "Participation becomes stronger when it is both practical and safe.",
    },
    {
      id: 3,
      title: "ROUND 3",
      prompt: "(MATCH EACH BARRIER WITH THE MOST EFFECTIVE SOLUTION)",
      pairs: [
        {
          barrierId: "BARRIER 5",
          barrier: "THERE ARE NO OPPORTUNITIES NEAR ME",
          correctSolutionId: "S5",
        },
        {
          barrierId: "BARRIER 6",
          barrier: "EVERYTHING IS CORRUPT ANYWAY",
          correctSolutionId: "S6",
        },
      ],
      solutions: [
        { id: "S5", label: "DIGITAL PARTICIPATION, ONLINE COMMUNITIES, YOUTH NETWORKS" },
        { id: "S6", label: "TRANSPARENCY TOOLS, WATCHDOG ORGANIZATIONS, ACCOUNTABILITY ACTIONS" },
        { id: "S2", label: "JOIN COLLECTIVE ACTION (GROUPS, NGOS, CAMPAIGNS)" },
        { id: "S1", label: "ACCESSIBLE EDUCATION, CLEAR EXPLANATIONS, YOUTH-FRIENDLY CONTENT" },
      ],
      feedback:
        "Participation depends on access, safety, knowledge, and trust. Removing barriers is part of building democracy.",
    },
  ],
};

export const WORLD3_TASK3 = {
  backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg3.png`,
  pointsIcon: `${process.env.PUBLIC_URL}/world1/task1/points.png`,
  curiosityIcon: `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`,
  badges: {
    beginner: `${process.env.PUBLIC_URL}/world1/task1/beginner.png`,
    advanced: `${process.env.PUBLIC_URL}/world1/task1/advanced.png`,
    expert: `${process.env.PUBLIC_URL}/world1/task1/expert.png`,
  },
  rounds: [
    {
      id: 1,
      title: "SCENARIO 1",
      statement: "LOCAL PARK IS BEING REMOVED",
      correctKey: "B",
      options: [
        { key: "A", label: "POST ANGRY COMMENTS", points: 3 },
        { key: "B", label: "ORGANIZE PETITION + CONTACT MUNICIPALITY", points: 8 },
        { key: "C", label: "IGNORE", points: 1 },
        { key: "D", label: "SPREAD RUMORS", points: 0 },
      ],
      feedbackMap: {
        A: "Expression without direction has limited impact.",
        B: "Local issues need organized, targeted action.",
        C: "Doing nothing leaves the decision untouched.",
        D: "Misinformation harms credibility.",
      },
    },
    {
      id: 2,
      title: "SCENARIO 2",
      statement: "ONLINE HATE SPEECH INCREASES",
      correctKey: "B",
      options: [
        { key: "A", label: "ATTACK BACK AGGRESSIVELY", points: 0 },
        { key: "B", label: "REPORT + RESPOND WITH FACTS + SUPPORT VICTIMS", points: 8 },
        { key: "C", label: "IGNORE", points: 1 },
        { key: "D", label: "SHARE FOR AWARENESS", points: 3 },
      ],
      feedbackMap: {
        A: "Escalation increases conflict.",
        B: "Responsible action protects others and reduces harm.",
        C: "Ignoring it does not reduce harm.",
        D: "Sharing harmful content can still amplify it.",
      },
    },
    {
      id: 3,
      title: "SCENARIO 3",
      statement: "EDUCATION REFORM PROPOSAL",
      correctKey: "B",
      options: [
        { key: "A", label: "COMPLAIN PRIVATELY", points: 3 },
        { key: "B", label: "JOIN CONSULTATION + CONTACT DECISION-MAKERS", points: 8 },
        { key: "C", label: "PROTEST RANDOMLY", points: 1 },
        { key: "D", label: "DO NOTHING", points: 0 },
      ],
      feedbackMap: {
        A: "Concern matters, but private complaint rarely creates policy change.",
        B: "Policy change requires engagement with decision-makers.",
        C: "Action without strategy is weaker.",
        D: "No action means no civic pressure.",
      },
    },
    {
      id: 4,
      title: "SCENARIO 4",
      statement: "WORKPLACE UNFAIR TREATMENT",
      correctKey: "B",
      options: [
        { key: "A", label: "STAY SILENT", points: 1 },
        { key: "B", label: "USE OFFICIAL COMPLAINT CHANNELS + COLLECTIVE SUPPORT", points: 8 },
        { key: "C", label: "ATTACK EMPLOYER ONLINE", points: 0 },
        { key: "D", label: "QUIT IMMEDIATELY", points: 3 },
      ],
      feedbackMap: {
        A: "Silence protects the problem, not the worker.",
        B: "Structured action creates real protection.",
        C: "Public attack can weaken your position.",
        D: "Leaving may be understandable, but it does not address the issue effectively.",
      },
    },
  ],
};

export const WORLD3_TASK4 = {
  backgroundUrl: `${process.env.PUBLIC_URL}/world3/bg4.png`,
  pointsIcon: `${process.env.PUBLIC_URL}/world1/task1/points.png`,
  curiosityIcon: `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`,
  badges: {
    beginner: `${process.env.PUBLIC_URL}/world1/task1/beginner.png`,
    advanced: `${process.env.PUBLIC_URL}/world1/task1/advanced.png`,
    expert: `${process.env.PUBLIC_URL}/world1/task1/expert.png`,
  },
  steps: [
    {
      id: 1,
      title: "STEP 1 — CHOOSE ALLIES",
      statement: "A YOUTH SPACE IN YOUR CITY IS BEING CLOSED. WHO SHOULD YOU INVOLVE?",
      multi: true,
      maxSelections: 4,
      correct: ["A", "B", "C", "D"],
      options: [
        { key: "A", label: "YOUTH ORGANIZATIONS" },
        { key: "B", label: "LOCAL MEDIA" },
        { key: "C", label: "MUNICIPALITY REPRESENTATIVES" },
        { key: "D", label: "FRIENDS / COMMUNITY" },
      ],
      feedback: "Strong civic action usually starts by building a coalition.",
    },
    {
      id: 2,
      title: "STEP 2 — CHOOSE ACTIONS",
      statement: "PICK UP TO 3 ACTIONS",
      multi: true,
      maxSelections: 3,
      correct: ["A", "B", "C"],
      options: [
        { key: "A", label: "PETITION" },
        { key: "B", label: "PUBLIC MEETING" },
        { key: "C", label: "SOCIAL MEDIA CAMPAIGN" },
        { key: "D", label: "DO NOTHING" },
        { key: "E", label: "SPREAD MISINFORMATION" },
      ],
      feedback: "The best actions combine public support, civic pressure, and clear communication.",
    },
    {
      id: 3,
      title: "STEP 3 — CHOOSE COMMUNICATION STYLE",
      statement: "HOW WILL YOU COMMUNICATE?",
      multi: false,
      correct: ["B"],
      options: [
        { key: "A", label: "AGGRESSIVE" },
        { key: "B", label: "INFORMATIVE + INCLUSIVE" },
        { key: "C", label: "EMOTIONAL PANIC" },
        { key: "D", label: "BLAMING" },
      ],
      feedback: "Inclusive and informative communication builds credibility and support.",
    },
  ],
};
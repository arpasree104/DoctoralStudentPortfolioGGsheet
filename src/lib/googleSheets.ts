/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Certificate, Activity, ConfigOption, ActivityLog, StudentPortfolioData } from '../types';

// Default initial config options
const DEFAULT_CONFIGS: ConfigOption[] = [
  { id: 'cfg-1', OptionType: 'ADVISOR', OptionValue: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)' },
  { id: 'cfg-2', OptionType: 'ADVISOR', OptionValue: 'ศ.ดร. สร้อยอนุสาสน์ สุขดี (Prof. Dr. Soianusat Sukdee)' },
  { id: 'cfg-3', OptionType: 'ADVISOR', OptionValue: 'ผศ.ดร. สมศรี เกียรติพงษ์ (Asst. Prof. Dr. Somsri Kiatiphong)' },
  { id: 'cfg-4', OptionType: 'CO_ADVISOR', OptionValue: 'รศ.ดร. วิภา ชัยชาญ (Assoc. Prof. Dr. Wipa Chaichan)' },
  { id: 'cfg-5', OptionType: 'CO_ADVISOR', OptionValue: 'ดร. กิตติศักดิ์ รัตนวิทย์ (Dr. Kittisak Rattanawit)' },
  { id: 'cfg-6', OptionType: 'CO_ADVISOR', OptionValue: 'ผศ.ดร. รพีพรรณ เลิศสมบูรณ์ (Asst. Prof. Dr. Rapeepan Lertsomboon)' },
  { id: 'cfg-7', OptionType: 'CERT_CATEGORY', OptionValue: 'นำเสนองานวิชาการระดับชาติ/นานาชาติ (Academic Presentation)' },
  { id: 'cfg-8', OptionType: 'CERT_CATEGORY', OptionValue: 'อบรมจริยธรรมการวิจัยในมนุษย์ (Human Research Ethics Training)' },
  { id: 'cfg-9', OptionType: 'CERT_CATEGORY', OptionValue: 'รางวัลระดับชาติ/นานาชาติ (National/International Award)' },
  { id: 'cfg-10', OptionType: 'CERT_CATEGORY', OptionValue: 'การตีพิมพ์วารสารวิชาการ (Academic Publication)' },
  { id: 'cfg-11', OptionType: 'CERT_CATEGORY', OptionValue: 'อบรมวิชาการเฉพาะทาง (Specialized Training)' },
  { id: 'cfg-12', OptionType: 'DEGREE', OptionValue: 'หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาพยาบาลศาสตร์ (PhD in Nursing Science - Thai Program)' },
  { id: 'cfg-13', OptionType: 'DEGREE', OptionValue: 'Doctor of Philosophy Program in Nursing Science (International Program)' }
];

// Preloaded beautiful student data matching the screenshots
const DEFAULT_STUDENT_PORTFOLIO: StudentPortfolioData = {
  academicBackground: [
    { degree: 'Master of Science (Nursing)', field: 'Adult Nursing', institution: 'Thammasat University', year: '2021' },
    { degree: 'Bachelor of Science (Nursing)', field: 'Nursing Science', institution: 'Mahidol University', year: '2017' }
  ],
  professionalBackground: [
    { period: '2021 - 2023', role: 'Registered Nurse, Gerontology Unit', remarks: 'Thammasat University Hospital' },
    { period: '2017 - 2021', role: 'Clinical Nurse Practitioner, ICU', remarks: 'Siriraj Hospital' }
  ],
  milestones: [
    { key: 'coursework', label: 'Coursework completion', plannedDate: '2024-03-15', actualDate: '2024-03-12', remarks: 'Completed with GPA 3.90', status: 'Completed' },
    { key: 'english', label: 'Meeting the English language proficiency requirement', plannedDate: '2024-05-20', actualDate: '2024-05-18', remarks: 'IELTS Band 7.0 achieved', status: 'Completed' },
    { key: 'research_hours', label: 'Completion of at least 180 research experience hours', plannedDate: '2025-06-30', actualDate: '2025-06-15', remarks: '185 hours completed under Dr. Nonglak', status: 'Completed' },
    { key: 'qe', label: 'Qualifying examination', plannedDate: '2024-10-10', actualDate: '2024-10-12', remarks: 'Passed on first attempt', status: 'Completed' },
    { key: 'study_abroad', label: 'Studying abroad', plannedDate: '2025-09-01', actualDate: '', remarks: 'Planned exchange at University of Michigan School of Nursing', status: 'In Progress' },
    { key: 'proposal_dev', label: 'Dissertation proposal development', plannedDate: '2025-01-15', actualDate: '2025-01-10', remarks: 'Draft approved by committee', status: 'Completed' },
    { key: 'proposal_defense', label: 'Proposal defense', plannedDate: '2025-03-20', actualDate: '2025-03-24', remarks: 'Passed with minor revisions', status: 'Completed' },
    { key: 'ethics', label: 'Ethics approval', plannedDate: '2025-05-10', actualDate: '2025-05-29', remarks: 'COA No. MUPN-2025-084', status: 'Completed' },
    { key: 'data_collection', label: 'Data collection', plannedDate: '2025-11-30', actualDate: '', remarks: 'Active recruiting post-stroke caregivers', status: 'In Progress' },
    { key: 'data_analysis', label: 'Data analysis', plannedDate: '2026-03-15', actualDate: '', remarks: '', status: 'Not Started' },
    { key: 'manuscript_prep', label: 'Manuscript preparation', plannedDate: '2026-06-30', actualDate: '', remarks: 'Targeting International Journal of Nursing Studies', status: 'Not Started' },
    { key: 'dissertation_writing', label: 'Dissertation writing', plannedDate: '2026-10-31', actualDate: '', remarks: '', status: 'Not Started' },
    { key: 'final_defense', label: 'Final defense', plannedDate: '2027-02-28', actualDate: '', remarks: '', status: 'Not Started' },
    { key: 'graduation', label: 'Graduation', plannedDate: '2027-05-31', actualDate: '', remarks: '', status: 'Not Started' }
  ],
  englishTest: {
    testName: 'IELTS Academic',
    dateTaken: '2024-05-18',
    scoreAchieved: '7.0',
    requiredScore: '6.5',
    status: 'Passed Requirement',
    evidence: 'IELTS Test Report Form No. 24TH008432KEA001'
  },
  englishActivities: [
    { date: '2024-01-10', activity: 'Academic English Writing Course', organizer: 'TU Language Institute', description: '60-hour intensive academic nursing manuscript writing', evidence: 'Certificate No. TULI-2024-09' },
    { date: '2024-04-05', activity: 'International Thesis Presentation Practice', organizer: 'Faculty of Nursing, TU', description: 'Presented draft proposal in English with native advisors', evidence: 'Seminar Handout' }
  ],
  englishReflection: 'I have focused heavily on improving my vocabulary for health science research and post-stroke rehabilitation. The academic writing course helped me construct more concise research aims and methodology sections in English.',
  completedCourses: [
    { code: 'NS901', title: 'Advanced Philosophical Foundations of Nursing Science', semester: '1/2023', credits: '3', grade: 'A' },
    { code: 'NS902', title: 'Theory Development and Nursing Knowledge Construction', semester: '1/2023', credits: '3', grade: 'A' },
    { code: 'NS903', title: 'Advanced Quantitative Research Methodology', semester: '2/2023', credits: '3', grade: 'A' },
    { code: 'NS904', title: 'Qualitative Research in Healthcare', semester: '2/2023', credits: '3', grade: 'A-' }
  ],
  keyLearnings: [
    { course: 'NS903 Quantitative Methods', keyLearning: 'Learned multi-level linear regression, structural equation modeling, and G*Power calculations for clinical interventions.', application: 'Used to calculate caregiver sample size (N=120) for the PhD randomized clinical trial.' },
    { course: 'NS902 Theory Development', keyLearning: 'Analyzed Middle-Range theories including Roy Adaptation Model and Bandura Social Cognitive Theory.', application: 'Integrated Bandura self-efficacy framework into the Tele-Nursing stroke caregiver intervention protocol.' }
  ],
  workshops: [
    { date: '2024-07-12', title: 'Systematic Review and Meta-Analysis Workshop', organizer: 'Cochrane Thailand', role: 'Participant', keyLearning: 'Risk of bias assessment tools (RoB 2) and RevMan software execution.' },
    { date: '2025-02-20', title: 'Innovative Digital Health & Telehealth Symposia', organizer: 'TU Faculty of Nursing', role: 'Presenter', keyLearning: 'Key challenges in remote clinical trial delivery and electronic consent.' }
  ],
  dissertationInfo: {
    title: 'Efficacy of Mindfulness-Based Tele-Nursing Intervention on Quality of Life and Coping Strategies in Thai Post-Stroke Caregivers: A Randomized Controlled Trial',
    background: 'Post-stroke caregivers experience severe psychological strain, physical exhaustion, and burnout. Tele-health applications present a scalable, highly promising delivery mechanism in Thailand.',
    problem: 'Traditional hospital care lacks consistent, continuous mindfulness-based coping coaching for family caregivers post-discharge.',
    objectives: 'To evaluate the effectiveness of an 8-week mindfulness-based tele-nursing training module on caregiver burden, depressive symptoms, and overall quality of life.',
    hypotheses: 'Caregivers receiving the mindfulness tele-nursing intervention will report significantly higher mindfulness scores and lower anxiety scores compared to the control group.',
    conceptualFramework: 'Based on the Stress and Coping Model of Lazarus and Folkman and the Roy Adaptation Model.',
    methodology: 'A double-blinded, parallel randomized controlled trial (N=120, 60 experimental, 60 standard care control) with follow-ups at 4, 8, and 12 weeks post-baseline.'
  },
  dissertationProgress: [
    { activity: 'Literature Review completed', date: '2024-11-15', progress: 'Wrote 45-page chapter outlining tele-health interventions and mindfulness in Southeast Asia.', evidence: 'Chapter 2 draft approved by Major Advisor' },
    { activity: 'IRB Protocol Approval', date: '2025-05-29', progress: 'Ethical board approved the research protocol and consent forms.', evidence: 'COA Document No. MUPN-2025-084' }
  ],
  advisorMeetings: [
    { date: '2025-04-10', persons: 'Dr. Nonglak, Dr. Wipa', issues: 'Sample recruitment pathways and clinical site selection.', actionPoints: 'To contact Pathum Thani Hospital and TU Hospital stroke rehabilitation clinics.' },
    { date: '2025-06-05', persons: 'Dr. Nonglak', issues: 'Finalizing the mobile app mockups for the tele-nursing intervention.', actionPoints: 'Complete pilot run with 5 caregivers by early August.' }
  ],
  ethicsGovernance: {
    dateApplied: '2025-03-30',
    dateApproved: '2025-05-29',
    approvalNumber: 'MUPN-2025-084',
    amendments: 'Minor amendment approved on June 10 for digital electronic signatures on consent.',
    confidentiality: 'All patient and caregiver identifiers are replaced with randomized secure uuid hashes. Audio files are deleted post-transcription.'
  },
  researchExperience: [
    { date: '2024-08-01', activity: 'Research Assistant - Caregiver Burden Cohort Study', description: 'Assisted in quantitative phone interviews, database compilation, and cleaning of SPSS datasets (100 hours total).', hours: 100, supervisor: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์', evidence: 'Logsheet signed' },
    { date: '2024-12-10', activity: 'Systematic Review Coding Assistant', description: 'Screened titles/abstracts and extracted qualitative study characteristics for meta-synthesis on stroke caregiver interventions (85 hours).', hours: 85, supervisor: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์', evidence: 'Signed confirmation certificate' }
  ],
  researchReflection: 'Completing 185 hours of active research experience deepened my understanding of research logistics. It taught me the crucial importance of participant retention strategies and data validation protocols.',
  conferencePresentations: [
    { date: '2024-11-20', title: 'Burden and Psychological Distress Among Primary Family Caregivers of Stroke Survivors in Central Thailand', conference: 'The 4th International Nursing and Health Sciences Conference', type: 'Oral Presentation', venue: 'Chiang Mai, Thailand' }
  ],
  publications: [
    { year: '2025', title: 'Psychometric Evaluation of the Thai Zarit Burden Interview (ZBI-12) in Acute Stroke Caregivers', journal: 'Journal of Health Research', status: 'Published', doi: '10.11086/jhr-2025-0012' }
  ],
  manuscripts: [
    { title: 'Tele-health interventions in Thai Nursing Practice: A Systematic Scoping Review', journal: 'Pacific Rim International Journal of Nursing Research', stage: 'Under Review', plannedSubmission: 'Submitted 2025-05-02' }
  ],
  grants: [
    { title: 'Development and Evaluation of Mindfulness-Based Tele-Nursing Support System', source: 'Thammasat University Doctoral Research Fund', role: 'Principal Investigator', amount: '150,000 THB', period: '2025 - 2026' }
  ],
  awards: [
    { date: '2024-11-21', award: 'Best Oral Presentation Award', organizer: 'International Nursing Conference Committee', description: 'Received outstanding presentation recognition among 45 international doctoral candidates.' }
  ],
  teachingExperiences: [
    { semester: '1/2024', course: 'Adult and Gerontological Nursing Practicum', role: 'Teaching Assistant (clinical supervisor)', studentLevel: 'Undergraduate (Year 3)', description: 'Supervised clinical rotations of 8 senior students at TU Hospital medical ward.' }
  ],
  supervisions: [
    { date: '2024-03-01', type: 'Clinical Skills Tutoring', studentLevel: 'Bachelor Year 2', description: 'Instructed basic stroke screening assessment, swallowing tests, and bedside mobility scales.' }
  ],
  academicServices: [
    { date: '2025-01-15', activity: 'Volunteer Health Screening & Post-Stroke Community Assessment', role: 'Head Educator', organization: 'Phathum Thani Municipality Public Health Center' }
  ],
  leaderships: [
    { date: '2024 - 2025', role: 'President of Doctoral Student Committee', organization: 'Faculty of Nursing, TU', responsibilities: 'Coordinated student academic forums, and organized the Dean-Student bilateral townhalls.' }
  ],
  competencySelfAssessment: [
    { competency: 'Advanced disciplinary knowledge', rating: 'Proficient', remarks: 'Excellent grasp of nursing epistemology, gerontological theory, and cognitive support models.' },
    { competency: 'Critical analysis and synthesis', rating: 'Proficient', remarks: 'Strong abilities validated by publishing first-author systematic evaluation.' },
    { competency: 'Research design and methodology', rating: 'Competent', remarks: 'Highly skilled in RCT randomized trials, but refining skills in qualitative focus groups.' },
    { competency: 'Data analysis', rating: 'Competent', remarks: 'Proficient in SPSS, learning AMOS for Structural Equation Modeling (SEM).' },
    { competency: 'Academic writing', rating: 'Proficient', remarks: 'Successfully drafted and published peer-reviewed journal manuscript.' },
    { competency: 'English communication for academic purposes', rating: 'Proficient', remarks: 'Scored 7.0 in IELTS, comfortable presenting at international symposiums.' },
    { competency: 'Scholarly presentation', rating: 'Proficient', remarks: 'Awarded best oral presentation in Chiang Mai conference.' },
    { competency: 'Teaching ability', rating: 'Competent', remarks: 'Supervised 3rd-year nursing students clinical cohort.' },
    { competency: 'Leadership', rating: 'Proficient', remarks: 'Acted as PhD Student Council President with successful forum delivery.' },
    { competency: 'Ethical conduct in research', rating: 'Proficient', remarks: 'Certified in CITI Programme biomedical ethics, passed TU IRB approval smoothly.' },
    { competency: 'Professionalism', rating: 'Proficient', remarks: 'Maintained strict clinical standards and excellent communication skills.' },
    { competency: 'Collaboration and networking', rating: 'Competent', remarks: 'Active engagement with national hospital clinics and overseas exchange hosts.' },
    { competency: 'Lifelong learning and self-development', rating: 'Proficient', remarks: 'Constantly attending advanced statistics seminars and qualitative coding labs.' }
  ],
  annualReview: {
    achievements: 'Passed qualifying examination, obtained IRB approval, completed 185 research experience hours, and published first research manuscript in JHR.',
    improvements: 'Improve skills in qualitative research methodologies (specifically thematic analysis) and master structural equation modeling.',
    actionPlans: [
      { goal: 'Pilot trial completion', steps: 'Recruit and deliver mindfulness tele-nursing training to 5 pilot family caregivers, compile logs.', timeline: 'August 2025', support: 'Primary Advisor (Dr. Nonglak)' },
      { goal: 'Studying Abroad exchange preparation', steps: 'Finalize study schedule and host arrangements with the University of Michigan mentor.', timeline: 'September - November 2025', support: 'Faculty Research Office Funding' }
    ]
  },
  futureCareer: {
    shortTerm: 'Secure a tenure-track Assistant Professor role in Gerontological Nursing department at Thammasat University.',
    longTerm: 'Become an international leader in digital nursing interventions, and establish a cross-regional Caregiver Digital Coping Research Lab in Southeast Asia.',
    preparation: 'Build relationships with international collaborators, pursue postdoctoral opportunities, and apply for government-funded research grants.'
  },
  advisorComments: 'Orapan is an exceptionally dedicated doctoral student. She possesses stellar analytical abilities and clinical rigor. Her RCT study proposal is exceptionally well-conceived, and she has met every milestones ahead of schedule. She shows massive potential to become an outstanding nursing researcher.',
  endorsements: [
    { role: 'Major Advisor', name: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)', signatureDate: '2025-06-15' },
    { role: 'Co-Advisor / Committee Member', name: 'รศ.ดร. วิภา ชัยชาญ (Assoc. Prof. Dr. Wipa Chaichan)', signatureDate: '2025-06-16' },
    { role: 'Committee Member', name: 'ผศ.ดร. สมศรี เกียรติพงษ์ (Asst. Prof. Dr. Somsri Kiatiphong)', signatureDate: '2025-06-18' }
  ]
};

const DEFAULT_USERS: User[] = [
  {
    UserID: 'STUDENT-1',
    Email: 'student@tu.ac.th',
    FullName: 'นางสาวอรพรรณ แก้วดี (Miss Orapan Kaewdee)',
    StudentID: '6601010024',
    Major: 'Doctor of Philosophy Program in Nursing Science (International Program)',
    Advisor: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)',
    CoAdvisor: 'รศ.ดร. วิภา ชัยชาญ (Assoc. Prof. Dr. Wipa Chaichan)',
    ThesisTitle: 'Efficacy of Mindfulness-Based Tele-Nursing Intervention on Quality of Life and Coping Strategies in Thai Post-Stroke Caregivers: A Randomized Controlled Trial',
    LineID: 'orapan.k',
    ORCID: 'https://orcid.org/0000-0002-1234-5678',
    ResearchInterests: 'Gerontological Nursing, Mindfulness-Based Therapy, Tele-rehabilitation, Stroke Caregiver Support',
    ExpectedGraduationYear: '2027',
    PhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    Role: 'STUDENT'
  },
  {
    UserID: 'ADVISOR-1',
    Email: 'advisor@tu.ac.th',
    FullName: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)',
    Role: 'ADVISOR',
    PhotoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
  },
  {
    UserID: 'ADMIN-1',
    Email: 'admin@tu.ac.th',
    FullName: 'ผศ.ดร. สุขุม พิพัฒน์โชติ (Asst. Prof. Dr. Sukhum Pipatchot) - แอดมินระบบ',
    Role: 'ADMIN',
    PhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
  }
];

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    CertID: 'CERT-001',
    StudentID: '6601010024',
    Name: 'ใบประกาศนียบัตรผ่านการอบรมจริยธรรมการวิจัยในมนุษย์ (CITI Programme Course)',
    Date: '2024-02-10',
    Category: 'อบรมจริยธรรมการวิจัยในมนุษย์ (Human Research Ethics Training)',
    ImageURL: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
    Status: 'APPROVED',
    ApprovedBy: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)',
    Feedback: 'เอกสารหลักฐานครบถ้วนและสมบูรณ์ ดีมาก'
  },
  {
    CertID: 'CERT-002',
    StudentID: '6601010024',
    Name: 'เกียรติบัตรการนำเสนองานวิจัยดีเด่น Oral Presentation Award 2024 - Chiang Mai Nursing Forum',
    Date: '2024-11-21',
    Category: 'รางวัลระดับชาติ/นานาชาติ (National/International Award)',
    ImageURL: 'https://images.unsplash.com/photo-1571171637578-41bc2dd4dcd2?auto=format&fit=crop&w=800&q=80',
    Status: 'APPROVED',
    ApprovedBy: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)',
    Feedback: 'ยินดีด้วยกับการนำเสนอที่ดีเยี่ยม'
  },
  {
    CertID: 'CERT-003',
    StudentID: '6601010024',
    Name: 'ใบประกาศร่วมอบรม Clinical Trial Management in Remote Nursing Sites',
    Date: '2025-03-05',
    Category: 'อบรมวิชาการเฉพาะทาง (Specialized Training)',
    ImageURL: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    Status: 'PENDING'
  }
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    ActivityID: 'ACT-001',
    StudentID: '6601010024',
    Title: 'พรีเซนต์ความคืบหน้าหัวข้อวิทยานิพนธ์ประจำไตรมาสกับคณะที่ปรึกษา',
    Date: '2025-04-10',
    Description: 'รายงานแผนการรับสมัครกลุ่มตัวอย่างผู้ดูแลผู้ป่วยโรคหลอดเลือดสมอง และการติดตั้งระบบระบบพยาบาลทางไกล (Tele-Nursing App) บนสมาร์ทโฟน',
    ImagesURL: [
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540317585620-17acb02221b2?auto=format&fit=crop&w=600&q=80'
    ],
    Status: 'APPROVED',
    ApprovedBy: 'รศ.ดร. นงลักษณ์ วิเศษศิลป์ (Assoc. Prof. Dr. Nonglak Wisetsilp)',
    Feedback: 'แนวทางการทำงานชัดเจน ติดตามกลุ่มผู้ดูแลอย่างใกล้ชิด'
  },
  {
    ActivityID: 'ACT-002',
    StudentID: '6601010024',
    Title: 'จัดกิจกรรมกลุ่มแนะแนวพยาบาลวิชาชีพเพื่อเตรียมความพร้อมวิจัยในชุมชน',
    Date: '2025-05-15',
    Description: 'ลงพื้นที่จัดอบรมทักษะสติ (Mindfulness) ร่วมกับบุคลากรทางการแพทย์ ณ รพ.สต. ปทุมธานี เพื่อขยายฐานการคัดกรองกลุ่มตัวอย่างและอบรมขั้นตอนการใช้งาน',
    ImagesURL: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80'
    ],
    Status: 'PENDING'
  }
];

const DEFAULT_LOGS: ActivityLog[] = [
  { LogID: 'LOG-001', Timestamp: '2026-06-30T07:50:30-07:00', Action: 'LOGIN', UserID: 'STUDENT-1', Details: 'Student Orapan Kaewdee logged into the system' },
  { LogID: 'LOG-002', Timestamp: '2026-06-30T07:51:15-07:00', Action: 'PORTFOLIO_UPDATE', UserID: 'STUDENT-1', Details: 'Saved Dissertation Information' }
];

// LocalStorage Persistence Keys
const KEYS = {
  USERS: 'TU_PHD_USERS',
  CERTIFICATES: 'TU_PHD_CERTS',
  ACTIVITIES: 'TU_PHD_ACTIVITIES',
  CONFIGS: 'TU_PHD_CONFIGS',
  LOGS: 'TU_PHD_LOGS',
  PORTFOLIO: 'TU_PHD_STUDENT_PORTFOLIO_6601010024', // keyed by studentId for simulation
  API_URL: 'TU_PHD_API_URL'
};

// Initializer helper
export function initializeDatabase() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(KEYS.CERTIFICATES)) {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(DEFAULT_CERTIFICATES));
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
  }
  if (!localStorage.getItem(KEYS.CONFIGS)) {
    localStorage.setItem(KEYS.CONFIGS, JSON.stringify(DEFAULT_CONFIGS));
  }
  if (!localStorage.getItem(KEYS.LOGS)) {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
  }
  if (!localStorage.getItem(KEYS.PORTFOLIO)) {
    localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(DEFAULT_STUDENT_PORTFOLIO));
  }
}

// Google Apps Script Connection Config
export function getAppsScriptUrl(): string {
  return localStorage.getItem(KEYS.API_URL) || (import.meta as any).env?.VITE_APPS_SCRIPT_URL || '';
}

export function setAppsScriptUrl(url: string) {
  localStorage.setItem(KEYS.API_URL, url);
  logActivity('SYSTEM', 'CONFIG_API_URL', `Set Apps Script endpoint to: ${url}`);
}

// Database Actions
export function logActivity(userId: string, action: string, details: string) {
  initializeDatabase();
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]');
  const newLog: ActivityLog = {
    LogID: `LOG-${Date.now()}`,
    Timestamp: new Date().toISOString(),
    Action: action,
    UserID: userId,
    Details: details
  };
  logs.unshift(newLog);
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs.slice(0, 200))); // keep latest 200 logs

  // Fire to Apps Script in background if configured
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logActivity', log: newLog })
    }).catch(err => console.log('Apps Script Sync log err:', err));
  }
}

// Data Getters with automatic Google Sheets proxy syncing if API configured
export async function getUsers(): Promise<User[]> {
  initializeDatabase();
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=users`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(KEYS.USERS, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Sync users failed, falling back to LocalStorage:', e);
    }
  }
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

export async function saveUser(user: User): Promise<void> {
  initializeDatabase();
  const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const index = users.findIndex(u => u.UserID === user.UserID);
  if (index !== -1) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  logActivity(user.UserID, 'SAVE_USER', `Saved user details for ${user.FullName} (${user.Role})`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveUser', user })
      });
    } catch (e) {
      console.error('Apps Script Sync failed:', e);
    }
  }
}

export async function deleteUser(userId: string): Promise<void> {
  initializeDatabase();
  const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const updated = users.filter(u => u.UserID !== userId);
  localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
  logActivity('ADMIN', 'DELETE_USER', `Deleted user with ID ${userId}`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteUser', userId })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  initializeDatabase();
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=certificates`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Sync certs failed, falling back to LocalStorage:', e);
    }
  }
  return JSON.parse(localStorage.getItem(KEYS.CERTIFICATES) || '[]');
}

export async function saveCertificate(cert: Certificate): Promise<void> {
  initializeDatabase();
  const certs: Certificate[] = JSON.parse(localStorage.getItem(KEYS.CERTIFICATES) || '[]');
  const index = certs.findIndex(c => c.CertID === cert.CertID);
  if (index !== -1) {
    certs[index] = cert;
  } else {
    certs.push(cert);
  }
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
  logActivity(cert.StudentID, 'SAVE_CERTIFICATE', `Uploaded/Updated certificate: ${cert.Name}`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveCertificate', certificate: cert })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getActivities(): Promise<Activity[]> {
  initializeDatabase();
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=activities`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Sync activities failed, falling back to LocalStorage:', e);
    }
  }
  return JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || '[]');
}

export async function saveActivity(act: Activity): Promise<void> {
  initializeDatabase();
  const acts: Activity[] = JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || '[]');
  const index = acts.findIndex(a => a.ActivityID === act.ActivityID);
  if (index !== -1) {
    acts[index] = act;
  } else {
    acts.push(act);
  }
  localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(acts));
  logActivity(act.StudentID, 'SAVE_ACTIVITY', `Uploaded/Updated Activity Progress: ${act.Title}`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveActivity', activity: act })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getConfigOptions(): Promise<ConfigOption[]> {
  initializeDatabase();
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=configOptions`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(KEYS.CONFIGS, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Sync configs failed, falling back to LocalStorage:', e);
    }
  }
  return JSON.parse(localStorage.getItem(KEYS.CONFIGS) || '[]');
}

export async function saveConfigOption(option: ConfigOption): Promise<void> {
  initializeDatabase();
  const configs: ConfigOption[] = JSON.parse(localStorage.getItem(KEYS.CONFIGS) || '[]');
  const index = configs.findIndex(c => c.id === option.id);
  if (index !== -1) {
    configs[index] = option;
  } else {
    configs.push(option);
  }
  localStorage.setItem(KEYS.CONFIGS, JSON.stringify(configs));
  logActivity('ADMIN', 'SAVE_CONFIG', `Saved Config Option [${option.OptionType}]: ${option.OptionValue}`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveConfigOption', config: option })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function deleteConfigOption(id: string): Promise<void> {
  initializeDatabase();
  const configs: ConfigOption[] = JSON.parse(localStorage.getItem(KEYS.CONFIGS) || '[]');
  const deleted = configs.filter(c => c.id !== id);
  localStorage.setItem(KEYS.CONFIGS, JSON.stringify(deleted));
  logActivity('ADMIN', 'DELETE_CONFIG', `Deleted config option with id: ${id}`);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteConfigOption', id })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getStudentPortfolio(studentId: string): Promise<StudentPortfolioData> {
  initializeDatabase();
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=portfolio&studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(`${KEYS.PORTFOLIO}_${studentId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Sync portfolio failed, falling back to LocalStorage:', e);
    }
  }
  // Fallback to STUDENT-1 if any ID to have realistic simulation preloaded
  const storeKey = studentId === '6601010024' ? KEYS.PORTFOLIO : `${KEYS.PORTFOLIO}_${studentId}`;
  const localData = localStorage.getItem(storeKey);
  if (localData) {
    return JSON.parse(localData);
  }
  // Otherwise duplicate the DEFAULT structure for this new student
  const newData = { ...DEFAULT_STUDENT_PORTFOLIO };
  localStorage.setItem(storeKey, JSON.stringify(newData));
  return newData;
}

export async function saveStudentPortfolio(studentId: string, data: StudentPortfolioData): Promise<void> {
  initializeDatabase();
  const storeKey = studentId === '6601010024' ? KEYS.PORTFOLIO : `${KEYS.PORTFOLIO}_${studentId}`;
  localStorage.setItem(storeKey, JSON.stringify(data));
  logActivity(studentId, 'SAVE_PORTFOLIO', 'Updated full doctoral portfolio milestones & study plan sections');

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'savePortfolio', studentId, portfolio: data })
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export function getLogs(): ActivityLog[] {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]');
}

// -------------------------------------------------------------
// GOOGLE APPS SCRIPT CODE TEMPLATE
// -------------------------------------------------------------
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script Web App for Thammasat University Nursing PhD Portfolio
 *
 * INSTRUCTIONS:
 * 1. Open Google Sheet (https://sheets.google.com) and create an empty spreadsheet.
 * 2. Create sheets with these exact names: "Users", "Certificates", "Activities", "ConfigOptions", "ActivityLogs", "Portfolios".
 * 3. Add headers in Row 1 for each sheet matching the column descriptions.
 * 4. Open Extensions > Apps Script, replace with this code, and deploy as a Web App:
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone"
 * 5. Copy the generated Web App URL and paste it into the Web API Endpoint configuration inside the System Settings panel.
 */

function doGet(e) {
  var type = e.parameter.type;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet;
  var data = [];
  
  try {
    if (type === 'users') {
      sheet = ss.getSheetByName('Users');
      data = getSheetDataAsJson(sheet);
    } else if (type === 'certificates') {
      sheet = ss.getSheetByName('Certificates');
      data = getSheetDataAsJson(sheet);
    } else if (type === 'activities') {
      sheet = ss.getSheetByName('Activities');
      var raw = getSheetDataAsJson(sheet);
      data = raw.map(function(item) {
        if (item.ImagesURL) {
          try {
            item.ImagesURL = JSON.parse(item.ImagesURL);
          } catch(e) {
            item.ImagesURL = [];
          }
        } else {
          item.ImagesURL = [];
        }
        return item;
      });
    } else if (type === 'configOptions') {
      sheet = ss.getSheetByName('ConfigOptions');
      data = getSheetDataAsJson(sheet);
    } else if (type === 'portfolio') {
      var studentId = e.parameter.studentId;
      sheet = ss.getSheetByName('Portfolios');
      var portfolios = getSheetDataAsJson(sheet);
      var match = portfolios.find(function(p) { return p.StudentID === studentId; });
      if (match && match.DataJSON) {
        return ContentService.createTextOutput(match.DataJSON)
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ error: 'Not found' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var response = { success: false };
  
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    
    if (action === 'saveUser') {
      var sheet = ss.getSheetByName('Users');
      upsertRow(sheet, 'UserID', postData.user);
      response.success = true;
    } else if (action === 'deleteUser') {
      var sheet = ss.getSheetByName('Users');
      deleteRow(sheet, 'UserID', postData.userId);
      response.success = true;
    } else if (action === 'saveCertificate') {
      var sheet = ss.getSheetByName('Certificates');
      upsertRow(sheet, 'CertID', postData.certificate);
      response.success = true;
    } else if (action === 'saveActivity') {
      var sheet = ss.getSheetByName('Activities');
      var act = postData.activity;
      if (Array.isArray(act.ImagesURL)) {
        act.ImagesURL = JSON.stringify(act.ImagesURL);
      }
      upsertRow(sheet, 'ActivityID', act);
      response.success = true;
    } else if (action === 'saveConfigOption') {
      var sheet = ss.getSheetByName('ConfigOptions');
      upsertRow(sheet, 'id', postData.config);
      response.success = true;
    } else if (action === 'deleteConfigOption') {
      var sheet = ss.getSheetByName('ConfigOptions');
      deleteRow(sheet, 'id', postData.id);
      response.success = true;
    } else if (action === 'savePortfolio') {
      var sheet = ss.getSheetByName('Portfolios');
      var rowObj = {
        StudentID: postData.studentId,
        DataJSON: JSON.stringify(postData.portfolio),
        LastUpdated: new Date().toISOString()
      };
      upsertRow(sheet, 'StudentID', rowObj);
      response.success = true;
    } else if (action === 'logActivity') {
      var sheet = ss.getSheetByName('ActivityLogs');
      sheet.appendRow([
        postData.log.LogID,
        postData.log.Timestamp,
        postData.log.Action,
        postData.log.UserID,
        postData.log.Details
      ]);
      response.success = true;
    }
    
  } catch(err) {
    response.error = err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// HELPERS
function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var list = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c];
    }
    list.push(obj);
  }
  return list;
}

function upsertRow(sheet, keyColumnName, rowObject) {
  var data = getSheetDataAsJson(sheet);
  var headers = sheet.getDataRange().getValues()[0];
  var keyColIndex = headers.indexOf(keyColumnName);
  
  var existingRowIndex = -1;
  for (var r = 0; r < data.length; r++) {
    if (data[r][keyColumnName] == rowObject[keyColumnName]) {
      existingRowIndex = r + 2; // +1 header, +1 Excel 1-based index
      break;
    }
  }
  
  var rowValues = headers.map(function(header) {
    return rowObject[header] !== undefined ? rowObject[header] : "";
  });
  
  if (existingRowIndex !== -1) {
    sheet.getRange(existingRowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function deleteRow(sheet, keyColumnName, keyValue) {
  var headers = sheet.getDataRange().getValues()[0];
  var keyColIndex = headers.indexOf(keyColumnName);
  var values = sheet.getDataRange().getValues();
  
  for (var r = values.length - 1; r >= 1; r--) {
    if (values[r][keyColIndex] == keyValue) {
      sheet.deleteRow(r + 1);
    }
  }
}
`;

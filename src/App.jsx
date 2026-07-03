import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

/* Каркасы (layout) грузим сразу — они нужны на каждом экране своей зоны.
   Страницы — лениво (React.lazy): роут-чанки вместо одного бандла. */
import Layout from './components/Layout'
import CabinetLayout from './cabinet/CabinetLayout'
import PublicLayout from './public/PublicLayout'
import PublicCabinetLayout from './public/PublicCabinetLayout'

// Internal portal
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Athletes = lazy(() => import('./pages/Athletes'))
const Coaches = lazy(() => import('./pages/Coaches'))
const Judges = lazy(() => import('./pages/Judges'))
const Organizations = lazy(() => import('./pages/Organizations'))
const Facilities = lazy(() => import('./pages/Facilities'))
const Events = lazy(() => import('./pages/Events'))
const Teams = lazy(() => import('./pages/Teams'))
const Applications = lazy(() => import('./pages/Applications'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const TrainerApplications = lazy(() => import('./pages/TrainerApplications'))
const AwardApplications = lazy(() => import('./pages/AwardApplications'))
const ApplicationReview = lazy(() => import('./pages/ApplicationReview'))
const JudgeApplications = lazy(() => import('./pages/JudgeApplications'))
const JudgeApplicationReview = lazy(() => import('./pages/JudgeApplicationReview'))
const RestorationApplications = lazy(() => import('./pages/RestorationApplications'))
const RestorationApplicationReview = lazy(() => import('./pages/RestorationApplicationReview'))
const AccreditationApplications = lazy(() => import('./pages/AccreditationApplications'))
const AccreditationApplicationReview = lazy(() => import('./pages/AccreditationApplicationReview'))
const TransferApplications = lazy(() => import('./pages/TransferApplications'))
const TransferApplicationReview = lazy(() => import('./pages/TransferApplicationReview'))
const ProtocolSubmissions = lazy(() => import('./pages/ProtocolSubmissions'))
const ProtocolReview = lazy(() => import('./pages/ProtocolReview'))
const Staff = lazy(() => import('./pages/Staff'))
const MedicalCertificates = lazy(() => import('./pages/MedicalCertificates'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Stipends = lazy(() => import('./pages/Stipends'))
const Finance = lazy(() => import('./pages/Finance'))

// Intranet (corporate portal for staff)
const IntranetHome = lazy(() => import('./intranet/IntranetHome'))
const IntranetNewsList = lazy(() => import('./intranet/IntranetNews').then(m => ({ default: m.IntranetNewsList })))
const IntranetNewsDetail = lazy(() => import('./intranet/IntranetNews').then(m => ({ default: m.IntranetNewsDetail })))
const IntranetAnnouncements = lazy(() => import('./intranet/IntranetAnnouncements'))
const IntranetDirectory = lazy(() => import('./intranet/IntranetDirectory'))
const IntranetStructure = lazy(() => import('./intranet/IntranetStructure'))
const IntranetRegulations = lazy(() => import('./intranet/IntranetRegulations'))
const IntranetKnowledge = lazy(() => import('./intranet/IntranetKnowledge'))
const IntranetTemplates = lazy(() => import('./intranet/IntranetTemplates'))
const IntranetCalendar = lazy(() => import('./intranet/IntranetCalendar'))
const IntranetChat = lazy(() => import('./intranet/IntranetChat'))
const IntranetRoutes = lazy(() => import('./intranet/IntranetRoutes'))
const IntranetApprovals = lazy(() => import('./intranet/IntranetApprovals'))
const IntranetCMS = lazy(() => import('./intranet/IntranetCMS'))

// Cabinet (unified personal account)
const CabinetDashboard = lazy(() => import('./cabinet/CabinetDashboard'))
const CabinetPage = lazy(() => import('./cabinet/CabinetPage'))

// Public portal
const PublicHome = lazy(() => import('./public/PublicHome'))
const PublicVerify = lazy(() => import('./public/PublicVerify'))
const PublicLogin = lazy(() => import('./public/PublicLogin'))
const PublicLoginPlayground = lazy(() => import('./public/PublicLoginPlayground'))
const PublicTickets = lazy(() => import('./public/PublicTickets'))
const PublicTicketEvent = lazy(() => import('./public/PublicTicketEvent'))
const PublicStatistics = lazy(() => import('./public/PublicStatistics'))
const PublicTrainerRegistration = lazy(() => import('./public/PublicTrainerRegistration'))
const PublicJudgeCategory = lazy(() => import('./public/PublicJudgeCategory'))
const PublicDocumentRestoration = lazy(() => import('./public/PublicDocumentRestoration'))
const PublicAccreditation = lazy(() => import('./public/PublicAccreditation'))
const PublicTransfer = lazy(() => import('./public/PublicTransfer'))
const PublicProtocol = lazy(() => import('./public/PublicProtocol'))
const PublicCoaches = lazy(() => import('./public/PublicCoaches'))
const PublicAthletes = lazy(() => import('./public/PublicAthletes'))
const PublicAthleteProfile = lazy(() => import('./public/PublicAthleteProfile'))
const PublicJudges = lazy(() => import('./public/PublicJudges'))
const PublicAwardApplication = lazy(() => import('./public/PublicAwardApplication'))
const PublicEvents = lazy(() => import('./public/PublicEvents'))
const PublicEventDetail = lazy(() => import('./public/PublicEventDetail'))
const PublicOrganizations = lazy(() => import('./public/PublicOrganizations'))
const PublicCabinet = lazy(() => import('./public/PublicCabinet'))
const PublicMyApplications = lazy(() => import('./public/PublicMyApplications'))
const PublicNotifications = lazy(() => import('./public/PublicNotifications'))
const PublicFacilities = lazy(() => import('./public/PublicFacilities'))
const PublicSchools = lazy(() => import('./public/PublicSchools'))
const PublicNPA = lazy(() => import('./public/PublicNPA'))
const PublicTeams = lazy(() => import('./public/PublicTeams'))

// Public content pages (раскрытые placeholder'ы)
const PublicNewsList = lazy(() => import('./public/pages/PublicNews').then(m => ({ default: m.PublicNewsList })))
const PublicNewsDetail = lazy(() => import('./public/pages/PublicNews').then(m => ({ default: m.PublicNewsDetail })))
const PublicAbout = lazy(() => import('./public/pages/PublicAbout'))
const PublicBudget = lazy(() => import('./public/pages/PublicBudget'))
const PublicCalendarPlan = lazy(() => import('./public/pages/PublicCalendarPlan'))
const PublicSports = lazy(() => import('./public/pages/PublicSports'))
const PublicAnnouncements = lazy(() => import('./public/pages/PublicAnnouncements'))
const PublicServices = lazy(() => import('./public/pages/PublicServices'))
const PublicAntidoping = lazy(() => import('./public/pages/PublicAntidoping'))
const PublicAnticorruption = lazy(() => import('./public/pages/PublicAnticorruption'))
const PublicReception = lazy(() => import('./public/pages/PublicReception'))
const PublicDiscussionsList = lazy(() => import('./public/pages/PublicDiscussions').then(m => ({ default: m.PublicDiscussionsList })))
const PublicLinks = lazy(() => import('./public/pages/PublicLinks'))

/* Нейтральный фолбэк на время загрузки роут-чанка */
function RouteFallback() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
            <div className="route-spinner" aria-label="Загрузка…" />
        </div>
    )
}

export default function App() {
    return (
        <Suspense fallback={<RouteFallback />}>
        <Routes>
            {/* Root → redirect to public portal */}
            <Route path="/" element={<Navigate to="/public" replace />} />

            {/* Internal Portal */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/athletes" element={<Athletes />} />
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/judges" element={<Judges />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/events" element={<Events />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/medical-certificates" element={<MedicalCertificates />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/stipends" element={<Stipends />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/trainer-applications" element={<TrainerApplications />} />
                <Route path="/award-applications" element={<AwardApplications />} />
                <Route path="/award-applications/:id" element={<ApplicationReview />} />
                <Route path="/judge-applications" element={<JudgeApplications />} />
                <Route path="/judge-applications/:id" element={<JudgeApplicationReview />} />
                <Route path="/restoration-applications" element={<RestorationApplications />} />
                <Route path="/restoration-applications/:id" element={<RestorationApplicationReview />} />
                <Route path="/accreditation-applications" element={<AccreditationApplications />} />
                <Route path="/accreditation-applications/:id" element={<AccreditationApplicationReview />} />
                <Route path="/transfer-applications" element={<TransferApplications />} />
                <Route path="/transfer-applications/:id" element={<TransferApplicationReview />} />
                <Route path="/protocol-submissions" element={<ProtocolSubmissions />} />
                <Route path="/protocol-submissions/:id" element={<ProtocolReview />} />
                <Route path="/settings" element={<Settings />} />

                {/* Intranet - internal corporate portal */}
                <Route path="/intranet" element={<IntranetHome />} />
                <Route path="/intranet/news" element={<IntranetNewsList />} />
                <Route path="/intranet/news/:id" element={<IntranetNewsDetail />} />
                <Route path="/intranet/structure" element={<IntranetStructure />} />
                <Route path="/intranet/directory" element={<IntranetDirectory />} />
                <Route path="/intranet/regulations" element={<IntranetRegulations />} />
                <Route path="/intranet/knowledge" element={<IntranetKnowledge />} />
                <Route path="/intranet/templates" element={<IntranetTemplates />} />
                <Route path="/intranet/chat" element={<IntranetChat />} />
                <Route path="/intranet/announcements" element={<IntranetAnnouncements />} />
                <Route path="/intranet/calendar" element={<IntranetCalendar />} />
                <Route path="/intranet/routes" element={<IntranetRoutes />} />
                <Route path="/intranet/approvals" element={<IntranetApprovals />} />
                <Route path="/intranet/cms" element={<IntranetCMS />} />
            </Route>

            {/* Cabinet - unified personal account for athlete/coach/judge */}
            <Route path="/cabinet" element={<CabinetLayout />}>
                <Route index element={<CabinetDashboard />} />
                {/* Athlete sections */}
                <Route path="passport" element={<CabinetPage section="passport" />} />
                <Route path="medical" element={<CabinetPage section="medical" />} />
                <Route path="training" element={<CabinetPage section="training" />} />
                <Route path="coaches" element={<CabinetPage section="coaches" />} />
                <Route path="medals" element={<CabinetPage section="medals" />} />
                {/* Coach sections */}
                <Route path="certificate" element={<CabinetPage section="certificate" />} />
                <Route path="athletes" element={<CabinetPage section="athletes" />} />
                {/* Judge sections */}
                <Route path="license" element={<CabinetPage section="license" />} />
                <Route path="category" element={<CabinetPage section="category" />} />
                {/* Shared sections */}
                <Route path="events" element={<CabinetPage section="events" />} />
                <Route path="team" element={<CabinetPage section="team" />} />
                <Route path="applications" element={<CabinetPage section="applications" />} />
                <Route path="notifications" element={<CabinetPage section="notifications" />} />
                {/* Org specific sections */}
                <Route path="facilities" element={<CabinetPage section="facilities" />} />
            </Route>

            {/* Login - standalone, no layout wrapper */}
            <Route path="/public/login" element={<PublicLogin />} />
            <Route path="/public/login-playground" element={<PublicLoginPlayground />} />

            {/* Cabinet layout - personal cabinet (header + sidebar) */}
            <Route path="/public" element={<PublicCabinetLayout />}>
                <Route path="cabinet" element={<PublicCabinet />} />
                <Route path="cabinet/applications" element={<PublicMyApplications />} />
                <Route path="cabinet/notifications" element={<PublicNotifications />} />
            </Route>

            {/* Public External Portal */}
            <Route path="/public" element={<PublicLayout />}>
                <Route index element={<PublicHome />} />
                <Route path="verify" element={<PublicVerify />} />
                <Route path="news" element={<PublicNewsList />} />
                <Route path="news/:id" element={<PublicNewsDetail />} />
                <Route path="about" element={<PublicAbout />} />
                <Route path="npa" element={<PublicNPA />} />
                <Route path="budget" element={<PublicBudget />} />
                <Route path="calendar" element={<PublicCalendarPlan />} />
                <Route path="events" element={<PublicEvents />} />
                <Route path="events/:id" element={<PublicEventDetail />} />
                <Route path="tickets" element={<PublicTickets />} />
                <Route path="tickets/:id" element={<PublicTicketEvent />} />
                <Route path="statistics" element={<PublicStatistics />} />
                <Route path="schools" element={<PublicSchools />} />
                <Route path="athletes" element={<PublicAthletes />} />
                <Route path="athletes/:id" element={<PublicAthleteProfile />} />
                <Route path="coaches" element={<PublicCoaches />} />
                <Route path="teams" element={<PublicTeams />} />
                <Route path="judges" element={<PublicJudges />} />
                <Route path="organizations" element={<PublicOrganizations />} />
                <Route path="sports" element={<PublicSports />} />
                <Route path="facilities" element={<PublicFacilities />} />
                <Route path="announcements" element={<PublicAnnouncements />} />
                <Route path="services" element={<PublicServices />} />
                <Route path="trainer-registration" element={<PublicTrainerRegistration />} />
                <Route path="award-application" element={<PublicAwardApplication />} />
                <Route path="judge-category" element={<PublicJudgeCategory />} />
                <Route path="document-restoration" element={<PublicDocumentRestoration />} />
                <Route path="accreditation" element={<PublicAccreditation />} />
                <Route path="transfer" element={<PublicTransfer />} />
                <Route path="protocol" element={<PublicProtocol />} />
                <Route path="antidoping" element={<PublicAntidoping />} />
                <Route path="anticorruption" element={<PublicAnticorruption />} />
                <Route path="reception" element={<PublicReception />} />
                <Route path="discussions" element={<PublicDiscussionsList />} />
                <Route path="links" element={<PublicLinks />} />
            </Route>
        </Routes>
        </Suspense>
    )
}

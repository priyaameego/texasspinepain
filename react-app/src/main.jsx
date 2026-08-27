import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

import HomePage from './routes/index.jsx'
import ContactUsPage from './routes/contact-us/index.jsx'
import DrPriteshPatelPage from './routes/dr-pritesh-patel/index.jsx'
import ExpertPainManagementPage from './routes/expert-pain-management-in-dallas/index.jsx'
import FaqPage from './routes/frequently-asked-questions/index.jsx'
import InsuranceBenefitsPage from './routes/insurance-benefits/index.jsx'
import LetterOfProtectionPage from './routes/letter-of-protection/index.jsx'
import MotorVehicleAccidentsPage from './routes/motor-vehicle-accidents/index.jsx'
import ServicesPage from './routes/services/index.jsx'
import TruckAccidentsPage from './routes/truck-accidents/index.jsx'
import WorkersCompensationPage from './routes/workers-compensation/index.jsx'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const contactUsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact-us', component: ContactUsPage })
const drPriteshPatelRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dr-pritesh-patel', component: DrPriteshPatelPage })
const expertPainManagementRoute = createRoute({ getParentRoute: () => rootRoute, path: '/expert-pain-management-in-dallas', component: ExpertPainManagementPage })
const aboutUsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about-us', component: ExpertPainManagementPage })
const faqRoute = createRoute({ getParentRoute: () => rootRoute, path: '/frequently-asked-questions', component: FaqPage })
const insuranceBenefitsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/insurance-benefits', component: InsuranceBenefitsPage })
const letterOfProtectionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/letter-of-protection', component: LetterOfProtectionPage })
const motorVehicleAccidentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/motor-vehicle-accidents', component: MotorVehicleAccidentsPage })
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/services', component: ServicesPage })
const truckAccidentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/truck-accidents', component: TruckAccidentsPage })
const workersCompensationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/workers-compensation', component: WorkersCompensationPage })

const routeTree = rootRoute.addChildren([
  indexRoute, contactUsRoute, drPriteshPatelRoute, expertPainManagementRoute, aboutUsRoute,
  faqRoute, insuranceBenefitsRoute, letterOfProtectionRoute, motorVehicleAccidentsRoute,
  servicesRoute, truckAccidentsRoute, workersCompensationRoute,
])

const router = createRouter({ routeTree })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
)

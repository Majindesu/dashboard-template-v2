/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardLayoutImport } from './routes/_dashboardLayout'
import { Route as LogoutIndexImport } from './routes/logout/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as DashboardLayoutDashboardIndexImport } from './routes/_dashboardLayout/dashboard/index'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const DashboardLayoutUsersIndexLazyImport = createFileRoute(
  '/_dashboardLayout/users/',
)()

// Create/Update Routes

const DashboardLayoutRoute = DashboardLayoutImport.update({
  id: '/_dashboardLayout',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const LogoutIndexRoute = LogoutIndexImport.update({
  path: '/logout/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardLayoutUsersIndexLazyRoute =
  DashboardLayoutUsersIndexLazyImport.update({
    path: '/users/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any).lazy(() =>
    import('./routes/_dashboardLayout/users/index.lazy').then((d) => d.Route),
  )

const DashboardLayoutDashboardIndexRoute =
  DashboardLayoutDashboardIndexImport.update({
    path: '/dashboard/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/_dashboardLayout': {
      preLoaderRoute: typeof DashboardLayoutImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/logout/': {
      preLoaderRoute: typeof LogoutIndexImport
      parentRoute: typeof rootRoute
    }
    '/_dashboardLayout/dashboard/': {
      preLoaderRoute: typeof DashboardLayoutDashboardIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboardLayout/users/': {
      preLoaderRoute: typeof DashboardLayoutUsersIndexLazyImport
      parentRoute: typeof DashboardLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  DashboardLayoutRoute.addChildren([
    DashboardLayoutDashboardIndexRoute,
    DashboardLayoutUsersIndexLazyRoute,
  ]),
  LoginIndexRoute,
  LogoutIndexRoute,
])

/* prettier-ignore-end */

// simulation-2/src/App.tsx
//
// fxhashArchive's App.tsx routes between a landing page, a browsable grid,
// per-token pages, artist pages, and the gallery. This app is only ever the
// gallery, but GalleryView still calls useSearchParams (for the ?room=/?project=
// deep link) and needs a Router above it to do that — so this keeps the smallest
// router that provides one, a single route, rather than removing react-router-dom
// and hand-rolling URLSearchParams parsing in vendored code.

import { createHashRouter, RouterProvider } from 'react-router-dom'
import GalleryPage from './pages/GalleryPage'

const router = createHashRouter([{ path: '/', element: <GalleryPage /> }])

export default function App() {
  return <RouterProvider router={router} />
}

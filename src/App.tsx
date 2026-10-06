import { CourseShell } from './components/CourseShell'
import { ProgressProvider } from './state/ProgressProvider'

export default function App() {
  return (
    <ProgressProvider>
      <CourseShell />
    </ProgressProvider>
  )
}

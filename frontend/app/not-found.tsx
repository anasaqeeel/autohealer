import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Page not found</p>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The page you are looking for does not exist. Please check the URL and try again.
          </p>
        </div>
        <Link href="/dashboard">
          <Button>Go back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

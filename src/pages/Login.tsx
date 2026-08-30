import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
      <Card className="w-[380px]">
        <h1 className="text-lg font-semibold mb-1">Sign in to TailorSuite</h1>
        <p className="text-sm text-text-secondary mb-6">Welcome back.</p>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error || undefined}
          />
          <Button onClick={handleLogin} isLoading={isLoading} className="w-full mt-2">
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  )
}
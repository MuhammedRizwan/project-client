import Link from 'next/link'
import Logo from '../Logo'
import UserLoginButton from '../UserLoginButton'

export default function Header() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
          <Logo />
            <span className="text-xl font-bold text-black">Heaven Finder</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-black hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link href="/packages" className="text-black hover:text-yellow-300 transition-colors">
              Packages
            </Link>
            <Link href="/agencies" className="text-black hover:text-yellow-300 transition-colors">
              Agencies
            </Link>
            <Link href="/blog" className="text-black hover:text-yellow-300 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-black hover:text-yellow-300 transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex items-center me-2">
            <UserLoginButton/>
          </div>
        </div>
      </div>
    </nav>
  )
}
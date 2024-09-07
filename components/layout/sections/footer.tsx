import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-xl font-bold text-purple-600">
            REPLYGEN
          </Link>
            <p className="text-gray-600 mb-4">
              A brief description of your company or website.
            </p>
            <Button >Get Started</Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600">123 Main St, City, Country</p>
            <p className="text-gray-600">info@example.com</p>
            <p className="text-gray-600">+1 234 567 8900</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

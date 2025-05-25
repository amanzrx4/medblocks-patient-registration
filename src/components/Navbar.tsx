import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import { Link } from 'wouter'

const menuItems = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Patient Registration',
    href: '/patient-registration'
  },
  {
    name: 'Patient Records',
    href: '/patient-records/sql'
  }
] as const

export default function Navbar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" size="icon" className="lg:hidden">
            <MenuIcon />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="mr-6 hidden lg:flex">
            <img src="/medblocks.svg" alt="medblocks" />
            <span className="sr-only">Medblocks</span>
          </Link>
          <div className="grid gap-2 py-6 ml-2">
            {menuItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-6 hidden lg:flex items-center gap-2">
        <img className="h-12 w-auto" src="/medblocks.svg" alt="medblocks" />
        <span className="sr-only">Medblocks</span>
        <h1 className="text-xl font-bold text-medblocks-blue">Medblocks</h1>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="font-semibold group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm  transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg
      className="cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

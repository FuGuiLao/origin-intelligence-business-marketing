import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

function ThemeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-8a5 5 0 0 0 5 5V7a5 5 0 0 0-5 5Z"
      />
    </svg>
  )
}

export function ThemeToggle() {
  let [mounted, setMounted] = useState(false)
  let { resolvedTheme, setTheme } = useTheme()
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  useEffect(() => {
    setMounted(true)

    // Automatically set the theme based on the user's system preference on initial load
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(userPrefersDark ? 'dark' : 'light');

    // Optional: Listen for system preference changes and update the theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      className="group absolute right-4 top-4 z-50 -m-2.5 p-2.5"
      onClick={() => setTheme(otherTheme)}
    >
      <span className="sr-only">Switch to {otherTheme} theme</span>
      <ThemeIcon className="h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white" />
    </button>
  )
}

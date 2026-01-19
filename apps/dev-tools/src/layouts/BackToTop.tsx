import { cn } from "@devtools/libs"
import { cva } from "class-variance-authority"
import { useRef, useState } from "react"

const perimeter = 2 * 20 * Math.PI
const { scrollTo } = window

function getPreciseScrollPercentage() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  if (scrollHeight <= clientHeight) {
    return 1
  }

  const maxScroll = scrollHeight - clientHeight
  return scrollTop / maxScroll
}

function BackToTop() {
  const [rate, setRate] = useState(0)
  const toTopRef = useRef<HTMLButtonElement | null>(null)

  function handleScroll() {
    const rateComputed = getPreciseScrollPercentage() * perimeter
    setRate(rateComputed)
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll)
    return () => document.removeEventListener("scroll", handleScroll)
  }, [])

  const classes = cva(
    "w-12 h-12 bg-transparent fixed right-12 -bottom-3 text-black flex justify-center items-center cursor-pointer transition-transform transition-opacity ease-in-out duration-50 z-50 drop-shadow",
    {
      variants: {
        variant: {
          default: "-translate-y-4 opacity-0",
          secondary: "translate-12 opacity-100",
          destructive: "",
          outline: "",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  )

  return (
    <button
      ref={toTopRef}
      type="button"
      title="Back To Top"
      onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(classes({ variant: window.scrollY < 200 ? "default" : "secondary" }))}
    >
      <svg className="absolute top-0 left-0 w-10.5 h-10.5">
        <title>Back To Top Icon</title>
        <circle
          cx="21"
          cy="21"
          r="20"
          stroke="#ca2015"
          fill="#fff"
          strokeWidth="0.125rem"
          className="transition-all ease-in-out duration-300"
          strokeDasharray={`${rate}, ${perimeter}`}
        />
      </svg>
      <svg
        className="relative -top-1 -left-1 hover:repeat-infinite duration-1000 ease-in-out hover:-translateY-24"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Back To Top Icon</title>
        <g className="">
          <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />
          <path
            fill="currentColor"
            d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z"
          />
        </g>
        <g>
          <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />
          <path
            fill="currentColor"
            d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z"
          />
        </g>
      </svg>
    </button>
  )
}

export default BackToTop

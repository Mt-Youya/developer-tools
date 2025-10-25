import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="h-full flex justify-center items-center flex-col gap-8 bg-white">
      <div className="flex gap-2.5">
        <span className="border-r-px border-r-solid border-[#292e33]"> 404 </span>
        <span> Not Found </span>
      </div>
      <div className="rounded-xl p-2 active:bg-[#f1f1f1]">
        <Link
          replace
          to="/"
          className="relative pb-1 text-[#0009] bg-size-[0_2px] bg-linear-to-r[#92db72_#90ff00] transition-all duration-300 ease-in-out bg-bottom bg-right bg-no-repeat hover:bg-size-[100%_2px] hover:bg-left hover:bg-bottom"
        >
          {" "}
          Back Home{" "}
        </Link>
      </div>
    </div>
  )
}

export default NotFound

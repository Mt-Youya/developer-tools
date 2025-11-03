import Main from "@/pages/Home/components/Main"
import GenerateCommand from "./components/GenerateCommand"
import InputWorkSpace from "./components/InputWorkSpace"
import OptionResult from "./components/OptionResult"

function Home() {
  return (
    <Main>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputWorkSpace />
        <OptionResult />
      </main>
      <GenerateCommand />
    </Main>
  )
}

export default Home

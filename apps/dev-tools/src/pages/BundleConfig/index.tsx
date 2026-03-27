import type { BundleVersionInfo, DevicePlatform, Env, PillowParams } from "@devtools/shared"
import {
  Badge,
  BottomMenuDemo,
  BreathingStatus,
  Button,
  Checkbox,
  CheckboxConfetti,
  GlassButton,
  Input,
  Label,
  QRCodeSVG,
  Status,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@devtools/ui"
import { isDefined, isEmptyArray } from "@devtools/utils"
import { PlusIcon } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { CurtainPreloader, StairsPreloader } from "@/components/PreLoader"
import { getGroupVersions, getListVersions, pillowRequest } from "@/services/bundleConfig"
import { PromptParser, SkillParser } from "@/utils/parser"

interface Bundle {
  name: BundleVersionInfo["name"]
  value: BundleVersionInfo["version"]
}
const cookie =
  "_lxsdk_cuid=19b87154f79c8-082f00db37f70d-1c525631-384000-19b87154f79c8; _lxsdk=19b87154f79c8-082f00db37f70d-1c525631-384000-19b87154f79c8; nest-survey-2025-shown=true; moa_deviceId=4FCA17408D94527D8593644B264A3156; WEBDFPID=uw1vz2w066w0519802z85vu0033477z580103uw3y11579587yy43w72-1773111262849-1754879844024OYMKIGI75613c134b6a252faa6802015be905512044; utm_source_rg=AM%2597FsLsZ%25325%25ITk07uT1FFT1zkfm1u7mz0I11OOJxx7zm1k1OITOPkkzxfzmxPPJOTxu; c5ca0eb629_ssoid=eAGFzrtKA0EUgGEGm6AI4hNMKanmcnYuVm6Msoh4IYqYRmZmzywJuGmyBK0sREgnsRCsJPYWYmMr2AgKPodVaot4eQHbv_j5amRh-DSZo9Or67N3KWZDEhxDr4RdppZhwJw5sJ6DdtIyHurGC4voJGjZuCSLFNZXU66BmaaFROimSaxUAA2hIJU8UfTu6_7lQy4R8e_P_EpWZrLx5-v5m9x5nDxfPMgRqR2gbwUscUwoJtJZD0E4mxtjde4MGiaEjhHAIm_TCD9ZYY6xLsEH7p2TOeMugoOoUI0ILVuddj9LK6u3irXt_ap7Osj6uNHbNMe7e4exuCHzA3-U96oTVxbdDt6S6Z_oGxY9YPQ**eAENx8EBwCAIA8CVqIRixpEg-4_Q3u_sMN-bGWA7t1BE7nXkrDX_MWpO1FGYWUc_UoSqchy4HzTCEfc**N_0HFgZ7du81MpzGVJIQj85RA8NDTqd9tUC8RqPL2kZ56hB9kUnO7SctSDzmkzitfrSAZ6KpsVIl_CbGcZlwjA**MjQ5MjczNjksd2JfZG91eWFuZ2ppZSznqqbmiazmnbAsd2JfZG91eWFuZ2ppZUBtZWl0dWFuLmNvbSwxLGVkY18yNDkyNzM2OSwxNzczMjg1MDAxNzI3; plus_token=dHzm5Sfbt5QlTBp8Pcmkvo9v3SU9xtIaDsahtD2NdV5oLDyGPsG7oK-9DQgVmj9FYwqljAFmIgxEvchlc8jmbmYVx9luU5vjOrvYpnc5VdDogdWyeG0l-9WZmDeWhRW5FNwkmemryo_ZeEXad585HYeyfUfJpNGRuJeDQUYWBzutf3hEVJ3tey_vr0pjjEXQ0FdVWifPxyu2PSiiTcmaHTXD8It8-428G9zFJTuVhkmQGOteV0PpvgvenFTHZIueC6gJR0kR-SRtUw==; phmac=PwGcn1CVMCD5tlXjxsGXaLLpqRcQRlr0-yWhuPqeuW0mzW_s80wmAq6p2xwjbb7DFeZt-gZCxNebNsjXgN6a91_feTehUmJwwqhqClEpbofadTwehDOFLTgYU_8lmBGiUJEndLHIo8q45iaUPq90nPovzzo3OjVCdY1XhEyguc72ZbMLsnF89kMJxs1VW8CxPISGaOQXWRLKdQqGEXWfherQ2dRfYXWydAS5ZqBovHwiiDG6gFIuWpsRYukXcIcDosKtMDnRXVEiIGdFea31ZdORvHugmXDVG2zeGluZzVUMe6He9Ev5g83KS8WYx73x_6sQxf1-zZfx6E2tc4dkjA==; _lxsdk_s=19cd2433825-7ba-583-67a%7C%7C176"
const DEFAULT_BUNDLES = [
  "rn_hotel_tour-around-detail",
  "rn_hotel_hotelchannel-facilities-detail",
  "rn_hotel_rn-hotel-shoppingcart",
  "rn_hotel_experience-highlights",
  "rn_hotel_hotelchannel-goods-detail",
  "rn_hotel_hotel-facilities-detail",
  "rn_travel_travelhpx",
  "rn_hotel_superdeal",
  "rn_hotel_rn-hotel-poidetail",
  "rn_hotel_hotelchannel-album",
  "rn_hotel_hotel-low-price-detail",
  "rn_hotel_superdeal-shoplist",
]

const DETAULT_ENV = "prod"
const DETAULT_PLATFORM = "iOS"
function BundleConfig() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [qrcode, setQrcode] = useState("")
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform] = useState<DevicePlatform>(DETAULT_PLATFORM)
  const [env, setEnv] = useState<Env>(DETAULT_ENV)
  const [bundleNames, setBundleNames] = useState(DEFAULT_BUNDLES)
  const [disabledCache, setDisabledCache] = useState(false)
  const caches = useRef(new Map<DevicePlatform, { [env in Env]?: { list: Bundle[]; qrcode: string } }>())

  const useCache = { "Cache-Control": disabledCache ? "no-store" : "no-cache" }
  // const listVersions = getListVersions()
  const groupVersions = getGroupVersions(useCache)

  const pillowReq = pillowRequest(useCache)
  async function generatePillowQRCode(bundleConfigList: PillowParams[]) {
    const { data } = await pillowReq(bundleConfigList)
    return data.pillow
  }

  async function fetchData(platform: DevicePlatform, env: Env) {
    if (!disabledCache) {
      const cache = caches.current?.get(platform)
      const cached = cache?.[env]
      if (cached) {
        return setBundles(cached.list), setQrcode(cached.qrcode), setLoading(false)
      }
    }
    setLoading(true)

    const { data } =
      (await groupVersions({
        bundleNames,
        platform,
        env,
      })) || {}

    const bundles = Object.entries(data).map(([key, { list: [{ version }] = [{ version: "" }] }]) => ({
      name: key,
      value: version,
    }))

    setBundles(bundles)

    const target = {
      type: "mrnbundle",
      blockOnFail: true,
    }
    const results: PillowParams[] = bundles.map(({ name, value }, index) => ({
      index,
      ...target,
      info: {
        isStage: 1,
        bundleName: name,
        bundleVersion: value,
      },
    }))
    const val = await generatePillowQRCode(results)
    setQrcode(val)
    setLoading(false)
    caches.current.set(platform, {
      [env]: { list: bundles, qrcode: val },
    })
  }

  useEffect(() => {
    fetchData(platform, env)
  }, [platform, env, disabledCache])
  

  const devices: DevicePlatform[] = ["iOS", "HarmonyOS", "Android"]

  const disabledCacheId = useId()

  return (
    <div className="flex-1 bg-linear-to-r from-slate-50 to-slate-100 p-6">
      <div className="mx-auto">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Bundle 配置管理</h1>
          <p className="text-slate-600">扫描二维码在 Pillow 中查看和测试您的 Bundle 配置</p>
          <div className="flex items-center gap-2">
            <Checkbox id={disabledCacheId} checked={disabledCache} onCheckedChange={setDisabledCache} />
            <Label htmlFor={disabledCacheId}>禁用缓存？</Label>
          </div>
          {/* <BottomMenuDemo /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 mx-auto max-w-11/12 ">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-64 h-64 bg-slate-100 rounded-xl animate-pulse"></div>
                <p className="text-slate-500">生成二维码中...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-block p-4 bg-gray-50 rounded-2xl shadow-sm">
                    <QRCodeSVG value={qrcode} size={400} />
                  </div>
                </div>
                <a
                  href={qrcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>open _blank</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  在 Pillow 中打开
                </a>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <Tabs
              defaultValue={DETAULT_PLATFORM}
              className="w-full mb-4"
              onValueChange={(value) => setPlatform(value as DevicePlatform)}
            >
              <TabsList className="grid w-full grid-cols-3">
                {devices.map((d) => (
                  <TabsTrigger key={d} value={d} children={d} />
                ))}
              </TabsList>
              {devices.map((d, idx) => (
                <TabsContent value={d} key={d + idx}>
                  {loading ? <BunldePlaceHolder /> : <BundleTable setEnv={setEnv} bundles={bundles} env={env} />}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* 底部信息卡片 */}
        <div className="mt-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>info</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">使用说明</h3>
              <p className="text-slate-600 text-sm">
                使用 Pillow App 扫描上方二维码，即可在移动设备上测试和调试这些 Bundle 配置。
              </p>
            </div>
          </div>
        </div>
      </div>
      <CheckboxConfetti />
    </div>
    // <CurtainPreloader loading={loading}>

    // </CurtainPreloader>
  )
}

function BunldePlaceHolder() {
  "use memo"
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-lg animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

function BundleTable({ bundles, setEnv, env }: { bundles: Bundle[]; setEnv: Dispatch<SetStateAction<Env>>; env: Env }) {
  "use memo"
  const [add, setAdd] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Bundle 列表</h2>
        <Tabs defaultValue={env} className="w-3/4" onValueChange={(e) => setEnv(e as Env)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test">test</TabsTrigger>
            <TabsTrigger value="prod">prod</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {bundles.filter(isDefined).length} 个配置
        </span>
      </div>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-800 text-lg font-semibold">Bundle 名称</TableHead>
            <TableHead>版本</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles.map((item, index) => (
            <TableRow key={index} className="hover:bg-slate-50">
              <TableCell className="text-slate-800 text-lg font-semibold">
                <Status dot size="sm" type="success" className="mr-2" />
                {item.name}
              </TableCell>
              <TableCell>
                <Badge className="text-sm" variant="grey">
                  {item.value}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      <ul className="space-y-1">
        {bundles.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 my-2 border border-slate-200 rounded-md hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-linear-to-r from-white to-slate-50"
          >
            <BreathingStatus
              status="success"
              size="sm"
              label={
                <>
                  {item.name}
                  {/* <span className="ml-2">{item}</span> */}
                </>
              }
            />
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-mono">{item.value}</span>
          </li>
        ))}
        {add && (
          <li className="flex items-center justify-center gap-4">
            <Input placeholder="bundle name" />
            <div className="flex items-center justify-center">
              <Button variant="default" className="ml-2">
                确定
              </Button>
              <Button variant="link" className="ml-4 text-sm" onClick={() => setAdd(false)}>
                取消
              </Button>
            </div>
          </li>
        )}
        <li>
          <GlassButton className="bg-gray-800" onClick={() => setAdd(true)}>
            <PlusIcon /> 添加 bundle
          </GlassButton>
        </li>
      </ul>
    </>
  )
}

export default BundleConfig

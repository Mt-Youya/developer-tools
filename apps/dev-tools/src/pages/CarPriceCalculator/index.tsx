import { Badge } from "@devtools/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devtools/ui/Card"
import { Input, UnderlineInput } from "@devtools/ui/Input"
import { Label } from "@devtools/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devtools/ui/Select"
import { Calculator, Car, DollarSign, Gift, MapPin, Shield } from "lucide-react"

interface Subsidy {
  manufacturer: number
  national: number
  provincial: number
  city: number
}

interface CitySubsidies {
  [key: string]: Subsidy
}

// 城市补贴数据（示例数据）
const citySubsidies: CitySubsidies = {
  beijing: {
    manufacturer: 0,
    national: 0,
    provincial: 0,
    city: 0,
  },
  shanghai: {
    manufacturer: 5000,
    national: 0,
    provincial: 4000,
    city: 3000,
  },
  shenzhen: {
    manufacturer: 5000,
    national: 0,
    provincial: 3500,
    city: 5000,
  },
  guangzhou: {
    manufacturer: 5000,
    national: 0,
    provincial: 3000,
    city: 3000,
  },
  hangzhou: {
    manufacturer: 5000,
    national: 0,
    provincial: 2500,
    city: 2000,
  },
}

// 新能源车补贴
const evSubsidies: CitySubsidies = {
  beijing: {
    manufacturer: 0,
    national: 0,
    provincial: 0,
    city: 0,
  },
  shanghai: {
    manufacturer: 8000,
    national: 0,
    provincial: 6000,
    city: 5000,
  },
  shenzhen: {
    manufacturer: 8000,
    national: 0,
    provincial: 7000,
    city: 8000,
  },
  guangzhou: {
    manufacturer: 8000,
    national: 0,
    provincial: 6000,
    city: 5000,
  },
  hangzhou: {
    manufacturer: 8000,
    national: 0,
    provincial: 5000,
    city: 4000,
  },
}

enum City {
  beijing = "北京",
  shanghai = "上海",
  shenzhen = "深圳",
  guangzhou = "广州",
  hangzhou = "杭州",
}

type CityKey = keyof typeof City

enum CarEnum {
  fuel = "燃油车",
  ev = "新能源",
}
type CarType = keyof typeof CarEnum

function CarPriceCalculator() {
  "use memo"
  const [msrp, setMsrp] = useState("126900")
  const [discount, setDiscount] = useState("7000")
  const [selectedCity, setSelectedCity] = useState<CityKey>("beijing")
  const [carType, setCarType] = useState<CarType>("fuel")
  const [purchaseTax, setPurchaseTax] = useState(0.1)
  const [insurance, setInsurance] = useState(0.045)

  // 计算裸车价
  const basePrice = parseFloat(msrp || "0") - parseFloat(discount || "0")

  // 获取当前补贴
  const subsidies = carType === "ev" ? evSubsidies[selectedCity] : citySubsidies[selectedCity]
  const totalSubsidy = subsidies.manufacturer + subsidies.national + subsidies.provincial + subsidies.city

  // 其他费用（上牌、车船税等）
  const otherFees = carType === "fuel" ? 1500 : 500

  // 最终落地价
  const finalPrice = basePrice + basePrice * purchaseTax + basePrice * 0.045 + otherFees - totalSubsidy

  function formatCurrency(value: number) {
    return value.toLocaleString("zh-CN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Car className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">汽车落地价计算器</h1>
          </div>
          <p className="text-gray-600">精准计算购车总成本，包含各项补贴和税费</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  基础信息
                </CardTitle>
                <CardDescription>请输入车辆价格信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="msrp">厂商指导价（元）</Label>
                  <Input
                    id="msrp"
                    type="number"
                    value={msrp}
                    onChange={(e) => setMsrp(e.target.value)}
                    placeholder="请输入厂商指导价"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">经销商优惠（元）</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="请输入优惠金额"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carType">车辆类型</Label>
                  <Select value={carType} onValueChange={(e) => setCarType(e!)}>
                    <SelectTrigger id="carType">
                      <SelectValue>{CarEnum[carType]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel">燃油车</SelectItem>
                      <SelectItem value="ev">新能源车</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    购车城市
                  </Label>
                  <Select value={selectedCity} onValueChange={(e) => setSelectedCity(e!)}>
                    <SelectTrigger id="city">
                      <SelectValue>{City[selectedCity]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(City).map(([key, val], idx) => (
                        <SelectItem key={idx} value={key}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">裸车价</span>
                    <span className="text-xl font-bold text-indigo-600">¥{formatCurrency(basePrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    = 指导价 ¥{formatCurrency(parseFloat(msrp || "0"))} - 优惠 ¥
                    {formatCurrency(parseFloat(discount || "0"))}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 补贴明细 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  补贴明细
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">厂家补贴</span>
                  <Badge variant="secondary">-¥{formatCurrency(subsidies.manufacturer)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">国家补贴</span>
                  <Badge variant="secondary">
                    {subsidies.national > 0 ? `-¥${formatCurrency(subsidies.national)}` : "暂无"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">省级补贴</span>
                  <Badge variant="secondary">-¥{formatCurrency(subsidies.provincial)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">市级补贴</span>
                  <Badge variant="secondary">-¥{formatCurrency(subsidies.city)}</Badge>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">补贴合计</span>
                    <span className="text-lg font-bold text-green-600">-¥{formatCurrency(totalSubsidy)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：费用明细 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  费用明细
                </CardTitle>
                <CardDescription>购车所需各项费用</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">裸车价</span>
                    <span className="font-semibold">¥{formatCurrency(basePrice)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-yellow-50 px-3 rounded">
                    <div className="w-24 gap-1 flex justify-start items-center">
                      <span className="flex-2 text-gray-700">购置税</span>
                      <UnderlineInput
                        type="number"
                        className="flex-1"
                        value={purchaseTax}
                        onChange={(e) => setPurchaseTax(+e.target?.value)}
                      />
                    </div>
                    <div>
                      {carType === "ev" && <Badge className="mx-2 bg-green-500">免税</Badge>}
                      <span className="font-semibold text-yellow-700">
                        {carType === "fuel" ? `¥${formatCurrency(basePrice * purchaseTax)}` : "¥0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="w-36 flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="flex-2 text-gray-700">保险费用</span>
                      <UnderlineInput
                        type="number"
                        className="flex-1"
                        value={insurance}
                        onChange={(e) => setInsurance(+e.target?.value)}
                      />
                    </div>
                    <span className="font-semibold">¥{formatCurrency(basePrice * insurance)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">其他费用</span>
                    <span className="font-semibold">¥{formatCurrency(otherFees)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded">
                    <span className="text-gray-700">补贴优惠</span>
                    <span className="font-semibold text-green-600">-¥{formatCurrency(totalSubsidy)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="bg-linear-to-r from-indigo-500 to-purple-500 p-6 rounded-lg text-white">
                    <div className="text-sm opacity-90 mb-1">预估落地价</div>
                    <div className="text-4xl font-bold">¥{formatCurrency(finalPrice)}</div>
                    <div className="text-xs opacity-75 mt-2">
                      {carType === "ev" ? "新能源车型" : "燃油车型"} ·&nbsp;
                      {City[selectedCity]}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <p className="font-medium mb-2">📌 温馨提示：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 保险费用按裸车价4.5%估算，实际以保险公司报价为准</li>
                    <li>• 其他费用包含上牌费、车船税等杂费</li>
                    <li>• 补贴政策可能随时调整，请以当地最新政策为准</li>
                    <li>• {carType === "ev" ? "新能源车免购置税" : "购置税按裸车价10%计算"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarPriceCalculator

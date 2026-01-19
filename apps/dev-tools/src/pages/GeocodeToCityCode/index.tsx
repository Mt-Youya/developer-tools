function GeocodeToCityCode() {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // 模拟逆地理编码（实际应该调用真实 API）
  async function mockReverseGeocode(lat, lng) {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 根据经纬度范围判断（这是简化的模拟逻辑）
    if (lat >= 39.4 && lat <= 41.6 && lng >= 115.7 && lng <= 117.4) {
      return {
        province: "北京",
        city: "北京市",
        district: "朝阳区",
        formatted_address: "北京市朝阳区",
      }
    }

    throw new Error("无法识别该坐标位置")
  }

  // 查找城市代码
  function findCityCode(province, district) {
    const provinceData = CITY_CODE_MAP[province]
    if (!provinceData) return null

    // 尝试匹配区县
    const districtName = district.replace(/区|县|市/g, "")
    if (provinceData[districtName]) {
      return provinceData[districtName]
    }

    // 匹配城市级别
    if (provinceData[province]) {
      return provinceData[province]
    }

    return null
  }

  const handleConvert = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        throw new Error("请输入有效的经纬度")
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("经纬度超出有效范围")
      }

      // 逆地理编码
      const geoInfo = await mockReverseGeocode(lat, lng)

      // 查找城市代码
      const cityCode = findCityCode(geoInfo.province, geoInfo.district)

      if (!cityCode) {
        throw new Error("未找到对应的城市代码，可能该地区暂未收录")
      }

      setResult({
        location: geoInfo,
        cityCode: cityCode,
        type: "city",
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
        },
        (error) => {
          setError("获取位置失败: " + error.message)
        }
      )
    } else {
      setError("浏览器不支持地理定位")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 标题 */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Cloud className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">经纬度转天气城市代码</h1>
              <p className="text-sm text-gray-500 mt-1">支持中国天气网城市编码转换</p>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">纬度 (Latitude)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="例如: 40.00651919963634"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">经度 (Longitude)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="例如: 116.47840335813709"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    转换
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition flex items-center gap-2"
              >
                <MapPin size={18} />
                当前位置
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          {/* 结果展示 */}
          {result && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Check className="text-green-500" size={20} />
                转换结果
              </h3>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">地理位置</div>
                  <div className="font-medium text-gray-800">{result.location.formatted_address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.location.province} / {result.location.city} / {result.location.district}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">城市代码</div>
                  <div className="flex items-center justify-between">
                    <code className="text-2xl font-bold text-blue-600">{result.cityCode}</code>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.cityCode)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
                      title="复制"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">类型</div>
                  <div className="font-medium text-gray-800">{result.type === "city" ? "城市级别" : "未知"}</div>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 mt-4">
                  <div className="text-sm font-medium text-blue-800 mb-2">JSON 输出</div>
                  <pre className="text-xs text-blue-900 overflow-x-auto">
                    {JSON.stringify(
                      {
                        location: result.cityCode,
                        type: result.type,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 说明 */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h4 className="font-semibold text-gray-800 mb-2">使用说明</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>此工具使用模拟数据演示转换流程</li>
              <li>实际使用需要接入高德/百度地图 API</li>
              <li>目前支持北京、上海、广东部分城市</li>
              <li>城市代码格式遵循中国天气网标准</li>
            </ul>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">实现原理</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-medium">逆地理编码</div>
                <div className="text-gray-600">调用地图 API 将经纬度转换为省/市/区信息</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-medium">城市代码映射</div>
                <div className="text-gray-600">根据区县名称在代码库中查找对应的天气城市代码</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-medium">返回结果</div>
                <div className="text-gray-600">输出包含城市代码、类型和位置信息的完整数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeocodeToCityCode

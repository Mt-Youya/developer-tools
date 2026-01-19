// Haversine 公式计算两点之间的距离（单位：千米）
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371 // 地球半径，单位为千米
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 返回距离，单位：千米
}

// 城市列表（此处为示例数据，实际使用时请准备完整数据集）
const cities = [
  { name: "北京", lat: 39.9042, lon: 116.4074 },
  { name: "上海", lat: 31.2304, lon: 121.4737 },
  { name: "广州", lat: 23.1291, lon: 113.2644 },
  // 可以继续添加更多城市
]

// 根据经纬度查找最接近的城市
function getCityByCoordinates(lat, lon) {
  let minDistance = Infinity
  let closestCity = null

  cities.forEach((city) => {
    const distance = haversine(lat, lon, city.lat, city.lon)
    if (distance < minDistance) {
      minDistance = distance
      closestCity = city
    }
  })

  return closestCity ? closestCity.name : "未找到城市"
}

// 示例：根据经纬度获取城市
const latitude = 39.9042 // 示例经纬度
const longitude = 116.4074 // 示例经纬度
const city = getCityByCoordinates(latitude, longitude)

console.log(`该位置的城市是：${city}`)

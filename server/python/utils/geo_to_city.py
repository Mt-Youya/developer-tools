from geopy.geocoders import Nominatim

def get_city_by_coordinates(lat, lng):
    geolocator = Nominatim(user_agent="dev-tools/1.0")
    location = geolocator.reverse((lat, lng), language='zh')
    if location:
        address = location.raw.get('address', {})
        city = address.get('city', address.get('town', '未知城市'))
        return city
    return None

# 示例经纬度
latitude =40.00653456966811
longitude = 116.47843169943384

city = get_city_by_coordinates(latitude, longitude)
print(f'该位置的城市是：{city}')

import { ServerStore } from '@/stores/server';
import { getAllLocalIPs, getLocalIP, getIPFromService } from '@/utils/getLocalIP';

export function useLocalIP() {
    const { server, setServer } = ServerStore()
    async function getIPV4() {
        const ip = await getLocalIP()
        if (ip) {
            return ip
        }
        const ips = await getAllLocalIPs()
        if (ips.length) {
            return ips[0]
        }
        const result = await getIPFromService()
        if (result) {
            return result
        }
        console.log('无法获取IP');
    }

    useEffect(() => {
        (async () => {
            const ip = await getIPV4()
            if (!ip) {
                return
            }
            setServer(ip)
        })()
    }, [])

    return [server, setServer] as const
} 

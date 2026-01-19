export function getLocalIP(): Promise<string> {
  return new Promise((resolve, reject) => {
    const pc = new RTCPeerConnection({
      iceServers: [],
    })

    pc.createDataChannel("")

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate
        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/
        const match = candidate.match(ipRegex)

        if (match && !match[0].startsWith("127.")) {
          resolve(match[0])
          pc.close()
        }
      }
    }

    pc.createOffer().then((offer) => pc.setLocalDescription(offer))

    // 超时处理
    const timer = setTimeout(() => {
      reject("获取IP超时")
      clearTimeout(timer)
    }, 3000)
  })
}

export function getAllLocalIPs(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const ips: string[] = []
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    pc.createDataChannel("")

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate
        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/g
        const matches = candidate.match(ipRegex)

        if (matches) {
          matches.forEach((ip) => {
            if (!ip.startsWith("127.") && !ips.includes(ip)) {
              ips.push(ip)
            }
          })
        }
      } else {
        // 收集完成
        pc.close()
        resolve(ips)
      }
    }

    pc.createOffer().then((offer) => pc.setLocalDescription(offer))

    const timer = setTimeout(() => {
      if (ips.length > 0) {
        resolve(ips)
      } else {
        reject("未找到本地IP")
      }
      clearTimeout(timer)
    }, 5000)
  })
}

export async function getIPFromService(): Promise<string> {
  try {
    // 这种方法获取的是公网IP，不是局域网IP
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("获取IP失败:", error)
    return ""
  }
}

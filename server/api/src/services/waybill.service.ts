import axios from "axios"
import { isObject } from "lodash-es"

export class WaybillService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  async getWaywill(trackNo = "SF0252714495269", cookie = ""): Promise<any> {
    try {
      const response = await this.httpClient.get(
        `https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/#${trackNo}`,
        {
          params: {
            lang: "sc",
            region: "cn",
            translate: "",
          },
        }
      )

      const { result = [], success } = isObject(response.data)
        ? response.data
        : { result: response.data, success: true }

      return {
        success,
        data: result,
        error: !success ? result : null,
      }
    } catch (error: any) {
      console.error("Waybill API error:", error.message)
      return {
        code: 500,
        success: false,
        data: [],
        error: this.getErrorMessage(error),
      }
    }
  }

  private getErrorMessage(error: any) {
    if (error.response) {
      return `API Error: ${error.response.status} ${error.response.statusText}`
    } else if (error.request) {
      return "Network Error: Unable to connect to music service"
    } else {
      return `Request Error: ${error.message}`
    }
  }
}

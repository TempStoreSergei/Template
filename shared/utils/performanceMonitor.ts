/**
 * Formats the parameters as a query string
 * @param data - The data object to be formatted
 * @returns A formatted query string
 */
function formatParams(data: Record<string, any> = {}): string {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}

/**
 * Performance monitoring class
 */
class PerformanceMonitor {
  // Task list to store all requests
  private reqDataList: any[] = [];
  // Default options for performance monitoring
  private options: {
    reportUrl: string;
    appId: string;
    appName: string;
    env: string;
    infoType: string;
    timeSpan: number;
    userAgent: string;
    isSendBeacon: boolean;
  };

  /**
   * Constructor to initialize PerformanceMonitor with custom options
   * @param ops - Partial options to override the default settings
   */
  constructor(ops: Partial<PerformanceMonitor["options"]>) {
    this.options = {
      reportUrl: location.href,
      appId: "",
      appName: "",
      env: "dev",
      infoType: "performance",
      timeSpan: Date.now(),
      userAgent: navigator.userAgent,
      isSendBeacon: false,
      ...ops,
    };
    this.init();
  }

  /**
   * Initializes the performance monitor
   */
  private init() {
    this.listenOnLoad();
  }

  /**
   * Adds an event listener for the window load event to gather performance data
   */
  private listenOnLoad() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.savePerformanceData({
          currentPagetUrl: location.href,
        });
      }, 0);
    });
  }

  /**
   * Gathers performance data from the browser
   * @returns An object containing various performance metrics
   */
  private getPerformanceData() {
    const {
      navigationStart = 0,
      fetchStart = 0,
      domainLookupStart = 0,
      domainLookupEnd = 0,
      connectStart = 0,
      connectEnd = 0,
      responseStart = 0,
      responseEnd = 0,
      domInteractive = 0,
      domContentLoadedEventEnd = 0,
      domComplete = 0,
      loadEventEnd = 0,
    } = window.performance.timing;

    return {
      prepareNewPageTime: fetchStart - navigationStart,
      queryDNSTime: domainLookupEnd - domainLookupStart,
      connectionTCPTime: connectEnd - connectStart,
      requestTime: responseEnd - responseStart,
      analysisDOMTime: domComplete - domInteractive,
      whiteScreenTime: responseStart - navigationStart,
      domReadyTime: domContentLoadedEventEnd - navigationStart,
      onloadSuccessTime: loadEventEnd - navigationStart,
    };
  }

  /**
   * Saves the performance data and sends a report
   * @param obj - Additional data to be included in the performance report
   */
  private async savePerformanceData(obj: Record<string, any>) {
    const performanceInfo = this.getPerformanceData();
    Object.assign(performanceInfo, obj, { timeSpan: Date.now() });
    this.reqDataList.push({ ...this.options, ...performanceInfo });
    await this.asyncSendReport();
  }

  /**
   * Asynchronously sends performance reports
   */
  private asyncSendReport() {
    const { isSendBeacon, reportUrl } = this.options;

    while (this.reqDataList.length > 0) {
      const reqData = this.reqDataList.shift();
      setTimeout(() => {
        this.sendReport(reqData, reportUrl, isSendBeacon);
      }, 0);
    }
  }

  /**
   * Sends performance data using Beacon API or as an image request
   * @param performance - Performance data to be sent
   * @param reportUrl - URL to send the data to
   * @param isSendBeacon - Flag to determine if Beacon API should be used
   */
  private sendReport(
    performance: any,
    reportUrl: string,
    isSendBeacon: boolean,
  ) {
    if (isSendBeacon) {
      this.sendBeacon(performance, reportUrl);
    } else {
      this.sendImage(performance, reportUrl);
    }
  }

  /**
   * Sends performance data using Beacon API
   * @param data - Performance data to be sent
   * @param reportUrl - URL to send the data to
   */
  private sendBeacon(data: any, reportUrl: string) {
    navigator.sendBeacon(reportUrl, JSON.stringify(data));
  }

  /**
   * Sends performance data as an image request
   * @param data - Performance data to be sent
   * @param reportUrl - URL to send the data to
   */
  private sendImage(data: any, reportUrl: string) {
    const image = new Image();
    image.src = `${reportUrl}?${formatParams(data)}`;
  }
}

export default new PerformanceMonitor({
  reportUrl: "http://localhost:10300/performanceMonitor",
  appId: "performanceMonitor-1559318109525",
  appName: "performanceMonitor",
  env: "dev",
});

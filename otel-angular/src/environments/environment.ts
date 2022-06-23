// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { OpenTelemetryConfig } from "@jufab/opentelemetry-angular-interceptor";
import { DiagLogLevel } from "@opentelemetry/api";

const opentelemetryConfig: OpenTelemetryConfig = {
  commonConfig: {
    console: true, // Display trace on console
    production: false, // Send trace with BatchSpanProcessor (true) or SimpleSpanProcessor (false)
    logBody: true, // true add body in a log, nothing otherwise
    serviceName: 'otel-angular', //Service name send in trace
    probabilitySampler: '1', //Samples a configurable percentage of traces, string value between '0' to '1'
    logLevel: DiagLogLevel.ALL // DiagLogLevel is an Enum from @opentelemetry/api
  },
  batchSpanProcessorConfig: { // Only if production = true in commonConfig
    maxQueueSize: '2048', // The maximum queue size. After the size is reached spans are dropped.
    maxExportBatchSize: '512', // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
    scheduledDelayMillis: '5000', // The interval between two consecutive exports
    exportTimeoutMillis: '30000', // How long the export can run before it is cancelled
  },
  otelcolConfig: {
    url: '/v1/traces', //URL of opentelemetry collector
  }
}

export const environment = {
  production: false,
  opentelemetryConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

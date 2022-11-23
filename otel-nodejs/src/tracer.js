"use strict";

const opentelemetry = require("@opentelemetry/api");

// Not functionally required but gives some insight what happens behind the scenes
const {diag, DiagConsoleLogger, DiagLogLevel} = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

const {AlwaysOnSampler} = require("@opentelemetry/core");
const {registerInstrumentations} = require("@opentelemetry/instrumentation");
const {NodeTracerProvider} = require("@opentelemetry/sdk-trace-node");
const {SimpleSpanProcessor} = require("@opentelemetry/sdk-trace-base");
const {Resource} = require("@opentelemetry/resources");
const {
  SemanticAttributes,
  SemanticResourceAttributes: ResourceAttributesSC,
} = require("@opentelemetry/semantic-conventions");

const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const {HttpInstrumentation} = require("@opentelemetry/instrumentation-http");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributesSC.SERVICE_NAME]: serviceName,
    }),
    sampler: filterSampler(ignoreSpan, new AlwaysOnSampler()),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });

  const traceExporterOptions = {
    url: "http://localhost:4318/v1/traces",
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 10, // an optional limit on pending requests
  };

  const traceExporter = new OTLPTraceExporter(traceExporterOptions);

  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer(serviceName);
};

function filterSampler(filterFn, parent) {
  return {
    shouldSample(ctx, tid, spanName, spanKind, attr, links) {
      if (filterFn(spanName, spanKind, attr)) {
        return {decision: opentelemetry.SamplingDecision.NOT_RECORD};
      }
      return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
    },
    toString() {
      return `FilterSampler(${parent.toString()})`;
    },
  };
}

function ignoreSpan(spanName, spanKind, attributes) {
  return (
    spanKind === opentelemetry.SpanKind.SERVER && (
      attributes[SemanticAttributes.HTTP_ROUTE] === "/health" ||
      attributes[SemanticAttributes.HTTP_TARGET] === "/health"
    )
  );
}

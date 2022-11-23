import {ConsoleSpanExporter, SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import {Resource} from "@opentelemetry/resources";
import {FetchInstrumentation} from '@opentelemetry/instrumentation-fetch';
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {W3CTraceContextPropagator} from '@opentelemetry/core';
import {registerInstrumentations} from '@opentelemetry/instrumentation';

const OTEL_COLLECTOR_TRACE_URL = 'http://localhost:4318/v1/traces';
const SERVICE_NAME = "otel-react";

const resource = new Resource({"service.name": SERVICE_NAME});

const tracerProvider = new WebTracerProvider({resource});
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({url: OTEL_COLLECTOR_TRACE_URL})));
tracerProvider.register({
  contextManager: new ZoneContextManager(),
  propagator: new W3CTraceContextPropagator(),
});
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({}),
  ],
});

export const tracer = tracerProvider.getTracer(SERVICE_NAME);

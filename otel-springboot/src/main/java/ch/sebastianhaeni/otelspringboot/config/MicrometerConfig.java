package ch.sebastianhaeni.otelspringboot.config;

import io.micrometer.tracing.otel.bridge.*;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

import static io.opentelemetry.sdk.trace.samplers.Sampler.alwaysOn;

@Configuration
public class MicrometerConfig {

    @Bean
    SpanExporter spanExporter() {
        return OtlpGrpcSpanExporter.builder()
            .setEndpoint("http://localhost:4317")
            .build();
    }

    @Bean
    SdkTracerProvider sdkTracerProvider(SpanExporter spanExporter) {
        return SdkTracerProvider.builder()
            .setSampler(alwaysOn())
            .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
            .addResource(Resource.builder().put("service.name", "otel-springboot").build())
            .build();
    }

    @Bean
    OpenTelemetrySdk getOpenTelemetrySdk(SdkTracerProvider sdkTracerProvider) {
        return OpenTelemetrySdk.builder()
            .setTracerProvider(sdkTracerProvider)
            .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
            .build();
    }

    @Bean
    OtelTracer tracer(OpenTelemetrySdk openTelemetrySdk) {

        Tracer otelTracer = openTelemetrySdk.getTracerProvider()
            .get("io.micrometer.micrometer-tracing");

        OtelCurrentTraceContext otelCurrentTraceContext = new OtelCurrentTraceContext();
        Slf4JEventListener slf4JEventListener = new Slf4JEventListener();
        Slf4JBaggageEventListener slf4JBaggageEventListener = new Slf4JBaggageEventListener(Collections.emptyList());

        return new OtelTracer(otelTracer, otelCurrentTraceContext, event -> {
            slf4JEventListener.onEvent(event);
            slf4JBaggageEventListener.onEvent(event);
        }, new OtelBaggageManager(otelCurrentTraceContext, Collections.emptyList(), Collections.emptyList()));
    }
}

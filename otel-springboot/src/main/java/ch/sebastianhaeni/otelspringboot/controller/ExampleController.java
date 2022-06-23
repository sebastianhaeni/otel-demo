package ch.sebastianhaeni.otelspringboot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/example")
public class ExampleController {

    private static final Logger LOG = LoggerFactory.getLogger(ExampleController.class);

    @GetMapping
    public String example() {
        LOG.info("Example called");
        return "example";
    }

}

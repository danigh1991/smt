package ir.samatco.smt.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PropertyController {

    @Value("${multipart.max-file-size:2500KB}")
    private String maxFileSize;

    @Value("${multipart.max-file-size:2500KB}")
    private void setMaxFileSize(String maxFileSize) { PropertyController.MAX_FILE_SIZE = maxFileSize; }

    public static String MAX_FILE_SIZE; //This is a static field which needs to be injected
}

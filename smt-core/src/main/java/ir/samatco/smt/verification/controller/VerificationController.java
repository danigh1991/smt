package ir.samatco.smt.verification.controller;

import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.response.ApiResponse;
import ir.samatco.smt.verification.service.VerificationService;
import ir.samatco.userManagement.userManagement.predefined.AdminRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping("/phone")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(method = RequestMethod.POST, value = "/verification", name = Constants.SEND_VERIFICATION_SMS)
    public ResponseEntity<ApiResponse> sendVerificationMessage(@RequestParam Integer fileId) {
        return verificationService.sendSms(fileId);
    }

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(method = RequestMethod.GET, value = "/verificationList", name = Constants.GET_VERIFICATION_LIST)
    public ResponseEntity<ApiResponse> getVerificationList() { return verificationService.getVerificationList(); }
}

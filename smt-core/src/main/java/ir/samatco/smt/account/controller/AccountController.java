package ir.samatco.smt.account.controller;

import ir.samatco.smt.account.service.AccountService;
import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.response.ApiResponse;
import ir.samatco.userManagement.userManagement.predefined.AdminRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RolesAllowed(AdminRole.NAME)
    @RequestMapping(value = "/list", method = RequestMethod.GET, name = Constants.GET_ACCOUNTS)
    public ResponseEntity<ApiResponse> getAccounts() { return accountService.getAccounts(); }
}

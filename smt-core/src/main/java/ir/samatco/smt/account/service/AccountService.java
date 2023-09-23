package ir.samatco.smt.account.service;

import ir.samatco.smt.account.entity.Account;
import ir.samatco.smt.account.repo.AccountRepository;
import ir.samatco.smt.response.APIResponseCodeConstants;
import ir.samatco.smt.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public ResponseEntity<ApiResponse> getAccounts() {
        return new ResponseEntity<>(
                new ApiResponse(APIResponseCodeConstants.OK_RESPONSE, accountRepository.findAll()), HttpStatus.OK);
    }

    public boolean exists(Integer accountId) { return accountRepository.exists(accountId); }

    public Account findAccountById(Integer accountId) { return accountRepository.findOne(accountId); }
}

package ir.samatco.smt.file.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Setter
@Getter
public class MoneyTransferDto {

    private Integer fileId;
    private Integer accountId;
    private HashMap<Integer, String> verificationMap;
}

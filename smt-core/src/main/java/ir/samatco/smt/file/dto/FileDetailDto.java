package ir.samatco.smt.file.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class FileDetailDto {

    private Integer recordId;
    private String destDepositNo;
    private String destSheba;
    private String destBankCode;
    private String destFirstName;
    private String destLastName;
    private Long amount;
    private String sourceComment;
    private String destComment;
    private String paymentId;
    private Date sentDate;
    private String status;
    private String paymentType;
}

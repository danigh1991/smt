package ir.samatco.smt.fanapPayment.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentRequestDto {

    @JsonProperty("Username")
    private String username;
    @JsonProperty("Timestamp")
    private String timestamp;
    @JsonProperty("SourceDepositNumber")
    private String sourceDepositNo;
    @JsonProperty("SourceSheba")
    private String sourceSheba;
    @JsonProperty("DestDepositNumber")
    private String destDepositNo;
    @JsonProperty("DestSheba")
    private String destSheba;
    @JsonProperty("DestBankCode")
    private String destBankCode;
    @JsonProperty("DestFirstName")
    private String destFirstName;
    @JsonProperty("DestLastName")
    private String destLastName;
    @JsonProperty("Amount")
    private Long amount;
    @JsonProperty("SourceComment")
    private String sourceComment;
    @JsonProperty("DestComment")
    private String destComment;
    @JsonProperty("PaymentId")
    private String paymentId;
}

package ir.samatco.smt.fanapPayment.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter(onMethod=@__({@JsonProperty}))
@Setter
public class FanapResponse {

    private Boolean isSuccess;
    private String message;
    private Object data;
    private Integer messageCode;
}

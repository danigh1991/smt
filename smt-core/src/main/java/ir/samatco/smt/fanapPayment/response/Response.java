package ir.samatco.smt.fanapPayment.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Response {

    private int status;
    private String error;
    private String exception;
    private String message;
    private Object data;

    @Override
    public String toString() {
        return "IsSuccess: " + this.status + " ,Message: " + this.message +
                " ,Data: " + this.data + " ,MessageCode: " + this.error;
    }
}

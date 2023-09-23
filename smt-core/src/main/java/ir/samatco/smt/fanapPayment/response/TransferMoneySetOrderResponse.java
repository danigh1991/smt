package ir.samatco.smt.fanapPayment.response;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"result"})
@XmlRootElement(name = "TransferMoneySetOrderResponse")
@Getter
@Setter
public class TransferMoneySetOrderResponse {

    @XmlElement(name = "result", required = true)
    private String result;
}

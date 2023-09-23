package ir.samatco.smt.fanapPayment.response;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"result"})
@XmlRootElement(name = "TransferMoneyResponse")
@Getter
@Setter
public class TransferMoneyResponse {

    @XmlElement(name = "result", required = true)
    private String result;
}

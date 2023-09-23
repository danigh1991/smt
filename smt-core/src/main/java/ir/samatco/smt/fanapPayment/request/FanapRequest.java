package ir.samatco.smt.fanapPayment.request;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "",
        namespace="http://ibank.fanap.ir/SignatureService",
        propOrder = {"request", "signature"}
)
@Getter
@Setter
public class FanapRequest {

    @XmlElement(name = "request", required = true)
    private String request;
    @XmlElement(name = "signature", required = true)
    private String signature;
}

package ir.samatco.smt.fanapPayment;

import ir.samatco.smt.fanapPayment.request.TransferMoneyRequest;
import ir.samatco.smt.fanapPayment.request.TransferMoneySetOrderRequest;
import ir.samatco.smt.fanapPayment.response.TransferMoneyResponse;
import ir.samatco.smt.fanapPayment.response.TransferMoneySetOrderResponse;

import javax.xml.bind.annotation.XmlRegistry;

@XmlRegistry
public class ObjectFactory {

    public ObjectFactory() { }

    /**
     * Create an instance of {@link TransferMoneyRequest }
     *
     */
    public TransferMoneyRequest createPaymentRequest() { return new TransferMoneyRequest(); }

    /**
     * Create an instance of {@link TransferMoneySetOrderRequest }
     *
     */
    public TransferMoneySetOrderRequest createSatnaRequest() { return new TransferMoneySetOrderRequest(); }

    /**
     * Create an instance of {@link TransferMoneyResponse }
     *
     */
    public TransferMoneyResponse createTransferMoneyResponse() { return new TransferMoneyResponse(); }

    /**
     * Create an instance of {@link TransferMoneySetOrderResponse }
     *
     */
    public TransferMoneySetOrderResponse createSatnaResponse() { return new TransferMoneySetOrderResponse(); }
}

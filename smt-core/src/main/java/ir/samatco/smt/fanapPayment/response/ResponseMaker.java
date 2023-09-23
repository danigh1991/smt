package ir.samatco.smt.fanapPayment.response;

import ir.samatco.smt.exception.BadRequestException;
import ir.samatco.smt.fanapPayment.constant.FanapConstant;

public class ResponseMaker {

    public static Response getResponse(FanapResponse fanapResponse) {

        Response response = new Response();
        if (fanapResponse.getIsSuccess()){
            response.setStatus(200);
            response.setError("");
            response.setMessage("عملیات مورد نظر با موفقیت انجام شد.");
            response.setData(fanapResponse.getData());
        } else {
            response.setStatus(fanapResponse.getMessageCode());
            response.setError(fanapResponse.getMessage());
            response.setException(BadRequestException.class.toString());
            response.setMessage("");
        }
        return response;
    }

    public static String convertResponse(Object object, String soapAction) {

        if (object != null)
            switch (soapAction) {
                case FanapConstant.PAYA_SOAP_ACTION:
                    return ((TransferMoneyResponse) object).getResult();
                case FanapConstant.SATNA_SOAP_ACTION:
                    return ((TransferMoneySetOrderResponse) object).getResult();
                default:
                    return "";
            }
        return "";
    }
}

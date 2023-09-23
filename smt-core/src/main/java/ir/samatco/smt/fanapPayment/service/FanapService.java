package ir.samatco.smt.fanapPayment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.samatco.smt.fanapPayment.constant.FanapConstant;
import ir.samatco.smt.fanapPayment.request.FanapRequest;
import ir.samatco.smt.fanapPayment.response.FanapResponse;
import ir.samatco.smt.fanapPayment.response.Response;
import ir.samatco.smt.fanapPayment.response.ResponseMaker;
import org.apache.commons.codec.binary.Base64;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Service;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import org.springframework.ws.soap.saaj.SaajSoapMessageFactory;

import javax.xml.soap.MessageFactory;
import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;

@Service
public class FanapService {

    private static ObjectMapper objectMapper = new ObjectMapper();

    public Response callFanapAPI(FanapRequest request, String soapAction) throws Exception {

        SaajSoapMessageFactory messageFactory = new SaajSoapMessageFactory(MessageFactory.newInstance());
        messageFactory.afterPropertiesSet();

        WebServiceTemplate webServiceTemplate = new WebServiceTemplate(messageFactory);
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("ir.samatco.smt.fanapPayment");
        marshaller.afterPropertiesSet();
        webServiceTemplate.setMarshaller(marshaller);
        webServiceTemplate.setUnmarshaller(marshaller);
        webServiceTemplate.afterPropertiesSet();

        request.setSignature(getSignature(request.getRequest()));
        Object response =  webServiceTemplate.marshalSendAndReceive(
                FanapConstant.USER_SERVICES_REQUEST_URL, request, new SoapActionCallback(soapAction));
        return ResponseMaker.getResponse(toFanapResponse(ResponseMaker.convertResponse(response, soapAction)));
    }

    private KeyPair loadKeyPair() throws GeneralSecurityException {

        byte[] modulusBytes = Base64.decodeBase64(FanapConstant.MODULUS_KEY);
        byte[] exponentBytes = Base64.decodeBase64(FanapConstant.EXPONENT_KEY);
        byte[] dBytes = Base64.decodeBase64(FanapConstant.D_KEY);
        BigInteger modulus = new BigInteger(1, modulusBytes);
        BigInteger exponent = new BigInteger(1, exponentBytes);
        BigInteger d = new BigInteger(1, dBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        RSAPublicKeySpec rsaPublicKeySpec = new RSAPublicKeySpec(modulus, exponent);
        PublicKey publicKey = keyFactory.generatePublic(rsaPublicKeySpec);
        RSAPrivateKeySpec rsaPrivateKeySpec = new RSAPrivateKeySpec(modulus, d);
        PrivateKey privateKey = keyFactory.generatePrivate(rsaPrivateKeySpec);
        return new KeyPair(publicKey, privateKey);
    }

    private String getSignature(String json) throws GeneralSecurityException {
        Signature signature = Signature.getInstance("SHA1withRSA");
        signature.initSign(loadKeyPair().getPrivate());
        signature.update(json.getBytes());
        return Base64.encodeBase64String(signature.sign());
    }

    public static FanapResponse toFanapResponse(String fanapResponse) throws IOException {
        if (!"".equals(fanapResponse))
            return objectMapper.readValue(fanapResponse, FanapResponse.class);
        return null;
    }
}

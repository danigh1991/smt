package ir.samatco.smt.verification.service;

import ir.samatco.smt.exception.BadRequestException;
import ir.samatco.smt.file.constant.Constants;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ExternalSmsService {

    @Value("${sms.username}")
    private String smsUsername;
    @Value("${sms.password}")
    private String smsPassword;
    @Value("${sms.sendSmsUrl}")
    private String sendSmsUrl;
    @Value("${sms.sendNumber}")
    private String sendNumber;

    public String sendSms(String receiver, String text) {

/**
* http://172.20.20.2:2252/url/post/SendSMS.ashx?from=500015749&to=9305450090&text=test&password=samat1234&username=btt_samat
*/

        OkHttpClient client = new OkHttpClient();

        HttpUrl.Builder urlBuilder = HttpUrl.parse(sendSmsUrl).newBuilder();
        urlBuilder.addQueryParameter("from", sendNumber);
        urlBuilder.addQueryParameter("to", receiver);
        urlBuilder.addQueryParameter("text", text);
        urlBuilder.addQueryParameter("password", smsPassword);
        urlBuilder.addQueryParameter("username", smsUsername);
        String url = urlBuilder.build().toString();

        Request request = new Request.Builder().url(url).build();

        Response response = null;
        String result = null;
        try {
            response = client.newCall(request).execute();
            result = response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException(Constants.SMS_SEND_ERROR);
        }
        return result;
    }
}

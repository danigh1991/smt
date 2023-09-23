package ir.samatco.smt.verification.service;

import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.file.entity.FileStorage;
import ir.samatco.smt.file.repo.FileStorageRepository;
import ir.samatco.smt.response.APIResponseCodeConstants;
import ir.samatco.smt.response.ApiResponse;
import ir.samatco.smt.verification.entity.PhoneVerification;
import ir.samatco.smt.verification.repo.PhoneVerificationRepository;
import ir.samatco.userManagement.conf.security.SecurityConf;
import ir.samatco.userManagement.exception.BadRequestException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VerificationService {

    private static final String NUMBER_REGEX = "^[\\u06F0-\\u06F90-9]*$";
    private static final Integer TOKEN_EXPIRY_HOUR = 24;

    private ExternalSmsService externalSmsService;
    private FileStorageRepository fileStorageRepository;
    private PhoneVerificationRepository phoneVerificationRepository;

    @Autowired
    public VerificationService(
            ExternalSmsService externalSmsService,
            FileStorageRepository fileStorageRepository,
            PhoneVerificationRepository phoneVerificationRepository) {

        this.externalSmsService = externalSmsService;
        this.fileStorageRepository = fileStorageRepository;
        this.phoneVerificationRepository = phoneVerificationRepository;
    }

    @Transactional
    public ResponseEntity<ApiResponse> sendSms(Integer fileId) {

        try {
            FileStorage file = getFileById(fileId);
            List<PhoneVerification> verificationList = new ArrayList<>();
            for (PhoneVerification entity : phoneVerificationRepository.findAll()) {
                validationMobileFormat(entity.getPhoneNumber());
                verificationList.add(sendSmsToken(entity));
            }
            file.setVerificationList(verificationList);
            saveFile(file);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL, e.getMessage()), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL, true), HttpStatus.OK);
    }

    private FileStorage getFileById(Integer fileId) {
        if (fileId != null && fileStorageRepository.exists(fileId))
            return fileStorageRepository.findOne(fileId);
        else throw new ir.samatco.smt.exception.BadRequestException(Constants.FILE_NOT_FOUND);
    }

    private void validationMobileFormat(String mobileNumber) {

        Pattern p = Pattern.compile(NUMBER_REGEX);
        Matcher m = p.matcher(mobileNumber);

        if (StringUtils.isBlank(mobileNumber))
            throw new BadRequestException(Constants.HP_ERROR_EMPTY);
        if (!m.matches())
            throw new BadRequestException(Constants.HP_ERROR_NUMERIC);
        if (!mobileNumber.startsWith("09") || mobileNumber.length() != 11)
            throw new BadRequestException(Constants.HP_ERROR_FORMAT);
    }

    private PhoneVerification sendSmsToken(PhoneVerification receiverEntity) {
        String token = generatePassword();
        String text = "کد ارسال فایل پرداخت : " + token + "\n سامانه واریز وجوه گروهی سمات";
        System.out.println("token: " + token);
        externalSmsService.sendSms(receiverEntity.getPhoneNumber(), text);
        receiverEntity.setToken(SecurityConf.getPasswordEncoder().encode(token));
        receiverEntity.setTokenExpiry(DateUtils.addHours(Calendar.getInstance().getTime(), TOKEN_EXPIRY_HOUR));
        return phoneVerificationRepository.save(receiverEntity);
    }

    private String generatePassword() {
        Integer code = 10000 + (int) (Math.random() * 89999.0D);
        return code.toString();
    }

    private void saveFile(FileStorage file) { fileStorageRepository.save(file); }

    public ResponseEntity<ApiResponse> getVerificationList() {
        return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE,
                phoneVerificationRepository.findAll()), HttpStatus.OK);
    }

    public void checkTokens(HashMap<Integer, String> verificationMap, FileStorage file) throws BadRequestException {
        if (file.getVerificationList() != null && file.getVerificationList().size() > 0) {
            if (verificationMap == null)
                throw new BadRequestException(Constants.PAYMENT_ERROR);
            for (PhoneVerification entity : file.getVerificationList()) {
                if (verificationMap.get(entity.getId()) != null) {
                    if (!SecurityConf.getPasswordEncoder().matches(verificationMap.get(entity.getId()), entity.getToken()))
                        throw new BadRequestException(Constants.SMS_TOKEN_ERROR + " - " + verificationMap.get(entity.getId()));
                    if (Calendar.getInstance().getTime().after(entity.getTokenExpiry()))
                        throw new BadRequestException(Constants.SMS_TOKEN_TIME_OUT + " - " + verificationMap.get(entity.getId()));
                } else throw new BadRequestException(Constants.SMS_TOKEN_NOT_FOUND + " - " + entity.getPhoneNumber());
            }
        } else throw new BadRequestException(Constants.FILE_TOKEN_LIST_EMPTY);
    }
}

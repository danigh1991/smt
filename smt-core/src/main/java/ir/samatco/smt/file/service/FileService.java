package ir.samatco.smt.file.service;

import ir.samatco.smt.account.service.AccountService;
import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.file.constant.FileStatus;
import ir.samatco.smt.file.dto.FileDto;
import ir.samatco.smt.file.dto.MoneyTransferDto;
import ir.samatco.smt.file.entity.FileStorage;
import ir.samatco.smt.file.entity.FileSubmission;
import ir.samatco.smt.file.repo.FileStorageRepository;
import ir.samatco.smt.file.repo.FileSubmissionRepository;
import ir.samatco.smt.response.APIResponseCodeConstants;
import ir.samatco.smt.response.ApiResponse;
import ir.samatco.smt.util.FileUtils;
import ir.samatco.smt.verification.service.VerificationService;
import ir.samatco.userManagement.userManagement.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class FileService {

    private UserService userService;
    private AccountService accountService;
    private FileDetailService fileDetailService;
    private VerificationService verificationService;
    private FileStorageRepository fileStorageRepository;
    private FileSubmissionRepository fileSubmissionRepository;

    @Autowired
    public FileService(
            UserService userService,
            AccountService accountService,
            FileDetailService fileDetailService,
            VerificationService verificationService,
            FileStorageRepository fileStorageRepository,
            FileSubmissionRepository fileSubmissionRepository) {

        this.userService = userService;
        this.accountService = accountService;
        this.fileDetailService = fileDetailService;
        this.verificationService = verificationService;
        this.fileStorageRepository = fileStorageRepository;
        this.fileSubmissionRepository = fileSubmissionRepository;
    }

    @Transactional
    public ResponseEntity<ApiResponse> uploadFile(MultipartFile document) {

        byte[] fileStream = FileUtils.checkFile(document);
        FileStorage fileStorage = new FileStorage();
        fileStorage.setId(null);
        fileStorage.setName(document.getOriginalFilename());
        fileStorage.setUploadDate(new Date());
        fileStorage.setContent(fileStream);
        fileStorage.setCheckSum(DigestUtils.md5Hex(fileStream));
        fileStorage.setCreatorUser(userService.getMe());
        FileStorage storage = fileStorageRepository.save(fileStorage);

        try {
            if (fileDetailService.transferRecords(document, storage))
                return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE, true), HttpStatus.OK);
            else
                return new ResponseEntity<>(new ApiResponse(
                        APIResponseCodeConstants.OK_GENERAL, false, Constants.FILE_CONTENT_ERROR), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(
                    APIResponseCodeConstants.OK_GENERAL, false, e.getMessage()), HttpStatus.OK);
        }
    }

    public ResponseEntity<ApiResponse> getFilesList(Pageable pageable) {

        Page<FileStorage> result = fileStorageRepository.findAll(pageable);
        List<FileDto> responseList = new ArrayList<>();
        for (FileStorage fileStorage : result.getContent()) {
            FileDto dto = new FileDto();
            dto.setFileId(fileStorage.getId());
            dto.setFileName(fileStorage.getName());
            dto.setUploadDate(fileStorage.getUploadDate());
            dto.setCheckSum(fileStorage.getCheckSum());
            dto.setCreatorUser(fileStorage.getCreatorUser().getName());
            // There should be only one record found if the file has been sent to fanapPayment web-service before
            List<FileSubmission> fileSubmissions = fileSubmissionRepository.findByFileStorageId(fileStorage.getId());
            if (fileSubmissions != null && fileSubmissions.size() > 0) {
                dto.setSubmitDate(fileSubmissions.get(0).getSubmitDate());
                dto.setFileStatus(fileSubmissions.get(0).getStatus().name());
                dto.setFromAccount(fileSubmissions.get(0).getFromAccount().getAccountNumber());
            } else
                dto.setFileStatus(FileStatus.NOT_SENT.name());
            responseList.add(dto);
        }

        return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE,
                new PageImpl<>(responseList, pageable, result.getTotalElements())), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ApiResponse> moneyTransfer(MoneyTransferDto moneyTransferDto) {

        // Bank account checking
        if (moneyTransferDto.getAccountId() == null | !accountService.exists(moneyTransferDto.getAccountId()))
            return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL,
                    false, Constants.ACCOUNT_NOT_FOUND), HttpStatus.OK);

        // Do checking on file
        FileStatus fileStatus = FileStatus.NOT_SENT;
        FileSubmission fileSubmission;
        if (moneyTransferDto.getFileId() != null && fileStorageRepository.exists(moneyTransferDto.getFileId())) {
            List<FileSubmission> fileSubmissions =
                    fileSubmissionRepository.findByFileStorageId(moneyTransferDto.getFileId());
            if (fileSubmissions != null && fileSubmissions.size() > 0) {
                // File has been sent (partially or in full) before
                fileSubmission = fileSubmissions.get(0);
                fileStatus = fileSubmission.getStatus();
                if (fileStatus.compareTo(FileStatus.SENT_SUCCESSFUL) == 0)
                    return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL,
                            false, Constants.FILE_SENT_SUCCESSFULLY), HttpStatus.OK);
            } else {
                // File not sent before (create record)
                fileSubmission = new FileSubmission();
                fileSubmission.setStatus(fileStatus);
                fileSubmission.setFromAccount(accountService.findAccountById(moneyTransferDto.getAccountId()));
                fileSubmission.setFileStorage(fileStorageRepository.findOne(moneyTransferDto.getFileId()));
                fileSubmissionRepository.save(fileSubmission);
            }
        } else return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL,
                false, Constants.FILE_NOT_FOUND), HttpStatus.OK);

        // Check tokens
        try {
            verificationService.checkTokens(moneyTransferDto.getVerificationMap(),
                    fileStorageRepository.findOne(moneyTransferDto.getFileId()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL, ex.getMessage()), HttpStatus.OK);
        }

        return fileDetailService.moneyTransferDetails(moneyTransferDto, fileSubmission);
    }
}

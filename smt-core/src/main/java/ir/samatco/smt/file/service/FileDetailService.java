package ir.samatco.smt.file.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.samatco.smt.account.entity.Account;
import ir.samatco.smt.account.service.AccountService;
import ir.samatco.smt.exception.BadRequestException;
import ir.samatco.smt.fanapPayment.request.TransferMoneySetOrderRequest;
import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.file.constant.PaymentType;
import ir.samatco.smt.file.constant.RecordStatus;
import ir.samatco.smt.file.dto.FileDetailDto;
import ir.samatco.smt.file.dto.MoneyTransferDto;
import ir.samatco.smt.file.entity.FileStorage;
import ir.samatco.smt.file.entity.FileStorageDetail;
import ir.samatco.smt.file.entity.FileSubmission;
import ir.samatco.smt.file.entity.FileSubmissionDetail;
import ir.samatco.smt.file.repo.FileStorageDetailRepository;
import ir.samatco.smt.file.repo.FileSubmissionDetailRepository;
import ir.samatco.smt.fanapPayment.constant.FanapConstant;
import ir.samatco.smt.fanapPayment.service.FanapService;
import ir.samatco.smt.fanapPayment.request.PaymentRequestDto;
import ir.samatco.smt.fanapPayment.response.Response;
import ir.samatco.smt.fanapPayment.request.TransferMoneyRequest;
import ir.samatco.smt.response.APIResponseCodeConstants;
import ir.samatco.smt.response.ApiResponse;
import org.apache.commons.validator.routines.IBANValidator;
import org.apache.commons.validator.routines.checkdigit.IBANCheckDigit;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class FileDetailService {

    private FanapService fanapService;
    private AccountService accountService;
    private FileStorageDetailRepository fileStorageDetailRepository;
    private FileSubmissionDetailRepository fileSubmissionDetailRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();
    private static String DATE_PATTERN = "yyyy/MM/dd HH:mm:ss:SSS";
    private final static long PAYA_LIMIT = 150_000_000l;// PAYA limit IRR

    @Autowired
    public FileDetailService(
            FanapService fanapService,
            AccountService accountService,
            FileStorageDetailRepository fileStorageDetailRepository,
            FileSubmissionDetailRepository fileSubmissionDetailRepository) {

        this.fanapService = fanapService;
        this.accountService = accountService;
        this.fileStorageDetailRepository = fileStorageDetailRepository;
        this.fileSubmissionDetailRepository = fileSubmissionDetailRepository;
    }

    // Check and save records to DB
    public boolean transferRecords(MultipartFile document, FileStorage fileStorage) throws Exception {

        Workbook workbook = new XSSFWorkbook(document.getInputStream());
        Sheet sheet = workbook.getSheetAt(0); //Getting first sheet
        Iterator<Row> iterator = sheet.iterator();

        while (iterator.hasNext()) {
            Row row = iterator.next();
            //For each row, iterate through all the columns
            FileStorageDetail detail = new FileStorageDetail();
            detail.setDestDepositNo(getStringCellValue(row.getCell(0)));

            // Get and check destination SHEBA
            String desSheba = getStringCellValue(row.getCell(1));
            detail.setDestSheba(checkSheba(desSheba));

            detail.setDestBankCode(getStringCellValue(row.getCell(2)));
            detail.setDestFirstName(getStringCellValue(row.getCell(3)));
            detail.setDestLastName(getStringCellValue(row.getCell(4)));
            detail.setAmount(getLongCellValue(row.getCell(5)));
            detail.setSourceComment(getStringCellValue(row.getCell(6)));
            detail.setDestComment(getStringCellValue(row.getCell(7)));
            detail.setFileStorage(fileStorage);
            fileStorageDetailRepository.save(detail);
        }

        return true;
    }

    private String checkSheba(String desSheba) {

        IBANValidator validator = new IBANValidator();
        validator.setValidator("IR", 26, "IR\\d{24}");
        IBANCheckDigit checkDigit = new IBANCheckDigit();

        if (desSheba != null) {
            desSheba = desSheba.trim();
            if (desSheba.length() == 26 /*SHEBA length*/
                    && validator.isValid(desSheba) && checkDigit.isValid(desSheba))
                return desSheba;
            else throw new BadRequestException(Constants.RECORD_SHEBA_IS_NOT_VALID + " - " + desSheba);
        }
        return null;
    }

    private String getStringCellValue(Cell cell) {
        if (cell != null) {
            CellType cellType = cell.getCellTypeEnum();
            if (cellType != CellType.BLANK && cellType == CellType.STRING)
                return String.valueOf(cell.getStringCellValue());
        }
        return null;
    }

    private Long getLongCellValue(Cell cell) {
        if (cell != null) {
            CellType cellType = cell.getCellTypeEnum();
            if (cellType != CellType.BLANK && cellType == CellType.NUMERIC)
                return new Double(cell.getNumericCellValue()).longValue();
        }
        return null;
    }

    public ResponseEntity<ApiResponse> getFileDetails(Pageable pageable, Integer fileId) {

        Page<FileStorageDetail> result = fileStorageDetailRepository.findByFileStorageId(pageable, fileId);
        List<FileDetailDto> responseList = new ArrayList<>();
        for (FileStorageDetail fileStorageDetail : result) {
            if (fileStorageDetail.isDeleted()) continue; // Continue if record is deleted
            FileDetailDto dto = new FileDetailDto();
            dto.setRecordId(fileStorageDetail.getId());
            dto.setDestDepositNo(fileStorageDetail.getDestDepositNo());
            dto.setDestSheba(fileStorageDetail.getDestSheba());
            dto.setDestBankCode(fileStorageDetail.getDestBankCode());
            dto.setDestFirstName(fileStorageDetail.getDestFirstName());
            dto.setDestLastName(fileStorageDetail.getDestLastName());
            dto.setAmount(fileStorageDetail.getAmount());
            dto.setSourceComment(fileStorageDetail.getSourceComment());
            dto.setDestComment(fileStorageDetail.getDestComment());
            // There should be only one record found if the record has been sent to fanapPayment web-service before
            List<FileSubmissionDetail> fileSubmissionDetails =
                    fileSubmissionDetailRepository.findByFileStorageDetailId(fileStorageDetail.getId());
            if (fileSubmissionDetails != null && fileSubmissionDetails.size() > 0) {
                dto.setPaymentId(fileSubmissionDetails.get(0).getPaymentId());
                dto.setSentDate(fileSubmissionDetails.get(0).getSentDate());
                dto.setStatus(fileSubmissionDetails.get(0).getStatus().name());
                dto.setPaymentType(fileSubmissionDetails.get(0).getPaymentType().name());
            }
            responseList.add(dto);
        }

        return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE,
                new PageImpl<>(responseList, pageable, result.getTotalElements())), HttpStatus.OK);
    }

    // We are not actually removing any records but just to set a flag
    public ResponseEntity<ApiResponse> deleteRecord(Integer recordId) {
        if (fileStorageDetailRepository.exists(recordId)) {
            FileStorageDetail entity = fileStorageDetailRepository.findOne(recordId);
            entity.setDeleted(true);
            fileStorageDetailRepository.save(entity);
            return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE, true), HttpStatus.OK);
        } else
            return new ResponseEntity<>(new ApiResponse(
                    APIResponseCodeConstants.OK_GENERAL, false, Constants.RECORD_NOT_FOUND), HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse> moneyTransferDetails(
            MoneyTransferDto moneyTransferDto, FileSubmission fileSubmission) {

        Account account = accountService.findAccountById(moneyTransferDto.getAccountId());
        String sourceDepositNo = account.getAccountNumber();
        String sourceSheba = account.getSheba();

        for (FileStorageDetail record : fileStorageDetailRepository.findByFileStorageId(
                null, moneyTransferDto.getFileId()).getContent()) {
            if (record.isDeleted()) continue;

            // Set a dto!
            PaymentRequestDto dto = new PaymentRequestDto();
            dto.setUsername(FanapConstant.USERNAME);
            dto.setTimestamp(new SimpleDateFormat(DATE_PATTERN).format(new Date()));
            dto.setSourceDepositNo(sourceDepositNo);
            dto.setSourceSheba(sourceSheba);
            dto.setDestDepositNo(record.getDestDepositNo());
            dto.setDestSheba(record.getDestSheba());
            dto.setDestBankCode(record.getDestBankCode());
            dto.setDestFirstName(record.getDestFirstName());
            dto.setDestLastName(record.getDestLastName());
            dto.setAmount(record.getAmount());
            dto.setSourceComment(record.getSourceComment());
            dto.setDestComment(record.getDestComment());
            dto.setPaymentId(UUID.randomUUID().toString().replace("-", ""));

            try {
                Response response;
                if (record.getAmount() > PAYA_LIMIT)
                    response = callSatna(dto);
                else response = callPayment(dto); // PAYA or inbound transfer

                if (response.getStatus() == HttpStatus.OK.value())
                    saveSubmission(dto, fileSubmission, record);
                else saveFailure(dto, fileSubmission, record);
            } catch (Exception ex) {
                ex.printStackTrace();
                return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_GENERAL,
                        ex.getMessage(), Constants.PAYMENT_ERROR), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(new ApiResponse(APIResponseCodeConstants.OK_RESPONSE,
                Constants.PAYMENT_SUCCESS), HttpStatus.OK);
    }

    private Response callSatna(PaymentRequestDto dto) throws Exception {

        TransferMoneySetOrderRequest request = new TransferMoneySetOrderRequest();
        String str = objectMapper.writeValueAsString(dto);
        str = str.replaceAll("null","\"\"");
        request.setRequest(str);
        return fanapService.callFanapAPI(request, FanapConstant.SATNA_SOAP_ACTION);
    }

    private Response callPayment(PaymentRequestDto dto) throws Exception {

        TransferMoneyRequest request = new TransferMoneyRequest();
        String str = objectMapper.writeValueAsString(dto);
        str = str.replaceAll("null","\"\"");
        request.setRequest(str);
        return fanapService.callFanapAPI(request, FanapConstant.PAYA_SOAP_ACTION);
    }

    private void saveSubmission(PaymentRequestDto dto, FileSubmission submission, FileStorageDetail record) {

        FileSubmissionDetail detail = new FileSubmissionDetail();
        detail.setPaymentId(dto.getPaymentId());
        detail.setSentDate(new Date(dto.getTimestamp()));
        detail.setStatus(RecordStatus.SENT);
        detail.setPaymentType(record.getAmount() > PAYA_LIMIT ? PaymentType.SATNA : PaymentType.PAYA);
        detail.setFileStorageDetail(record);
        detail.setFileSubmission(submission);
        fileSubmissionDetailRepository.save(detail);
    }

    private void saveFailure(PaymentRequestDto dto, FileSubmission submission, FileStorageDetail record) {

        FileSubmissionDetail detail = new FileSubmissionDetail();
        detail.setPaymentId(dto.getPaymentId());
        detail.setSentDate(new Date(dto.getTimestamp()));
        detail.setStatus(RecordStatus.FAILED);
        detail.setPaymentType(record.getAmount() > PAYA_LIMIT ? PaymentType.SATNA : PaymentType.PAYA);
        detail.setFileStorageDetail(record);
        detail.setFileSubmission(submission);
        fileSubmissionDetailRepository.save(detail);
    }
}

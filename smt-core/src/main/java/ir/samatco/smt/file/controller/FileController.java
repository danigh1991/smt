package ir.samatco.smt.file.controller;

import ir.samatco.smt.file.constant.Constants;
import ir.samatco.smt.file.dto.MoneyTransferDto;
import ir.samatco.smt.file.service.FileDetailService;
import ir.samatco.smt.file.service.FileService;
import ir.samatco.smt.response.ApiResponse;
import ir.samatco.userManagement.userManagement.predefined.AdminRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping("/file")
public class FileController {

    private FileService fileService;
    private FileDetailService fileDetailService;

    @Autowired
    public FileController(FileService fileService, FileDetailService fileDetailService) {
        this.fileService = fileService;
        this.fileDetailService = fileDetailService;
    }

    /*****************************************************************************

     File

     *****************************************************************************/

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(value = "/upload", method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE },
            name = Constants.UPLOAD_FILE)
    public ResponseEntity<ApiResponse> uploadFile(@RequestPart MultipartFile document) {
        return fileService.uploadFile(document);
    }

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(value = "/fileList", method = RequestMethod.GET, name = Constants.GET_FILES_LIST)
    public ResponseEntity<ApiResponse> getFilesList(Pageable pageable) { return fileService.getFilesList(pageable); }

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(value = "/fileDetail", method = RequestMethod.GET, name = Constants.GET_FILE_DETAILS)
    public ResponseEntity<ApiResponse> getFileDetails(Pageable pageable, @RequestParam Integer fileId) {
        return fileDetailService.getFileDetails(pageable, fileId);
    }

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(value = "/transfer", method = RequestMethod.POST, name = Constants.MONEY_TRANSFER)
    public ResponseEntity<ApiResponse> moneyTransfer(@RequestBody MoneyTransferDto moneyTransferDto) {
        return fileService.moneyTransfer(moneyTransferDto);
    }

    /*****************************************************************************

     File Records

     *****************************************************************************/

    @RolesAllowed({AdminRole.NAME})
    @RequestMapping(value = "/record/remove", method = RequestMethod.DELETE, name = Constants.DELETE_RECORD)
    public ResponseEntity<ApiResponse> deleteRecord(@RequestParam Integer recordId) {
        return fileDetailService.deleteRecord(recordId);
    }
}

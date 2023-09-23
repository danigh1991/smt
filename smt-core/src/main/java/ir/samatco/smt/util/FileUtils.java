package ir.samatco.smt.util;

import ir.samatco.smt.exception.BadRequestException;
import ir.samatco.smt.file.constant.Constants;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class FileUtils {

    private static final String MICROSOFT_EXCEL = "application/vnd.ms-excel";
    private static final String MICROSOFT_EXCEL_OPEN_XML = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static byte[] checkFile(MultipartFile multipartFile) {

        // Normalize file name
        String originalFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        // Check if the file's name contains invalid characters
        if (originalFileName.contains(".."))
            throw new BadRequestException(Constants.FILE_NAME_ERROR + originalFileName);

        if (!multipartFile.getContentType().equalsIgnoreCase(MICROSOFT_EXCEL) &&
                !multipartFile.getContentType().equalsIgnoreCase(MICROSOFT_EXCEL_OPEN_XML))
            throw new BadRequestException(Constants.FILE_NOT_ACCEPTED_FORMAT);

        if (multipartFile.getSize() > maxFileSizeInBytes())
            throw new BadRequestException(Constants.FILE_SIZE_ERROR);

        if (multipartFile.getOriginalFilename().length() > 50)
            throw new BadRequestException(Constants.FILE_NAME_TOO_LONG);

        byte[] file = null;
        try {
            file = multipartFile.getBytes();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return file;
    }

    private static Long maxFileSizeInBytes() {

        String maxFileSize = PropertyController.MAX_FILE_SIZE.trim().toLowerCase();
        long longValue = Long.parseLong(maxFileSize.substring(0, maxFileSize.length() - 2));
        if (maxFileSize.endsWith("kb"))
            return longValue * 1024;
        if (maxFileSize.endsWith("mb"))
            return longValue * 1024 * 1024;

        return longValue;
    }
}

package ir.samatco.smt.file.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class FileDto {

    private Integer fileId;
    private String fileName;
    private Date uploadDate;
    private String checkSum;
    private String creatorUser;
    private Date submitDate;
    private String fileStatus;
    private String fromAccount;
}

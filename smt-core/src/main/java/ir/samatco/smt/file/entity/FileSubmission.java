package ir.samatco.smt.file.entity;

import ir.samatco.smt.account.entity.Account;
import ir.samatco.smt.file.constant.FileStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "fileSubmission")
@Setter
@Getter
public class FileSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date submitDate;
    @Column(length = 1)
    private FileStatus status;
    @JoinColumn(name = "fromAccountId")
    private Account fromAccount;
    @JoinColumn(name = "fileStorageId")
    private FileStorage fileStorage;
}

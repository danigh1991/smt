package ir.samatco.smt.file.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "fileStorageDetail")
@Setter
@Getter
public class FileStorageDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(length = 20)
    private String destDepositNo;
    @Column(length = 26)
    private String destSheba;
    @Column(length = 3)
    private String destBankCode;
    private String destFirstName;
    private String destLastName;
    private Long amount;
    private String sourceComment;
    private String destComment;
    private boolean deleted;
    @JoinColumn(name = "fileStorageId")
    private FileStorage fileStorage;
}

package ir.samatco.smt.file.entity;

import ir.samatco.smt.file.constant.PaymentType;
import ir.samatco.smt.file.constant.RecordStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "fileSubmissionDetail")
@Setter
@Getter
public class FileSubmissionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String paymentId; // شناسه پرداخت
    @Temporal(TemporalType.TIMESTAMP)
    private Date sentDate;
    @Column(length = 1)
    private RecordStatus status;
    @Column(length = 1)
    private PaymentType paymentType;
    @JoinColumn(name = "fileStorageDetailId")
    private FileStorageDetail fileStorageDetail;
    @JoinColumn(name = "fileSubmissionId")
    private FileSubmission fileSubmission;
}

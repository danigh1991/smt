package ir.samatco.smt.file.entity;

import ir.samatco.smt.verification.entity.PhoneVerification;
import ir.samatco.userManagement.userManagement.entity.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "fileStorage")
@Setter
@Getter
public class FileStorage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    @Column(length = 50)
    private String name; // File name
    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;
    @NotNull
    @Lob
    private byte[] content;
    @NotNull
    @Column(length = 40)
    private String checkSum;
    @NotNull
    @JoinColumn(name = "creatorUserId")
    private User creatorUser;

    @ManyToMany // To keep joint information about which phone approved what file
    @JoinTable(name = "fileVerification",
    joinColumns = @JoinColumn(name = "fileId", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "phoneId", referencedColumnName = "id"))
    List<PhoneVerification> verificationList;
}

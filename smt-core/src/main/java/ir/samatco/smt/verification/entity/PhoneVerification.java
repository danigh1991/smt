package ir.samatco.smt.verification.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "phoneVerification")
@Getter
@Setter
public class PhoneVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    @Column(length = 11)
    private String phoneNumber;
    private String name;
    private String surName;
    @JsonIgnore
    private String token;
    @JsonIgnore
    @Temporal(TemporalType.TIMESTAMP)
    private Date tokenExpiry;
}

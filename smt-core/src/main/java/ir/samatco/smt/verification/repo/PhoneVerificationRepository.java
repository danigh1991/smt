package ir.samatco.smt.verification.repo;

import ir.samatco.smt.verification.entity.PhoneVerification;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(exported = false)
public interface PhoneVerificationRepository extends PagingAndSortingRepository<PhoneVerification, Integer> { }

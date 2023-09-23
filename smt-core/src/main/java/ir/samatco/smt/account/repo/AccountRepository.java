package ir.samatco.smt.account.repo;

import ir.samatco.smt.account.entity.Account;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface AccountRepository extends PagingAndSortingRepository<Account, Integer> { }

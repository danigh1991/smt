package ir.samatco.smt.file.repo;

import ir.samatco.smt.file.entity.FileStorage;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface FileStorageRepository extends PagingAndSortingRepository<FileStorage, Integer> { }

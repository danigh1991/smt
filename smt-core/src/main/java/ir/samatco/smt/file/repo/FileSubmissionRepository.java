package ir.samatco.smt.file.repo;

import ir.samatco.smt.file.entity.FileSubmission;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface FileSubmissionRepository extends PagingAndSortingRepository<FileSubmission, Integer> {

    List<FileSubmission> findByFileStorageId(Integer fileStorageId);
}

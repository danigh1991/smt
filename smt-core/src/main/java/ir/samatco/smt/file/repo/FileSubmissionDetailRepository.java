package ir.samatco.smt.file.repo;

import ir.samatco.smt.file.entity.FileSubmissionDetail;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface FileSubmissionDetailRepository extends PagingAndSortingRepository<FileSubmissionDetail, Integer> {

    List<FileSubmissionDetail> findByFileStorageDetailId(Integer id);
}

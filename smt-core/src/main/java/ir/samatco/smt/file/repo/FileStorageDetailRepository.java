package ir.samatco.smt.file.repo;

import ir.samatco.smt.file.entity.FileStorageDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface FileStorageDetailRepository extends PagingAndSortingRepository<FileStorageDetail, Integer> {

    Page<FileStorageDetail> findByFileStorageId(Pageable pageable, Integer fileId);
}

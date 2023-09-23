package ir.samatco.smt;

import ir.samatco.userManagement.RequestMappingControllerPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

import javax.annotation.PostConstruct;


@SpringBootApplication
@EnableScheduling
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@ComponentScan(basePackages = {"ir.samatco.*"})
@EnableJpaRepositories("ir.samatco.*")
@EntityScan("ir.samatco.*")
public class Application {

	@Autowired
	private RequestMappingControllerPermission requestMappingControllerPermission;

	@PostConstruct
	public void init() { requestMappingControllerPermission.RequestMappingControllerPermissionMethod(); }

	public static void main(String[] args){ SpringApplication.run(Application.class); }
}

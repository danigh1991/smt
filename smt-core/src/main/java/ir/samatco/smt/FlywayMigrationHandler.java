package ir.samatco.smt;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.annotation.PostConstruct;


@Configuration
@DependsOn("workflowProcessFlywayMigrationHandler")
public class FlywayMigrationHandler {

    @Autowired(required = false)
    private Flyway flyway;

    private final Log logger = LogFactory.getLog(FlywayMigrationHandler.class);

    @PostConstruct
    public void FlywayMigration() {

        if (flyway != null) {
            logger.info("SAMAT Money Transfer Flyway Start.");
            String[] locations = flyway.getLocations();
            String table = flyway.getTable();
            flyway.setLocations("classpath:db/smt/migration");
            flyway.setBaselineOnMigrate(true);
            flyway.migrate();
            flyway.setLocations(locations);
            flyway.setTable(table);
            logger.info("SAMAT Money Transfer Flyway finish.");
        }
    }
}

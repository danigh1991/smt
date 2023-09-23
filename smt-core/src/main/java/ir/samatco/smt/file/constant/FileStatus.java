package ir.samatco.smt.file.constant;

import com.fasterxml.jackson.annotation.JsonValue;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

public enum FileStatus {

    NOT_SENT (0),
    SENT_SUCCESSFUL (1),
    SENT_PARTIAL_SUCCESS (2),
    SENT_NOT_SUCCESSFUL (3);

    private final int val;

    FileStatus(int val) { this.val = val; }

    @JsonValue
    int val() { return val; }

    @Converter(autoApply = true)
    public static class EnumStatusConverter implements AttributeConverter<FileStatus, Integer> {

        @Override
        public Integer convertToDatabaseColumn(FileStatus fileStatus) {
            if (fileStatus != null)
                return fileStatus.val();
            return null;
        }

        @Override
        public FileStatus convertToEntityAttribute(Integer integer) {

            if (integer == null) return null;

            for (FileStatus status : FileStatus.values()) {
                if (status.val() == integer)
                    return status;
            }
            return null;
        }
    }
}

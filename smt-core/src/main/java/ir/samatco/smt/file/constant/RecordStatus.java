package ir.samatco.smt.file.constant;

import com.fasterxml.jackson.annotation.JsonValue;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

public enum RecordStatus {

    SENT (0),
    FAILED (1);

    private final int val;

    RecordStatus(int val) { this.val = val; }

    @JsonValue
    int val() { return val; }

    @Converter(autoApply = true)
    public static class EnumRecordStatusConverter implements AttributeConverter<RecordStatus, Integer> {

        @Override
        public Integer convertToDatabaseColumn(RecordStatus recordStatus) {
            if (recordStatus != null)
                return recordStatus.val();
            return null;
        }

        @Override
        public RecordStatus convertToEntityAttribute(Integer integer) {

            if (integer == null) return null;

            for (RecordStatus status : RecordStatus.values()) {
                if (status.val() == integer)
                    return status;
            }
            return null;
        }
    }
}

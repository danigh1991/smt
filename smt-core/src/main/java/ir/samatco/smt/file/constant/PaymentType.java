package ir.samatco.smt.file.constant;

import com.fasterxml.jackson.annotation.JsonValue;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

public enum PaymentType {

    PAYA (0),
    SATNA (1),
    INBOUND (2); // انتقال وجه داخلی

    private final int val;

    PaymentType(int val) { this.val = val; }

    @JsonValue
    int val() { return val; }

    @Converter(autoApply = true)
    public static class EnumPaymentTypeConverter implements AttributeConverter<PaymentType, Integer> {

        @Override
        public Integer convertToDatabaseColumn(PaymentType paymentType) {
            if (paymentType != null)
                return paymentType.val();
            return null;
        }

        @Override
        public PaymentType convertToEntityAttribute(Integer integer) {

            if (integer == null) return null;

            for (PaymentType status : PaymentType.values()) {
                if (status.val() == integer)
                    return status;
            }
            return null;
        }
    }

}

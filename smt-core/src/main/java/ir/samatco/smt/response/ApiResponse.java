package ir.samatco.smt.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public final class ApiResponse<T> {

    private String code = "";
    private T data = null;
    private String message;

    public ApiResponse() { }

    public ApiResponse(String code, T data) {

        if (code == null) {
            throw new RuntimeException("ApiResponse code & data must not be null. " +
                    "Use the `withoutData` method if you want them to be empty.");
        }
        this.code = code;
        this.data = data;
    }

    public ApiResponse(String code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message= message;
    }

    public static <T> ApiResponse<T> withoutData(String code) {
        return new ApiResponse<T>(code, null);
    }

    public String asJson() throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(this);
    }
}

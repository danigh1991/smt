package ir.samatco.smt.exception;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.text.ParseException;


@ControllerAdvice
class GlobalControllerExceptionHandler {

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(EmptyResultDataAccessException.class)
	public void notFound(){ }

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(ParseException.class)
	public void badRequest(){ }

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(DuplicateKeyException.class)
	public void conflict(){ }

    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "duplicate NationalId")
    @ExceptionHandler(DuplicateNationalId.class)
    public void DuplicateNationalId() { }

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UnauthorizedException.class)
	public void unauthorized(){ }
}

package ir.samatco.smt.file.constant;

public class Constants {

    // File related
    public static final String FILE_NOT_ACCEPTED_FORMAT = "فرمت فایل ارسالی مورد قبول نمی باشد";
    public static final String FILE_SIZE_ERROR = "اندازه فایل ارسالی بیش از حد بزرگ است";
    public static final String FILE_NAME_TOO_LONG = "نام فایل طولانی است";
    public static final String FILE_NAME_ERROR = "نام فایل انتخاب شده شامل کاراکترهای غیر مجاز می باشد";
    public static final String FILE_CONTENT_ERROR = "محتوای فایل ارسالی دارای اشکال است";
    public static final String FILE_NOT_FOUND = "فایل مورد نظر یافت نشد";
    public static final String FILE_SENT_SUCCESSFULLY = "فایل مورد نظر قبلا با موفقیت ارسال شده است";
    public static final String FILE_TOKEN_LIST_EMPTY = "لیست تائید پیامکی فایل مورد نظر خالی است";

    // Record related
    public static final String RECORD_NOT_FOUND = "رکورد مورد نظر یافت نشد";
    public static final String RECORD_SHEBA_IS_NOT_VALID = "شماره شبا معتبر نیست";

    // Method related
    public static final String UPLOAD_FILE = "آپلود فایل حقوق پرسنل شرکت";
    public static final String GET_FILES_LIST = "دریافت لیست فایل های آپلود شده";
    public static final String GET_FILE_DETAILS = "دریافت لیست رکوردهای فایل آپلود شده";
    public static final String MONEY_TRANSFER = "ارسال فایل به وب سرویس انتقال وجه";
    public static final String DELETE_RECORD = "حذف رکورد مورد نظر در فایل آپلود شده";
    public static final String GET_ACCOUNTS = "دریافت لیست حساب های شرکت";
    public static final String SEND_VERIFICATION_SMS = "درخواست ارسال اس ام اس تائید پرداخت";
    public static final String GET_VERIFICATION_LIST = "دریافت لیست شماره تلفن ها جهت تائید فایل";

    // Account related
    public static final String ACCOUNT_NOT_FOUND = "شماره حساب مورد نظر یافت نشد";

    // Payment related
    public static final String PAYMENT_ERROR = "در عملیات پرداخت مشکلی پیش آمده است";
    public static final String PAYMENT_SUCCESS = "عملیات پرداخت با موفقیت انجام شد";

    // Sms related
    public static final String HP_ERROR_EMPTY = "شماره تلفن همراه باید وارد شود";
    public static final String HP_ERROR_NUMERIC = "شماره تلفن همراه باید عدد باشد";
    public static final String HP_ERROR_FORMAT = "فرمت شماره تلفن همراه مجاز نمی باشد";
    public static final String SMS_SEND_ERROR = "ارسال پیامک با خطا مواجه شد لطفا دقایقی دیگر مجددا امتحان کنید";
    public static final String SMS_TOKEN_ERROR = "کد ارسالی مورد تائید نمی باشد";
    public static final String SMS_TOKEN_TIME_OUT = "مهلت کد تایید به اتمام رسیده است";
    public static final String SMS_TOKEN_NOT_FOUND = "کد ارسالی رکورد موجود نیست";
}

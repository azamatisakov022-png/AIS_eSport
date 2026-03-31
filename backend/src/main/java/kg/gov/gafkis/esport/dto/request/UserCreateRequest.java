package kg.gov.gafkis.esport.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Имя пользователя обязательно")
    private String username;

    @Email(message = "Некорректный формат email")
    private String email;

    @NotBlank(message = "Пароль обязателен")
    private String password;

    @NotBlank(message = "ФИО обязательно")
    private String fullName;

    private String phone;

    @NotBlank(message = "Роль обязательна")
    private String role;

    private String department;
}

package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.request.UserCreateRequest;
import kg.gov.gafkis.esport.dto.request.UserUpdateRequest;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.dto.response.UserResponse;
import kg.gov.gafkis.esport.entity.User;
import kg.gov.gafkis.esport.entity.enums.Role;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.DuplicateResourceException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAll(String search, String role, Pageable pageable) {
        Specification<User> spec = buildSpecification(search, role);
        Page<User> page = userRepository.findAll(spec, pageable);

        List<UserResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", "id", id));
        return toResponse(user);
    }

    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Пользователь", "username", request.getUsername());
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Пользователь", "email", request.getEmail());
        }

        Role role = parseRole(request.getRole());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .department(request.getDepartment())
                .isActive(true)
                .isBlocked(false)
                .failedAttempts(0)
                .build();

        user = userRepository.save(user);
        log.info("Создан пользователь: {} с ролью {} (id={})", user.getUsername(), role, user.getId());
        return toResponse(user);
    }

    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", "id", id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getRole() != null) {
            user.setRole(parseRole(request.getRole()));
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        user = userRepository.save(user);
        log.info("Обновлен пользователь: {} (id={})", user.getUsername(), user.getId());
        return toResponse(user);
    }

    public void block(Long id, boolean blocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", "id", id));
        user.setBlocked(blocked);
        if (!blocked) {
            user.setBlockedUntil(null);
            user.setFailedAttempts(0);
        }
        userRepository.save(user);
        log.info("Пользователь {} (id={}) {}", user.getUsername(), id,
                blocked ? "заблокирован" : "разблокирован");
    }

    public void resetPassword(Long id, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("Пароль должен содержать минимум 6 символов");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", "id", id));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setFailedAttempts(0);
        user.setBlocked(false);
        user.setBlockedUntil(null);
        userRepository.save(user);
        log.info("Сброшен пароль пользователя: {} (id={})", user.getUsername(), id);
    }

    private Specification<User> buildSpecification(String search, String role) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), pattern),
                        cb.like(cb.lower(root.get("username")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern)
                ));
            }

            if (role != null && !role.isBlank()) {
                try {
                    Role roleEnum = Role.valueOf(role.toUpperCase());
                    predicates.add(cb.equal(root.get("role"), roleEnum));
                } catch (IllegalArgumentException ignored) {
                    // Invalid role filter, skip
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Role parseRole(String roleStr) {
        try {
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Недопустимая роль: " + roleStr
                    + ". Допустимые: SUPERADMIN, ADMIN, EMPLOYEE, ATHLETE, COACH, JUDGE");
        }
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .linkedEntityType(user.getLinkedEntityType())
                .linkedEntityId(user.getLinkedEntityId())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

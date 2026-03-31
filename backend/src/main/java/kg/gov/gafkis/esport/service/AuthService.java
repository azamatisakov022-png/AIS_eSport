package kg.gov.gafkis.esport.service;

import kg.gov.gafkis.esport.dto.request.LoginRequest;
import kg.gov.gafkis.esport.dto.request.RefreshTokenRequest;
import kg.gov.gafkis.esport.dto.request.RegisterRequest;
import kg.gov.gafkis.esport.dto.response.AuthResponse;
import kg.gov.gafkis.esport.entity.RefreshToken;
import kg.gov.gafkis.esport.entity.User;
import kg.gov.gafkis.esport.entity.enums.Role;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.DuplicateResourceException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.repository.RefreshTokenRepository;
import kg.gov.gafkis.esport.repository.UserRepository;
import kg.gov.gafkis.esport.security.JwtTokenProvider;
import kg.gov.gafkis.esport.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new BadRequestException("Неверное имя пользователя или пароль")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= 5) {
                user.setBlocked(true);
                user.setBlockedUntil(LocalDateTime.now().plusMinutes(30));
            }
            userRepository.save(user);
            throw new BadRequestException("Неверное имя пользователя или пароль");
        }

        if (!user.isActive()) {
            throw new BadRequestException("Аккаунт деактивирован");
        }

        if (user.isBlocked()) {
            if (user.getBlockedUntil() != null && user.getBlockedUntil().isAfter(LocalDateTime.now())) {
                throw new BadRequestException("Аккаунт заблокирован до " + user.getBlockedUntil());
            }
            user.setBlocked(false);
            user.setBlockedUntil(null);
        }

        user.setLastLogin(LocalDateTime.now());
        user.setLastLoginIp(ipAddress);
        user.setFailedAttempts(0);
        userRepository.save(user);

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(userPrincipal);
        String refreshTokenStr = tokenProvider.generateRefreshToken();

        saveRefreshToken(user, refreshTokenStr);

        log.info("Пользователь {} выполнил вход с IP {}", user.getUsername(), ipAddress);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Пользователь", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Пользователь", "email", request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.ATHLETE)
                .isActive(true)
                .isBlocked(false)
                .failedAttempts(0)
                .build();

        user = userRepository.save(user);

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(userPrincipal);
        String refreshTokenStr = tokenProvider.generateRefreshToken();

        saveRefreshToken(user, refreshTokenStr);

        log.info("Зарегистрирован новый пользователь: {}", user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Недействительный refresh token"));

        if (storedToken.isRevoked()) {
            throw new BadRequestException("Refresh token отозван");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new BadRequestException("Refresh token просрочен");
        }

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(userPrincipal);
        String newRefreshTokenStr = tokenProvider.generateRefreshToken();

        saveRefreshToken(user, newRefreshTokenStr);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new BadRequestException("Недействительный refresh token"));

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        log.info("Пользователь {} выполнил выход", storedToken.getUser().getUsername());
    }

    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusSeconds(tokenProvider.getRefreshExpirationMs() / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }
}

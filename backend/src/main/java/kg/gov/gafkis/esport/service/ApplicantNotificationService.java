package kg.gov.gafkis.esport.service;

import jakarta.persistence.criteria.Predicate;
import kg.gov.gafkis.esport.dto.response.ApplicantNotificationResponse;
import kg.gov.gafkis.esport.dto.response.PagedResponse;
import kg.gov.gafkis.esport.entity.ApplicantNotification;
import kg.gov.gafkis.esport.repository.ApplicantNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicantNotificationService {

    private final ApplicantNotificationRepository repository;

    /**
     * Зафиксировать уведомление заявителю о смене статуса заявки (канал — e-mail).
     * Вызывается из changeStatus каждого модуля. Реальная отправка письма не выполняется
     * (прототип) — фиксируется факт, адрес и текст; SMTP подключается отдельно.
     */
    public void notify(String email, String name, String serviceType, String appNo, String status) {
        String message = String.format("Заявка %s (%s): статус изменён на «%s».",
                appNo, serviceType, status);

        ApplicantNotification n = ApplicantNotification.builder()
                .recipientEmail(email)
                .recipientName(name)
                .serviceType(serviceType)
                .appNo(appNo)
                .status(status)
                .message(message)
                .channel("email")
                .build();
        repository.save(n);

        if (email != null && !email.isBlank()) {
            log.info("E-mail уведомление поставлено в очередь: {} -> {} [{}]", email, message, appNo);
        } else {
            log.info("Уведомление в кабинете (нет e-mail): {} [{}]", message, appNo);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicantNotificationResponse> getAll(String email, Pageable pageable) {
        Specification<ApplicantNotification> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (email != null && !email.isBlank()) {
                p.add(cb.equal(cb.lower(root.get("recipientEmail")), email.trim().toLowerCase()));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };
        Page<ApplicantNotification> page = repository.findAll(spec, pageable);
        List<ApplicantNotificationResponse> content = page.getContent().stream().map(this::toResponse).toList();
        return new PagedResponse<>(content, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    private ApplicantNotificationResponse toResponse(ApplicantNotification n) {
        return ApplicantNotificationResponse.builder()
                .id(n.getId())
                .recipientEmail(n.getRecipientEmail())
                .recipientName(n.getRecipientName())
                .serviceType(n.getServiceType())
                .appNo(n.getAppNo())
                .status(n.getStatus())
                .message(n.getMessage())
                .channel(n.getChannel())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

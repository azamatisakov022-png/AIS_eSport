package kg.gov.gafkis.esport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.gov.gafkis.esport.entity.Document;
import kg.gov.gafkis.esport.entity.User;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.repository.DocumentRepository;
import kg.gov.gafkis.esport.repository.UserRepository;
import kg.gov.gafkis.esport.security.CurrentUser;
import kg.gov.gafkis.esport.security.UserPrincipal;
import kg.gov.gafkis.esport.service.MinioStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Управление документами (MinIO)")
@PreAuthorize("isAuthenticated()")
public class DocumentController {

    private final MinioStorageService minioStorageService;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    @Operation(summary = "Загрузить документ", description = "Загрузка файла для привязки к сущности")
    public ResponseEntity<DocumentInfo> upload(
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Тип сущности (athlete, coach, judge, event и т.д.)")
            @RequestParam String entityType,
            @Parameter(description = "ID сущности")
            @RequestParam Long entityId,
            @Parameter(description = "Тип документа (passport, medical, certificate и т.д.)")
            @RequestParam String docType,
            @CurrentUser UserPrincipal currentUser) {

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", "id", currentUser.getId()));

        Document document = minioStorageService.upload(file, entityType, entityId, docType, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(toInfo(document));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Скачать документ", description = "Скачивание файла по ID документа")
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Документ", "id", id));

        InputStreamResource resource = minioStorageService.download(id);

        String contentType = document.getMimeType() != null
                ? document.getMimeType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить документ", description = "Удаление документа из MinIO и базы данных")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        minioStorageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Список документов сущности", description = "Получение списка документов для указанной сущности")
    public ResponseEntity<List<DocumentInfo>> getByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {

        List<Document> documents = minioStorageService.getByEntity(entityType, entityId);
        List<DocumentInfo> result = documents.stream()
                .map(this::toInfo)
                .toList();

        return ResponseEntity.ok(result);
    }

    private DocumentInfo toInfo(Document d) {
        return new DocumentInfo(
                d.getId(),
                d.getFileName(),
                d.getFileSize(),
                d.getMimeType(),
                d.getDocType(),
                d.getEntityType(),
                d.getEntityId(),
                d.getCreatedAt() != null ? d.getCreatedAt().toString() : null
        );
    }

    public record DocumentInfo(
            Long id,
            String fileName,
            Long fileSize,
            String mimeType,
            String docType,
            String entityType,
            Long entityId,
            String createdAt
    ) {}
}

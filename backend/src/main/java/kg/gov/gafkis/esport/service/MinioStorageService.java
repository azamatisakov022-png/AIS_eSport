package kg.gov.gafkis.esport.service;

import io.minio.*;
import io.minio.errors.*;
import jakarta.annotation.PostConstruct;
import kg.gov.gafkis.esport.entity.Document;
import kg.gov.gafkis.esport.entity.User;
import kg.gov.gafkis.esport.exception.BadRequestException;
import kg.gov.gafkis.esport.exception.ResourceNotFoundException;
import kg.gov.gafkis.esport.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioStorageService {

    private final MinioClient minioClient;
    private final DocumentRepository documentRepository;

    @Value("${minio.bucket}")
    private String bucketName;

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "jpg", "jpeg", "png", "docx");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    @PostConstruct
    public void initBucket() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
                log.info("Создан бакет MinIO: {}", bucketName);
            }
        } catch (Exception e) {
            log.error("Ошибка при инициализации бакета MinIO: {}", e.getMessage(), e);
        }
    }

    @Transactional
    public Document upload(MultipartFile file, String entityType, Long entityId,
                           String docType, User uploadedBy) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Файл не может быть пустым");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Размер файла превышает 20 МБ");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException(
                    "Недопустимый тип файла: " + extension + ". Допустимые: " + ALLOWED_EXTENSIONS
            );
        }

        String minioKey = entityType + "/" + entityId + "/" + UUID.randomUUID() + "-" + originalFilename;

        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(minioKey)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (Exception e) {
            log.error("Ошибка при загрузке файла в MinIO: {}", e.getMessage(), e);
            throw new BadRequestException("Ошибка при загрузке файла: " + e.getMessage());
        }

        Document document = Document.builder()
                .entityType(entityType)
                .entityId(entityId)
                .docType(docType)
                .fileName(originalFilename)
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .minioKey(minioKey)
                .uploadedBy(uploadedBy)
                .build();

        document = documentRepository.save(document);
        log.info("Загружен документ: {} для {} id={} (docId={})",
                originalFilename, entityType, entityId, document.getId());

        return document;
    }

    public InputStreamResource download(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Документ", "id", documentId));

        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(document.getMinioKey())
                            .build()
            );
            return new InputStreamResource(stream);
        } catch (Exception e) {
            log.error("Ошибка при скачивании файла из MinIO: {}", e.getMessage(), e);
            throw new BadRequestException("Ошибка при скачивании файла: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Документ", "id", documentId));

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(document.getMinioKey())
                            .build()
            );
        } catch (Exception e) {
            log.error("Ошибка при удалении файла из MinIO: {}", e.getMessage(), e);
            throw new BadRequestException("Ошибка при удалении файла: " + e.getMessage());
        }

        documentRepository.delete(document);
        log.info("Удален документ: {} (id={})", document.getFileName(), documentId);
    }

    @Transactional(readOnly = true)
    public List<Document> getByEntity(String entityType, Long entityId) {
        return documentRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}

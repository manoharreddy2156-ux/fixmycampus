package app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Saves the uploaded evidence photo under the configured upload directory
     * and returns the file name to store on the Complaint (null if no file
     * was supplied - evidence is always optional).
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);

            String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
            String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String fileName = UUID.randomUUID() + extension;

            Path target = dir.resolve(fileName);
            Files.copy(file.getInputStream(), target);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store evidence file", e);
        }
    }
}

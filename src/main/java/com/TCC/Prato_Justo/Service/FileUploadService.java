package com.TCC.Prato_Justo.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${upload.dir}")
    private String uploadDir;

    /**
     * Salva um arquivo de imagem e retorna a URL
     */
    public String saveAvatar(MultipartFile file, Long userId) throws IOException {
        // Validar arquivo
        if (file.isEmpty()) {
            throw new IOException("Arquivo vazio");
        }

        // Validar tipo de arquivo
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("O arquivo deve ser uma imagem");
        }

        // Validar tamanho (5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB em bytes
        if (file.getSize() > maxSize) {
            throw new IOException("O arquivo deve ter no máximo 5MB");
        }

        // Criar diretório se não existir
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
            System.out.println("📁 Diretório criado: " + uploadDirFile.getAbsolutePath());
        }

        // Gerar nome único para o arquivo
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String filename = "user_" + userId + "_" + UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(uploadDir, filename);

        // Salvar arquivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Avatar salvo: " + filePath);

        // Retornar URL
        return "/uploads/" + filename;
    }

    /**
     * Deleta um avatar antigo
     */
    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isEmpty() || !avatarUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            // Extrair nome do arquivo da URL
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, filename);
            
            if (Files.deleteIfExists(filePath)) {
                System.out.println("🗑️ Avatar antigo deletado: " + filename);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao deletar avatar: " + e.getMessage());
        }
    }
}


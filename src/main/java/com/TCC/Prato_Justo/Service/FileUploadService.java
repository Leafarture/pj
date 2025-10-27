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
        return "/uploads/avatars/" + filename;
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

    /**
     * Salva uma imagem de alimento e retorna a URL
     */
    public String saveFoodImage(MultipartFile file, Long doacaoId) throws IOException {
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

        // Obter diretório raiz de uploads (pai do uploadDir)
        File uploadDirFile = new File(uploadDir);
        File rootUploadDir = uploadDirFile.getParentFile();
        if (rootUploadDir == null) {
            rootUploadDir = new File("./uploads");
        }

        // Criar subdiretório para imagens de alimentos
        File foodImagesDirFile = new File(rootUploadDir, "alimentos");
        if (!foodImagesDirFile.exists()) {
            foodImagesDirFile.mkdirs();
            System.out.println("📁 Diretório de alimentos criado: " + foodImagesDirFile.getAbsolutePath());
        }

        // Gerar nome único para o arquivo
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String filename = "food_" + (doacaoId != null ? doacaoId + "_" : "") + UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(foodImagesDirFile.getAbsolutePath(), filename);

        // Salvar arquivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Imagem de alimento salva: " + filePath);

        // Retornar URL
        return "/uploads/alimentos/" + filename;
    }

    /**
     * Deleta uma imagem de alimento
     */
    public void deleteFoodImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty() || !imageUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            // Obter diretório raiz de uploads
            File uploadDirFile = new File(uploadDir);
            File rootUploadDir = uploadDirFile.getParentFile();
            if (rootUploadDir == null) {
                rootUploadDir = new File("./uploads");
            }

            // Extrair nome do arquivo da URL
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            File foodImagesDir = new File(rootUploadDir, "alimentos");
            Path filePath = Paths.get(foodImagesDir.getAbsolutePath(), filename);
            
            if (Files.deleteIfExists(filePath)) {
                System.out.println("🗑️ Imagem de alimento deletada: " + filename);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao deletar imagem de alimento: " + e.getMessage());
        }
    }
}


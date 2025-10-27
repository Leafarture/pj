package com.TCC.Prato_Justo.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
            System.out.println("✅ Diretório de uploads criado: " + uploadDirFile.getAbsolutePath());
        }

        // Obter o diretório raiz de uploads (pai do uploadDir)
        File rootUploadDir = uploadDirFile.getParentFile();
        if (rootUploadDir == null) {
            rootUploadDir = new File("./uploads");
        }
        
        if (!rootUploadDir.exists()) {
            rootUploadDir.mkdirs();
        }

        // Mapear URL /uploads/** para a pasta raiz de uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + rootUploadDir.getAbsolutePath() + "/");
        
        System.out.println("📁 Uploads configurados em: " + rootUploadDir.getAbsolutePath());
    }
}


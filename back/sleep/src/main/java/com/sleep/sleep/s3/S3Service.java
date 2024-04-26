package com.sleep.sleep.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public String getPath(String fileName) {
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public String uploadFile(MultipartFile multipartFile, String fileName) throws IOException {
        File file = convertMultiPartFileToFile(multipartFile);
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file));
        file.delete();
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    private File convertMultiPartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(multipartFile.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

}

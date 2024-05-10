package com.sleep.sleep.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.sleep.sleep.member.entity.Member;
import com.sleep.sleep.member.repository.MemberRepository;
import com.sleep.sleep.shorts.dto.UploadShortsDto;
import com.sleep.sleep.shorts.service.ShortsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    private final AmazonS3 amazonS3;
    private final ShortsService shortsService;
    private final MemberRepository memberRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public String getPath(String fileName) {
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public String uploadFile(MultipartFile multipartFile, String fileName, String username) throws IOException {
        File file = convertMultiPartFileToFile(multipartFile);
        String inputFileName=username+"/"+fileName;
        log.info("inputFileName"+inputFileName);
        amazonS3.putObject(new PutObjectRequest(bucketName, inputFileName, file));

        String s3Url = amazonS3.getUrl(bucketName, inputFileName).toString();
        UploadShortsDto dto = new UploadShortsDto(s3Url,inputFileName);
        shortsService.upload(dto,username);

        file.delete();
        return s3Url;
    }

    public void deleteFile(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName,fileName));
    }

    private File convertMultiPartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(multipartFile.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

    public InputStream downloadFile(String filePath) {
        S3Object s3Object = amazonS3.getObject(new GetObjectRequest(bucketName, filePath));
        return s3Object.getObjectContent();
    }

}

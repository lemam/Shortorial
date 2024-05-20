# AWS S3 URL

작성자: DAYUN KIM

## 👩‍💻 IAM 생성

### 상단 검색 창→ IAM 검색 → 액세스 관리 → 사용자 → 사용자 생성 → 권한 설정

![aws1.PNG](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/aws1.png)

![s32.PNG](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/s32.png)

### 사용자 → 생성된 사용자 링크 → 액세스 키 만들기 → 기타 → 아무 설명 입력 → .CSV 파일 다운로드 → 완료

![sr3.PNG](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/sr3.png)

## 👩‍💻 S3 생성

### 상단 검색 창 → S3 검색 → 버킷 만들기 → AWS 리전 서울 설정 → 버킷 이름 입력 →퍼플릭 액세스 차단 체크 취소 → 버킷 만들기

![캡처33.PNG](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/%25EC%25BA%25A1%25EC%25B2%259833.png)

### 권한 → 버킷 정책 → 편집 → 버킷 ARN 복사 → 정책 생성기 → ARN 칸에 붙여넣기 → Add Statement → Generate Policy → 복사

![Untitled](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/Untitled.png)

### 버킷 정책 → 편집 - Generate Policy 붙여넣기 → Resource: arn이름 뒤에 /* 추가 → 변경 사항 저장

![캡처666.PNG](AWS%20S3%20URL%207cf146fdf65f4e61a4992293cfdc4010/%25EC%25BA%25A1%25EC%25B2%2598666.png)

### 버킷 → 방금 생성한 버킷 → 업로드 → 이미지 드래그 앤 드롭

## 👩‍💻 스프링부트 설정

### pom.xml

```java
<!-- https://mvnrepository.com/artifact/com.amazonaws/aws-java-sdk-s3 -->
<dependency>
	<groupId>com.amazonaws</groupId>
	<artifactId>aws-java-sdk-s3</artifactId>
	<version>1.12.645</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-aws -->
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-aws</artifactId>
	<version>2.2.6.RELEASE</version>
</dependency>
```

### application.properties

```java
cloud.aws.s3.bucket=버킷 이름
cloud.aws.region.static=ap-northeast-2
cloud.aws.stack.auto=false

cloud.aws.credentials.access-key=다운 받은 csv 파일의 Access key
cloud.aws.credentials.secret-key=다운 받은 csv 파일의 Secret acceess key

spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

### S3Config

```java
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }
}
```

### S3Service

```java
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
```

### S3Controller

```java
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class S3Controller {
    private final S3Service s3UploadService;

    @GetMapping("/tales/s3/download/{fileName}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileName) {
        try {
            String filePath = s3UploadService.getPath(fileName);
            return new ResponseEntity<String>(filePath, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/tales/s3/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) {
        try {
            String uploadUrl = s3UploadService.uploadFile(file, fileName);
            return new ResponseEntity<String>(uploadUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
```
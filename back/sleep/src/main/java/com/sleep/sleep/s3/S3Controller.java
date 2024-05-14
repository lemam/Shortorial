package com.sleep.sleep.s3;

import com.sleep.sleep.common.JWT.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@Slf4j
public class S3Controller {

    private final S3Service s3Service;
    private final JwtTokenUtil jwtTokenUtil;

    @Operation(summary = "동영상 업로드", description ="추후 사용자별 업로드로 수정 예정; param: 업로드할 파일이름")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestHeader("Authorization") String accessToken, @RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) {
        try {
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));

            System.out.println("username : "+ username);

            File convFile = multipartFileToFile(file); // 멀티파트 파일 -> 파일로 형변환

            double shortsTime = DurationExtractor.extract(convFile);    // 초 단위로 영상 길이 추출

            System.out.println(shortsTime);

            String uploadUrl = s3Service.uploadFile(file, fileName, username);
            return new ResponseEntity<String>(uploadUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "동영상 링크 보기", description ="추후 사용자별 다운로드로 수정 예정; param: 다운로드할 파일이름")
    @GetMapping("/download/{fileName}")
    public ResponseEntity<?> downloadFile(@RequestHeader("Authorization") String accessToken, @PathVariable String fileName) {
        try {
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            System.out.println("username : "+ username);

            String filePath = s3Service.getPath(username+"/"+fileName);
            return new ResponseEntity<String>(filePath, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Operation(summary = "동영상 삭제", description ="uploadNo, title")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestHeader("Authorization") String accessToken,@RequestBody Map<String,String> data){
        try {
            int uploadNo = Integer.parseInt(data.get("uploadNo"));
            String fileName = data.get("title");

            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            System.out.println("username : "+ username);

            s3Service.deleteFile(uploadNo, fileName);
            return new ResponseEntity<String>("Successfully delete!",HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String resolveToken(String accessToken) {
        log.info("resolveToken, AccessToken: "+ accessToken.toString());
        return accessToken.substring(7);
    }

    @Operation(summary = "동영상 파일 다운로드", description = "추후 사용자별 다운로드로 수정 예정; param: 다운로드할 파일이름")
    @GetMapping("/download/file/{fileName}")
    public ResponseEntity<?> downloadStaticFile(@PathVariable String fileName) {
        try {

            InputStreamResource resource = new InputStreamResource(s3Service.downloadFile(fileName));

            // 파일명 인코딩
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");

            String contentDisposition = "attachment; filename*=UTF-8''" + encodedFileName;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .contentType(MediaType.parseMediaType("video/mp4"))
                    .body(resource);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "동영상 파일 이름 변경", description = "헤더에 accessToken넣기. requestBody에 oldTitle, newTitle 이름 넣기")
    @PutMapping("/rename")
    public ResponseEntity<?> updateTitle(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, String> data) {
        try {
            int uploadNo = Integer.parseInt(data.get("uploadNo"));
            String oldTitle = data.get("oldTitle");
            String newTitle = data.get("newTitle");

            // oldTitle과 newTitle 사용
            System.out.println("Old Title: " + oldTitle);
            System.out.println("New Title: " + newTitle);

            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));

            //s3와 db 업데이트하는 것
            s3Service.reaname(uploadNo, oldTitle,username+"/"+newTitle);

            return new ResponseEntity<String>("Successfully update!",HttpStatus.OK);
    @PostMapping("/s3/bring/{fileName}")
    public ResponseEntity<?> BringFile(@RequestHeader("Authorization") String accessToken, @PathVariable String fileName) {
        try {
            // 토큰에서 사용자 이름 추출 (이 코드는 사용자가 직접 구현해야 함)
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            //String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");

            // S3에서 파일 다운로드
            InputStream inputStream = s3Service.downloadFile(username + "/" + fileName);

            // 임시 파일 생성
            File tempFile = File.createTempFile("downloaded-", ".mp4", new File(System.getProperty("java.io.tmpdir")));
            //tempFile.deleteOnExit();  // 프로그램 종료 시 파일 삭제

            // 파일로 스트림 복사
            Files.copy(inputStream, Paths.get(tempFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);

            // 작업 완료 로그
            System.out.println("File downloaded and saved to temporary directory: " + tempFile.getAbsolutePath());

            // 클라이언트에 반환할 필요 없음
            return ResponseEntity.ok()
                    .body(tempFile.getAbsolutePath());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * multipartFile을 File로 변환한다.
     *
     * @param MultipartFile file 멀티파트 파일
     * @return File 변환된 파일을 반환한다.
     * @throws IOException
     */
    public static File multipartFileToFile(MultipartFile file) throws IOException {

        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();

        return convFile;

    }
}
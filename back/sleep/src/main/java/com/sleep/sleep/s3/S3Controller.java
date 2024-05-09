package com.sleep.sleep.s3;

import com.sleep.sleep.common.JWT.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class S3Controller {

    private final S3Service s3Service;
    private final JwtTokenUtil jwtTokenUtil;

    @Operation(summary = "동영상 업로드", description ="추후 사용자별 업로드로 수정 예정; param: 업로드할 파일이름")
    @PostMapping("/s3/upload")
    public ResponseEntity<?> uploadFile(@RequestHeader("Authorization") String accessToken, @RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) {
        try {
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            System.out.println("username : "+ username);

            File convFile = multipartFileToFile(file); // 멀티파트 파일 -> 파일로 형변환

            double shortsTime = DurationExtractor.extract(convFile);    // 초 단위로 영상 길이 추출

            System.out.println(shortsTime);

            String uploadUrl = s3Service.uploadFile(file, username+"/"+fileName);
            return new ResponseEntity<String>(uploadUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "동영상 다운로드", description ="추후 사용자별 다운로드로 수정 예정; param: 다운로드할 파일이름")
    @GetMapping("/s3/download/{fileName}")
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

    @Operation(summary = "동영상 삭제", description ="추후 사용자별 다운로드로 수정 예정; param: 삭제할 파일이름")
    @DeleteMapping("/s3/delete/{fileName}")
    public ResponseEntity<?> deleteFile(@RequestHeader("Authorization") String accessToken,@PathVariable String fileName){
        try {
            String username = jwtTokenUtil.getUsername(resolveToken(accessToken));
            System.out.println("username : "+ username);

            s3Service.deleteFile(username+"/"+fileName);
            return new ResponseEntity<String>("Successfully delete!",HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String resolveToken(String accessToken) {
        log.info("resolveToken, AccessToken: "+ accessToken.toString());
        return accessToken.substring(7);
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
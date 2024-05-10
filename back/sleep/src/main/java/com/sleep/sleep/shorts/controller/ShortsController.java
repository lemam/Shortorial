package com.sleep.sleep.shorts.controller;

import com.sleep.sleep.shorts.dto.ShortsDto;
import com.sleep.sleep.shorts.service.ShortsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class ShortsController {

    private final ShortsService shortsService;

    @Operation(summary = "쇼츠 목록 조회")
    @GetMapping("/api/shorts")
    public ResponseEntity<List<ShortsDto>> selectShortList() {

        List<ShortsDto> shortsList = shortsService.getShortList();

        return ResponseEntity.ok(shortsList);
    }

    @Operation(summary = "특정 쇼츠 조회")
    @GetMapping("/api/shorts/{shortsNo}")
    public ResponseEntity<ShortsDto> selectUserPrediction(@PathVariable int shortsNo) {
        return ResponseEntity.ok(shortsService.getShortsInfo(shortsNo));
    }
}

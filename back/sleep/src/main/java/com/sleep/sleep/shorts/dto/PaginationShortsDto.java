package com.sleep.sleep.shorts.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaginationShortsDto {
    private List<ShortsDto> contents;
    private boolean isLastPage;
}

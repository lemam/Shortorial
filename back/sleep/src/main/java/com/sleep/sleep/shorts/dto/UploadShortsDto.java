package com.sleep.sleep.shorts.dto;

import com.sleep.sleep.member.entity.Member;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadShortsDto {
    private int uploadNo;
    private int memberNo;
    private String uploadUrl;
    private String uploadTitle;
    private String uploadDate;
    private String youtubeUrl;

    public UploadShortsDto( String uploadUrl, String uploadTitle) {
        this.uploadUrl = uploadUrl;
        this.uploadTitle = uploadTitle;
    }
}

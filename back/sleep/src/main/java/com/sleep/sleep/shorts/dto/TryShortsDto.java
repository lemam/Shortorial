package com.sleep.sleep.shorts.dto;

import com.sleep.sleep.member.entity.Member;
import com.sleep.sleep.shorts.entity.Shorts;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryShortsDto {

    private int tryNo;
    private int shortsNo;
    private int memberIndex;
    private LocalDateTime uploadDate;

}

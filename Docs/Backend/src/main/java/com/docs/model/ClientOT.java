package com.docs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class ClientOT {
    private String docId;
    private String version;
    private String username;
    private String operation;
    private int from;
    private int to;
    private String content;
}

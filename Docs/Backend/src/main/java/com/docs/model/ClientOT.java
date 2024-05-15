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
    private int version;
    private String username;
    private String operation;
    // private int position;
    private int from;
    private int to;
    private String content;
    private String docContent;
}

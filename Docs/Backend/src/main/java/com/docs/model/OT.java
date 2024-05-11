package com.docs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class OT {
    private String version;
    private String operation;
    private Doc document;
    private String[] history; // history of operations
}

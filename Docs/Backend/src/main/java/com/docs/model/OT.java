package com.docs.model;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class OT {
    private int version;
    private String operation;
    private Doc document;
    private ArrayList<ClientOT> history; // history of operations
    private int numberOfConnectedClients;
}

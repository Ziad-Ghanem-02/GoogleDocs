package com.docs.model;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Docs")
@Data
public class Doc {

    @Id
    private String id;
    private String title;
    private String content;
    private String ownerID;
    // last accessed date
    private Date lastAccessed;

    // list of collaborators (editors, viewers)
    private List<String> editors = new ArrayList<>();
    private List<String> viewers = new ArrayList<>();

    // @DBRef
    // When you save a Doc object, the User objects in these lists will be saved as
    // DBRef fields in the Doc document. When you load a Doc object, Spring Data
    // MongoDB will automatically resolve these DBRef fields and populate the
    // editors and viewers lists with the referenced User objects.

}
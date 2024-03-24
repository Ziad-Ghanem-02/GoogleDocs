package com.docs.model;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Docs")
public class Doc {

    @Id
    private String id;
    private String title;
    private String content;
    private String ownerID;
    // list of collaborators (editors, viewers)
    private List<String> editors = new ArrayList<>();
    private List<String> viewers = new ArrayList<>();
    // last accessed date
    private Date lastAccessed;

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getownerID() {
        return ownerID;
    }

    public void setownerID(String ownerID) {
        this.ownerID = ownerID;
    }

    public List<String> getEditors() {
        return editors;
    }

    // need another to append editors
    public void setEditors(List<String> editors) {
        this.editors = editors;
    }

    public List<String> getViewers() {
        return viewers;
    }

    // need another to append viewers
    public void setViewers(List<String> viewers) {
        this.viewers = viewers;
    }

    public Date getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(Date lastAccessed) {
        // set it to the current date
        this.lastAccessed = lastAccessed;
    }
}
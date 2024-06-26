package com.docs.service;

import com.docs.model.Doc;

import java.util.List;
import java.util.Optional;

public interface DocService {
    Doc saveDoc(Doc doc);

    List<Doc> getAllDocs();

    Optional<Doc> getDocByTitle(String title);

    Optional<Doc> getDocById(String id);

    public List<Doc> getDocsByUser(String username);

    Doc updateDocById(String id, Doc doc);
    Doc updateDoc(String title, Doc doc);

    void deleteDoc(String title);

    void renameDoc(String oldTitle, String newTitle);

    boolean existsByTitle(String title);

    Doc addViewer(String title, String viewer);

    Doc addEditor(String title, String editor);

    Doc removeViewer(String title, String viewer);

    Doc removeEditor(String title, String editor);
}
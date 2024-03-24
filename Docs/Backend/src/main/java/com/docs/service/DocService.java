package com.docs.service;

import com.docs.model.Doc;

import java.util.List;
import java.util.Optional;

public interface DocService {
    Doc saveDoc(Doc doc);

    List<Doc> getAllDocs();

    Optional<Doc> getDocByTitle(String title);

    Doc updateDoc(String title, Doc doc);

    void deleteDoc(String title);

    void renameDoc(String oldTitle, String newTitle);
}
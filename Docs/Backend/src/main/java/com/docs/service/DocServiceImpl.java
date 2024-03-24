package com.docs.service;

import com.docs.model.Doc;
import com.docs.repository.DocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Date;

@Service
public class DocServiceImpl implements DocService {

    private DocRepository docRepository;

    @Autowired
    public DocServiceImpl(DocRepository docRepository) {
        this.docRepository = docRepository;
    }

    @Override
    public Doc saveDoc(Doc doc) {
        return docRepository.save(doc);
    }

    @Override
    public List<Doc> getAllDocs() {
        return docRepository.findAll();
    }

    @Override
    public Doc updateDoc(String title, Doc doc) {
        Doc existingDoc = getDocByTitle(title)
                .orElseThrow(() -> new NoSuchElementException("Document not found"));
        existingDoc.setContent(doc.getContent());
        existingDoc.setLastAccessed(doc.getLastAccessed());
        return docRepository.save(existingDoc);
    }

    @Override
    public void deleteDoc(String title) {
        Doc docToDelete = getDocByTitle(title)
                .orElseThrow(() -> new NoSuchElementException("Document not found"));
        docRepository.deleteById(docToDelete.getId());
    }

    @Override
    public void renameDoc(String oldTitle, String newTitle) {
        Doc existingDoc = getDocByTitle(oldTitle)
                .orElseThrow(() -> new NoSuchElementException("Document not found"));
        existingDoc.setTitle(newTitle);
        existingDoc.setLastAccessed(new Date());
        docRepository.save(existingDoc);
    }

    @Override
    public Optional<Doc> getDocByTitle(String title) {
        return docRepository.findByTitle(title);
    }
}
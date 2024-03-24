package com.docs.controller;

import java.util.Date;
import java.util.Map;

import com.docs.model.Doc;
import com.docs.service.DocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/docs")
@CrossOrigin
public class DocController {
    @Autowired
    private DocService docService;

    // assumption: the ownerID, title and content are passed in the request body
    @PostMapping("/create")
    public String create(@RequestBody Doc doc) {
        if (docService.getDocByTitle(doc.getTitle()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Document with the same title already exists");
        }
        doc.setLastAccessed(new Date(System.currentTimeMillis()));
        docService.saveDoc(doc);
        return "New document is created";
    }

    @GetMapping("/getAll")
    public List<Doc> list() {
        return docService.getAllDocs();
    }

    @GetMapping("/{title}")
    public Doc get(@PathVariable String title) {
        return docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
    }

    @PutMapping("/update/{title}")
    public String update(@PathVariable String title, @RequestBody Map<String, String> body) {
        try {
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Document not found"));
            existingDoc.setContent(body.get("content"));
            docService.updateDoc(existingDoc.getTitle(), existingDoc);
            return "Document is updated";
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unable to update document", e);
        }
    }

    @DeleteMapping("/delete/{title}")
    public String delete(@PathVariable String title) {
        try {
            docService.deleteDoc(title);
            return "Document is deleted";
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unable to delete document", e);
        }
    }

    @PutMapping("/rename/{title}")
    public String rename(@PathVariable String title, @RequestBody Map<String, String> body) {
        String newTitle = body.get("title");
        try {
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Document not found"));
            docService.renameDoc(existingDoc.getTitle(), newTitle);
            return "Document is renamed";
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unable to rename document", e);
        }
    }
}
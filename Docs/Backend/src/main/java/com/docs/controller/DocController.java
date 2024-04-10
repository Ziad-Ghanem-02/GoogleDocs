package com.docs.controller;

import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

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

    // assumption: the ownerID, title, content, viewers and editors are passed in
    // the request body
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
    public List<Doc> getAll() {
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
            if (!docService.existsByTitle(title)) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found");
            }
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
    public String delete(@PathVariable String title, @RequestParam String username) {
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        if (!existingDoc.getownerID().equals(username)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only the owner can delete the document");
        }
        docService.deleteDoc(title);
        return "Document is deleted";
    }

    @PutMapping("/rename/{title}")
    public String rename(@PathVariable String title, @RequestBody Map<String, String> body) {
        String newTitle = body.get("title");
        if (docService.getDocByTitle(newTitle).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Document with the same title already exists");
        }
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        docService.renameDoc(existingDoc.getTitle(), newTitle);
        return "Document is renamed";
    }

    @PutMapping("/addViewer/{title}")
    public String addViewer(@PathVariable String title, @RequestBody Map<String, String> body) {
        String viewer = body.get("viewer");
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        if (existingDoc.getViewers().contains(viewer)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Viewer already exists");
        }
        docService.addViewer(existingDoc.getTitle(), viewer);
        return "Viewer is added";
    }

    @PutMapping("/addEditor/{title}")
    public String addEditor(@PathVariable String title, @RequestBody Map<String, String> body) {
        String editor = body.get("editor");
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        if (existingDoc.getEditors().contains(editor)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Editor already exists");
        }
        docService.addEditor(existingDoc.getTitle(), editor);
        return "Editor is added";
    }

    @PutMapping("/removeViewer/{title}")
    public String removeViewer(@PathVariable String title, @RequestBody Map<String, String> body) {
        String viewer = body.get("viewer");
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        if (!existingDoc.getViewers().remove(viewer)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Viewer not found");
        }
        docService.removeViewer(existingDoc.getTitle(), viewer);
        return "Viewer is removed";
    }

    @PutMapping("/removeEditor/{title}")
    public String removeEditor(@PathVariable String title, @RequestBody Map<String, String> body) {
        String editor = body.get("editor");
        Doc existingDoc = docService.getDocByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Document not found"));
        if (!existingDoc.getEditors().remove(editor)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Editor not found");
        }
        docService.removeEditor(existingDoc.getTitle(), editor);
        return "Editor is removed";
    }

    //
    // Get docs by last accessed date and find the user as owner or in the
    // viewers/editors list
    @GetMapping("/getByLastAccessed")
    public List<Doc> getByLastAccessed(@RequestParam String username) {
        return docService.getAllDocs().stream()
                .filter(doc -> doc.getownerID().equals(username)
                        || doc.getViewers().contains(username)
                        || doc.getEditors().contains(username))
                .sorted((doc1, doc2) -> doc2.getLastAccessed().compareTo(doc1.getLastAccessed()))
                .collect(Collectors.toList());
    }
}

// TODO: no duplicate viewers/editors done
// TODO: error if no viewer/editor to remove done
// unique username AND title?
// only owner can delete the file done
// return docs by last accessed date
// password length
//
// if add to editor, remove from viewer (might leave it for backend idk)
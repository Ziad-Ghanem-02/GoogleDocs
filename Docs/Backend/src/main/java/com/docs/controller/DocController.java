package com.docs.controller;

import java.util.Date;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import com.docs.model.Doc;
import com.docs.model.User;
import com.docs.service.DocService;
import com.docs.service.JwtService;
import com.docs.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/docs")
@CrossOrigin
public class DocController {
    @Autowired
    private DocService docService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    // assumption: the ownerID, title, content, viewers and editors are passed in
    // the request body
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody Doc doc) {
        if (docService.getDocByTitle(doc.getTitle()).isPresent()) {
            return new ResponseEntity<>(
                    "Document with the same title already exists",
                    HttpStatus.CONFLICT);
        }
        // Check for valid user
        if (!userService.existsById(doc.getOwnerID())) {
            return new ResponseEntity<>(
                    "Owner not found",
                    HttpStatus.NOT_FOUND);
        }
        doc.setLastAccessed(new Date(System.currentTimeMillis()));
        docService.saveDoc(doc);
        return new ResponseEntity<String>("Document created successfuly", HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public List<Doc> getAll() {
        return docService.getAllDocs();
    }

    @GetMapping("/{title}")
    public ResponseEntity<?> get(@PathVariable String title) {
        try {
            return new ResponseEntity<>(docService.getDocByTitle(title), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Document not found.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<?> update(@PathVariable String title, @RequestBody Map<String, String> body) {
        try {
            if (!docService.existsByTitle(title)) {
                return new ResponseEntity<>(
                        "Document not found",
                        HttpStatus.NOT_FOUND);
            }

            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException("Document not found"));
            existingDoc.setContent(body.get("content"));
            docService.updateDoc(existingDoc.getTitle(), existingDoc);
            return new ResponseEntity<>("Document updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to update document.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<?> delete(HttpServletRequest request, @PathVariable String title) {
        try {

            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }
            String username = jwtService.extractUsername(token);

            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException("Document not found"));
            User user = userService.getUserByUsername(username);

            if (!existingDoc.getOwnerID().equals(user.getId())) {
                return new ResponseEntity<>(
                        "Only the owner can delete the document",
                        HttpStatus.UNAUTHORIZED);
            }
            docService.deleteDoc(title);
            return new ResponseEntity<>("Document deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to delete document.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/rename/{title}")
    public ResponseEntity<String> rename(@PathVariable String title, @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String newTitle = body.get("title");
        if (newTitle == null) {
            return new ResponseEntity<>("New title not provided", HttpStatus.BAD_REQUEST);
        }
        if (docService.getDocByTitle(newTitle).isPresent()) {
            return new ResponseEntity<>(
                    "Document with the same title already exists",
                    HttpStatus.CONFLICT);
        }
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }

            String username = jwtService.extractUsername(token);
            User user = userService.getUserByUsername(username);
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));
            if (!existingDoc.getOwnerID().equals(user.getId()) || !existingDoc.getEditors().contains(username)) {
                return new ResponseEntity<>(
                        "Only the owner or an editor can rename the document",
                        HttpStatus.UNAUTHORIZED);
            }

            docService.renameDoc(existingDoc.getTitle(), newTitle);
            return new ResponseEntity<>("Document renamed successfully.", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to rename document.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/addViewer/{title}")
    public ResponseEntity<String> addViewer(@PathVariable String title, @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String viewer = body.get("viewer");
        if (viewer == null) {
            return new ResponseEntity<>("Viewer not provided", HttpStatus.BAD_REQUEST);
        }
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }

            // String username = jwtService.extractUsername(token);
            // User signedInUser = userService.getUserByUsername(username);
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));

            // if (!existingDoc.getOwnerID().equals(signedInUser.getId())
            // || !existingDoc.getEditors().contains(username)) {
            // return new ResponseEntity<>(
            // "Only the owner or an editor can add a viewer",
            // HttpStatus.UNAUTHORIZED);
            // }

            if (existingDoc.getViewers().contains(viewer)) {
                throw new NoSuchElementException(
                        "Viewer already exists");
            }

            User user = userService.getUserByUsername(viewer);
            if (user == null) {
                return new ResponseEntity<>("Invalid viewer username.", HttpStatus.NOT_FOUND);
            }

            docService.addViewer(existingDoc.getTitle(), viewer);
            return new ResponseEntity<>("Viewer is added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to add viewer.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/addEditor/{title}")
    public ResponseEntity<String> addEditor(@PathVariable String title, @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String editor = body.get("editor");
        if (editor == null) {
            return new ResponseEntity<>("Editor not provided", HttpStatus.BAD_REQUEST);
        }
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }

            String username = jwtService.extractUsername(token);
            User signedInUser = userService.getUserByUsername(username);
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));

            if (!existingDoc.getOwnerID().equals(signedInUser.getId())) {
                return new ResponseEntity<>(
                        "Only the owner can add an editor",
                        HttpStatus.UNAUTHORIZED);
            }

            if (existingDoc.getEditors().contains(editor)) {
                throw new NoSuchElementException(
                        "Editor already exists");
            }

            User user = userService.getUserByUsername(editor);
            if (user == null) {
                return new ResponseEntity<>("Invalid editor username.", HttpStatus.NOT_FOUND);
            }

            docService.addEditor(existingDoc.getTitle(), editor);
            return new ResponseEntity<>("Editor is added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to add editor.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/removeViewer/{title}")
    public ResponseEntity<String> removeViewer(@PathVariable String title, @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String viewer = body.get("viewer");
        if (viewer == null) {
            return new ResponseEntity<>("Viewer not provided", HttpStatus.BAD_REQUEST);
        }
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }

            String username = jwtService.extractUsername(token);
            User signedInUser = userService.getUserByUsername(username);
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));

            if (!existingDoc.getOwnerID().equals(signedInUser.getId())) {
                return new ResponseEntity<>(
                        "Only the owner can remove a viewer",
                        HttpStatus.UNAUTHORIZED);
            }

            if (!existingDoc.getViewers().remove(viewer)) {
                throw new NoSuchElementException(
                        viewer + " is not a viewer of " + existingDoc.getTitle() + ".");
            }

            docService.removeViewer(existingDoc.getTitle(), viewer);
            return new ResponseEntity<>("Viewer is removed", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to remove viewer.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/removeEditor/{title}")
    public ResponseEntity<String> removeEditor(@PathVariable String title, @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String editor = body.get("editor");
        if (editor == null) {
            return new ResponseEntity<>("Editor not provided", HttpStatus.BAD_REQUEST);
        }
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }

            String username = jwtService.extractUsername(token);
            User signedInUser = userService.getUserByUsername(username);
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));

            if (!existingDoc.getOwnerID().equals(signedInUser.getId())) {
                return new ResponseEntity<>(
                        "Only the owner can remove an editor",
                        HttpStatus.UNAUTHORIZED);
            }

            if (!existingDoc.getEditors().remove(editor)) {
                throw new NoSuchElementException(
                        editor + " is not an editor of " + existingDoc.getTitle() + ".");
            }
            docService.removeEditor(existingDoc.getTitle(), editor);
            return new ResponseEntity<>("Editor is removed", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to remove editor.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    //
    // Get docs by last accessed date and find the user as owner or in the
    // viewers/editors list
    @GetMapping("/getByLastAccessed")
    public List<Doc> getByLastAccessed(@RequestParam String username) {
        return docService.getAllDocs().stream()
                .filter(doc -> doc.getOwnerID().equals(username)
                        || doc.getViewers().contains(username)
                        || doc.getEditors().contains(username))
                .sorted((doc1, doc2) -> doc2.getLastAccessed().compareTo(doc1.getLastAccessed()))
                .collect(Collectors.toList());
    }

    // TODO: Add api to get docs by username as owner/editor/viewer
    @GetMapping("/getUsersDoc/{userId}")
    public List<Doc> getUsersDoc(@PathVariable String userId) {
        return docService.getDocsByUser(userId);
    }

}

// TODO: no duplicate viewers/editors done
// TODO: error if no viewer/editor to remove done
// unique username AND title?
// only owner can delete the file done
// return docs by last accessed date
// if add to editor, remove from viewer (might leave it for backend idk)
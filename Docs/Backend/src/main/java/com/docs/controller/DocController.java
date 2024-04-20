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

    @GetMapping("/getAll")
    public List<Doc> getAll() {
        return docService.getAllDocs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocbyID(HttpServletRequest request, @PathVariable String id) {
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }
            String username = jwtService.extractUsername(token);

            Doc existingDoc = docService.getDocById(id)
                    .orElseThrow(() -> new NoSuchElementException("Document not found"));

            if (!existingDoc.getOwner().equals(username)
                    || !existingDoc.getEditors().contains(username)
                    || !existingDoc.getViewers().contains(username)) {
                throw new NoSuchElementException("User is not the owner of the document");
            }

            return new ResponseEntity<>(existingDoc, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to get the document.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
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

    // assumption: the ownerID, title, content, viewers and editors are passed in
    // the request body
    @PostMapping("/create/givenDoc")
    public ResponseEntity<String> create(HttpServletRequest request, @RequestBody Doc doc) {
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }
            String username = jwtService.extractUsername(token);

            // Check for valid owner's username
            // Neglecting owner provided in the request body & using the username from the
            // token
            if (!userService.existsByUsername(username)) {
                return new ResponseEntity<>(
                        "Owner " + username + " not found",
                        HttpStatus.NOT_FOUND);
            }

            // Check for valid editors's username
            for (String editor : doc.getEditors()) {
                if (!userService.existsByUsername(editor)) {
                    return new ResponseEntity<>(
                            "Editor " + editor + " not found",
                            HttpStatus.NOT_FOUND);
                }
            }

            // Check for valid viewers's username
            for (String viewer : doc.getViewers()) {
                if (!userService.existsByUsername(viewer)) {
                    return new ResponseEntity<>(
                            "Viewer " + viewer + " not found",
                            HttpStatus.NOT_FOUND);
                }
            }

            if (docService.existsByTitle(doc.getTitle())) {
                return new ResponseEntity<>(
                        "Document with the same title already exists",
                        HttpStatus.CONFLICT);
            }

            doc.setLastAccessed(new Date(System.currentTimeMillis()));
            docService.saveDoc(doc);
            return new ResponseEntity<String>("Document created successfuly", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to get the document.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDocument(HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }
            String username = jwtService.extractUsername(token);

            // Check for valid owner's username
            if (!userService.existsByUsername(username)) {
                return new ResponseEntity<>(
                        "User not found",
                        HttpStatus.NOT_FOUND);
            }

            Doc doc = new Doc();
            doc.setOwner(username);
            doc.setLastAccessed(new Date(System.currentTimeMillis()));
            docService.saveDoc(doc); // Save the document to get the id
            doc.setTitle("Untitled-" + doc.getId());
            docService.saveDoc(doc);

            doc.setLastAccessed(new Date(System.currentTimeMillis()));
            docService.saveDoc(doc);
            return new ResponseEntity<>(doc, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to create document.\n" + e,
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

            // If the user is an editor, remove the user from the editors list
            if (existingDoc.getEditors().contains(username)) {
                docService.removeEditor(existingDoc.getTitle(), username);
                return new ResponseEntity<>("Editor removed successfully.", HttpStatus.OK);
            }

            // If the user is a viewer, remove the user from the viewers list
            if (existingDoc.getViewers().contains(username)) {
                docService.removeViewer(existingDoc.getTitle(), username);
                return new ResponseEntity<>("Viewer removed successfully.", HttpStatus.OK);
            }

            // If the user is the owner, delete the document
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
            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));
            if (!existingDoc.getOwner().equals(username) || !existingDoc.getEditors().contains(username)) {
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

            Doc existingDoc = docService.getDocByTitle(title)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Document not found"));

            if (existingDoc.getViewers().contains(viewer)) {
                throw new NoSuchElementException(
                        "Viewer already exists");
            }

            User user = userService.getUserByUsername(viewer);
            if (user == null) {
                return new ResponseEntity<>("Invalid viewer username.", HttpStatus.NOT_FOUND);
            }

            if (existingDoc.getEditors().contains(viewer)) {
                docService.removeEditor(existingDoc.getTitle(), viewer);
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

            if (!existingDoc.getOwner().equals(signedInUser.getUsername())) {
                return new ResponseEntity<>(
                        "Only the owner can add an editor",
                        HttpStatus.UNAUTHORIZED);
            }

            if (existingDoc.getEditors().contains(editor)) {
                throw new NoSuchElementException(
                        "Editor already exists");
            }

            if (existingDoc.getViewers().contains(editor)) {
                docService.removeViewer(existingDoc.getTitle(), editor);
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

            if (!existingDoc.getOwner().equals(signedInUser.getUsername())) {
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

            if (!existingDoc.getOwner().equals(signedInUser.getUsername())) {
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
                .filter(doc -> doc.getOwner().equals(username)
                        || doc.getViewers().contains(username)
                        || doc.getEditors().contains(username))
                .sorted((doc1, doc2) -> doc2.getLastAccessed().compareTo(doc1.getLastAccessed()))
                .collect(Collectors.toList());
    }

    @GetMapping("/getUsersDoc")
    public ResponseEntity<?> getUsersDoc(HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromHeader(request);
            if (token == null) {
                return new ResponseEntity<>("User must be authenticated.", HttpStatus.UNAUTHORIZED);
            }
            String username = jwtService.extractUsername(token);
            List<Doc> docs = docService.getDocsByUser(username);
            docs.sort((doc1, doc2) -> doc2.getLastAccessed().compareTo(doc1.getLastAccessed()));
            return new ResponseEntity<>(
                    docs,
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Unable to remove editor.\n" + e,
                    HttpStatus.BAD_REQUEST);
        }
    }

}

// Done: no duplicate viewers/editors done
// TODO: error if no viewer/editor to remove done
// unique username AND title?
// only owner can delete the file done
// return docs by last accessed date
// if add to editor, remove from viewer (might leave it for backend idk)
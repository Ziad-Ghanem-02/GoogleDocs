package com.docs.controller;

import java.util.ArrayList;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.mongodb.core.aggregation.VariableOperators.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import com.docs.model.OT;
import com.docs.model.ClientOT;
import com.docs.model.Doc;
import com.docs.service.DocService;
import com.docs.service.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
@EnableScheduling
public class OTController {

    private final SimpMessagingTemplate messageTemplate;
    private final DocService docService;
    private final JwtService jwtService;

    // docId: OT
    ConcurrentHashMap<String, OT> docs = new ConcurrentHashMap<>();

    @GetMapping("/getDoc/{docId}")
    public ResponseEntity<?> connect(@PathVariable String docId) {
        System.out.println("connect: " + docId);
        try {
            if (!docs.containsKey(docId)) {
                Doc doc = docService.getDocById(docId).get();
                System.out.println("doc: " + doc);
                // still starting so revision=0
                OT ot = new OT(0, "connect", doc, new ArrayList<ClientOT>(), 1);
                docs.put(docId, ot);
                System.out.println("docs: " + docs.get(docId));
                // send([doc,revision])//send document and revision number to client
                return new ResponseEntity<>(ot, HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        System.out.println("docs: " + docs.get(docId));
        OT ot = docs.get(docId);
        return new ResponseEntity<>(ot, HttpStatus.OK);
    }

    @GetMapping("/getDocHistory/{docId}")
    public ResponseEntity<ArrayList<ClientOT>> getDocHistory(@PathVariable String docId) {
        System.out.println("history: " + docId);
        try {
            if (!docs.containsKey(docId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(docs.get(docId).getHistory(), HttpStatus.OK);
    }

    private ResponseEntity<String> saveDoc(String docId) {
        try {
            if (docs.containsKey(docId)) {
                Doc doc = docService.getDocById(docId).get();
                OT serverOT = docs.get(docId);
                System.out.println("doc save: " + doc);
                docService.updateDocById(docId, serverOT.getDocument());
                serverOT.getHistory().clear();
                doc = docService.getDocById(docId).get();
                serverOT.setDocument(doc);
                System.out.println("docs saved: " + docs);
                return new ResponseEntity<>(docId + " Saved.", HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Couldn't save this doc: " + docId, HttpStatus.OK);
    }

    @PostMapping("/saveDoc/{docId}")
    public ResponseEntity<String> saveDocID(@PathVariable String docId) {
        System.out.println("docId: " + docId);
        return saveDoc(docId);
    }

    @PostMapping("/disconnect/{docId}")
    public ResponseEntity<String> disconnect(@PathVariable String docId) {
        System.out.println("docId: " + docId);
        try {
            if (docs.containsKey(docId)) {
                docs.get(docId).setNumberOfConnectedClients(docs.get(docId).getNumberOfConnectedClients() - 1);
                if (docs.get(docId).getNumberOfConnectedClients() == 0)
                    docs.remove(docId);
                return new ResponseEntity<>(docId + " Disconnected.", HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Couldn't disconnect this doc: " + docId, HttpStatus.OK);
    }

    @MessageMapping("/ot/process/{docId}")
    @SendTo("/topic/ot/process/{docId}")
    public synchronized ClientOT operation_room(ClientOT operation, @DestinationVariable String docId) {
        System.out.println("operation: " + operation + " DocId: " + docId);
        OT serverOT = docs.get(docId);
        if (operation.getVersion() == serverOT.getVersion()) {
            System.out.println(operation.getFrom() + ", " + operation.getContent() + ", " + operation.getDocContent());

            System.out.println("serverOT Before: " + serverOT.getDocument().getContent());
            serverOT.getDocument().setContent(operation.getDocContent());
            System.out.println("serverOT After: " + serverOT.getDocument().getContent());
            serverOT.setVersion(serverOT.getVersion() + 1); // increment the version number
            // changeBuffer.add(message.op)//add the operation to the history
            serverOT.getHistory().add(operation);
            // Broadcast operation to all users viewing/editing the document
            return operation;
        }
        return null;
        // // if the version number is not the same, then the operation is not applied
        // operation.setOperation("nack");
        // operation.setVersion(serverOT.getVersion()); // send the current version
        // number to the client
        // return operation;
    }

    @Scheduled(fixedDelay = 10000) // 10 seconds
    public void scheduleFixedDelayTask() {
        System.out.println(
                "Fixed delay task - " + System.currentTimeMillis() / 1000);
        for (Entry<String, OT> entry : docs.entrySet()) {
            String docId = entry.getValue().getDocument().getId();
            saveDoc(docId);
        }
    }

}

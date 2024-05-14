package com.docs.controller;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import com.docs.model.OT;
import com.docs.model.ClientOT;
import com.docs.model.Doc;
import com.docs.model.OT;
import com.docs.service.DocService;
import com.docs.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class OTController {

    private final SimpMessagingTemplate messageTemplate;
    private final DocService docService;
    private final JwtService jwtService;

    // docId: OT
    ConcurrentHashMap<String, OT> map = new ConcurrentHashMap<>();

    @GetMapping("/getDoc/{docId}")
    public ResponseEntity<OT> connect(@PathVariable String docId) {
        System.out.println("connect: " + docId);
        try {
            if (!map.containsKey(docId)) {
                Doc doc = docService.getDocById(docId).get();
                System.out.println("doc: " + doc);
                // still starting so revision=0
                OT ot = new OT(0, "connect", doc, new String[0]);
                map.put(docId, ot);
                // send([doc,revision])//send document and revision number to client
                return new ResponseEntity<>(ot, HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(map.get(docId), HttpStatus.OK);
    }

    @MessageMapping("/ot/process/{docId}")
    @SendTo("/topic/ot/process/{docId}")
    public ClientOT operation_room(ClientOT operation, @DestinationVariable String docId) {
        System.out.println("operation: " + operation + " DocId: " + docId);
        // OT serverOT = map.get(docId);
        // StringBuilder serverContent = new
        // StringBuilder(serverOT.getDocument().getContent());
        // // if (operation.getVersion() == serverOT.getVersion()) {
        // // // apply the recieved operation
        // // if (operation.getOperation().equals("insert")) {
        // // serverContent.insert(operation.getFrom(), operation.getContent());
        // // } else if (operation.getOperation().equals("delete")) {
        // // serverContent.delete(operation.getFrom(),
        // // operation.getFrom() + operation.getContent().length());
        // // }
        // // serverOT.setVersion(serverOT.getVersion() + 1); // increment the version
        // number
        // // // changeBuffer.add(message.op)//add the operation to the history

        // // // Broadcast operation to all users viewing/editing the document
        // // return operation;
        // // }
        return operation;
    }

    @Scheduled(fixedDelay = 1000)
    public void scheduleFixedDelayTask() {
        System.out.println(
                "Fixed delay task - " + System.currentTimeMillis() / 1000);
    }

}

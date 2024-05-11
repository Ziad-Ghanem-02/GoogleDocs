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

@Controller
@RequiredArgsConstructor
public class OTController {

    private final SimpMessagingTemplate messageTemplate;
    private final DocService docService;
    private final JwtService jwtService;

    // docId: OT
    ConcurrentHashMap<String, OT> map = new ConcurrentHashMap<>();

    @MessageMapping("/ot/connect/{docId}")
    @SendTo("/topic/ot/connect/{docId}")
    public OT connect(@DestinationVariable String docId) {
        System.out.println("connect: " + docId);
        try {
            if (!map.containsKey(docId)) {
                Doc doc = docService.getDocById(docId).get();
                System.out.println("doc: " + doc);
                // still starting so revision=0
                OT ot = new OT("0", "connect", doc, new String[0]);
                map.put(docId, ot);
                // send([doc,revision])//send document and revision number to client
                return ot;
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
        return map.get(docId);
    }

    @MessageMapping("/ot/process/{docId}")
    @SendTo("/topic/ot/process/{docId}")
    public ClientOT operation_room(ClientOT operation, @DestinationVariable String docId) {
        System.out.println("operation: " + operation + " DocId: " + docId);
        // Apply operation to current document
        return operation;
    }

    @Scheduled(fixedDelay = 1000)
    public void scheduleFixedDelayTask() {
        System.out.println(
                "Fixed delay task - " + System.currentTimeMillis() / 1000);

    }

}

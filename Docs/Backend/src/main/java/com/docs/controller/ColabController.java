package com.docs.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.docs.model.Colab;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ColabController {

    private final SimpMessagingTemplate template;

    @MessageMapping("/colab")
    @SendTo("/topic/colab")
    public Colab colab(Colab colab) {
        System.out.println("Colab: " + colab);
        return colab;
    }

    @MessageMapping("/colab/{docId}")
    public Colab colab_room(Colab colab, @DestinationVariable String docId) {
        System.out.println("Colab: " + colab + " DocId: " + docId);
        // template.convertAndSend("/topic/colab/" + docId, colab);
        return colab;
    }

}

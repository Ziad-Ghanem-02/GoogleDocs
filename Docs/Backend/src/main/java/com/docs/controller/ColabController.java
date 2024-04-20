package com.docs.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.docs.model.Colab;

@Controller
public class ColabController {

    @MessageMapping("/colab")
    @SendTo("/topic/colab")
    public Colab colab(Colab colab) {
        // System.out.println("Colab: " + colab);
        return colab;
    }
}

package com.docs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /*
     * Defines an endpoint URL
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws");
        // The endpoint URL that the client will use to connect to the WebSocket server
        registry.addEndpoint("/ws")

                // * It is often required because the default behavior of WebSocket and SockJS
                // is to accept only same-origin requests
                // * Allow requests from the specified origin (different from the rigin/domain)
                .setAllowedOrigins(
                        "http://localhost:5173", // FE Development server
                        "http://localhost:4173", // FE Local Production server
                        "https://coedit.vercel.app/" // Deployed FE server
                ) // Can use "*" to allow all origins

                // * SockJS will let our WebSockets work even if the WebSocket protocol is not
                // supported by an internet browser.
                // * The SockJS library is used to enable fallback options for browsers that
                // don't support WebSocket.
                .withSockJS();
    }

    /*
     * The method configureMessageBroker() is used to configure the message broker.
     * The message broker is responsible for routing messages from one client to
     * another.
     * 
     * It can be configured to route messages to a specific user, to a specific
     * queue, or to a specific topic.
     * Topics are used to broadcast messages to multiple clients.
     * Queues are used to send messages to a single (private) client.
     * 
     * The method enableSimpleBroker() is used to enable a simple in-memory message
     * broker.
     * In this case, we are using the in-memory message broker, which is simple to
     * configure and is useful for testing purposes. (Malnash da3wa)
     * 
     * Tip: If you want to use a more advanced message broker, you can use RabbitMQ
     * or ActiveMQ.
     * To use RabbitMQ, you need to add the spring-boot-starter-amqp dependency to
     * your project.
     * To use ActiveMQ, you need to add the spring-boot-starter-activemq dependency
     * to your project.
     * 
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic/", "/queue/");
        config.setApplicationDestinationPrefixes("/app");
    }
}

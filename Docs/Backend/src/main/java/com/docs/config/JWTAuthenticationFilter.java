package com.docs.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.docs.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor // Lombok automatically generates a constructor for that class. This constructor
                         // will have one parameter for each field that requires special handling.
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Used to fetch user details from the database

    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain // filterChain is used to invoke the next filter in the chain
    )
            throws ServletException, IOException {
        // Extract authentication token from the request's header
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;
        // Check if the token is valid
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7); // Skip "Bearer "

        try {
            userEmail = jwtService.extractUsername(jwtToken);
        } catch (Exception e) {
            System.out.println("\n\n()Error extracting username from token.\n" + e + "\n\n");
            filterChain.doFilter(request, response);
            return;
        }
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch the user existing in the database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(jwtToken, userDetails)) {
                // Update the security context with the authenticated user
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                // null is being passed as the credentials
                // parameter. This is because the user is being authenticated based on a JWT
                // (JSON Web Token), not a password. The JWT has already been validated at this
                // point, so there's no need to provide a password. ~ Copilot

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request, response);
        }

    }

}

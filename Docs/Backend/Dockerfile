# # Stage 1: Build the project
# FROM maven:3.8.1-openjdk-11 as build
# WORKDIR /workspace
# COPY . .
# RUN mvn clean install

# # Stage 2: Build the Docker image
# FROM openjdk:21
# WORKDIR /Docs/Backend
# COPY --from=build /workspace/target/Docs-0.0.1-SNAPSHOT.jar co_edit.jar
# ENTRYPOINT [ "java", "-jar","co_edit.jar" ]


# Use an official Maven image as the base image
FROM maven:3.8.4-openjdk-11-slim AS build
# Set the working directory in the container
WORKDIR /app
# Copy the pom.xml and the project files to the container
COPY pom.xml .
COPY src ./src
# Build the application using Maven
RUN mvn clean package -DskipTests
# Use an official OpenJDK image as the base image
FROM openjdk:11-jre-slim
# Set the working directory in the container
WORKDIR /app
# Copy the built JAR file from the previous stage to the container
COPY --from=build /app/Docs-0.0.1-SNAPSHOT.jar co_edit.jar
# Set the command to run the application
ENTRYPOINT [ "java", "-jar","co_edit.jar" ]
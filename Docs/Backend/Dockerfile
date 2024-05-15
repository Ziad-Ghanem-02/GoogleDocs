# Stage 1: Build the project
FROM maven:3.8.1-openjdk-11 as build
WORKDIR /workspace
COPY . .
RUN mvn clean install

# Stage 2: Build the Docker image
FROM openjdk:21
WORKDIR /Docs/Backend
COPY --from=build /workspace/target/Docs-0.0.1-SNAPSHOT.jar co_edit.jar
ENTRYPOINT [ "java", "-jar","co_edit.jar" ]
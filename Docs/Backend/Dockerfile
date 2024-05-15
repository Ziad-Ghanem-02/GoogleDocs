FROM openjdk:21
WORKDIR /Docs/Backend
CMD [ "mvn clean install" ]
ADD target/Docs-0.0.1-SNAPSHOT.jar co_edit.jar
ENTRYPOINT [ "java", "-jar","co_edit.jar" ]
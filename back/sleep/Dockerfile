FROM openjdk:17-jdk
EXPOSE 8089
COPY build/libs/*.jar letsdance.jar
RUN build.gradle
ENTRYPOINT ["java","-jar","/letsdance.jar"]

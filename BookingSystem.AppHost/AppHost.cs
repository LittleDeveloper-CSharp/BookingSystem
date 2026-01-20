var builder = DistributedApplication.CreateBuilder(args);

var pgBuilder = builder.AddPostgres("postgres");
var pg = pgBuilder.AddDatabase("bookings");

var server = builder.AddProject<Projects.BookingSystem_Server>("server")
    .WithReference(pg)
    .WaitFor(pg)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();

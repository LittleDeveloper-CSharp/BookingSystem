var builder = DistributedApplication.CreateBuilder(args);

var pgBuilder = builder.AddPostgres("postgres")
    .WithDataVolume();
var pg = pgBuilder.AddDatabase("bookings");

var server = builder.AddProject<Projects.BookingSystem_Server>("server")
    .WithReference(pgBuilder)
    .WaitFor(pg)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WithEnvironment("VITE_API_URL", server.GetEndpoint("http"))
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();

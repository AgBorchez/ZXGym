FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["GymManager.api/GymManager.api.csproj", "GymManager.api/"]
RUN dotnet restore "GymManager.api/GymManager.api.csproj"

COPY . .
WORKDIR "/src/GymManager.api"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "GymManager.api.dll"]
# Nude Eye

### An optical shop, modeled in Java.

A two-person academic console application exploring object-oriented domain modeling, layered architecture and interchangeable persistence.

**Authors:** Francesc Mateu Vallespín and Jan Francesc Porcar Guillen. Developed for Object-Oriented Design and Programming at La Salle — Universitat Ramon Llull.

## What it does

Users can register or select a client identity, browse optical products and provider offers, build a cart, complete a simulated purchase and inspect purchase history. The client-ID selection flow is an academic simplification, not secure authentication.

The later project phases introduce specialized client and product types, plus startup selection between a course REST API and local JSON/CSV storage.

## Architecture

| Layer | Responsibility |
| --- | --- |
| Presentation | Console menus, input collection and orchestration through `Controller` |
| Business | Clients, products, providers, carts, sales and their managers |
| Persistence | Four DAO contracts, with API and local-file implementations |

The persistence contracts cover products, clients, providers and sales. Client/product/provider data use JSON locally; sales use CSV. Managers can receive DAO implementations through constructors, making the dependencies explicit.

## Design artifact

The original UML class diagram is included in `docs/class-diagram.pdf`. It maps the presentation, business and persistence layers, class hierarchies and DAO relationships. The portfolio provides a cropped vector preview and the original PDF for detailed inspection. The project was co-developed by the two authors credited above.

## Domain behavior

The `Product` hierarchy includes glasses, contact lenses, consumables and services. Each implements or inherits `calculatePrice`, allowing the caller to use the common product contract while behavior changes by subtype.

The client model includes in-person, online and corporate clients. Shipping and VAT decisions depend on client type and the project's configured rules.

| Product | Implemented pricing behavior |
| --- | --- |
| Glasses | Base price with optional 1.21 multiplier |
| Contact lenses | Base price with optional 1.10 multiplier |
| Consumables | Optional 1.21 multiplier, then 0.60 near-expiry multiplier |
| Services | Hourly rate × duration, with optional 1.21 multiplier |

These are the constants used by the assignment. The near-expiry check uses the current date and an exclusive three-month threshold; it also classifies already-expired items as near expiry.

## Persistence selection

The original implementation selected persistence by probing the course API. In this public snapshot, `Main` uses local files unless both `NUDE_EYE_API_BASE_URL` and `NUDE_EYE_GROUP_ID` are explicitly configured. The original service address and group identifier are omitted. When configured, the controller probes that authorized API. If it is unavailable, or API initialization fails, the controller attempts file-backed managers. If local initialization also fails, the application stops.

This is startup mode selection. It is not replication, transactional failover or automatic synchronization between API and file storage.

## Build and run

Use JDK 25 or newer and keep the provided course dependencies in `lib/`. The geolocation dependency contains Java 25 class files (major version 69); the API helper contains Java 21 class files (major version 65). Run from the project root so relative data paths resolve correctly.

macOS/Linux:

```bash
mkdir -p build
find src -name '*.java' > sources.txt
printf '%s\n' Main.java LocalMain.java >> sources.txt
javac -proc:none -cp 'lib/*' -d build @sources.txt
java -cp 'build:lib/*' LocalMain
```

PowerShell:

```powershell
New-Item -ItemType Directory -Force build | Out-Null
$sources = @(Get-ChildItem src -Recurse -Filter *.java | ForEach-Object FullName) + @('Main.java', 'LocalMain.java')
javac -proc:none -cp 'lib/*' -d build $sources
java -cp 'build;lib/*' LocalMain
```

`LocalMain` is a packaging addition that uses the existing injection constructor to select file persistence without probing the course API. The included fixture has an in-person client with ID **1**, four products and one provider. It is deliberately illustrative; it does not include the original customer or sales records.

Selecting online-client flows can still involve the geolocation helper. Its embedded API credential has been removed from the distributed dependency, so authenticated geolocation requests are unavailable in this public package. The in-person `LocalMain` example does not need that credential. To enable online geolocation, obtain an authorized, configurable replacement from the dependency provider and supply your own credential outside the source code.

Use remote mode only with a service and group you are authorized to access. Set `NUDE_EYE_API_BASE_URL` and `NUDE_EYE_GROUP_ID` outside the repository before launching `Main`; remote actions can read or write that service. Without those settings, startup makes no course-API request.

## Source guide

- `Main.java`: original entry point.
- `LocalMain.java`: added local-persistence entry point.
- `src/business/`: domain classes, managers and business exceptions.
- `src/presentation/`: controller and console interface.
- `src/persistence/dao/`: four persistence interfaces.
- `src/persistence/impl/`: eight API/file implementations.
- `lib/`: bundled course dependencies; `CoordinatesAPI.jar` has its embedded API credential removed.
- `docs/class-diagram.pdf`: original vector UML class diagram, presented as part of Francesc’s work on the collaborative project.
- `docs/technical-report.pdf`: original academic report with UML and design decisions.

## Verification and boundaries

The portfolio case study is based on source inspection and the report. The interactive pricing illustration reproduces the source formulas in JavaScript; it is not the Java application running in the browser.

Compilation was attempted with the available Java 17 compiler and stopped because the supplied course dependencies require Java 25. Compilation and application execution with the required Java version remain unverified. Build commands and the additional local entry point should be checked in a JDK-equipped environment before relying on them. No remote API operations were performed.

Further engineering work would include unit tests for pricing and persistence, a controllable clock for expiry rules, decimal money handling instead of floating-point values, and stronger authentication and transaction handling for any real deployment.

## Credits and packaging

The original domain implementation is retained. Public packaging makes the optional API address/group configurable and adds this README, `LocalMain.java`, a clean ignore file and fresh sample data. IDE state, compiled outputs, duplicated files and original customer/sales records are omitted. The bundled geolocation library retains its classes and interfaces, with the API credential removed from both compiled occurrences. Its archive and class structures were checked after sanitization; Java execution still requires the JDK validation described above.

No individual component ownership is claimed beyond the joint authorship in the report. No new licence is assigned to the project or its bundled course dependencies; retain their original terms and obtain author permission for reuse.

## GitHub source edition

The GitHub repository omits course binaries and requires authorized dependencies obtained separately. This website download contains a separately prepared dependency bundle; the setup and JDK 25 requirements above apply to this bundle. Both editions retain the academic scope and disclose that full Java runtime verification is outstanding.

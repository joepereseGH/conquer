# Architecture
Conquer is a terminal-based cli program.
This project has 4 layers: `CLI`, `objects`, `services`, and `storage`.

## Objects
Objects are used to hold data in memory. This is the data that `services` use to make changes.
`Day` is the parent object. It represents a daily record for one date.
A `Day` contains collections of child objects.

### Child objects
Child objects only contain data relevant to their own object type.
* Wins contains `win` objects.
* Loss contains `loss` objects.
* Action contains `action` objects.
* Reflection contains one `reflection` object.
* Notes contain `note` objects.

## Services
Services contain the rules and actions of the program.
Services make changes to objects.
Services do not save or load JSON directly.
Services use the day parent object when the logic involves data from different object groups.
Services never communicate with storage directly through JSON files. Services only work with objects. Storage is responsible for loading objects from JSON and saving objects back to JSON.

### V1 Services
* `DayService` creates new day objects and reads day summaries.
* `WinService` adds, lists, edits, removes, and links wins.
* `LossService` adds, lists, edits, removes, and links losses.
* `ActionService` adds, lists, edits, removes, ignores, and updates actions.
* `ReflectionService` updates and views the day's reflection question.
* `NoteService` adds, lists, edits and removes notes.

## Storage
Storage is responsible for persistent data.
Storage loads JSON files into objects.
Storage saves updated objects back into JSON files.
Storage does not contain business rules. It only reads and writes data.

### V1 Storage
* Create a new Day JSON file.
* Load a Day JSON file.
* Save a Day JSON file.
* Check if a Day already exists.
* Remove a Day JSON file.

## Workflow
The terminal is used to write commands.
The cli receives a command.
Storage loads the days .json.
Services update the day object.
Storage updates the .json.
The cli prints output.

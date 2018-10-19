# selectron

Modular component-based library for injecting expressions and targeting related layers/properties.

## major
* Graveyard all unused Joystick-Buddy code.
* Port tagging mechanic from Joystick-Buddy, add inter-relation filters to recognize layer hierarchies and included parents.
* Primary UI should be a body for tags to appear, a screen for contextual actions, a toolbar for quick actions (select all with tag, select siblings with tag/prop) and a means to create modular actions/conditions for Rig Recipes.
* Context mechanic needs to scan current tags and current selected layers to determine if selection is viable.

## minor
* Generate native Buddy controls.
* Iterate through all layers to collect fill/stroke colors to a single source of truth on Buddy.

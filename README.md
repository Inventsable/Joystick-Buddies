# ~~Joystick Buddies~~
~~Companion panel to Bodymovin' and Joystick N' Sliders for rigging vector characters and optimizing workflow throughout.~~

# Rebooting as Selectron
![](https://thumbs.gfycat.com/EmotionalSkeletalGecko-size_restricted.gif)

## to-do

* Create detailed schematic notes for selectron.
* Graveyard deprecated code to `dead.js|css`
* ~~UI revamp > Finish grid outline and placement~~
* ~~UI revamp > Rebuild as vue components~~
* Kickstart > Detect comp as riggable and prompt for kickstart
* ~~Kickstart > Convert AI layers to vector, strip "Outlines" and delete originals.~~
* ~~Kickstart > Discover related layers via dynamic keywords and auto-assign matching color labels.~~
* ~~Kickstart > Lock and dim nullification layers like background.~~
* Kickstart > Generate master control and link all corresponding fill/stroke colors to master color controls.
* Kickstart > Identify rig layers and separate from character art layers.
* Kickstart > Approximate anchor placement for all limbs and assign parenting hierarchy up logical keyword trees (hand > arm > shoulders(controller) > body)
* ~~Tags > Detect common tags in layer names for limb and direction.~~
* ~~Tags > Sort layer color labels by scoped number of common tags and type (limb/direction).~~
* ~~Selection > Reactive selection length and change detection~~
* ~~Selection > Identify if selection has single tags like 'Brow' or 'Pupil' for corresponding Rig Recipe.~~
* ~~Selection > Generate total unique tag list within currently selected layer names.~~
* ~~Selection > Refactor to fix selection not changing when total length is unchanged. (1 > 1)~~
* ~~Selection > Refactor to determine if target should be Layers, Properties, or Items.~~
* ~~Selection > Prompt Rig Recipe components.~~
* Rig Recipe > If exist, detect if character art style is line or solid.
* Rig Recipe > Auto-rig pupils within eye bounds and set keyframes for Joystick.
* Rig Recipe > Auto-rig brows for blinking and generic sad/mad/flat Slider keyframes.
* Rig Recipe > Prompt doubling of strokes with Trim Path slider to create sleeves on line-art arms and legs.
* Buddy > Generate controllers [square, circle, gaze, pin, bone] as new shape layers via toolbar button on click.
* Buddy > If currently selected, display debugging information, links and UI prompts for adding presets.
* Buddy > Scan selected layers to generate color controls for all distinct colors within shape fills/stroke, replacing with expressions to single sources on Buddy.
* Buddy > Scan selected layers to generate transform controls and inject related expression references.
* Buddy > Scan selected properties, detect what expression control is needed and parse all matching property lists into corresponding expression control on Buddy
* Find/Replace options for all layer, property names and expression references.
* JnS > Detect all Joystick Origins and Nulls in comp, create Joystick[x,y] list.
* JnS > Rename Slider Controls within Sliders to match corresponding target path.
* JnS > Reset all Joysticks and/or Sliders to [0,0].
* JnS > Style Joysticks to fills and delete dashed stroke, replace white null with shape layer and expression references to shape layer.
* BM > Auto-detect and warn of common errors.
* BM > Scan to find no-class Fills/Strokes.

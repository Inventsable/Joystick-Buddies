# Joystick Buddies

Companion panel to Bodymovin' and Joystick N' Sliders for rigging vector characters and optimizing workflow throughout.

## proto UI
![](https://i.imgur.com/sHLUUX3.png)

## selection change detection
![](https://thumbs.gfycat.com/RegalIllCassowary-size_restricted.gif)

## kickstart
![demo](https://thumbs.gfycat.com/FantasticUnfoldedBlueandgoldmackaw-size_restricted.gif)

## to-do
* UI revamp > Finish grid outline and placement
* UI revamp > Rebuild as vue components
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
* Selection > Identify if selection has single tags like 'Brow' or 'Pupil' for corresponding Rig Recipe.
* Selection > Generate total unique tag list within currently selected layer names, if multiple prompt creation of Rig Recipe.
* Rig Recipe > If exist, detect if character style is line-art or solids.
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
* JNS > Rename Slider Controls within Sliders to match corresponding target path.
* JNS > Reset all Joysticks and/or Sliders to [0,0].
* JNS > Style Joysticks to fills and delete dashed stroke, replace white null with shape layer and expression references to shape layer.
* BM > Auto-detect and warn of common errors.
* BM > Scan to find no-class Fills/Strokes.

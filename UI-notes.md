# UI notes

# state view brief
- show tile for each dedi
  - name
  - number of drivers connected
  - session/offline
  - time in/left in session
  - buttons for actions
    - restart weekend
    - restart session
    - next session
    - nice to have
      - ems put on track
      - ems leave/exit
      - ems enable ai
      - ems disable ai

# dedi detail
- dedi metadata
  - track
  - car(s)
  - session type (qualiy/practice/warmup/race)
  - session time
- list of drivers
  - ctrl/shift/multi select available
  - buttons to
    - remove penalty
    - add laps (amount to add/rem)
    - set grid order +/-
    - add penalty (type and time)
    - set weight (amount to set it to in kg)
  - show basic metrics
    - penalties
    - on track or not (use a highlight to indicate?)
    - anything else?? ie laps/position/etc
    - ems errors - ie no 100% throttle
- button to load broadcast control panel on a new tab
- button to red flag the race (with confirmation)
- buttons for actions
  - restart weekend
  - restart session
  - next session
  - nice to have - turns out these are easy =)
    - ems put on track
    - ems leave/exit
    - ems enable ai
    - ems disable ai




## driver buttons
- clear penalty
  - just hits dedi
  - chat endpoint
  - driver name in body
- put on track/leave-exit
  - check if session is race
    - if race, pop confirmation modal before removing anyone
  - iterate driver names
  - map to pod id
  - map to ip address
  - get nav state
  - determine next nav action
  - pass nav action to pod
- enable/disable AI
  - iterate driver names
  - map to pod id
  - map to ip
  - send command
- controls
  - list all presets (should be the same for every pod)
  - select a preset
  - provide warning/confirmation if new preset is different wheel/etc from current preset (nice to have)
- options
  - select drivers and apply changes to individual button mappings, assists, etc
  - searchable select of options - then set value - then apply to all selected drivers


## pod list
- only list pods not in dedis
- info to communicate
  - running or not                  x
  - at drive selection or not       x
  - connected to dedi or not        x
  - what dedi they're connected to  x
  - car                             x
  - track                           x
- on click
  - highlight for selection
  - if state is correct - button to pick car/livery (should be the only reason they're in the list)
    - single pod pod selected
      - present list of cars
      - present list of liveries
      - apply selected car/livery
      - return to list
    - multiple drivers selected
      - button to select car
      - livery is auto-selected based on pod id
        - so, select drivers 1,2,5 and car 1 and they'll get different liveries of that (if available)
        - then select 3,4 and car 2 and they'll get that car
      - return to list

## pod list more
- track name or mod name
- list of pods
  - pod id
  - driver name
  - car model
  - car number
- button to select auto livery
- button to get list of cars
  - select car and aut livery
  - select car and list of liveries
- button join server




to do
- test save button mapping presets and change via api possible?
- test if we can change a dedi setting in player.json, then restart weekend to take effect (ie practice start time)
- add laps completed of total to race session on dedi card (ie 7 of 10)
- 
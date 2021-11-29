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
  - nice to have
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
- livery
  - single driver in the correct state (the drive/spectate/exit in UI)
    - option to go to car/livery selection
    - presentation of cars/livery
    - selection of car/livery and progress to next state
  - multiple drivers selected
    - button to select car and auto-select livery based on pod id
    - so, select drivers 1,2,5 and car 1 and they'll get different liveries of that (if available)
    - the select 3,4 and car 2 and they'll get that car
  - options
    - initially just presets
    - select drivers and apply changes to button mappings, assists, etc
    - save button mapping presets and change via api possible?


to do
- map out driver nav
- test save button mapping presets and change via api possible?
- test if we can change a dedi setting in player.json, then restart weekend to take effect (ie practice start time)
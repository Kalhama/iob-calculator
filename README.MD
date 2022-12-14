# IOB-calculator #

Simple app for calculating Insulin on Board.

## Assumptions ##

Insulin activity data function is the function from Fiasp calculated in this thread https://github.com/LoopKit/Loop/issues/388#issuecomment-313442742.

## Technology and security ##

Site is static and saves everything locally in the device.

## Disclaimer ##

Please use this just for demonstration purposes. This is not a medical software and should not be used in medical applications.

## Demo ##

Hosted on [https://iob.kalhama.fi/](https://iob.kalhama.fi/)

### IOB graph ###
![IOB Graph](sample_images/graph.png)

### bolus calculator ###
![Bolus calculator](sample_images/calculator.png)

## Known issues ##
1. Graph zoom doesn't work on mobile
2. Crashes if you have got no data (for new users)
3. useIOBCurve vois laskee mieluummin minuutin etukätee ku et säädetään aikaa millon insuliini laitetaan siellä ja täällä
4. there is slight jitter in graph when zooming in and out.
5. Focus on going to main page
6. Cant scroll main page sometimes
7. Hot reloading doesn't work when developing


## Roadmap ##
1. Add carbs
    - FAB -> Speed Dial
    - Modal missä pystyy inserttaa carbeja
        - määrä
        - kello
        - slider miten nopeesti imeytyvää on
        - carbmodel valinta??
    - Reduxiin nämä^, voinee kopsata pitkälti bolusreducerin
    - hookit ja selectorit samal taval ku insuliinille
    - Listaan ylhäälle joku tabi valinta tjs mist voi valita bolus vs safka
    - käppyrät samal taval ku insuliineille
    - Päivitetty BGUpdated(t) = BG(t) + (COB(t) - COB(0)) / carbsSensitivity 
2. Main pagen työstö
    - Innovaatiota Loopista?
    ...
3. Integrate BG from libre
    Network sync
        - hyvä puoli et voi droppaa localstoragen jollon datamigraatiot helpottuu
        ...
4. When performing calculations option to consider BG to be past (like 15 mins)
    ...

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
3. useIOB vois laskee mieluummin minuutin etukätee ku et säädetään aikaa millon insuliini laitetaan siellä ja täällä
4. there is slight jitter in graph when zooming in and out.

## Roadmap ##
2. Input Blood glucose manually for prediction
    BG(t) = (IOB(t) + BolusAsBasal(t) - IOB(0)) * insulinSensitivity + BG(-15)
1. Add carbs
    Carbeille samanalaiset käppyrät ku insuliinille
    Päivitetty BG(t) = (IOB(t) + BolusAsBasal(t) - IOB(0)) * insulinSensitivity + BG(0) + (COB(t) - COB(0)) / carbsSensitivity 
3. Network sync
    4. Integrate BG from libre
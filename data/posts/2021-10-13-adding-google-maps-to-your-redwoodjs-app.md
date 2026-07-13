---
title: Adding Google Maps to your RedwoodJS App
subtitle: And navigating the npm package jungle
date: 2021-10-13
canonicalUrl: https://tlundberg.com/blog/2021-10-13-adding-google-maps-to-your-redwoodjs-app
cover: /assets/map-thomas-kinto-unsplash.jpg
coverAlt: Cover image for the post. A German road map. Photo taken by Thomas Kinto.
---

I wanted to show the location of a local business on their About page. The most common solution to this is to embed Google Maps with a pin showing the location. Since Redwood uses React I went and looked for a Google Maps React component.

Looking for existing guides on how to integrate Google Maps I found mention of two React components, https://github.com/tomchentw/react-google-maps and https://github.com/fullstackreact/google-maps-react. They both seem fairly popular on npm too, with 144k and 60k weekly downloads respectively. A quick check on [bundlephobia](https://bundlephobia.com/package/google-maps-react@2.0.6) showed that google-maps-react was about 1/3 the size of react-google-maps. So even though it wasn't as popular I went with the smaller option. Only to find out their docs are outdated and their TypeScript support is broken 🙁

![bundlephobia google-maps-react](/assets/bundlephobia-gmr.png)

Turns out both project are pretty much abandoned too, with lots of open issues without any replies. So back to Google to find other options.

I then found [@react-google-maps/api](https://github.com/JustFly1984/react-google-maps-api) which is a rewrite of react-google-maps, the most popular of the packages I evaluated earlier. This rewrite is made for modern versions of React with hooks and function components 💯 Nice! To be honest their docs could use some work (like a total overhaul), but after a couple of tries I got something working!

While writing this blog post I also found https://github.com/google-map-react/google-map-react which is the most popular option I've found so far with 215k weekly downloads. But that library seems more focused on rendering your own custom markers on the map. I just wanted the default Google Maps pin, which is super easy with the package I used.

## Implementation

Begin by adding the package to your app

```
yarn workspace web @react-google-maps/api
```

You'll need a Google Maps API key, so while the package is downloading and installing you can go to https://developers.google.com/maps/documentation/javascript/get-api-key and set everything up. You don't need to set up billing to use it, but you'll have an ugly "for development only" overlay and lots of watermarks on your map until you do.

When you have your API key you should go ahead and paste it in your .env file. (If you don't have a .env file, look for a .env.defaults file and create an empty .env file next to it.) I'm going to use the key name GOOGLE_MAPS_API_KEY. So place this on a row of its own

```
GOOGLE_MAPS_API_KEY=AIezaChaosFml69ggpW7YlQHnndx-QBesos
```

It should look something like the above. To be able to use it in your front-end code you also have to whitelist it in redwood.toml

```
[web]
  includeEnvironmentVariables = [
    'GOOGLE_MAPS_API_KEY',
  ]
```

After you can created a `Map` component to use on your About page (or wherever you want, obv).

```
yarn rw g component Map
```

Open up `Map.tsx` and replace everything inside with this

```ts
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px',
  marginTop: '16px',
}

const center = {
  lat: 37.419857,
  lng: -122.078827,
}

const Map = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  })

  if (loadError) {
    // This would be a great place to show just a static image of a map as a
    // fallback option
    return <p>Error loading map</p>
  }

  return isLoaded ? (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={containerStyle}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <p>Loading...</p>
  )
}

export default React.memo(Map)
```

It's important to note that you need to give the container some dimensions. Otherwise the map won't show up.

And now we're ready to use it on our About page

```jsx
import Map from 'src/components/Map'

const AboutPage = () => {
  return (
    <div>
      <address>
        <strong>Googleplex</strong>
        <br />
        1600 Amphitheatre Pkwy
        <br />
        Mountain View
        <br />
        CA 94043
        <br />
        United States
      </address>
      <Map />
    </div>
  )
}

export default AboutPage
```

This is what it'll look like (it's just a screenshot, so it's not interactive like the real map would be)

![Screenshot of Google Maps showing the Googleplex](/assets/googleplex-google-maps.png)

---

Cover photo by <a href="https://unsplash.com/@thomaskinto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Thomas Kinto</a> on <a href="https://unsplash.com/s/photos/map?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

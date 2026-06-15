# WyoFile Election Guide 2026

## About

To Be Deployed at https://projects.wyofile.com/election-guide-2026

This site is an election guide for federal and state candidates in the state of Wyoming, built for the independent member-supported news service [WyoFile](https://www.wyofile.com). Development was completed by [Tom Musselman](https://github.com/musselmanth). It was _heavily_ influenced (with permission) by [Eric Dietrich's app for Montana Free Press](https://github.com/mtfreepress/mt-2024-elections)

Question about the code can be directed to Tom Musselman (tmusselman@gmail.com), and about the project and editing to Tennessee Watson (tennessee@wyofile.com)

## Tech

It is a front-end only static export Next.js app, deployed via AWS S3 with Cloudfront CDN.

It uses [OpenLayers](https://openlayers.org/) for the interactive district map. Shapefiles files for district lines were provided by the US Census Bureau and compressed and converted into GeoJSON.

News article content is fetched and cached using SWR from the Wordpress REST API. All other data is converted from CSV files into JSON objects and imported.

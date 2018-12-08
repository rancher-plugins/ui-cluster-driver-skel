# ui-plugable-cluster-driver
Skeleton Rancher UI driver for custom Kubernetes cluster drivers

NOTE: This is a working example of a plugable cluster driver which uses [this driver](https://github.com/rancher/kontainer-engine-example-driver/releases/download/v0.1.0/kontainer-engine-example-driver-linux) as its cluster driver.
This is a port of the built-in Google GKE driver and simply exists as an example of how to build your own cluster driver. Do not use in production.

## Setup

* Fork or checkout this repository
* Run `npm install`
* Run `npm run build -- --name=example`
This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`.  You can run this while developing and point the Rancher settings for the component js there.

## Using

* Add a Cluster Driver in Rancher 2.0 (Global -> Custom Drivers -> Cluster Drivers)
  * Name: Your `DRIVERNAME` (see above).
  * Download URL: The URL for the driver binary (e.g. `https://github.com/rancher/kontainer-engine-driver-example/releases/download/v0.2.0/kontainer-engine-driver-example-linux`)
  * Custom UI URL: The URL you uploaded the `dist` folder to, e.g. `http://localhost:3000/component.js`)
* Wait for the driver to become "Active"
* Go to Clusters -> Add Cluster, your driver and custom UI should show up.

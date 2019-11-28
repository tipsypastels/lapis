# Lapis

## How to use

Make sure you have `node`, `git`, and `yarn` installed on your system. If you're not sure, try typing them in a terminal - you'll get an error if they're missing. Google for installation instructions.

Download this project from git using `git clone https://github.com/tipsypastels/lapis`. Then, move into the directory in your terminal using `cd lapis`.

If this is the first time you're installing this project, run the following commands to install global dependencies.
`yarn global add windows-build-tools`
`yarn global add node-gyp`
`yarn global add bcrypt`

Next, run `yarn install`. This will download Koa.js and other packages. Once that's done, you're good - run `yarn start` to start lapis. This will start the server and tell you how to proceed.

## How to develop

Before making any changes run `git checkout -b yournamehere`. This is git's branching feature and will allow us to work without overwriting each other.

### JavaScript

All of the JavaScript code is in the `/src` folder. 

### HTML

HTML is in `/src/views`. Note that for views we are not using pure HTML, we're using a technology called handlebars, which has a file extension `.hbs`. You can still write regular HTML and use mock data for now.

Also, your `.hbs` file does NOT need to be a full HTML page. The file `/src/views/layouts/application.hbs` contains a "layout" file - basically, everything in that file gets added to every page, so it's the place for generic things like the HTML skeleton, navbars, footers, and similar.

CSS files are in `/static/css`. There is only one file so far but feel free to add more, it's better than having one big messy one. If you add any new files, you must add a new `<link>` tag to the application layout file mentioned above so that it gets imported.

Text me if I forgot to mention anything!

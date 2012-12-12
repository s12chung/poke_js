# PokeJs
Auto-magical scaffolding for the [Garber-Irish Implementation](http://viget.com/inspire/extending-paul-irishs-comprehensive-dom-ready-execution) way of organizing your javascript.

## Purpose
Javascript is hard to organize and debugging ajax is a mess. This is one method to organizing your javascript neatly by mirroring the controllers and having all the JS outside of your HTML views.

## How it works
### Setup your namespace
```javascript
APP = {
	all: {
		html: {
			init: function() {
			}
		}
	},
	demos: {
		html: {
			init: function() {
			},
			demo_action: function() {
			}
		}
	}
}
```
### What happens
After, requests to `demos#demo_action` with format `html` will call the following functions (if they exist):
* `APP.all.html.init`
* `APP.demos.html.init`
* `APP.demos.html.demo_action` (with parameters if given)

`js` format is also supported, i.e.:
* `APP.all.js.init`
* `APP.demos.js.init`
* `APP.demos.js.demo_action` (with parameters if given)

## Installation
Add this line to your application's `Gemfile`:

    gem 'poke_js'

And then execute:

    $ bundle

Add this to your `app/assets/javascripts/application.js`

    //= require poke_js

Make sure your `app/views/layouts/application.html.erb` (and all your other layouts) looks like this:
```erb
<html>
<head>… <%= poke %> …</head>
<body data-controller="<%= poke_js_template.first %>" data-action="<%= poke_js_template.last %>">
    …
</body>
</html>
```

## Basic Use
I like to have a JS file for every controller in `app/assets/javascripts/controllers`. Like so:

`app/assets/javascripts/controllers/demos.js`:
```javascript
(function() {
	var demos = APP.define('demos', {
		html: {
			edit: function(params) {
				alert(params.alert_message);
			}
		},

		js: {
			new: function(params) {
				console.log(params.log_message);
			}
		}
	});
})();
```

`APP.define()` extends or creates the namespace `APP.demos`
and returns it. This allows me to access `APP.demos` through
the `demos` variable.

You can also use the traditional hash
namespacing shown in the [Setup your namespace](https://github.com/s12chung/poke_js#setup-your-namespace) section.

### HTML
So if a `html` request is sent to `demos#edit`, `APP.demos.html.edit` is called with the HTML view rendering.

### Javascript
For a `js` request sent to `demos#new`, `APP.demos.js.new` is called and nothing else happens.

### Passing parameters
__Optional__ Parameters are passed from a JSON DSL (such as [jbuilder](https://github.com/rails/jbuilder/)) and is passed as the `params` object to the function. You can pass any JSON object.

#### HTML
`app/views/demos/edit_params.js.jbuilder`:
```ruby
json.alert_message "ploop"
```
so 
```javascript
APP.demos.html.edit({ alert_message: "ploop" });
```
is called automatically.

#### Javascript
`app/views/demos/new.js.jbuilder`:
```ruby
json.log_message "loggggggggggggg"
```
so
```javascript
APP.demos.js.new({ log_message: "loggggggggggggg" });
```
is called automatically.

## Advanced Use
To be written...
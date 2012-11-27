# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'poke_js/version'

Gem::Specification.new do |gem|
  gem.name          = "poke_js"
  gem.version       = PokeJs::VERSION
  gem.authors       = ["s12chung"]
  gem.email         = ["steve@placemarklist.com"]
  gem.description   = %q{ Moves all javascript into assets js files using the Garber-Irish Implementation }
  gem.summary       = %q{ Moves all javascript into assets js files using the Garber-Irish Implementation }
  gem.homepage      = ""

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end

# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'poke_js/version'

Gem::Specification.new do |gem|
  gem.name          = "poke_js"
  gem.version       = PokeJs::VERSION
  gem.authors       = ["s12chung"]
  gem.email         = ["steve@placemarklist.com"]
  gem.description   = %q{ Auto-magical scaffolding for the Garber-Irish Implementation way of organizing your javascript. }
  gem.summary       = %q{ Auto-magical scaffolding for the Garber-Irish Implementation way of organizing your javascript. }
  gem.homepage      = ""

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency('rails', '>= 3.1')

  gem.add_development_dependency('rake')
end
